'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const createGame=require('./route-harness-score1.cjs'),source=fs.readFileSync(path.join(__dirname,'candidate-score1.html'),'utf8');
const filename='route-n5-cautious-retry-weight.json',content=fs.readFileSync(path.join(__dirname,filename),'utf8'),w=JSON.parse(content);assert.equal(w.complete,true);assert.equal(w.level,5);
fs.writeFileSync(path.join(__dirname,'verified-'+filename),content);
const {api,route}=createGame(source);api.newGame();api.loadLevel(4);api.startLevel();let frame=0,lastDead=false,lastCarry=null;const events=[];
for(const c of w.commands){assert.ok([-1,0,1].includes(c.a[0]));assert.ok([0,1].includes(+c.a[1])&&[0,1].includes(+c.a[2]));route.input(c.a);
 for(let f=0;f<c.frames&&api.state==='play';f++){route.step();frame++;const p=api.player,carry=api.campaign.carry;
  if(carry!==lastCarry)events.push({frame,type:'carry-change',from:lastCarry,to:carry,x:p.x,y:p.y});
  if(p.dead&&!lastDead)events.push({frame,type:'death',carry,lives:p.lives,x:p.x,y:p.y,weightStates:api.campaign.trials.filter(t=>t.kind==='weight').map(t=>({id:t.id,solved:t.solved,activeNodes:t.nodes.filter(n=>n.active).map(n=>n.id)}))});
  if(!p.dead&&lastDead)events.push({frame,type:'respawn',carry,lives:p.lives,x:p.x,y:p.y});lastDead=!!p.dead;lastCarry=carry;
 }
}
assert.equal(api.state,'clear');assert.equal(api.player.lives,2);assert.equal(frame,w.frames);assert.equal(api.campaign.trials.filter(t=>t.solved).length,10);
const death=events.find(e=>e.type==='death'),respawn=events.find(e=>e.type==='respawn');assert.equal(events.filter(e=>e.type==='death').length,1);assert.ok(death.carry,'Weight still carried on death');assert.ok(respawn);assert.equal(respawn.carry,null);assert.equal(api.campaign.trials.find(t=>t.id===death.carry).solved,true);
const report={sourceHash:crypto.createHash('sha256').update(source).digest('hex'),witness:filename,witnessHash:crypto.createHash('sha256').update(content).digest('hex'),scope:'Legal input replay from natural N5 start. No state mutation, snapshots, previews, healing or direct die/reset calls. Confirms carry exists at death, clears on respawn and that same weight puzzle is solved afterwards.',complete:true,frames:frame,seconds:frame/60,lives:api.player.lives,events,campaignEvents:api.campaign.events};
fs.writeFileSync(path.join(__dirname,'reintento-contrapeso-verificado.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({frames:frame,death,respawn,complete:true},null,2));
