'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {classify}=require('./clasificador-comun-round6.cjs'),createGame=require('./route-harness-score1.cjs'),sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const frozen=path.join(__dirname,'round6-review-frozen'),output=path.join(__dirname,'round6-classification');fs.mkdirSync(output,{recursive:true});
const manifestText=fs.readFileSync(path.join(frozen,'manifest.json'),'utf8'),manifest=JSON.parse(manifestText),sourcePath=path.join(frozen,'index.html'),source=fs.readFileSync(sourcePath,'utf8');assert.equal(sha(source),manifest.sourceHash);
const classifierHash=sha(fs.readFileSync(path.join(__dirname,'clasificador-comun-round6.cjs'))),results=[];
const evaluatedAPI=createGame(source).api;
const reusedSources=['harmonized-v2/index.html'].map(name=>{const text=fs.readFileSync(path.join(__dirname,name),'utf8');return {hash:sha(text),api:createGame(text).api};});
function validateWitnessSource(w){if(w.sourceHash===manifest.sourceHash)return;const previous=reusedSources.find(s=>s.hash===w.sourceHash);assert.ok(previous,'Reused controls must declare a known frozen source');assert.deepEqual(structuredClone(previous.api.LEVELS[w.level-1]),structuredClone(evaluatedAPI.LEVELS[w.level-1]),'Reused input witness must target an unchanged level');assert.deepEqual(structuredClone(previous.api.CFG),structuredClone(evaluatedAPI.CFG));}
function endpoint(w,coalesced){const {api,route}=createGame(source);api.newGame();api.loadLevel(w.level-1);api.startLevel();let frames=0;
 const commands=coalesced||null;
 if(commands){for(const c of commands){route.input(c.a);for(let f=0;f<c.frames&&api.state==='play';f++){route.step();frames++;}}}
 else if(w.inputs){for(const i of w.inputs){route.input(w.actions[i]);for(let f=0;f<w.framesPerAction&&api.state==='play';f++){route.step();frames++;}}}
 else{for(const c of w.commands){route.input(c.a);for(let f=0;f<c.frames&&api.state==='play';f++){route.step();frames++;}}}
 assert.equal(api.state,'clear');return {frames,state:route.save()};}
for(const entry of manifest.files){
 const file=path.join(frozen,entry.name),raw=fs.readFileSync(file,'utf8');assert.equal(sha(raw),entry.hash);const w=JSON.parse(raw);assert.equal(w.protocol,'harmonized-v2');assert.equal(w.policy,entry.policy);assert.equal(w.level,entry.level);assert.equal(w.budget,20000);validateWitnessSource(w);assert.equal(w.complete,true);
 const resultPath=path.join(output,`n${entry.level}-${entry.policy}.json`);
 if(fs.existsSync(resultPath)){const previous=JSON.parse(fs.readFileSync(resultPath));assert.equal(previous.classifierHash,classifierHash,'Changed observer requires a new explicit output version');assert.equal(previous.result.witnessHash,entry.hash);results.push(previous);continue;}
 // Independent normalization check: adjacent identical controls are coalesced,
 // preserving holding behavior while changing the command segmentation.
 const chunks=w.commands||w.inputs.map(i=>({a:w.actions[i],frames:w.framesPerAction})),coalesced=[];
 for(const c of chunks){const p=coalesced.at(-1);if(p&&JSON.stringify(p.a)===JSON.stringify(c.a))p.frames+=c.frames;else coalesced.push({a:c.a.slice(),frames:c.frames});}
 const originalEnd=endpoint(w),normalizedEnd=endpoint(w,coalesced);assert.deepEqual(structuredClone(normalizedEnd),structuredClone(originalEnd),'Coalescing legal held inputs must preserve complete endpoint state across VM realms');
 const result=classify(file,sourcePath);assert.equal(result.frames,originalEnd.frames);assert.equal(result.comparisonEligible,true);
 const record={policy:entry.policy,protocol:w.protocol,budget:w.budget,classifierHash,declaredWitnessSourceHash:w.sourceHash,evaluatedSourceHash:manifest.sourceHash,reusedControls:w.sourceHash!==manifest.sourceHash,normalization:{originalChunks:chunks.length,coalescedChunks:coalesced.length,fullEndpointIdentical:true,frames:originalEnd.frames},result};
 fs.writeFileSync(resultPath,JSON.stringify(record,null,2)+'\n');results.push(record);console.log(JSON.stringify({level:entry.level,policy:entry.policy,frames:result.frames,vector:result.vector,totalLowerBound:result.totalLowerBound,uncertain:result.uncertainEpisodes.length,normalization:true}));
}
const missing=[];for(let level=1;level<=8;level++)for(const policy of ['balanced','cautious','speed'])if(!results.some(r=>r.result.level===level&&r.policy===policy))missing.push({level,policy});
const batch={manifestHash:sha(manifestText),sourceHash:manifest.sourceHash,classifierHash,processed:results.length,expected:24,complete:missing.length===0,missing,results:results.map(r=>{const unresolved=[...new Set([...r.result.uncertainEpisodes,...r.result.uncompletedCandidates])];return {level:r.result.level,policy:r.policy,frames:r.result.frames,vector:r.result.vector,totalLowerBound:r.result.totalLowerBound,totalUpperBound:r.result.totalLowerBound+unresolved.length,unresolved,semanticActiveFrames:r.result.semanticActiveFrames,normalization:r.normalization};}),scope:'Frozen complete witnesses only; this batch does not erase earlier failed searches and does not assign a grade. Context frames are not human activity. Entered-but-uncompleted candidates are unresolved, not silently excluded from upper bounds.'};
const name=`batch-${results.length}-${sha(manifestText).slice(0,12)}-bounds-v1.json`;fs.writeFileSync(path.join(output,name),JSON.stringify(batch,null,2)+'\n');console.log(JSON.stringify({batch:name,processed:results.length,missing:missing.length,complete:batch.complete}));
