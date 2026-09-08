'use strict';
// Real frame ordering from a declared near-threshold fixture; not a full route.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const createGame=require('./route-harness-candidate-A.cjs');
const sourceFile=process.argv[2]||path.join(__dirname,'candidate-A.html');
const source=fs.readFileSync(sourceFile,'utf8'),cases=[];
for(const offset of [-1,0,1]){
 const {api,route}=createGame(source);api.newGame();api.loadLevel(5);api.startLevel();const t=api.campaign.trials[0];
 t.progress=t.nodes.length;t.until=100;api.campaignGate(t,true);api.simF=100+offset-1;
 Object.assign(api.player,{x:t.gateX-api.player.w,y:142,vx:1.5,vy:0,onGround:true,dead:0});
 route.input([1,0,0]);route.step();
 const first={simF:api.simF,x:api.player.x,right:api.player.x+api.player.w,until:t.until,open:t.open,solved:t.solved};
 for(let i=0;i<20;i++)route.step();const afterExit={x:api.player.x,open:t.open,solved:t.solved,tile:api.tileAt(t.gateX/16,9)};
 route.input([-1,0,0]);for(let i=0;i<45;i++)route.step();
 const afterReturn={x:api.player.x,open:t.open,solved:t.solved,tile:api.tileAt(t.gateX/16,9)};
 cases.push({crossingOffsetFromDeadline:offset,gateX:t.gateX,first,afterExit,afterReturn,events:api.campaign.events});
}
const report={sha256:crypto.createHash('sha256').update(source).digest('hex'),scope:'Fabricated valid threshold-adjacent state, then production route.step with normal inputs and hazards. Does not claim whole-level reachability.',cases};
fs.writeFileSync(process.argv[3]||path.join(__dirname,'probe-deadline-physics.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
