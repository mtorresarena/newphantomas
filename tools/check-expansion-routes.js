'use strict';
const fs=require('fs'),path=require('path'),createGame=require('./route-harness');
const out=[],version=process.argv[2]||'v2.3';
for(let level=5;level<=8;level++){
 const witness=JSON.parse(fs.readFileSync(path.join(__dirname,'..','review',`route-n${level}-${version}.json`)));
 const {api,route}=createGame();api.newGame();api.loadLevel(level-1);api.startLevel();
 const parts=Array.from({length:5},(_,i)=>({part:i+1,frames:0,minEnergy:100,crumbleContact:0,verticalRide:0,horizontalRide:0,chargeFrames:0,orbsFired:0}));
 for(const ai of witness.inputs){route.input(witness.actions[ai]);for(let f=0;f<10&&api.state==='play';f++){
  const before=new Set(api.orbs),oldP=api.player;
  const crumbleTouch=oldP.onGround&&api.crumbles.some(c=>['solid','shaking'].includes(c.state)&&Math.abs(c.y-oldP.y-oldP.h)<.6&&oldP.x+oldP.w>c.x&&oldP.x<c.x+16);
  route.step();const p=api.player,s=parts[route.part().part-1];
  if(p.dead||p.lives!==3)throw Error(`N${level}: muerte en replay`);
  s.frames++;s.minEnergy=Math.min(s.minEnergy,p.energy);
  if(crumbleTouch)s.crumbleContact++;
  if(p.mover?.t==='v')s.verticalRide++;if(p.mover?.t==='h')s.horizontalRide++;
  if(api.ents.some(e=>e.t==='K'&&e.state==='charge'&&e.x>=route.camera()&&e.x<route.camera()+320))s.chargeFrames++;
  s.orbsFired+=api.orbs.filter(o=>!before.has(o)).length;
 }}
 if(api.state!=='clear')throw Error(`N${level}: no llega a la meta`);
 const required={6:{crumbleContact:[1,2,3,4,5],verticalRide:[3,5],horizontalRide:[4]},7:{crumbleContact:[4,5],orbsFired:[1,2,3,4,5]},8:{crumbleContact:[2,3,4,5],verticalRide:[4,5],horizontalRide:[3],chargeFrames:[1,4,5],orbsFired:[1,4,5]}}[level]||{chargeFrames:[1,2,4,5]};
 for(const [metric,expected] of Object.entries(required))for(const part of expected)if(parts[part-1][metric]===0)throw Error(`N${level} P${part}: falta evidencia de ${metric}`);
 for(const p of parts)p.minEnergy=+p.minEnergy.toFixed(1);
 const result={level,clear:true,deaths:api.stats.deaths,time:+api.stats.time.toFixed(1),parts};out.push(result);console.log(JSON.stringify(result));
}
fs.writeFileSync(path.join(__dirname,'..','review',`continuous-routes-${version}.json`),JSON.stringify(out,null,2)+'\n');
