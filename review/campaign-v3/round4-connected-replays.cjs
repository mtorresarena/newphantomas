'use strict';
const assert=require('assert/strict'),fs=require('fs'),crypto=require('crypto'),createGame=require('./route-harness-score1.cjs');
const hash=crypto.createHash('sha256').update(fs.readFileSync('review/campaign-v3/round4/index.html')).digest('hex');
const runs=[];
for(let li=4;li<8;li++){
 const witness=JSON.parse(fs.readFileSync(`review/campaign-v3/round4/route-n${li+1}.json`));assert.equal(witness.complete,true);
 const attempts=[];
 for(let attempt=0;attempt<3;attempt++){
  const {api,route}=createGame(fs.readFileSync('review/campaign-v3/round4/index.html','utf8'));api.newGame();api.loadLevel(li);api.startLevel();
  const counts={frames:0,charging:0,movingWithoutCharge:0,stillWithoutCharge:0,jumps:0,hits:0,returns:0,bossActive:0};let minEnergy=100,lastDir=0;
  for(const c of witness.commands){route.input(c.a);for(let f=0;f<c.frames&&api.state==='play';f++){
   const before={x:api.player.x,y:api.player.y,vy:api.player.vy,hurt:api.player.hurtT};route.step();const p=api.player;
   assert.equal(p.dead,0);assert.equal(p.lives,3);counts.frames++;minEnergy=Math.min(minEnergy,p.energy);
   if(p.charging)counts.charging++;else if(Math.abs(p.x-before.x)>.01||Math.abs(p.y-before.y)>.01)counts.movingWithoutCharge++;else counts.stillWithoutCharge++;
   if(p.vy<-3&&before.vy>=0)counts.jumps++;if(p.hurtT>before.hurt)counts.hits++;
   const dir=Math.sign(p.x-before.x);if(dir&&lastDir&&dir!==lastDir)counts.returns++;if(dir)lastDir=dir;
   if(api.campaign.final?.active)counts.bossActive++;
  }}
  assert.equal(api.state,'clear');assert.ok(api.campaign.trials.every(t=>t.solved));if(li===7)assert.equal(api.campaign.final.defeated,true);
  attempts.push({counts,minEnergy,energy:api.player.energy,events:JSON.parse(JSON.stringify(api.campaign.events))});
 }
 assert.deepEqual(attempts[0],attempts[1]);assert.deepEqual(attempts[0],attempts[2]);runs.push({level:li+1,...attempts[0],identicalReplays:3});console.log('PASS current N'+(li+1)+' '+attempts[0].counts.frames+' frames, 3 deterministic replays');
}
// Connect the independently recorded N4 reference to all four campaign routes.
const {api,route}=createGame(fs.readFileSync('review/campaign-v3/round4/index.html','utf8')),base=JSON.parse(fs.readFileSync('review/campaign-v3/ruta-base-v3-n4.json'));
api.newGame();api.loadLevel(3);api.startLevel();for(const i of base.inputs){route.input(base.actions[i]);for(let f=0;f<base.framesPerAction&&api.state==='play';f++)route.step();}assert.equal(api.state,'clear');
const transitions=[];
for(let li=4;li<8;li++){
 route.input([0,0,0]);for(let f=0;f<100;f++)route.step();route.press('Space');assert.equal(api.lvl,li);assert.equal(api.state,'intro');for(let f=0;f<35;f++)route.step();route.press('Space');assert.equal(api.state,'play');
 const witness=JSON.parse(fs.readFileSync(`review/campaign-v3/round4/route-n${li+1}.json`));
 // Pause is a real key event and must freeze simulation state and clocks.
 const start=api.simF;route.press('KeyP',false);for(let f=0;f<40;f++)route.step();assert.equal(api.simF,start);assert.equal(api.state,'pause');route.press('KeyP',false);assert.equal(api.state,'play');
 for(const c of witness.commands){route.input(c.a);for(let f=0;f<c.frames&&api.state==='play';f++)route.step();}
 assert.equal(api.state,'clear','continuous N'+(li+1));assert.equal(api.player.lives,3);transitions.push({from:li,to:li+1,complete:true});
}
route.input([0,0,0]);for(let i=0;i<100;i++)route.step();route.press('Space');assert.equal(api.state,'title');
fs.writeFileSync('review/campaign-v3/round4-connected-replays.json',JSON.stringify({sourceHash:hash,scope:'Production loop, actual movement inputs; three deterministic repetitions are not three players. Frame categories are not human decisions.',runs,transitions,finalTitle:true},null,2));

