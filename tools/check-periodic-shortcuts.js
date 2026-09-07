'use strict';
const assert=require('assert/strict'),fs=require('fs'),path=require('path'),create=require('./route-harness');
const baseline=fs.readFileSync(path.join(__dirname,'..','review','baselines','index-v2.2.txt'),'utf8');
const cases=[[4,4,60],[4,5,60],[6,1,30],[6,5,30]],results=[];
for(const [version,source] of [['v2.2',baseline],['v2.3',undefined]])for(const [li,part,period] of cases){
 const trials=[];
 for(const offset of [-8,0,8])for(const phase of [0,30,90]){
  const {api:a,route:r}=create(source);a.newGame();a.loadLevel(li);a.startLevel();const z=a.L.zones.find(z=>z.part===part&&!z.transition);
  Object.assign(a.player,{x:z.x0+52+offset,y:142,vx:0,vy:0,onGround:true,jHeld:false});a.simF=phase;
  const key=a.items.find(i=>i.t==='k'&&i.x>=z.x0&&i.x<z.x1);let collected=false,hits=0,frames=0;
  for(;frames<1800&&a.state==='play'&&!a.player.dead;frames++){
   const energy=a.player.energy;r.input([1,frames%period<period-2,0]);r.step();if(energy-a.player.energy>2)hits++;
   if(key&&!a.items.includes(key))collected=true;
   if(part<5&&a.player.x>z.x1+48)break;
  }
  trials.push({offset,phase,frames,hits,dead:!!a.player.dead,clear:part===5?a.state==='clear':collected&&a.player.x>z.x1+48});
 }
 results.push({version,level:li+1,part,period,cleared:trials.filter(t=>t.clear).length,trials});
}
assert.equal(results.find(r=>r.version==='v2.2'&&r.level===7&&r.part===5).cleared,9,'Reproducir el control del revisor');
for(const r of results.filter(r=>r.version==='v2.3'))assert.equal(r.cleared,0,`N${r.level} P${r.part}: persiste el atajo periódico`);
fs.writeFileSync(path.join(__dirname,'..','review','periodic-shortcuts-v2.3.json'),JSON.stringify(results,null,2)+'\n');
console.log(JSON.stringify(results.map(({trials,...r})=>r),null,2));
