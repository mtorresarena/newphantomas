'use strict';
// Legal input prefix from the actual N5 start; tests whether jumping is needed here.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const createGame=require('./route-harness-candidate-A.cjs');
const source=fs.readFileSync(path.join(__dirname,'candidate-B.html'),'utf8');
const {api,route}=createGame(source);api.newGame();api.loadLevel(4);api.startLevel();
const t=api.campaign.trials[0],guard=api.ents.find(e=>e.t==='K'&&e.puzzleGuard),approach=guard.sx-130,safe=t.nodes[0].x+50;
let phase='approach',inputs=[],hits=0,lastHurt=0;
for(let frame=0;frame<1500&&!t.solved&&!api.player.dead;frame++){
 let dir=0;
 if(phase==='approach'){if(api.player.x<approach-2)dir=1;else phase='wait-first-charge';}
 if(phase==='wait-first-charge'&&guard.state==='recover')phase='walk-past';
 if(phase==='walk-past'){if(api.player.x<safe-2)dir=1;else phase='wait-for-seal';}
 route.input([dir,0,0]);route.step();inputs.push([dir,0,0]);
 if(api.player.hurtT>lastHurt)hits++;lastHurt=api.player.hurtT;
}
const report={sha256:crypto.createHash('sha256').update(source).digest('hex'),scope:'Real N5 start, controls only. Complete first seal puzzle, partial level; no geometry/state mutation, no jumps.',solved:t.solved,frames:inputs.length,seconds:inputs.length/60,hits,lives:api.player.lives,dead:api.player.dead,energy:api.player.energy,position:{x:api.player.x,y:api.player.y},phase,events:api.campaign.events,inputs};
fs.writeFileSync(path.join(__dirname,'probe-charge-safe-inputs-v2.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({...report,inputs:inputs.length},null,2));
