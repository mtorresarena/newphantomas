'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const createGame=require('./route-harness-candidate-A.cjs');
const source=fs.readFileSync(process.argv[2]||path.join(__dirname,'candidate-B.html'),'utf8'),cases=[];
function fixture(level){const g=createGame(source);g.api.newGame();g.api.loadLevel(level);g.api.startLevel();return g;}
function use(api,n){Object.assign(api.player,{x:n.x-5,y:n.y-9,vx:0,vy:0,dead:0});api.keys.ArrowDown=false;api.updateCampaign();api.keys.ArrowDown=true;api.updateCampaign();api.keys.ArrowDown=false;api.updateCampaign();}
for(let l=4;l<8;l++){
 const inventory=fixture(l).api.campaign.trials.map(t=>({id:t.id,kind:t.kind,nodes:t.nodes.length}));
 for(const def of inventory){
  const {api,route}=fixture(l),t=api.campaign.trials.find(t=>t.id===def.id);
  if(t.kind==='mirror')use(api,t.nodes.find(n=>n.role==='mirror'));
  else if(t.kind==='weight')use(api,t.nodes.find(n=>n.role==='stone'));
  else if(t.kind==='sequence'||t.kind==='timed')use(api,t.nodes.find(n=>n.id===t.order[0]));
  else if(t.nodes.length>1)t.nodes[0].active=true;
  const prepared={progress:t.progress,carry:api.campaign.carry,until:t.until,angles:t.nodes.map(n=>n.angle),active:t.nodes.map(n=>n.active)};
  route.input([0,0,0]);api.die('hit');for(let f=0;f<91;f++)route.step();
  const ok=api.player.lives===2&&!api.player.dead&&!t.solved&&!t.open&&t.progress===0&&!t.until&&api.campaign.carry===null&&t.nodes.every(n=>!n.active&&n.angle===n.initialAngle)&&api.ents.filter(e=>e.t==='K'||e.t==='Y').every(e=>e.state==='idle'&&e.x===e.sx);
  cases.push({level:l+1,trial:t.id,kind:t.kind,nodes:t.nodes.length,prepared,ok});
 }
}
const {api,route}=fixture(7),b=api.campaign.final,canonicalX=b.x;
Object.assign(api.player,{x:b.x0+30,y:142,vx:0,vy:0});Object.assign(b,{active:true,hp:1,phase:3,state:'open',timer:100});api.simF=131;api.updateCampaign();const phase3X=b.x;
route.input([0,0,0]);api.die('hit');for(let f=0;f<91;f++)route.step();
const bossRetry={canonicalX,phase3X,afterResetX:b.x,hp:b.hp,phase:b.phase,state:b.state,active:b.active,canonicalPositionRestored:Math.abs(b.x-canonicalX)<.001};
const report={sha256:crypto.createHash('sha256').update(source).digest('hex'),scope:'Partial puzzle and phase states fabricated; death and respawn executed by production step. Tests state recovery, not traversal/reachability.',cases,bossRetry};
fs.writeFileSync(process.argv[3]||path.join(__dirname,'probe-recovery-matrix.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({passed:cases.filter(c=>c.ok).length,total:cases.length,failed:cases.filter(c=>!c.ok),bossRetry},null,2));
