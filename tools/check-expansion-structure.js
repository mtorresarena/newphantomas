'use strict';
const assert=require('assert/strict'),{execFileSync}=require('child_process'),createGame=require('./route-harness');
const {api,route}=createGame();
const baseline=createGame(execFileSync('git',['show','749c72a:index.html'],{encoding:'utf8'})).api;
assert.equal(JSON.stringify(api.LEVELS.slice(0,4)),JSON.stringify(baseline.LEVELS.slice(0,4)),'Los cuatro mapas originales deben conservarse');
const allNames=new Set(),allGeometry=new Set();
for(let li=4;li<8;li++){
 const def=api.LEVELS[li],rooms=def.segs.filter(s=>!s.transition);
 assert.equal(rooms.length,5);assert.equal(def.segs.filter(s=>s.transition).length,4);
 assert.ok(new Set(rooms.map(s=>s.t)).size>=4,'Al menos cuatro ambientes por nivel');
 rooms.forEach((s,n)=>{
  assert.equal(s.part,n+1);assert.equal(s.parts,5);assert.ok(s.rows.every(r=>r.length===s.rows[0].length));
  assert.ok(!allNames.has(s.label));allNames.add(s.label);
  const geometry=s.rows.map(r=>r.replace(/[^#~=_!\-]/g,'.')).join('\n');assert.ok(!allGeometry.has(geometry),'Geometría repetida');allGeometry.add(geometry);
  const cells=s.rows.join('');assert.equal((cells.match(/k/g)||[]).length,n<4?1:0);assert.equal((cells.match(/S/g)||[]).length,n===4?1:0);
  assert.equal(s.rows[9][3],n?'C':'P');assert.equal(s.rows[9][7],'E');
  api.newGame();api.loadLevel(li);api.startLevel();const z=api.L.zones.filter(z=>!z.transition)[n];
  api.check.x=z.x0+3*16+4;api.check.y=142;api.player.dead=1;route.input([0,0]);route.step();
  for(let f=0;f<180;f++)route.step();
  assert.equal(api.player.dead,0);assert.ok(api.player.energy>95,`N${li+1} P${n+1}: daño al reaparecer quieto`);
 });
 console.log(`PASS N${li+1}: cinco partes distintas, cuatro llaves/puertas ordenadas, cinco entradas seguras tras respawn real.`);
}
console.log('PASS: 20 nombres y geometrías únicos; N1–N4 idénticos al commit 749c72a.');
