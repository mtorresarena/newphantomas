'use strict';
// Fault injection at actual key/door transitions of the recorded routes.
// This checks inventory and checkpoints, not completion after every possible death.
const fs=require('fs'),path=require('path'),createGame=require('./route-harness');
const results=[],version=process.argv[2]||'v2.3';
for(let level=5;level<=8;level++){
 const w=JSON.parse(fs.readFileSync(path.join(__dirname,'..','review',`route-n${level}-${version}.json`),'utf8'));
 const {api,route}=createGame();api.newGame();api.loadLevel(level-1);api.startLevel();let lastKeys=0;
 for(const ai of w.inputs){route.input(w.actions[ai]);for(let f=0;f<10&&api.state==='play';f++){
  route.step();if(api.player.keys===lastKeys)continue;
  const kind=api.player.keys>lastKeys?'key-collected':'door-opened';lastKeys=api.player.keys;
  const saved=route.save(),keys=api.player.keys,check=JSON.stringify(api.check);
  const doorCount=api.L.map.flat().filter(c=>c==='D').length;
  const keysLeft=api.items.filter(i=>i.t==='k').map(i=>i.x).join(',');
  route.input([0,0]);api.player.energy=0;route.step();for(let n=0;n<91;n++)route.step();
  const ok=api.player.dead===0&&api.player.lives===2&&api.player.keys===keys&&
   JSON.stringify(api.check)===check&&api.L.map.flat().filter(c=>c==='D').length===doorCount&&
   api.items.filter(i=>i.t==='k').map(i=>i.x).join(',')===keysLeft;
  results.push({level,part:saved.zoneName.part,kind,heldKeys:keys,doorTiles:doorCount,ok});
  if(!ok)throw Error(`Inventory changed on death N${level} ${kind}`);
  route.restore(saved);route.input(w.actions[ai]);
 }}
}
if(results.length!==32)throw Error(`Expected 32 key/door transitions, got ${results.length}`);
fs.writeFileSync(path.join(__dirname,'..','review',`respawn-progress-${version}.json`),JSON.stringify(results,null,2)+'\n');
console.log(`PASS: ${results.length} muertes inyectadas tras recoger llaves o abrir puertas; inventario y checkpoint conservados.`);
