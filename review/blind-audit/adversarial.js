'use strict';const fs=require('fs'),create=require('../tools/route-harness');
const result={checkpoints:[],doors:[],jumpSweep:[],tutorials:[]};
function fresh(li){const g=create();g.api.newGame();g.api.loadLevel(li);g.api.startLevel();return g;}
function tick(g,input,n){for(let i=0;i<n;i++){g.route.input(input);g.route.step();}}
function pos(p){return {x:p.x,y:p.y,energy:p.energy,lives:p.lives,keys:p.keys,dead:p.dead};}
for(let li=4;li<8;li++){
 let g=fresh(li);const cps=g.api.items.filter(i=>i.t==='C').map(i=>({...i}));
 for(const cp of cps){g=fresh(li);const a=g.api;Object.assign(a.player,{x:cp.x,y:142,onGround:true,jHeld:false});tick(g,[0,0,0],1);const before={check:{...a.check},player:pos(a.player)};a.player.energy=0;tick(g,[0,0,0],92);const respawn=pos(a.player);tick(g,[0,0,0],180);result.checkpoints.push({level:li+1,cp:cp.x,before,respawn,after180:pos(a.player),state:a.state});}
 for(const z of g.api.L.zones.filter(z=>z.transition)){
  for(const keys of [0,1]){g=fresh(li);const a=g.api,c=z.x0/16+1;Object.assign(a.player,{x:c*16-11,y:142,vx:0,vy:0,onGround:true,keys});tick(g,[1,0,0],20);result.doors.push({level:li+1,c,initialKeys:keys,player:pos(a.player),door:[a.tileAt(c,8),a.tileAt(c,9)]});}
 }
 // Start each non-transition part on its actual safe approach; no invulnerability or removed hazards.
 for(let si=0;si<g.api.L.zones.length;si++){let z=g.api.L.zones[si];if(z.transition)continue;
  for(const period of [0,30,40,50,60]){g=fresh(li);const a=g.api;z=a.L.zones[si];Object.assign(a.player,{x:z.x0+51,y:142,onGround:true,jHeld:false});let maxX=a.player.x,damages=0,prev=a.player.energy,activations=0,states=new Set(),firstDeath=null;for(let f=0;f<1200&&a.state==='play';f++){const jump=period>0&&f%period<period-2;tick(g,[1,jump,0],1);maxX=Math.max(maxX,a.player.x);if(a.player.energy<prev-2)damages++;prev=a.player.energy;for(const e of a.ents.filter(e=>e.zone?.x0===z.x0))states.add(e.t+':'+e.state);if(a.player.dead){firstDeath=f;break;}if(a.player.x>=z.x1-15)break;}
  result.jumpSweep.push({level:li+1,part:z.part,period,maxX,partEnd:z.x1,delta:maxX-z.x0,damageEvents:damages,firstDeath,keys:a.player.keys,states:[...states],player:pos(a.player)});
 }
 }
}
fs.writeFileSync(__dirname+'/adversarial-results.json',JSON.stringify(result,null,2));
console.log(JSON.stringify(result,null,2));
