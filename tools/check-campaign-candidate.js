'use strict';
// Reuse frozen control traces without relabelling their recorded source.
const fs=require('fs'),path=require('path'),crypto=require('crypto'),assert=require('assert/strict'),createGame=require('./route-harness');
const evidenceRound=Number(process.argv[2]||6),candidateRound=Number(process.argv[3]||7);
assert(Number.isInteger(evidenceRound)&&evidenceRound>0);assert(Number.isInteger(candidateRound)&&candidateRound>0);
const root='review/campaign-v3',evidence=path.join(root,'round'+evidenceRound),candidate=path.join(root,'round'+candidateRound);
const hash=b=>crypto.createHash('sha256').update(b).digest('hex'),source=fs.readFileSync('index.html','utf8'),previous=fs.readFileSync(path.join(evidence,'index.html'),'utf8');
assert.equal(hash(source),hash(fs.readFileSync(path.join(candidate,'index.html'))),'Candidate must be frozen before testing');
const manifest=JSON.parse(fs.readFileSync(path.join(evidence,'manifest.json')));assert(manifest.complete&&manifest.files.length===24,'All 24 witnesses required');
const results=[];
function replay(html,w){const {api,route}=createGame(html);api.newGame();api.loadLevel(w.level-1);api.startLevel();const commands=w.commands||w.inputs.map(i=>({a:w.actions[i],frames:w.framesPerAction}));for(const c of commands){route.input(c.a);for(let f=0;f<c.frames&&api.state==='play';f++){route.step();assert(!api.player.dead,'Unexpected death');}}assert.equal(api.state,'clear');assert.equal(api.player.lives,3);return JSON.parse(JSON.stringify(route.save()));}
for(const entry of manifest.files){const bytes=fs.readFileSync(path.join(evidence,entry.name));assert.equal(hash(bytes),entry.hash,'Frozen input changed');const w=JSON.parse(bytes);assert(w.complete);const before=replay(previous,w),after=replay(source,w);assert.deepEqual(after,before,'Simulation changed for '+entry.name);results.push({name:entry.name,recordedSourceHash:w.sourceHash,inputHash:entry.hash,level:w.level,policy:w.policy,frames:after.simF,lives:after.player.lives,state:after.state,simulationIdentical:true});console.log('PASS '+entry.name);}
fs.writeFileSync(path.join(candidate,'candidate-replays.json'),JSON.stringify({sourceHash:hash(source),comparedSourceHash:hash(previous),scope:'All 24 frozen legal control traces replayed from natural spawn in both sources; complete simulation snapshots match. No claim of human difficulty or optimality.',complete:true,results},null,2));
