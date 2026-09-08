'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict'),game=require('./route-harness-score1.cjs');
const read=n=>fs.readFileSync(path.join(__dirname,n),'utf8'),source=read('round7/index.html'),sha=s=>crypto.createHash('sha256').update(s).digest('hex');assert.equal(sha(source),'383fc2c0837ffdf01deff83fbcf4e3d02dbf512d1de94c39d147679757c42607');const results=[];
for(let level=5;level<=8;level++){
 const semantic=JSON.parse(read(`semantic-windows-v2-round6/n${level}-balanced.json`)),w=JSON.parse(read(`round6-review-frozen/route-n${level}.json`));
 const spans=semantic.runs.filter(r=>r.category==='simple_transit').sort((a,b)=>(b.endFrame-b.startFrame)-(a.endFrame-a.startFrame)).slice(0,2).map(r=>({...r,frames:r.endFrame-r.startFrame+1,seconds:(r.endFrame-r.startFrame+1)/60,samples:[]}));
 const {api,route}=game(source);api.newGame();api.loadLevel(level-1);api.startLevel();let frame=0;
 function sample(span,edge){const p=api.player,s=route.save(),z=api.L.zones.find(z=>p.x+5>=z.x0&&p.x+5<z.x1);span.samples.push({edge,frame,x:p.x,y:p.y,zone:z?structuredClone(z):null,keys:p.keys,bags:api.stats.bags,charging:!!p.charging,carry:api.campaign.carry,checkpoint:s.check,cam:s.cam,energy:p.energy,solved:api.campaign.trials.filter(t=>t.solved).map(t=>t.id),campaignEvents:api.campaign.events.length});}
 for(const c of w.commands){route.input(c.a);for(let f=0;f<c.frames&&api.state==='play';f++){for(const span of spans)if(frame===span.startFrame-1)sample(span,'before');route.step();frame++;for(const span of spans)if(frame===span.endFrame)sample(span,'after');}}
 assert.equal(api.state,'clear');assert.equal(frame,w.frames);for(const span of spans){assert.equal(span.samples.length,2);const lo=span.samples[0].x,hi=span.samples[1].x;span.levelName=api.LEVELS[level-1].name;span.distance=hi-lo;}
 results.push({level,spans});console.log(JSON.stringify({level,spans:spans.map(s=>({start:s.startFrame,end:s.endFrame,seconds:s.seconds,distance:s.distance,samples:s.samples}))}));
}
fs.writeFileSync(path.join(__dirname,'transito-largo-fuente7.json'),JSON.stringify({sourceHash:sha(source),scope:'Post-review diagnostic of two longest already-labelled simple-transit intervals in each balanced route. Selection by duration, not a new A–E criterion. Legal full replay and read-only edge states. Does not prove that all rest/safety/camera pacing is dispensable.',results},null,2)+'\n');
