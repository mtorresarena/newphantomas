'use strict';
// Inspección del commit fijo; no reproduce una partida ni asigna puntuaciones.
const fs = require('node:fs');
const path = require('node:path');
const {execFileSync} = require('node:child_process');
const createGame = require('../../tools/route-harness');
const commit = '31d461028516344bc0dbb80b7ecd625296509014';
const source = execFileSync('git', ['show', `${commit}:index.html`], {encoding:'utf8'});
const {api} = createGame(source);
const levels = [];
for (let i=0;i<api.LEVELS.length;i++) {
  api.newGame(); api.loadLevel(i);
  const def = api.LEVELS[i];
  const count = key => api.items.filter(it=>it.t===key).length;
  levels.push({
    level:i+1,name:def.name,columns:api.L.cols,spawn:{x:api.player.x,y:api.player.y},
    keys:count('k'),checkpoints:count('C'),chargers:count('E'),goalItems:count('S'),
    doorColumns: new Set(api.L.map.flatMap(row=>row.flatMap((ch,c)=>ch==='D'?[c]:[]))).size,
    boss:!!api.boss,enemies:Object.fromEntries([...new Set(api.ents.map(e=>e.t))].map(t=>[t,api.ents.filter(e=>e.t===t).length])),
    rooms:def.segs.filter(s=>!s.transition).map(s=>({theme:s.t,part:s.part,label:s.label,lesson:s.lesson,columns:s.rows[0].length}))
  });
}
const result={commit,node:process.version,method:'Static definition and loadLevel inventory in DOM/canvas stubs; no route executed, no visual validation.',levels};
fs.writeFileSync(path.join(__dirname,'inventario-base.json'), JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));
