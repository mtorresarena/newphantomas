'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=__dirname,read=n=>fs.readFileSync(path.join(root,n),'utf8'),sha=s=>crypto.createHash('sha256').update(s).digest('hex'),game=require('./route-harness-score1.cjs');
const source=read('round6/index.html'),previous=read('round4/index.html'),base=read('index-base-31d4610.html'),sourceHash=sha(source);
assert.equal(sourceHash,'5963bcc02f71090a958df9737eca2b8fd5a96ed0a615f4a9dcbe4be4dc04ef21');
const api=game(source).api,original=game(base).api;
assert.deepEqual(structuredClone(api.LEVELS.slice(0,4)),structuredClone(original.LEVELS.slice(0,4)));
assert.deepEqual(structuredClone(api.CFG),structuredClone(original.CFG));
const tail=s=>s.slice(s.indexOf('// ---------------- Entrada ----------------')).replace(/^function partLesson\(\).*$/m,'READ_ONLY_PART_LESSON');
assert.equal(tail(source),tail(previous));
const mechanics=s=>s.slice(s.indexOf('let campaign=null;'),s.indexOf('function drawCampaign')).replace(/^   if\(lvl===4&&zoneAt\(f.sx\).part===1&&Math.abs\(f.x-player.x\)<64&&!campaign.prompt\)campaign.prompt='ESCARABAJO: PUEDES PISARLO';\r?\n/m,'');
assert.equal(mechanics(source),mechanics(previous));
fs.writeFileSync(path.join(root,'compatibilidad-fuente-round6.json'),JSON.stringify({sourceHash,registryHash:sha(read('segmentos-preregistrados-round6.json')),levels:[1,2,3,4,5,6,7,8],checks:{originalFirstFourDefinitionsIdentical:true,originalPhysicsConfigIdentical:true,round4InputPlayerEnemyBossTailExceptReadOnlyPartLessonIdentical:true,campaignMechanicsExceptExactReadOnlyBeetlePromptIdentical:true},manualDiffScope:'Complete mechanics diff inspected: one added campaign.prompt assignment in first N5 beetle proximity. Exact line excluded explicitly; no broader function excluded. All N5–N8 boundaries preregistered for source6; only N1–N4 controls may be reused from harmonized-v2. Replays still execute source6.'},null,2)+'\n');
const frozen=path.join(root,'round6-review-frozen');fs.mkdirSync(frozen,{recursive:true});
function immutable(name,raw){const file=path.join(frozen,name);if(fs.existsSync(file))assert.equal(sha(fs.readFileSync(file)),sha(raw),'Frozen entry cannot be replaced: '+name);else fs.writeFileSync(file,raw);}
immutable('index.html',source);
const files=[],originalManifest=JSON.parse(read('harmonized-v2/manifest.json'));
for(const e of originalManifest.files.filter(e=>e.level<=4)){const raw=read('harmonized-v2/'+e.name);assert.equal(sha(raw),e.hash);immutable(e.name,raw);files.push({...e,origin:'harmonized-v2',declaredSourceHash:JSON.parse(raw).sourceHash});}
for(let level=5;level<=8;level++)for(const policy of ['balanced','cautious','speed']){
 const name=`route-n${level}${policy==='balanced'?'':'-'+policy}.json`,p=path.join(root,'round6',name);if(!fs.existsSync(p))continue;
 const raw=fs.readFileSync(p,'utf8'),w=JSON.parse(raw);if(!w.complete)continue;
 assert.equal(w.sourceHash,sourceHash);assert.equal(w.level,level);assert.equal(w.policy,policy);assert.equal(w.protocol,'harmonized-v2');assert.equal(w.budget,20000);immutable(name,raw);files.push({level,policy,name,hash:sha(raw),origin:'round6',declaredSourceHash:w.sourceHash});
}
const manifest={sourceHash,protocol:'harmonized-v2',expected:24,frozen:files.length,complete:files.length===24,files,scope:'Append-only reviewer copies of complete witnesses; partial set is not population evidence. Earlier failed searches remain in author directories and are not erased. N1–N4 reused controls independently checked against source6.'};
fs.writeFileSync(path.join(frozen,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
const classifier=read('clasificador-comun-round6.cjs').replace('compatibilidad-fuente-armonizada.json','compatibilidad-fuente-round6.json');fs.writeFileSync(path.join(root,'clasificador-comun-round6.cjs'),classifier);
let measurement=read('medir-congelados-round4.cjs').replaceAll('clasificador-comun-round4','clasificador-comun-round6').replace("'round4'),output=path.join(__dirname,'round4-classification'","'round6-review-frozen'),output=path.join(__dirname,'round6-classification'").replace("['harmonized-v2/index.html','round3/index.html']","['harmonized-v2/index.html']");
fs.writeFileSync(path.join(root,'medir-congelados-round6.cjs'),measurement);
let semantics=read('clasificar-ventanas-v2.cjs').replace("'round4'),out=path.join(__dirname,'semantic-windows-v2-round4'","'round6-review-frozen'),out=path.join(__dirname,'semantic-windows-v2-round6'").replaceAll('segmentos-preregistrados-round4','segmentos-preregistrados-round6').replaceAll('round4-classification','round6-classification');
fs.writeFileSync(path.join(root,'clasificar-ventanas-v2-round6.cjs'),semantics);
console.log(JSON.stringify({frozen:files.length,complete:manifest.complete,sourceHash}));
