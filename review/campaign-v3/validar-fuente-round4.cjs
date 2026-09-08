'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const createGame=require('./route-harness-score1.cjs'),read=f=>fs.readFileSync(path.join(__dirname,f),'utf8'),sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const base=read('index-base-31d4610.html'),score1=read('candidate-score1.html'),frozen=read('round4/index.html');
assert.equal(sha(frozen),'8eef8b28ed89122e03c5eb04ebed91d5923fe87b51b6b12dd6f999699e35c65b');
const old=createGame(base).api,one=createGame(score1).api,next=createGame(frozen).api;
assert.deepEqual(JSON.parse(JSON.stringify(old.LEVELS.slice(0,4))),JSON.parse(JSON.stringify(next.LEVELS.slice(0,4))));
assert.deepEqual(JSON.parse(JSON.stringify(one.LEVELS.slice(6))),JSON.parse(JSON.stringify(next.LEVELS.slice(6))));
assert.deepEqual(JSON.parse(JSON.stringify(old.CFG)),JSON.parse(JSON.stringify(next.CFG)));
const mechanics=s=>s.slice(s.indexOf('let campaign=null;'),s.indexOf('function drawCampaign'));
assert.equal(mechanics(score1),mechanics(frozen));
// The complete diff was inspected: only the read-only service hint added to
// partLesson differs in this tail. Preserve all other input/physics text.
const tail=s=>s.slice(s.indexOf('// ---------------- Entrada ----------------')).replace(/^function partLesson\(\).*$/m,'READ_ONLY_PART_LESSON');
assert.equal(tail(score1),tail(frozen));
const record={sourceHash:sha(frozen),registryHash:sha(read('segmentos-preregistrados-round4.json')),levels:[1,2,3,4,5,6,7,8],checks:{originalFirstFourLevelDefinitionsIdentical:true,score1Levels7and8Identical:true,originalPhysicsConfigIdentical:true,campaignMechanicsTextIdentical:true,inputPlayerEnemyBossLoopAndTailExceptReadOnlyPartLessonIdentical:true},manualDiffScope:'Original N1–N4 and score1 N7–N8 definitions match. New N5/N6 boundaries registered independently from round4 maps before reading routes. Physics, campaign mechanics and input/player/enemy/boss loop compared as exact text. Only the read-only partLesson line is excluded from the tail comparison after inspecting the complete diff.',scope:'Authorizes this exact source hash for unchanged preregistered boundaries; no new units, thresholds or policy-dependent delimitations.'};
fs.writeFileSync(path.join(__dirname,'compatibilidad-fuente-round4.json'),JSON.stringify(record,null,2)+'\n');console.log(JSON.stringify(record));
