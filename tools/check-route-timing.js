'use strict';
// Sensitivity of EXISTING open-loop witnesses, not a human success rate or game score.
const fs=require('fs'),path=require('path'),createGame=require('./route-harness');
const delays=[0,15,30,45,60,75,90,105,120],results=[];
for(let level=5;level<=8;level++){
 const witness=JSON.parse(fs.readFileSync(path.join(__dirname,'..','review',`route-n${level}-v2.2.json`),'utf8'));
 for(const delay of delays){
  const {api,route}=createGame();api.newGame();api.loadLevel(level-1);api.startLevel();route.input([0,0]);
  for(let f=0;f<delay;f++)route.step();
  let died=false,frames=0;
  outer:for(const ai of witness.inputs){route.input(witness.actions[ai]);for(let f=0;f<10;f++){
   if(api.state!=='play')break outer;
   route.step();frames++;
   if(api.player.dead||api.player.lives!==3){died=true;break outer;}
  }}
  results.push({level,delayFrames:delay,clear:api.state==='clear',died,replayedFrames:frames,
   part:route.part().part,x:+api.player.x.toFixed(1),energy:+api.player.energy.toFixed(1)});
 }
 const rows=results.filter(r=>r.level===level);
 console.log(`N${level}: ${rows.filter(r=>r.clear).length}/${rows.length} secuencias llegan; ${rows.filter(r=>r.died).length} mueren.`);
}
fs.writeFileSync(path.join(__dirname,'..','review','route-timing-sensitivity.json'),JSON.stringify({delays,results},null,2)+'\n');
if(results.filter(r=>r.delayFrames===0).some(r=>!r.clear))throw Error('El control original de 0 frames debe llegar a la meta');
