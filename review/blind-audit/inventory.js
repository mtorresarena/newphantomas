'use strict';
const fs=require('fs'),create=require('../tools/route-harness');
const {api:a}=create();let out=[];
for(let li=0;li<8;li++) {a.newGame();a.loadLevel(li);a.startLevel();const L=a.L;out.push({level:li+1,name:L.def.name,intro:L.def.intro,zones:L.zones.map((z,i)=>({...z,lesson:L.def.segs[i].lesson,pressure:L.def.segs[i].pressure,rows:L.def.segs[i].rows})),enemies:a.ents.map(e=>({t:e.t,x:e.x,y:e.y,zone:e.zone})),items:a.items,movers:a.movers,crumbles:a.crumbles});}
fs.writeFileSync(__dirname+'/inventory.json',JSON.stringify(out,null,2));
console.log(out.map(l=>({level:l.level,name:l.name,parts:l.zones.filter(z=>!z.transition).map(z=>({label:z.label||z.t,width:z.x1-z.x0,lesson:z.lesson})),enemies:l.enemies.reduce((s,e)=>(s[e.t]=(s[e.t]||0)+1,s),{}),keys:l.items.filter(i=>i.t==='k').length,checkpoints:l.items.filter(i=>i.t==='C').length,movers:l.movers.length,crumbles:l.crumbles.length})))
for(const l of out.slice(4)){console.log('\nLEVEL '+l.level);for(const z of l.zones.filter(z=>!z.transition)){console.log(z.label+' x='+z.x0+'..'+z.x1);console.log(z.rows.join('\n'));}}
