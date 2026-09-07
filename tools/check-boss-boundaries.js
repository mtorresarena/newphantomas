'use strict';
const assert=require('assert/strict'),fs=require('fs'),path=require('path'),create=require('./route-harness');
const baseline=fs.readFileSync(path.join(__dirname,'..','review','baselines','index-v2.2.txt'),'utf8');
function escape(source,side){
 const g=create(source),a=g.api;a.newGame();a.loadLevel(3);a.startLevel();
 a.player.x=a.boss.x0+26;g.route.input([0,0]);g.route.step();
 // Reachable lower side balconies; isolate a jump toward the arena boundary.
 Object.assign(a.player,{x:side<0?a.boss.x0+34:a.boss.x1-44,y:94,vx:0,vy:0,onGround:true,jHeld:false});
 let outside=false;
 for(let f=0;f<160&&!a.player.dead;f++){g.route.input([side,f%60<58]);g.route.step();if(a.player.x<a.boss.x0||a.player.x+a.player.w>a.boss.x1){outside=true;break;}}
 return {side,outside,active:a.boss.active,x:a.player.x,camera:g.route.camera()};
}
const before=[-1,1].map(s=>escape(baseline,s)),after=[-1,1].map(s=>escape(undefined,s));
assert.ok(before.every(r=>r.outside),'El control anterior debe reproducir ambas fugas');
assert.ok(after.every(r=>!r.outside&&r.active),'No se puede salir saltando con el combate activo');
const g=create(),a=g.api;a.newGame();a.loadLevel(3);a.startLevel();a.player.x=a.boss.x0+26;g.route.step();
// Recovery guard for an already-invalid active arena state.
a.player.x=a.boss.x1+60;a.player.y=142;g.route.step();
assert.ok(a.player.x+a.player.w<=a.boss.x1-16,'Recuperar un estado fuera de la arena');
a.player.energy=0;g.route.input([0,0]);for(let f=0;f<92;f++)g.route.step();
assert.equal(a.boss.active,false);assert.equal(a.boss.gateLeft,true);assert.equal(a.boss.gateRight,false);
const entrance=Math.floor(a.boss.x0/16),exit=Math.floor(a.boss.x1/16)-1;
for(let r=1;r<10;r++){assert.equal(a.tileAt(entrance,r),'.');assert.equal(a.tileAt(exit,r),'#');}
a.player.x=a.boss.x0+26;g.route.step();a.boss.hp=0;a.boss.state='defeat';a.boss.timer=1;g.route.step();
assert.equal(a.boss.defeated,true);for(let r=1;r<10;r++)assert.equal(a.tileAt(exit,r),'.');
Object.assign(a.player,{x:a.boss.x1-35,y:142,vx:0,vy:0,onGround:true});
g.route.input([1,0]);for(let f=0;f<70;f++)g.route.step();assert.ok(a.player.x>a.boss.x1,'La salida debe permitir avanzar tras derrotarlo');
const result={before,after,invalidStateRecovered:true,respawnGates:true,defeatedExit:true};
fs.writeFileSync(path.join(__dirname,'..','review','boss-boundaries-v2.3.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));
