'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const createGame=require('./route-harness-score1.cjs');
const source=fs.readFileSync(path.join(__dirname,'candidate-score1.html'),'utf8');
const specs=[{id:'guardian-intro',level:5,kind:'K',advanced:false},{id:'guardian-advanced',level:5,kind:'K',advanced:true},{id:'moth-intro',level:5,kind:'moth'},{id:'moth-combination-n8',level:8,kind:'moth'},{id:'watcher-intro',level:7,kind:'Y'},{id:'watcher-combination-n8',level:8,kind:'Y'},{id:'beetle-optional',level:5,kind:'beetle'}];
function target(api,s){if(s.kind==='K'){const t=api.campaign.trials.find(t=>t.kind==='charge'&&(t.nodes.length>1)===s.advanced);return api.ents.find(e=>e.t==='K'&&e.sx>=t.x0+(t.gate-28)*16&&e.sx<t.gateX);}if(s.kind==='Y')return api.ents.find(e=>e.t==='Y');return api.campaign.foes.find(e=>e.kind===s.kind);}
const runs=[];
for(const spec of specs){
 const w=JSON.parse(fs.readFileSync(path.join(__dirname,`score1-route-n${spec.level}.json`),'utf8'));
 let prefixFrame=0,entry;
 {const {api,route}=createGame(source);api.newGame();api.loadLevel(spec.level-1);api.startLevel();
  outer:for(const c of w.commands){route.input(c.a);for(let f=0;f<c.frames&&api.state==='play';f++){route.step();prefixFrame++;const e=target(api,spec),p=api.player;
   if(spec.kind==='beetle'?(p.x<e.x&&e.x-p.x<70):['alert','warn','prepare'].includes(e.state)){entry={state:e.state,timer:e.timer,x:e.x,y:e.y,playerX:p.x,playerY:p.y,energy:p.energy,inCamera:e.x>=route.camera()&&e.x+e.w<=route.camera()+320,warningMarkerY:e.y-(spec.kind==='moth'?17:0),chargeDist:e.chargeDist};break outer;}
  }}assert.ok(entry,'Reach warning '+spec.id);
 }
 const policies=spec.kind==='beetle'?['wait','right','seek_stomp']:['wait','right','move_after_warning'];
 for(const policy of policies){
  const {api,route}=createGame(source);api.newGame();api.loadLevel(spec.level-1);api.startLevel();let cursor=0;
  outer:for(const c of w.commands){route.input(c.a);for(let f=0;f<c.frames;f++){if(cursor===prefixFrame)break outer;route.step();cursor++;}}
  const e=target(api,spec),states=[],inputs=[],originalEvents=api.campaign.events.length;let lastState=e.state,lastHurt=api.player.hurtT,hits=0,jumps=0,move=false,frames=0,shots=0,lastOrbs=new Set(api.orbs);
  for(;frames<240&&!api.player.dead&&e.alive!==false;frames++){
   const p=api.player;let a=[0,0,0];
   if(policy==='right')a=[1,0,0];
   if(policy==='move_after_warning'){
    if(spec.kind==='Y'?e.state==='lock':e.timer<=8&&['alert','warn'].includes(e.state))move=true;
    if(move){const toward=Math.sign(e.x+e.w/2-p.x-5)||1;a=spec.kind==='K'?[toward,+(e.state==='alert'),0]:[-toward,+(spec.kind==='Y'&&e.state==='lock'),0];}
   }
   if(policy==='seek_stomp'){
    const dx=e.x+e.w/2-p.x-5;let jump=p.onGround&&Math.abs(dx)<48&&p.y+p.h>e.y-20;
    a=[Math.abs(dx)>2?Math.sign(dx):0,+jump,0];
   }
   const vy=p.vy;route.input(a);route.step();inputs.push(a);if(api.player.hurtT>lastHurt)hits++;lastHurt=api.player.hurtT;if(api.player.vy<-3&&vy>=0)jumps++;
   if(e.state!==lastState){states.push({frame:frames+1,state:e.state,timer:e.timer,x:e.x,y:e.y,playerX:api.player.x,playerY:api.player.y});lastState=e.state;}
   shots+=api.orbs.filter(o=>!lastOrbs.has(o)).length;lastOrbs=new Set(api.orbs);
  }
  runs.push({...spec,policy,prefixFrame,entry,frames,hits,jumps,shots,dead:!!api.player.dead,energy:api.player.energy,enemyAlive:e.alive,states,events:api.campaign.events.slice(originalEvents),inputs,scope:'Legal score1 prefix followed by actual controls, no state mutation. Damage includes other hazards present; not attributed solely to the target.'});
 }
}
// Isolated collision fixtures validate the optional stomp rule, not reachability.
const fixtures=[];
for(const variant of ['descending-top','side']){
 const {api}=createGame(source);api.newGame();api.loadLevel(4);api.startLevel();const e=api.campaign.foes.find(e=>e.kind==='beetle');
 api.player.x=e.x+3;api.player.y=variant==='descending-top'?e.y-api.player.h+3:e.y;api.player.vy=variant==='descending-top'?2:0;api.player.onGround=false;
 api.updateCampaign();fixtures.push({variant,alive:e.alive,playerVy:api.player.vy,energy:api.player.energy,events:api.campaign.events,scope:'Explicit player position/velocity collision fixture; no claim of legal approach.'});
 assert.equal(e.alive,variant!=='descending-top');assert.equal(api.player.energy,variant==='descending-top'?100:82);
}
const report={sourceHash:crypto.createHash('sha256').update(source).digest('hex'),runs,fixtures};
fs.writeFileSync(path.join(__dirname,'respuestas-enemigas.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({runs:runs.map(r=>({id:r.id,policy:r.policy,prefixFrame:r.prefixFrame,hits:r.hits,dead:r.dead,shots:r.shots,stomp:r.events.some(e=>e.type==='stomp'),states:r.states.map(s=>[s.frame,s.state])})),fixtures},null,2));
