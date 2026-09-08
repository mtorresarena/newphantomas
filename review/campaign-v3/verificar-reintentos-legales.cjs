'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const createGame=require('./route-harness-score1.cjs');
const source=fs.readFileSync(path.join(__dirname,'candidate-score1.html'),'utf8');
const files=['route-n8-retry.json','route-n8-retry-phase2.json','route-n8-retry-phase3.json'],runs=[];
for(const filename of files){
 const content=fs.readFileSync(path.join(__dirname,filename),'utf8'),w=JSON.parse(content);assert.equal(w.complete,true);assert.equal(w.level,8);
 fs.writeFileSync(path.join(__dirname,'verified-'+filename),content);
 const {api,route}=createGame(source);api.newGame();api.loadLevel(7);api.startLevel();
 let frame=0,lastDead=false,lastHp=6,lastActive=false;const events=[];
 for(const c of w.commands){assert.ok([-1,0,1].includes(c.a[0]));assert.ok([0,1].includes(+c.a[1])&&[0,1].includes(+c.a[2]));assert.ok(Number.isInteger(c.frames)&&c.frames>0);route.input(c.a);
  for(let f=0;f<c.frames&&api.state==='play';f++){
   const before={phase:api.campaign.final.phase,state:api.campaign.final.state,hp:api.campaign.final.hp,x:api.player.x,y:api.player.y};route.step();frame++;
   const p=api.player,b=api.campaign.final;
   if(p.dead&&!lastDead)events.push({frame,type:'death',phase:before.phase,bossState:before.state,hp:before.hp,x:p.x,y:p.y});
   if(!p.dead&&lastDead)events.push({frame,type:'respawn',bossHp:b.hp,bossPhase:b.phase,bossState:b.state,x:p.x,y:p.y,lives:p.lives});
   if(b.active&&!lastActive)events.push({frame,type:'boss-entry',phase:b.phase,hp:b.hp});
   if(b.hp<lastHp)events.push({frame,type:'boss-progress',phase:b.phase,hp:b.hp});
   lastHp=b.hp;lastActive=b.active;lastDead=!!p.dead;
  }
 }
 assert.equal(api.state,'clear');assert.equal(api.campaign.final.defeated,true);assert.equal(api.campaign.trials.filter(t=>t.solved).length,10);assert.equal(api.player.lives,2);assert.equal(frame,w.frames);
 assert.equal(events.filter(e=>e.type==='death').length,1);const respawn=events.find(e=>e.type==='respawn');assert.ok(respawn);assert.equal(respawn.bossHp,6);assert.equal(respawn.bossPhase,1);assert.equal(events.filter(e=>e.type==='boss-progress'&&e.frame>respawn.frame).length,6);
 const expected=filename.includes('phase2')?2:filename.includes('phase3')?3:1;assert.equal(events.find(e=>e.type==='death').phase,expected);
 runs.push({witness:filename,witnessHash:crypto.createHash('sha256').update(content).digest('hex'),complete:true,frames:frame,lives:api.player.lives,events});
}
const result={sourceHash:crypto.createHash('sha256').update(source).digest('hex'),scope:'Clean legal input replays from natural N8 start. No snapshot restore, preview, state injection, healing, invulnerability, entity deletion or direct boss methods.',runs};
fs.writeFileSync(path.join(__dirname,'reintentos-legales-verificados.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(runs.map(r=>({witness:r.witness,frames:r.frames,death:r.events.find(e=>e.type==='death'),respawn:r.events.find(e=>e.type==='respawn'),complete:r.complete})),null,2));
