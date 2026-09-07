'use strict';
// Search for an INPUT witness, then replay it from the actual level start.
// No teleport, healing, invulnerability, enemy removal or manual gate opening in replay.
const fs=require('fs'),path=require('path'),createGame=require('./route-harness');
const level=Number(process.argv[2]||4),limit=Number(process.argv[3]||14000),version=process.argv[4]||'v2.3';
const {api,route}=createGame();api.newGame();api.loadLevel(level);api.startLevel();
const initial=route.save(),actions=[[1,0],[1,1],[0,0],[0,1],[-1,0],[-1,1]];
class Heap{constructor(){this.a=[];}push(n){let i=this.a.length;this.a.push(n);while(i){let p=(i-1)>>1;if(this.a[p].score<=n.score)break;this.a[i]=this.a[p];i=p;}this.a[i]=n;}pop(){const a=this.a,n=a[0],v=a.pop();if(a.length){let i=0;while(i*2+1<a.length){let c=i*2+1;if(c+1<a.length&&a[c+1].score<a[c].score)c++;if(a[c].score>=v.score)break;a[i]=a[c];i=c;}a[i]=v;}return n;}}
function targetScore(s,t){const p=s.player;return Math.abs(p.x+5-t.x)*.75+Math.abs(p.y+9-t.y)*1.7;}
function hash(s){const p=s.player;return [Math.round(p.x/4),Math.round(p.y/4),Math.round(p.vx),Math.round(p.vy),+p.onGround,+p.jHeld,Math.floor(s.simF%320/24),p.keys,Math.floor(p.energy/20),s.items.filter(i=>i.t==='k').length,s.crumbles.filter(c=>c.state!=='solid').map(c=>c.c+':'+c.state[0]+Math.floor(c.timer/20)).join('.')].join(',');}
let inputs=[],stages=[];
const rooms=api.L.zones.filter(z=>!z.transition);
for(const z of rooms){
 const objective=api.items.find(i=>(i.t==='k'||i.t==='S')&&i.x>=z.x0&&i.x<z.x1);
 const targets=[];
 // Approach return balconies from the open side. These are search waypoints,
 // never teleports: the final witness is replayed from spawn using only inputs.
 const approaches={'4:4':[[50,6]],'4:5':[[48,5]],'6:1':[[34,7]],'6:5':[[44,8],[55,5]]}[level+':'+z.part]||[];
 for(const [col,row] of approaches)targets.push({x:z.x0+col*16+8,y:row*16-9,type:'balcony'});
 // Authored planning hints guide the search to the lift and its landing.
 // They add input objectives, not state changes; replay still contains only keys.
 const lift=api.movers.find(m=>m.t==='v'&&m.sx>=z.x0&&m.sx<z.x1);
 if(lift){
  targets.push({x:lift.sx+16,y:lift.sy-35,type:'ride',sy:lift.sy});
  let col=Math.ceil((lift.sx+16)/16);while(col<z.x1/16&&api.L.map[3][col]!=='=')col++;
  if(col<z.x1/16)targets.push({x:col*16+8,y:39,type:'balcony'});
 }
 targets.push({x:objective.x+objective.w/2,y:objective.y+objective.h/2,type:objective.t,ox:objective.x});
 if(objective.t==='k')targets.push({x:z.x1+48,y:151,type:'exit'});
 for(const t of targets){
  const start=route.save(),heap=new Heap(),seen=new Map();let found=null,expanded=0;
  heap.push({s:start,score:targetScore(start,t),g:0,parent:null,a:null});
  while(heap.a.length&&expanded<limit){
   const n=heap.pop();expanded++;
   for(let ai=0;ai<actions.length;ai++){
    route.restore(n.s);route.input(actions[ai]);let dead=false;
    for(let f=0;f<10;f++){route.step();if(api.player.dead||api.player.lives<initial.player.lives){dead=true;break;}if(api.state==='clear')break;}
    if(dead)continue;
    const s=route.save(),p=s.player;
    if(p.x<z.x0-24||p.x>z.x1+65)continue;
    const g=n.g+10,node={s,g,parent:n,a:ai};
    const success=t.type==='ride'?p.mover?.t==='v'&&p.y+p.h<t.sy-10:t.type==='balcony'?p.onGround&&Math.abs(p.y+9-t.y)<3&&Math.abs(p.x+5-t.x)<22:t.type==='exit'?p.x>=t.x:t.type==='S'?s.state==='clear':!s.items.some(i=>i.t==='k'&&i.x===t.ox);
    if(success){found=node;break;}
    const k=hash(s),cost=g+(100-p.energy)*2;
    if((seen.get(k)??Infinity)<=cost)continue;seen.set(k,cost);
    node.score=targetScore(s,t)+g*.10+(100-p.energy)*1.2;
    heap.push(node);
   }
   if(found)break;
  }
  if(!found){console.error(`FAIL N${level+1} ${z.label} ${t.type}: ${expanded} nodes`);process.exit(1);}
  const seq=[];for(let n=found;n.parent;n=n.parent)seq.push(n.a);seq.reverse();inputs.push(...seq);
  route.restore(found.s);stages.push({part:z.part,label:z.label,target:t.type,frames:found.g,energy:+api.player.energy.toFixed(1),expanded});
  console.log(JSON.stringify(stages.at(-1)));
 }
}
route.restore(initial);let minEnergy=100,hits=0,crumbleContacts=0,moverContacts=0,prevHurt=0;
for(const ai of inputs){route.input(actions[ai]);for(let f=0;f<10&&api.state==='play';f++){
 route.step();minEnergy=Math.min(minEnergy,api.player.energy);if(api.player.hurtT>prevHurt)hits++;prevHurt=api.player.hurtT;
 if(api.player.mover)moverContacts++;
 if(api.crumbles.some(c=>c.state==='shaking'))crumbleContacts++;
 if(api.player.dead)throw Error('Replay died');
}}
if(api.state!=='clear')throw Error('Replay did not clear level');
const report={level:level+1,frames:inputs.length*10,seconds:Math.round(inputs.length/6),minEnergy:+minEnergy.toFixed(1),hits,crumbleContacts,moverContacts,stages,actions,inputs};
const output=path.join(__dirname,'..','review',`route-n${level+1}-${version}.json`);fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');
console.log(`PASS continuous replay N${level+1}: ${report.seconds}s, minimum energy ${report.minEnergy}, hits ${hits}`);
