'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const createGame=require('./route-harness-base.cjs');
const source=fs.readFileSync(path.join(__dirname,'index-base-31d4610.html'),'utf8');
const files=['ruta-base-v2-n1.json','ruta-base-n2.json','ruta-base-v2-n3.json','ruta-base-v3-n4.json'];
const results=[];
const category=a=>a[2]?(a[1]?'drop_command':'use_command'):a[0]?(a[1]?'horizontal_and_jump_held':'horizontal'):a[1]?'jump_held_without_direction':'neutral';
for(const file of files){
 const witness=JSON.parse(fs.readFileSync(path.join(__dirname,file),'utf8')),{api,route}=createGame(source);api.newGame();api.loadLevel(witness.level-1);api.startLevel();
 const controls={horizontal:0,horizontal_and_jump_held:0,jump_held_without_direction:0,drop_command:0,use_command:0,neutral:0};
 const observations={frames:0,neutralStill:0,neutralMoving:0,chargingStill:0,chargingMoving:0,onHorizontalMover:0,onVerticalMover:0,directionChanges:0,jumpStarts:0,damageEvents:0};
 const interactions={key:0,door:0,bag:0,battery:0,garlic:0,checkpoint:0,conductor:0,goal:0};
 const events=[];let previousDirection=0,lastHurt=0;
 const emit=(kind,detail={})=>events.push({frame:observations.frames,kind,x:+api.player.x.toFixed(1),y:+api.player.y.toFixed(1),...detail});
 for(const ai of witness.inputs){const action=witness.actions[ai],cat=category(action);
  if(action[0]&&previousDirection&&action[0]!==previousDirection){observations.directionChanges++;emit('direction-command-change',{to:action[0]});}if(action[0])previousDirection=action[0];route.input(action);
  for(let f=0;f<witness.framesPerAction&&api.state==='play';f++){
   const p=api.player,before={x:p.x,y:p.y,vy:p.vy,keys:p.keys,check:JSON.stringify(api.check),hp:api.boss?.hp,items:api.items.filter(i=>'k$bj'.includes(i.t)).map(i=>({t:i.t,x:i.x,y:i.y}))};
   route.step();observations.frames++;controls[cat]++;assert.equal(api.player.dead,0);assert.equal(api.player.lives,3);
   const still=Math.abs(p.x-before.x)<.01&&Math.abs(p.y-before.y)<.01;
   if(cat==='neutral')observations[still?'neutralStill':'neutralMoving']++;
   if(p.charging)observations[still?'chargingStill':'chargingMoving']++;
   if(p.mover?.t==='h')observations.onHorizontalMover++;if(p.mover?.t==='v')observations.onVerticalMover++;
   if(p.vy<-3&&before.vy>=0){observations.jumpStarts++;emit('jump-start');}
   if(p.hurtT>lastHurt){observations.damageEvents++;emit('damage');}lastHurt=p.hurtT;
   const remaining=new Set(api.items.map(i=>i.t+':'+i.x+':'+i.y));
   for(const item of before.items)if(!remaining.has(item.t+':'+item.x+':'+item.y)){const type={k:'key','$':'bag',b:'battery',j:'garlic'}[item.t];interactions[type]++;emit('pickup',{type});}
   if(p.keys<before.keys){interactions.door++;emit('door-open');}
   if(JSON.stringify(api.check)!==before.check){interactions.checkpoint++;emit('checkpoint');}
   if(api.boss&&api.boss.hp<before.hp){interactions.conductor++;emit('conductor',{hp:api.boss.hp});}
   if(api.state==='clear'){interactions.goal++;emit('goal');}
  }
 }
 assert.equal(api.state,'clear');assert.equal(observations.frames,witness.metrics.frames);assert.equal(Object.values(controls).reduce((a,b)=>a+b,0),observations.frames);
 let cursor=0;const phaseTotals={},phases=[];
 for(const stage of witness.stages){const frames=Math.max(0,Math.min(stage.frames,observations.frames-cursor));const type=stage.target.type;
  phases.push({startFrame:cursor+1,endFrame:cursor+frames,frames,type,zone:stage.target.zone,target:stage.target,meaning:'Planner objective interval, not a semantic activity classification'});cursor+=frames;phaseTotals[type]=(phaseTotals[type]||0)+frames;
 }
 assert.equal(cursor,observations.frames);
 results.push({level:witness.level,witness:file,complete:true,controls,observations,interactions,phaseTotals,phases,events});
}
const report={commit:'31d461028516344bc0dbb80b7ecd625296509014',scope:'Homogeneous observation/classification of four legal input witnesses. Control commands and planner goals are not distinct human decisions. Search policy differs for N2.',definitions:{controlCategories:'Mutually exclusive by buttons; a held jump is not a new jump.',neutral:'No horizontal/jump/drop/use input; movement can continue.',interactions:'Observed automatic pickups, door opening, checkpoint changes, conductor hits and clear.',phases:'Intervals attributed to authored planner targets, not mandatory gameplay phases.'},results};
fs.writeFileSync(path.join(__dirname,'clasificacion-referencias.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(results.map(({level,controls,observations,interactions,phaseTotals})=>({level,controls,observations,interactions,phaseTotals})),null,2));
