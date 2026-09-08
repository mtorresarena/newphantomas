'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.join(__dirname,'round4-classification'),frozen=path.join(__dirname,'round4'),manifest=JSON.parse(fs.readFileSync(path.join(frozen,'manifest.json'),'utf8'));assert.equal(manifest.complete,true);assert.equal(manifest.files.length,24);
const median=arr=>{const a=arr.slice().sort((x,y)=>x-y);return (a[1]+a[2])/2;},rows=[];
for(const entry of manifest.files){const r=JSON.parse(fs.readFileSync(path.join(root,`n${entry.level}-${entry.policy}.json`),'utf8')),v=r.result;
 const w=JSON.parse(fs.readFileSync(path.join(frozen,entry.name),'utf8')),chunks=w.commands||w.inputs.map(i=>({a:w.actions[i],frames:w.framesPerAction})),coalesced=[];
 for(const c of chunks){const p=coalesced.at(-1);if(p&&JSON.stringify(p.a)===JSON.stringify(c.a))p.frames+=c.frames;else coalesced.push({a:c.a,frames:c.frames});}
 const unresolved=[...new Set([...v.uncertainEpisodes,...v.uncompletedCandidates])];
 rows.push({level:entry.level,policy:entry.policy,frames:v.frames,seconds:v.frames/60,vector:v.vector,lower:v.totalLowerBound,upper:v.totalLowerBound+unresolved.length,unresolved,minEnergy:v.minEnergy,hits:v.hits,contexts:v.contextFrames,controlsHash:crypto.createHash('sha256').update(JSON.stringify(coalesced)).digest('hex')});
}
const policies=[];
for(const policy of ['balanced','cautious','speed']){const reference=rows.filter(r=>r.policy===policy&&r.level<=4),lower=median(reference.map(r=>r.lower)),upper=median(reference.map(r=>r.upper));
 policies.push({policy,referenceMedian:{lower,upper},comparisons:rows.filter(r=>r.policy===policy&&r.level>=5).map(r=>{const threshold=r.level===8?1:.8;return {level:r.level,lower:r.lower,upper:r.upper,required:{lower:lower*threshold,upper:upper*threshold},ratio:{lower:r.lower/upper,upper:r.upper/lower},status:r.lower>=upper*threshold?'meets':r.upper<lower*threshold?'fails':'not-demonstrated'};})});
}
const uniqueness=Array.from({length:8},(_,i)=>({level:i+1,distinctControlTraces:new Set(rows.filter(r=>r.level===i+1).map(r=>r.controlsHash)).size}));
const report={sourceHash:manifest.sourceHash,scope:'All24 frozen harmonized-v2 policies. Conservative interval comparison; no grade or human-duration inference. A failed single policy is distinguished from failing every comparable policy.',rows,policies,uniqueness};
fs.writeFileSync(path.join(__dirname,'comparacion-round4-final.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({policies,uniqueness,riskN4speed:rows.find(r=>r.level===4&&r.policy==='speed')},null,2));
