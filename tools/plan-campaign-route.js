'use strict';
// Search produces a control recording, then a fresh game replays every input.
// Search snapshots are isolated in route-harness; replay has no gameplay edits.
const fs=require('fs'),path=require('path'),createGame=require('./route-harness');
const level=+(process.argv[2]||4),limit=+(process.argv[3]||2400);
const policy=(process.argv.find(a=>a.startsWith('--policy='))||'--policy=balanced').split('=')[1];
const costs={balanced:{time:.13,damage:5},cautious:{time:.1,damage:8},speed:{time:.2,damage:3}}[policy];
if(!costs)throw Error('Unknown policy '+policy);
const source=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const {api,route}=createGame(source);api.newGame();api.loadLevel(level);api.startLevel();
const bossFixture=process.argv.includes('--boss-fixture');if(bossFixture){api.player.x=api.campaign.final.x0-45;api.player.y=142;}
const initial=route.save(),commands=[],stages=[],A=[[1,0,0],[1,1,0],[0,0,0],[0,1,0],[-1,0,0],[-1,1,0],[0,1,1]];
const retryBoss=process.argv.includes('--retry-boss'),retryPhase=Number((process.argv.find(a=>a.startsWith('--retry-phase='))||'--retry-phase=1').split('=')[1]);let expectedLives=initial.player.lives,retryDone=false;
const retryService=(process.argv.find(a=>a.startsWith('--retry-service='))||'').split('=')[1];
const activeTimer=process.argv.includes('--active-timer');
const exerciseLinks=process.argv.includes('--exercise-links');
const retryKind=(process.argv.find(a=>a.startsWith('--retry-kind='))||'').split('=')[1];
const retryTrial=(process.argv.find(a=>a.startsWith('--retry-trial='))||'').split('=')[1];
const retryLink=(process.argv.find(a=>a.startsWith('--retry-link='))||'').split('=')[1];
const expireTrial=(process.argv.find(a=>a.startsWith('--expire-trial='))||'').split('=')[1];let expiredOnce=false;
const roundNum=Number((process.argv.find(a=>a.startsWith('--round='))||'').split('=')[1])||3,round3=process.argv.includes('--round3')||roundNum>3,outputRoot=path.join(__dirname,'../review/campaign-v3',round3?'round'+roundNum:'');fs.mkdirSync(outputRoot,{recursive:true});
const out=path.join(outputRoot,(bossFixture?'boss-fixture':'route-n'+(level+1))+(policy==='balanced'?'':'-'+policy)+(retryService?'-retry-service-'+retryService:'')+(retryBoss?'-retry'+(retryPhase===1?'':'-phase'+retryPhase):retryKind?'-retry-'+retryKind+(activeTimer?'-active':''):'')+(retryTrial?'-trial'+retryTrial:'')+(expireTrial?'-expire-trial'+expireTrial:'')+(exerciseLinks?'-exercise-links':'')+'.json');
let cachePath=(retryService||retryTrial||expireTrial)?(fs.existsSync(out)?out:path.join(outputRoot,'route-n'+(level+1)+(policy==='balanced'?'':'-'+policy)+'.json')):(retryBoss||retryKind)?(roundNum>3&&fs.existsSync(path.join(__dirname,'../review/campaign-v3/round'+(roundNum-1),path.basename(out)))?path.join(__dirname,'../review/campaign-v3/round'+(roundNum-1),path.basename(out)):path.join(__dirname,'../review/campaign-v3/score1-route-n'+(level+1)+'.json')):round3&&!fs.existsSync(out)?path.join(__dirname,'../review/campaign-v3/'+(roundNum>3?'round'+(roundNum-1):'harmonized-v2'),path.basename(out)):out;
if(round3&&!fs.existsSync(cachePath)&&!retryKind&&!retryBoss&&!retryService&&!expireTrial){for(let previous=roundNum-1;previous>=3;previous--){const candidate=path.join(__dirname,'../review/campaign-v3/round'+previous,path.basename(out));if(fs.existsSync(candidate)){cachePath=candidate;break;}}}
if(exerciseLinks&&!fs.existsSync(out))cachePath=path.join(outputRoot,'route-n'+(level+1)+(policy==='balanced'?'':'-'+policy)+'.json');
const cached=process.argv.includes('--resume')&&fs.existsSync(cachePath)?JSON.parse(fs.readFileSync(cachePath,'utf8')):null;
let useCache=true;
class Heap{constructor(){this.a=[];}push(n){let i=this.a.length;this.a.push(n);while(i){let p=(i-1)>>1;if(this.a[p].score<=n.score)break;this.a[i]=this.a[p];i=p;}this.a[i]=n;}pop(){const a=this.a,n=a[0],v=a.pop();if(a.length){let i=0;while(i*2+1<a.length){let c=i*2+1;if(c+1<a.length&&a[c+1].score<a[c].score)c++;if(a[c].score>=v.score)break;a[i]=a[c];i=c;}a[i]=v;}return n;}}
function compact(s){s.campaign.events=[];return s;}
function input(a,frames){commands.push({a,frames});route.input(a);for(let i=0;i<frames;i++){route.step();if(api.player.dead)throw Error('Dead during explicit input');}}
function key(s){const p=s.player;return [Math.round(p.x/4),Math.round(p.y/4),Math.round(p.vx*2),Math.round(p.vy),+p.onGround,+p.jHeld,+s.campaign.downHeld,p.keys,s.items.filter(i=>i.t==='k').map(i=>i.x).join('/'),Math.floor(s.simF%400/30),Math.floor(p.energy/15),s.campaign.trials.map(t=>[t.solved?1:0,t.progress,t.nodes.map(n=>+n.active).join('')].join(':')).join('.'),s.crumbles.filter(c=>c.state!=='solid').map(c=>c.c+':'+c.state[0]+Math.floor(c.timer/20)).join('.')].join(',');}
function go(t,done=()=>api.player.onGround&&Math.hypot(api.player.x+5-t.x,api.player.y+9-t.y)<18,extra={}){
 const old=useCache&&cached?.stages[stages.length];if(old?.label===t.label&&old.commandEnd){const before=route.save(),length=commands.length,rest=cached.commands.slice(length,old.commandEnd);let valid=true;try{for(const c of rest)input(c.a,c.frames);valid=done();}catch{valid=false;}if(valid){stages.push(old);console.log('REPLAY '+t.label);return;}route.restore(before);commands.length=length;useCache=false;console.log('Changed state, replanning '+t.label);}
 const start=compact(route.save()),heap=new Heap(),seen=new Map();let found=null,expanded=0,best=Infinity,bestP=null;
 const distance=s=>extra.distance?extra.distance(s):Math.abs(s.player.x+5-t.x)*.8+Math.abs(s.player.y+9-t.y)*1.4;
 heap.push({s:start,g:0,score:distance(start),parent:null});
 while(heap.a.length&&expanded<limit){const n=heap.pop();expanded++;
  for(const a of A){route.restore(n.s);route.input(a);let dead=false;
   for(let f=0;f<10;f++){route.step();if(api.player.dead||api.player.lives<expectedLives){dead=true;break;}if(api.state==='clear')break;}
   if(dead||api.player.x<t.minX||api.player.x>t.maxX)continue;
   const s=compact(route.save()),g=n.g+10,node={s,g,parent:n,a};
   if(done()){found=node;break;}
   const d=distance(s);if(d<best){best=d;bestP={x:s.player.x,y:s.player.y,energy:s.player.energy,frame:s.simF};}
   const k=key(s)+(extra.keySuffix?extra.keySuffix(s):''),cost=g+(100-s.player.energy)*costs.damage/ costs.time;
   if((seen.get(k)??Infinity)<=cost)continue;seen.set(k,cost);
   node.score=d+g*costs.time+(100-s.player.energy)*costs.damage+(extra.penalty?extra.penalty(s):0);heap.push(node);
  }if(found)break;
 }
 if(!found){fs.writeFileSync(out,JSON.stringify({protocol:"harmonized-v2",policy,budget:limit,level:level+1,complete:false,stages,commands,failed:t,bestP},null,2));throw Error('FAIL '+t.label+' '+expanded+' '+JSON.stringify(bestP));}
 const seq=[];for(let n=found;n.parent;n=n.parent)seq.push(n.a);seq.reverse();for(const a of seq)commands.push({a,frames:10});route.restore(found.s);
 const stage={label:t.label,frames:found.g,energy:+api.player.energy.toFixed(1),expanded,commandEnd:commands.length};stages.push(stage);console.log(JSON.stringify(stage));fs.writeFileSync(out,JSON.stringify({protocol:"harmonized-v2",policy,budget:limit,level:level+1,complete:false,stages,commands},null,2));
}
function nearNode(id,nid,label){const t=api.campaign.trials.find(t=>t.id===id),n=t.nodes.find(n=>n.id===nid),target={x:n.x,y:n.y,label,minX:t.x0-10,maxX:t.gateX+16};go(target);input([0,0,0],8);if(Math.hypot(api.player.x+5-n.x,api.player.y+9-n.y)>=23||api.player.stun)go({...target,label:label+' align'},()=>api.player.onGround&&!api.player.stun&&Math.hypot(api.player.x+5-n.x,api.player.y+9-n.y)<8);if(activeTimer&&!retryDone&&t.kind==='timed'&&(!retryTrial||id===retryTrial)){let wait=0;route.input([0,0,0]);while(api.player.energy>1.5&&!api.player.dead&&wait<16000){route.step();wait++;}commands.push({a:[0,0,0],frames:wait});if(api.player.dead)throw Error('Died before timer activation');}input([0,0,1],1);input([0,0,0],1);}
function recharge(z){const e=api.items.find(i=>i.t==='E'&&i.x>=z.x0&&i.x<z.x1);if(!e||api.player.energy>90)return;
 go({x:e.x+8,y:151,label:z.part+' recharge',minX:z.x0-30,maxX:e.x+50},()=>api.player.charging>0&&Math.abs(api.player.x+5-e.x-8)<4);
 input([0,0,0],Math.min(400,Math.ceil((100-api.player.energy)/(.26666-.00917))+4));
}
const rooms=api.L.zones.filter(z=>!z.transition&&!api.L.def.segs[api.L.zones.indexOf(z)].finalArena);
function maybeRetry(t){
 if(retryDone||t.kind!==retryKind||(retryTrial&&t.id!==retryTrial)||(t.kind==='charge'&&t.nodes.length<2))return;
 if(retryLink==='weight-anchored'&&!t.anchored)return;if(retryLink==='light-primed'&&!t.primed)return;
 useCache=false;const solved=api.campaign.trials.filter(t=>t.solved).map(t=>t.id);
 route.input([0,0,0]);let frames=0;while(!api.player.dead&&frames++<16000)route.step();
 if(!api.player.dead)throw Error('Partial puzzle idle did not die');
 if(activeTimer&&(!api.campaign.trials.find(v=>v.id===t.id).progress||api.campaign.trials.find(v=>v.id===t.id).until<=api.simF))throw Error('Timer was not active at death');
 let deathFrames=0;while(api.player.dead&&deathFrames++<100)route.step();
 commands.push({a:[0,0,0],frames:frames+deathFrames});expectedLives=2;retryDone=true;
 if(api.player.lives!==2||api.player.dead||!solved.every(id=>api.campaign.trials.find(t=>t.id===id).solved))throw Error('Puzzle death lost solved progress');
 if(retryLink){const reset=api.campaign.trials.find(v=>v.id===t.id);if(reset.anchored||reset.primed||reset.docked||reset.bridges.some(b=>b.on)||reset.nodes.some(n=>n.active)||api.campaign.carry)throw Error('Linked mechanism reset is incomplete');}
 throw Error('RETRY_PART');
}
function recoverService(z,when){
 if(retryDone||retryService!==when+'-'+z.part)return;
 const door=api.L.def.segs[api.L.zones.indexOf(z)].service.door,col=z.x0/16+door,before={keys:api.player.keys,door:api.tileAt(col,9)},solved=api.campaign.trials.filter(t=>t.solved).map(t=>t.id);
 const beforeKeys=api.items.filter(i=>i.t==='k').map(i=>i.x).join(',');useCache=false;route.input([0,0,0]);let frames=0;while(!api.player.dead&&frames<16000){route.step();frames++;}if(!api.player.dead)throw Error('Service wait did not die');let deathFrames=0;while(api.player.dead&&deathFrames<100){route.step();deathFrames++;}commands.push({a:[0,0,0],frames:frames+deathFrames});expectedLives=2;retryDone=true;
 if(api.player.lives!==2||api.player.dead||api.player.keys!==before.keys||api.tileAt(col,9)!==before.door||api.items.filter(i=>i.t==='k').map(i=>i.x).join(',')!==beforeKeys||!solved.every(id=>api.campaign.trials.find(t=>t.id===id).solved))throw Error('Service recovery lost inventory or door');
 console.log('PASS service death recovery '+retryService);throw Error('RETRY_PART');
}
for(let roomIndex=0;roomIndex<rooms.length;roomIndex++){const z=rooms[roomIndex];if(z.part===6||bossFixture)break;
 go({x:z.x0+55,y:151,label:z.part+' entrance',minX:Math.max(0,z.x0-100),maxX:z.x0+180});recharge(z);
 try{
 for(const original of api.campaign.trials.filter(t=>t.part===z.part)){
  const id=original.id,get=()=>api.campaign.trials.find(t=>t.id===id);let t=get();
  if(!t.solved){
  if(t.kind==='charge'){
   for(const n of t.nodes){
    // Pass the guardian, then bait a charge toward the pressure seal. Search
    // may jump or wait, but cannot switch an enemy's state or activate a seal.
    const guardian=api.ents.filter(e=>e.t==='K'&&e.sx>=t.x0&&e.sx<t.gateX).sort((a,b)=>Math.abs(a.sx-n.x)-Math.abs(b.sx-n.x))[0];
    if(!guardian)throw Error('Missing guardian '+id);
    const sx=guardian.sx,side=sx<n.x?1:-1;
    go({x:n.x+side*28,y:151,label:id+' approach seal '+n.id,minX:t.x0,maxX:t.gateX});
    // A missed bait is allowed to finish and return through real idle inputs.
    // Camera lag is part of the search state: enemies act only fully in view.
    let settle=0;
    while(!(useCache&&cached?.stages[stages.length]?.label===id+' bait '+n.id)&&!get().nodes.find(k=>k.id===n.id).active&&settle<420){const g=api.ents.find(e=>e.t==='K'&&e.sx===sx);if(g.state==='idle'||g.state==='warn')break;input([0,0,0],10);settle+=10;}
    go({x:n.x+side*28,y:151,label:id+' bait '+n.id,minX:t.x0,maxX:t.gateX},()=>get().nodes.find(k=>k.id===n.id).active,{
     distance(s){const g=s.ents.find(e=>e.t==='K'&&e.sx===sx),remaining=Math.abs(g.x+g.w/2-n.x),raw=remaining>(g.chargeDist||160)-18?g.x+g.w/2+side*80:n.x+side*28,target=side>0?Math.min(raw,g.x+120):raw;return .8*Math.abs(s.player.x+5-target)+.7*Math.abs(s.player.y+9-151)+.2*remaining;},
     keySuffix(s){const g=s.ents.find(e=>e.t==='K'&&e.sx===sx);return ','+[Math.round(g.x/4),g.state,Math.floor(g.timer/10),g.dir,Math.round(s.cam.x),Math.floor(s.simF%400/10)].join(',');}
    });
    maybeRetry(get());
   }
  }else if(t.kind==='weight'){
   nearNode(id,'1',id+' pickup');if(api.campaign.carry!==id)throw Error('Pickup failed '+id);
   maybeRetry(get());
   nearNode(id,'2',id+' deposit');
   if(t.relay){
    if(get().solved||get().docked!=='2')throw Error('Relay prematurely solved '+id);
    if(exerciseLinks){nearNode(id,'2',id+' withdraw before latch');if(get().bridges.some(b=>b.on)||api.campaign.carry!==id)throw Error('Unlatched supports did not retract');nearNode(id,'2',id+' restore weight power');}
    go({x:t.x0+(t.gate-28+12)*16,y:87,label:id+' powered lower stair',minX:t.x0,maxX:t.gateX});
    go({x:t.x0+(t.gate-28+18)*16,y:55,label:id+' powered upper stair',minX:t.x0,maxX:t.gateX});
    nearNode(id,'3',id+' fix remote latch');if(!get().anchored)throw Error('Latch failed '+id);
    maybeRetry(get());
    nearNode(id,'2',id+' retrieve same weight');if(api.campaign.carry!==id)throw Error('Retrieval failed '+id);
    go({x:t.x0+(t.gate-28+11)*16,y:87,label:id+' return with weight',minX:t.x0,maxX:t.gateX});
    nearNode(id,'4',id+' upper balance');
   }
   if(!get().solved)throw Error('Deposit failed '+id);
  }else if(t.kind==='mirror'){
   // Visible mirror geometry determines orientation; each rotation is DOWN.
   const solution=require('./solve-mirror-layout')(get(),(c,r)=>api.isSolid(api.tileAt(c,r)));
   if(retryKind==='mirror'&&retryTrial===id&&!retryDone){const correct=get().nodes.find(n=>n.role==='mirror'&&n.angle===solution[n.id]),wrong=get().nodes.find(n=>n.role==='mirror'&&n.angle!==solution[n.id]);if(!correct||!wrong)throw Error('Mixed mirror recovery requires correct and incorrect initial mirrors');nearNode(id,correct.id,id+' deliberate wrong mirror '+correct.id);nearNode(id,wrong.id,id+' partial correction '+wrong.id);maybeRetry(get());}
   for(const name of Object.keys(solution)){t=get();const n=t.nodes.find(n=>n.id===name);if(n.angle!==solution[name]){
    if(t.dualLight&&name==='C')go({x:n.x,y:103,label:id+' right access below C',minX:t.x0,maxX:t.gateX});
    nearNode(id,name,id+' mirror '+name);
   }maybeRetry(get());}
   input([0,0,0],35);
   if(t.dualLight)maybeRetry(get());
   if(t.dualLight){if(!get().primed||get().solved)throw Error('First receiver failed '+id);if(exerciseLinks){nearNode(id,'C',id+' interrupt first light');if(!get().primed||!get().bridges.every(b=>b.on))throw Error('Stored receiver power was lost');nearNode(id,'C',id+' reconnect stored light');}nearNode(id,'E',id+' divert powered prism');input([0,0,0],35);}
   if(!get().solved)throw Error('Light did not connect '+id);
  }else{
   if(level===5&&id==='5-2'&&t.kind==='timed'&&!t.progress){const liftX=t.x0+(t.gate-28+6)*16;go({x:liftX+8,y:130,label:id+' board final lift',minX:t.x0,maxX:t.gateX},()=>api.player.mover?.t==='v'&&api.player.mover.sx>liftX-16);}
   for(let orderIndex=0;orderIndex<t.order.length;orderIndex++){const name=t.order[orderIndex];nearNode(id,name,id+' rune '+name);maybeRetry(get());
    if(expireTrial===id&&!expiredOnce){const before=get();if(!before.until||!before.progress)throw Error('Expiry test did not start clock');useCache=false;input([0,0,0],before.until-api.simF+3);if(get().until||get().progress||get().open||get().nodes.some(n=>n.active))throw Error('Expiry did not reset clock and gate');expiredOnce=true;console.log('PASS deliberate timer expiry '+id);orderIndex=-1;}
   }
   if(t.kind==='sequence'&&!get().solved)throw Error('Sequence failed '+id);
  }
  }
  t=get();go({x:t.gateX+35,y:151,label:id+' gate',minX:t.x0,maxX:t.gateX+65},()=>api.player.x>get().gateX+20&&get().solved);
  if(id.endsWith('-1')){
   // Landings constrain the search at acid crossings; all are reached by keys.
   const local=(x,y,label)=>go({x:z.x0+x*16+8,y,label:z.part+' '+label,minX:z.x0+40*16,maxX:z.x0+72*16});
   if(level===4&&z.part%2){local(50,119,'canal 1');local(55,103,'canal 2');local(61,119,'bank');}
   if(level===5&&z.part%2){local(54,120,'moving bridge');local(58,103,'crumble bridge');local(64,119,'bank');}
   if(level===5&&!(z.part%2)){go({x:z.x0+46*16+8,y:151,label:z.part+' lift bank',minX:z.x0+40*16,maxX:z.x0+48*16});go({x:z.x0+49*16+8,y:100,label:z.part+' board lift',minX:z.x0+44*16,maxX:z.x0+53*16},()=>api.player.mover?.t==='v'&&api.player.y+18<108);local(54,39,'upper balcony');local(61,87,'descending crumble');local(66,119,'bank');}
   if(level===7){local(50,119,'crumble 1');local(55,87,'upper island');local(61,119,'crumble 2');}
   local(67,151,'traversal end');
   const service=api.L.def.segs[api.L.zones.indexOf(z)].service;
   if(service){
    const k=api.items.find(i=>i.t==='k'&&i.x>=z.x0&&i.x<z.x1);
    if(k){
     if(level===5&&z.part===2)go({x:z.x0+77*16,y:80,label:'maintenance lift',minX:z.x0+64*16,maxX:z.x0+85*16},()=>api.player.mover?.t==='v'&&api.player.mover.sx>z.x0+70*16&&api.player.y+18<92);
     if(level===5&&z.part===4){go({x:z.x0+83*16,y:87,label:'pendulum gallery ascent',minX:z.x0+64*16,maxX:z.x0+87*16});}
     go({x:k.x+4,y:k.y+4,label:'gallery key '+z.part,minX:z.x0+64*16,maxX:z.x0+service.door*16},()=>!api.items.some(i=>i.t==='k'&&i.x===k.x));
    }
    if(level===5&&z.part===4)go({x:z.x0+89*16,y:71,label:'pendulum fragile crossing',minX:z.x0+64*16,maxX:z.x0+99*16});
    recoverService(z,'key');
    go({x:z.x0+service.door*16+35,y:151,label:'maintenance gate '+z.part,minX:z.x0+64*16,maxX:z.x0+(service.door+4)*16},()=>api.player.x>z.x0+service.door*16+20&&api.tileAt(z.x0/16+service.door,9)!=='D');
    recoverService(z,'door');
   }
  }
 }
 }catch(e){if(e.message==='RETRY_PART'){roomIndex--;continue;}throw e;}
 if(z.part===5&&level<7){go({x:z.x1-65,y:151,label:'goal',minX:z.x1-130,maxX:z.x1},()=>api.state==='clear');}
 else go({x:z.x1-44,y:151,label:z.part+' end',minX:z.x1-130,maxX:z.x1+20});
}
if(level===7){
 const b0=api.campaign.final;
 function failAndRecover(){
  useCache=false;
  if(!api.campaign.final.active)go({x:b0.x0+35,y:151,label:'enter arena for failed attempt',minX:b0.x0-130,maxX:b0.x1-16},()=>api.campaign.final.active);
  route.input([0,0,0]);let frames=0;while(!api.player.dead&&frames++<16000)route.step();
  if(!api.player.dead)throw Error('Idle attempt did not die');
  if(api.campaign.final.phase!==retryPhase)throw Error('Death did not occur in requested phase');
  const timer=api.campaign.final.timer;let deathFrames=0;
  while(api.player.dead&&deathFrames++<100){route.step();if(api.player.dead&&api.campaign.final.timer!==timer)throw Error('Boss advanced during death');}
  commands.push({a:[0,0,0],frames:frames+deathFrames});expectedLives=2;
  if(api.player.lives!==2||api.player.dead||api.player.x>=b0.x0||api.player.x<b0.x0-150||api.campaign.final.hp!==6||!api.campaign.trials.every(t=>t.solved))throw Error('Invalid boss recovery');
  retryDone=true;
 }
 if(retryBoss&&retryPhase===1)failAndRecover();
 if(!bossFixture){const e=api.items.find(i=>i.t==='E'&&i.x>b0.x0-100&&i.x<b0.x0);go({x:e.x+8,y:151,label:'boss recharge',minX:e.x-50,maxX:b0.x0},()=>api.player.charging&&Math.abs(api.player.x+5-e.x-8)<4);input([0,0,0],Math.ceil((100-api.player.energy)/.2575)+5);}
 for(let hp=6;hp>0;hp--){
  let b=api.campaign.final;const left=hp===6?api.player.x<b.x+32:api.player.vx<0,tx=b.x0+(left?118:236);
  go({x:tx,y:71,label:'boss ledge '+hp,minX:b.x0-130,maxX:b.x1-16},()=>api.player.onGround&&Math.abs(api.player.y-62)<2&&Math.abs(api.player.x+5-tx)<12);
  let guard=0;
  while(api.campaign.final.state!=='open'&&guard++<700){
   b=api.campaign.final;
   // Third phase marks the last position. Move along the ledge before impact.
   const evade=b.phase>=2&&['warn','attack'].includes(b.state)&&Math.abs(api.player.x+5-b.target)<26;
   const dir=evade?(b.target<b.x0+160?(b.target>b.x0+94?-1:1):(b.target>b.x0+250?-1:1)):0;
   const drop=b.phase>=2&&['warn','attack'].includes(b.state)&&(b.state==='attack'||b.timer<=35)&&api.player.onGround&&api.player.y<(b.phase===3&&b.cycle%2===0?130:80);
   input([dir,+drop,+drop],1);
  }
  if(guard>=700)throw Error('Boss opening missing');
  b=api.campaign.final;const before=b.hp;
  go({x:b.x+32,y:b.y-9,label:'boss strike '+hp,minX:b.x0+16,maxX:b.x1-26},()=>api.campaign.final.hp<before);
  if(retryBoss&&!retryDone&&api.campaign.final.hp===(retryPhase===2?4:2)){failAndRecover();hp=7;}
 }
 input([0,0,0],130);if(!api.campaign.final.defeated)throw Error('Boss defeat missing');
 if(!bossFixture){const s=api.items.find(i=>i.t==='S');go({x:s.x+16,y:151,label:'final treasure',minX:b0.x0,maxX:api.L.W},()=>api.state==='clear');}
}
route.restore(initial);let minEnergy=100,hits=0,prevHurt=0;
for(const c of commands){route.input(c.a);for(let f=0;f<c.frames&&api.state==='play';f++){route.step();minEnergy=Math.min(minEnergy,api.player.energy);if(api.player.hurtT>prevHurt)hits++;prevHurt=api.player.hurtT;if(api.player.dead&&!retryBoss&&!retryKind&&!retryService)throw Error('Replay died');}}
if((retryBoss||retryKind||retryService)&&(!retryDone||api.player.lives!==2))throw Error('Expected exactly one death and successful recovery');
if(expireTrial&&!expiredOnce)throw Error('Expected deliberate timer expiry');
if(bossFixture?!api.campaign.final.defeated:api.state!=='clear')throw Error('Replay incomplete');
const report={protocol:"harmonized-v2",policy,budget:limit,deaths:initial.player.lives-api.player.lives,retry:retryBoss?"boss-phase"+retryPhase:retryKind||retryService||null,level:level+1,complete:!bossFixture,scope:bossFixture?'Isolated arena start; NOT full campaign':'Full level from natural spawn',sourceHash:require('crypto').createHash('sha256').update(source).digest('hex'),frames:api.simF,seconds:api.simF/60,minEnergy,hits,events:api.campaign.events,stages,commands};fs.writeFileSync(out,JSON.stringify(report,null,2));console.log('PASS N'+(level+1)+' '+report.seconds+'s');
