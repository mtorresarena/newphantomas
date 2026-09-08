'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const createGame=require('./route-harness-base.cjs');
const filename=process.argv[2];if(!filename)throw Error('Indicar ruta-base-nN.json');
const witness=JSON.parse(fs.readFileSync(filename,'utf8'));
const html=process.argv[3]||path.join(__dirname,'index-base-31d4610.html');
const {api,route}=createGame(fs.readFileSync(html,'utf8'));api.newGame();api.loadLevel(witness.level-1);api.startLevel();
let frames=0;
for(const ai of witness.inputs){route.input(witness.actions[ai]);for(let f=0;f<witness.framesPerAction&&api.state==='play';f++){route.step();frames++;assert.equal(api.player.dead,0,'Muerte en el replay');assert.equal(api.player.lives,3,'Pérdida de vida en el replay');}}
assert.equal(api.state==='clear',witness.complete,'El estado final discrepa del testigo guardado');
assert.equal(frames,witness.metrics.frames,'La duración del replay difiere');
console.log(JSON.stringify({level:witness.level,complete:api.state==='clear',frames,seconds:frames/60,x:api.player.x,energy:api.player.energy,scope:witness.complete?'Synthetic complete replay; not human duration':'Valid partial prefix only; does not demonstrate level completion'}));
