'use strict';
// Execute the immutable 24-witness set on its exact frozen production source.
// A reused input recording keeps its original source hash; this report records
// the new execution hash without rewriting or relabelling earlier evidence.
const fs=require('fs'),path=require('path'),crypto=require('crypto'),assert=require('assert/strict'),create=require('./route-harness');
const round=Number(process.argv[2]||11),dir=path.join(__dirname,'../review/campaign-v3/round'+round),hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const manifest=JSON.parse(fs.readFileSync(path.join(dir,'manifest.json'))),source=fs.readFileSync(path.join(dir,'index.html'));
assert.equal(hash(source),manifest.sourceHash);assert.equal(hash(fs.readFileSync(path.join(__dirname,'../index.html'))),manifest.sourceHash);assert.equal(manifest.complete,true);
const runs=[];
for(const e of manifest.files){
 const bytes=fs.readFileSync(path.join(dir,e.name));assert.equal(hash(bytes),e.hash);const w=JSON.parse(bytes);assert.equal(w.complete,true);
 const {api,route}=create(source.toString('utf8'));api.newGame();api.loadLevel(e.level-1);api.startLevel();
 const commands=w.commands||w.inputs.map(i=>({a:w.actions[i],frames:w.framesPerAction}));let minEnergy=100;
 for(const c of commands){assert.ok(c.a.length===3&&[-1,0,1].includes(c.a[0])&&[0,1].includes(+c.a[1])&&[0,1].includes(+c.a[2]));assert.ok(Number.isInteger(c.frames)&&c.frames>0);route.input(c.a);for(let f=0;f<c.frames&&api.state==='play';f++){route.step();assert.equal(api.player.dead,0);assert.equal(api.player.lives,3);minEnergy=Math.min(minEnergy,api.player.energy);}}
 assert.equal(api.state,'clear',e.name);if(api.campaign)assert.ok(api.campaign.trials.every(t=>t.solved));if(e.level===4)assert.equal(api.boss.defeated,true);if(e.level===8)assert.equal(api.campaign.final.defeated,true);
 runs.push({level:e.level,policy:e.policy,witnessHash:e.hash,recordedSourceHash:w.sourceHash,executedSourceHash:manifest.sourceHash,frames:api.simF,minEnergy,energy:api.player.energy,lives:api.player.lives,complete:true,events:api.campaign?.events||[]});console.log('PASS N'+e.level+' '+e.policy+' '+api.simF+' frames');
}
assert.equal(runs.length,24);fs.writeFileSync(path.join(dir,'verified-set.json'),JSON.stringify({sourceHash:manifest.sourceHash,scope:'24 real input replays from natural spawn, no game-state injection. Policies are synthetic, not people.',runs},null,2));
