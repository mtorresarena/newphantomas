'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const createGame=require('./route-harness-base.cjs');
const witness=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
const {api,route}=createGame(fs.readFileSync(path.join(__dirname,'index-base-31d4610.html'),'utf8'));
api.newGame();api.loadLevel(witness.level-1);api.startLevel();
const events=[],counts={frames:0,charging:0,movingWithoutCharge:0,stillWithoutCharge:0,bossActive:0,damageEvents:0,jumps:0};
const record=(kind,detail={})=>events.push({frame:counts.frames,kind,x:+api.player.x.toFixed(2),y:+api.player.y.toFixed(2),energy:+api.player.energy.toFixed(2),...detail});
for(const ai of witness.inputs){const action=witness.actions[ai];route.input(action);
 for(let f=0;f<witness.framesPerAction&&api.state==='play';f++){
  const p=api.player,b=api.boss,prev={x:p.x,y:p.y,vy:p.vy,hurt:p.hurtT,keys:p.keys,bossState:b?.state,hp:b?.hp,active:b?.active,defeated:b?.defeated,charged:b?.conductors.map(c=>c.charged)};
  route.step();counts.frames++;assert.equal(api.player.dead,0);assert.equal(api.player.lives,3);
  if(p.charging)counts.charging++;else if(Math.abs(p.x-prev.x)>.01||Math.abs(p.y-prev.y)>.01)counts.movingWithoutCharge++;else counts.stillWithoutCharge++;
  if(p.vy<-3&&prev.vy>=0){counts.jumps++;record('jump');}
  if(p.hurtT>prev.hurt){counts.damageEvents++;record('damage');}
  if(p.keys>prev.keys)record('key');if(p.keys<prev.keys)record('door');
  if(b){
   if(b.active)counts.bossActive++;
   if(b.active&&!prev.active)record('boss-start');
   if(b.state!==prev.bossState)record('boss-state',{state:b.state,timer:b.timer});
   if(b.hp!==prev.hp)record('boss-hit',{hp:b.hp,charged:b.conductors.map(c=>c.id).filter((id,i)=>b.conductors[i].charged&&!prev.charged[i])});
   if(b.defeated&&!prev.defeated)record('boss-defeated');
  }
 }
}
assert.equal(api.state==='clear',witness.complete);assert.equal(counts.frames,witness.metrics.frames);
assert.equal(counts.charging+counts.movingWithoutCharge+counts.stillWithoutCharge,counts.frames);
const report={level:witness.level,complete:api.state==='clear',witness:process.argv[2],scope:'Clean baseline replay. Mutually exclusive frame categories are mechanical observations, not meaningful activity or human decisions.',counts,events};
const output=process.argv[3]||path.join(__dirname,`eventos-base-n${witness.level}.json`);fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({...report,events:events.filter(e=>e.kind.startsWith('boss'))},null,2));
