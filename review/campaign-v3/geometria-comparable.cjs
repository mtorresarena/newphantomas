'use strict';
const fs=require('node:fs'),path=require('node:path');
const createGame=require('./route-harness-base.cjs');
const input=process.argv[2]||path.join(__dirname,'index-base-31d4610.html');
const output=process.argv[3]||path.join(__dirname,'geometria-base.json');
const {api}=createGame(fs.readFileSync(input,'utf8'));
const levels=[];
for(let li=0;li<api.LEVELS.length;li++){
 api.newGame();api.loadLevel(li);const def=api.LEVELS[li],start=api.player.x,goal=api.items.find(i=>i.t==='S');
 const count=t=>api.items.filter(i=>i.t===t).length;
 const raw=def.segs.map(s=>s.rows.join('')).join('');
 const doors=[...new Set(api.L.map.flatMap(r=>r.flatMap((ch,c)=>ch==='D'?[c]:[])))].sort((a,b)=>a-b);
 const enemyTypes=[...new Set(api.ents.map(e=>e.t))].sort();
 const goalDx=goal?Math.max(0,goal.x-start-api.player.w):null;
 levels.push({level:li+1,name:def.name,columns:api.L.cols,widthPx:api.L.W,horizontalGoalDistanceLowerBoundPx:goalDx,
  keys:count('k'),doorColumns:doors.length,orderedDoorColumns:doors,chargers:count('E'),checkpoints:count('C'),batteries:count('b'),optionalBags:count('$'),garlic:count('j'),
  enemyCount:api.ents.length,enemyTypes,enemyTypeCount:enemyTypes.length,movingPlatforms:api.movers.length,verticalPlatforms:api.movers.filter(m=>m.t==='v').length,horizontalPlatforms:api.movers.filter(m=>m.t==='h').length,
  crumbleTiles:api.crumbles.length,acidTiles:[...raw].filter(x=>x==='~').length,spikeTiles:[...raw].filter(x=>x==='^').length,boss:!!api.boss,dawnSeconds:def.dawn||null,
  ruleInventory:{keysOpenDoors:doors.length>0,energyAndCharging:count('E')>0,movingSupports:api.movers.length>0,fragileSupports:api.crumbles.length>0,garlicRepelsVampire:count('j')>0&&enemyTypes.includes('v'),timePressure:!!def.dawn,conductorBoss:!!api.boss},
  note:'Counts are opportunities or objects; not mandatory decisions, difficulty, human duration, or proof of a playable route.'});
}
const result={input,method:'Same baseline loader and predicates applied to every level; geometry and rule inventory only. Goal displacement ignores walls, keys and vertical travel and is not a completion time.',levels};
fs.writeFileSync(output,JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(levels.map(l=>({level:l.level,columns:l.columns,keys:l.keys,doors:l.doorColumns,enemies:l.enemyCount,types:l.enemyTypeCount,movers:l.movingPlatforms,fragile:l.crumbleTiles,goalDx:l.horizontalGoalDistanceLowerBoundPx})),null,2));
