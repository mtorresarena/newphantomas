'use strict';
// Planificador acotado independiente. Solo un replay limpio acredita un recorrido.
const fs=require('node:fs'),path=require('node:path');
const createGame=require('./route-harness');
const source=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const level=Number(process.argv[2]||1),limit=Number(process.argv[3]||5000);
const outputTag=process.argv[4]||'balanced',resumeFile=process.argv.includes('--resume')?path.join(__dirname,'../review/campaign-v3/reference-n'+level+'-'+outputTag+'.json'):null; const costs={balanced:{time:.13,damage:5},cautious:{time:.1,damage:8},speed:{time:.2,damage:3}}[outputTag]; if(!costs)throw Error('Unknown policy');
if(level<1||level>4)throw Error('N1–N4 solamente');
const {api,route}=createGame(source);api.newGame();api.loadLevel(level-1);api.startLevel();
const initial=route.save(),actions=[[1,0,0],[1,1,0],[0,0,0],[0,1,0],[-1,0,0],[-1,1,0],[0,1,1]];
class Heap{constructor(){this.a=[];}push(n){let i=this.a.length;this.a.push(n);while(i){let p=(i-1)>>1;if(this.a[p].score<=n.score)break;this.a[i]=this.a[p];i=p;}this.a[i]=n;}pop(){const a=this.a,n=a[0],v=a.pop();if(a.length){let i=0;while(i*2+1<a.length){let c=i*2+1;if(c+1<a.length&&a[c+1].score<a[c].score)c++;if(a[c].score>=v.score)break;a[i]=a[c];i=c;}a[i]=v;}return n;}}
const targets=[];
for(const z of api.L.zones.filter(z=>z.x1-z.x0>100)){
  for(const it of api.items.filter(i=>'kSE'.includes(i.t)&&i.x>=z.x0&&i.x<z.x1).sort((a,b)=>a.x-b.x))targets.push({type:it.t,x:it.x+it.w/2,y:it.y+it.h/2,ox:it.x,zone:z.t});
  if(!targets.some(t=>t.type==='S'))targets.push({type:'exit',x:z.x1+8,y:145,zone:z.t});
}
// Hints author only target locations; successful paths remain normal controls.
if(level===1){const k=targets.findIndex(t=>t.type==='k'&&t.x>1400);targets.splice(k,0,{type:'ride',x:2056,y:80,zone:'library'});}
if(level===2)targets.unshift({type:'stance',x:186,y:103,zone:'moat'},{type:'stance',x:280,y:103,zone:'moat'});
if(level===3){const i=targets.findIndex(t=>t.type==='exit'&&t.zone==='sewer');targets.splice(i,0,{type:'stance',x:2808,y:103,zone:'sewer'},{type:'stance',x:2880,y:55,zone:'sewer'},{type:'stance',x:3290,y:55,zone:'sewer'});}
if(level===4){const i=targets.findIndex(t=>t.type==='exit'&&t.zone==='boss');const x=api.boss.x0;targets.splice(i,0,{type:'conductor',id:0,x:x+106,y:151,zone:'boss'},{type:'conductor',id:1,x:x+38,y:103,zone:'boss'},{type:'conductor',id:2,x:x+267,y:103,zone:'boss'},{type:'defeated',x:x+267,y:103,zone:'boss'});}
if(level===4){const i=targets.findIndex(t=>t.type==='k'&&t.zone==='crypt');targets.splice(i,0,{type:'stance',x:4380,y:119,zone:'crypt'},{type:'stance',x:4270,y:71,zone:'crypt'});}
function hash(s){const p=s.player,b=s.boss;return [Math.round(p.x/4),Math.round(p.y/4),Math.round(p.vx*2),Math.round(p.vy),+p.onGround,+p.jHeld,Math.floor(s.simF%400/30),p.keys,Math.floor(p.energy/15),s.items.filter(i=>i.t==='k').length,b?.state,Math.floor((b?.timer||0)/5),b?.conductors.map(c=>+c.charged).join(''),Math.round((b?.targetX||0)/10),Math.round((b?.targetY||0)/10)].join(',');}
function distance(s,t){return Math.abs(s.player.x+5-t.x)*.8+Math.abs(s.player.y+9-t.y)*1.4;}
let inputs=[],stages=[],failed=null;
if(resumeFile){const prev=JSON.parse(fs.readFileSync(resumeFile,'utf8'));if(prev.level!==level)throw Error('Nivel de reanudación distinto');inputs=prev.inputs;stages=prev.stages;for(const ai of inputs){route.input(actions[ai]);for(let f=0;f<10;f++)route.step();}const last=JSON.stringify(stages.at(-1).target),index=targets.findIndex(t=>JSON.stringify(t)===last);if(index<0)throw Error('Último target anterior no encontrado');targets.splice(0,index+1);}
for(const t of targets){
 if(t.type==='E'&&api.player.energy>90){stages.push({target:t,frames:0,energy:+api.player.energy.toFixed(1),expanded:0,method:'Skip recharge above 90, same campaign policy'});continue;}
 if(level===4&&((t.type==='conductor'&&api.boss.conductors[t.id].charged)||(t.type==='defeated'&&api.boss.defeated))){stages.push({target:t,frames:0,energy:+api.player.energy.toFixed(1),expanded:0});continue;}
 if(level===4&&t.type==='conductor'&&t.id===0&&process.argv.includes('--boss-controller')){
  let hold=0,prevJump=false,frames=0;
  while(!api.boss.defeated&&frames<2400){
   const b=api.boss,p=api.player,id=b.conductors.findIndex(c=>!c.charged),point=id===0?{x:b.x0+106,y:151}:id===1?{x:b.x0+38,y:103}:{x:b.x0+267,y:103};
   const dx=point.x-p.x-5;let dir=Math.abs(dx)>3?Math.sign(dx):0,jump=false,down=false;
   if(hold>0){jump=true;hold--;}else if(p.onGround&&!prevJump&&p.y+9>point.y+10){jump=true;hold=2;}else if(p.onGround&&!prevJump&&p.y+9<point.y-15){jump=true;down=true;}
   const action=[dir,+jump,+down];let ai=actions.findIndex(a=>JSON.stringify(a)===JSON.stringify(action));if(ai<0){ai=actions.length;actions.push(action);}route.input(action);prevJump=jump;
   for(let f=0;f<10;f++){route.step();if(api.player.dead||api.player.lives!==3)throw Error('Falló controlador del jefe durante generación');}
   inputs.push(ai);frames+=10;
  }
  if(!api.boss.defeated)throw Error('Controlador del jefe no lo derrotó');
  const stage={target:t,frames,energy:+api.player.energy.toFixed(1),expanded:0,method:'Adaptive input controller, no state mutations'};stages.push(stage);console.log(JSON.stringify(stage));continue;
 }
 const start=route.save(),heap=new Heap(),seen=new Map();let found=null,expanded=0,best={distance:Infinity};
 heap.push({s:start,score:distance(start,t),g:0,parent:null,a:null});
 while(heap.a.length&&expanded<limit){
  const n=heap.pop();expanded++;
  for(let ai=0;ai<actions.length;ai++){
   route.restore(n.s);route.input(actions[ai]);let dead=false;
   for(let f=0;f<10;f++){route.step();if(api.player.dead||api.player.lives<initial.player.lives){dead=true;break;}if(api.state==='clear')break;}
   if(dead)continue;const s=route.save(),p=s.player,g=n.g+10;
   if(p.x<start.player.x-850||p.x>Math.max(start.player.x,t.x)+900)continue;
   const node={s,g,parent:n,a:ai};
   const success=t.type==='k'?!s.items.some(i=>i.t==='k'&&i.x===t.ox):t.type==='S'?s.state==='clear':t.type==='conductor'?s.boss.conductors[t.id].charged:t.type==='defeated'?s.boss.defeated:t.type==='E'?p.charging&&p.energy>=99.5:t.type==='stance'?p.onGround&&Math.abs(p.x+5-t.x)<20&&Math.abs(p.y+9-t.y)<2:t.type==='ride'?p.mover?.t==='v'&&p.y<90:p.x>=t.x;
   if(success){found=node;break;}
   const d=distance(s,t);if(d<best.distance)best={distance:+d.toFixed(1),x:+p.x.toFixed(1),y:+p.y.toFixed(1),energy:+p.energy.toFixed(1)};
   const h=hash(s),cost=g+(100-p.energy)*costs.damage/costs.time;if((seen.get(h)??Infinity)<=cost)continue;seen.set(h,cost);
   node.score=d+g*costs.time+(100-p.energy)*costs.damage;heap.push(node);
  }
  if(found)break;
 }
 if(!found){failed={target:t,expanded,best};console.log(JSON.stringify({failed}));break;}
 const seq=[];for(let n=found;n.parent;n=n.parent)seq.push(n.a);seq.reverse();inputs.push(...seq);route.restore(found.s);
 const stage={target:t,frames:found.g,energy:+api.player.energy.toFixed(1),expanded};stages.push(stage);console.log(JSON.stringify(stage));
}
// Clean new VM replay: no search snapshots or mutations of player/world state.
const clean=createGame(source);clean.api.newGame();clean.api.loadLevel(level-1);clean.api.startLevel();
const events=[],metrics={frames:0,jumps:0,directionChanges:0,idleInputFrames:0,stationaryFrames:0,movingFrames:0,chargingFrames:0,hits:0,keys:0,doors:0,minEnergy:100,distancePx:0};
let prevDir=0;
for(const ai of inputs){const a=actions[ai];if(a[0]&&prevDir&&a[0]!==prevDir)metrics.directionChanges++;if(a[0])prevDir=a[0];clean.route.input(a);
 for(let f=0;f<10&&clean.api.state==='play';f++){
  const p=clean.api.player,before={x:p.x,y:p.y,vy:p.vy,keys:p.keys,hurt:p.hurtT,zone:clean.route.part().t,cp:JSON.stringify(clean.api.check)};
  clean.route.step();metrics.frames++;const now=clean.api.player,dx=Math.abs(now.x-before.x);metrics.distancePx+=dx;metrics.minEnergy=Math.min(metrics.minEnergy,now.energy);
  if(!a[0]&&!a[1])metrics.idleInputFrames++;if(dx<.01&&Math.abs(now.y-before.y)<.01)metrics.stationaryFrames++;else metrics.movingFrames++;
  if(now.charging)metrics.chargingFrames++;
  const emit=(kind,detail={})=>events.push({frame:metrics.frames,kind,x:+now.x.toFixed(1),y:+now.y.toFixed(1),energy:+now.energy.toFixed(1),...detail});
  if(now.vy<-3&&before.vy>=0){metrics.jumps++;emit('jump');}
  if(now.hurtT>before.hurt){metrics.hits++;emit('damage');}
  if(now.keys>before.keys){metrics.keys++;emit('key');}if(now.keys<before.keys){metrics.doors++;emit('door');}
  if(clean.route.part().t!==before.zone)emit('zone',{zone:clean.route.part().t});
  if(JSON.stringify(clean.api.check)!==before.cp)emit('checkpoint');
  if(now.dead||now.lives!==3)throw Error('El replay limpio murió: no conservar como ruta válida.');
 }
}
metrics.distancePx=+metrics.distancePx.toFixed(1);metrics.minEnergy=+metrics.minEnergy.toFixed(1);metrics.simulatedSeconds=+(metrics.frames/60).toFixed(2);
const result={protocol:"harmonized-v2",budget:limit,policy:outputTag,sourceHash:require('crypto').createHash('sha256').update(source).digest('hex'),level,complete:clean.api.state==='clear',state:clean.api.state,failed,scope:'Synthetic controller, production physics and hazards, clean replay; not human duration or difficulty. Partial prefixes are not completability evidence.',metrics,stages,actions,framesPerAction:10,inputs,events};
fs.writeFileSync(path.join(__dirname,`../review/campaign-v3/reference-n${level}-${outputTag}.json`),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({complete:result.complete,metrics}));
