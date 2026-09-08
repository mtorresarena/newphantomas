'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const sha=s=>crypto.createHash('sha256').update(s).digest('hex'),root=path.join(__dirname,'round3'),out=path.join(__dirname,'round3-review-frozen');
fs.mkdirSync(out,{recursive:true});
function retain(name,raw){const p=path.join(out,name);if(fs.existsSync(p))assert.equal(sha(fs.readFileSync(p)),sha(raw),'Frozen reviewer witness cannot be replaced');else fs.writeFileSync(p,raw);}
const source=fs.readFileSync(path.join(root,'index.html'));assert.equal(sha(source),'f2a7d393a540134f0c049dfc589001928bb695ae71b0064c4ea0e9017025e780');retain('index.html',source);
const files=[];for(const level of [5,6])for(const policy of ['balanced','cautious','speed']){const name=`route-n${level}${policy==='balanced'?'':'-'+policy}.json`,raw=fs.readFileSync(path.join(root,name)),w=JSON.parse(raw);assert.equal(w.sourceHash,sha(source));assert.equal(w.protocol,'harmonized-v2');assert.equal(w.budget,20000);if(w.complete!==true)continue;retain(name,raw);files.push({name,level,policy,hash:sha(raw)});}
const manifest={sourceHash:sha(source),protocol:'harmonized-v2',expected:6,frozen:files.length,complete:files.length===6,files};fs.writeFileSync(path.join(out,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');console.log(JSON.stringify(manifest));
