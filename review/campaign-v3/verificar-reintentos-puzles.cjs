'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const createGame=require('./route-harness-score1.cjs'),source=fs.readFileSync(path.join(__dirname,'candidate-score1.html'),'utf8');
const specs=[{level:5,kind:'charge'},{level:5,kind:'sequence'},{level:6,kind:'timed'},{level:7,kind:'mirror'}],runs=[];
const partial=t=>!t.solved&&(t.progress>0||t.nodes.some(n=>n.active||n.angle!==n.initialAngle));
const state=t=>({id:t.id,kind:t.kind,solved:t.solved,progress:t.progress,until:t.until,open:t.open,nodes:t.nodes.map(n=>({id:n.id,active:n.active,angle:n.angle,initialAngle:n.initialAngle}))});
for(const spec of specs){
 const filename=`route-n${spec.level}-retry-${spec.kind}.json`,content=fs.readFileSync(path.join(__dirname,filename),'utf8'),w=JSON.parse(content);assert.equal(w.complete,true);assert.equal(w.level,spec.level);
 fs.writeFileSync(path.join(__dirname,'verified-'+filename),content);
 const {api,route}=createGame(source);api.newGame();api.loadLevel(spec.level-1);api.startLevel();let frame=0,lastDead=false;const events=[],partials=new Map();
 for(const c of w.commands){assert.ok([-1,0,1].includes(c.a[0]));assert.ok([0,1].includes(+c.a[1])&&[0,1].includes(+c.a[2]));route.input(c.a);
  for(let f=0;f<c.frames&&api.state==='play';f++){route.step();frame++;const p=api.player;
   for(const t of api.campaign.trials.filter(t=>t.kind===spec.kind&&partial(t)))if(!partials.has(t.id))partials.set(t.id,{frame,...state(t)});
   if(p.dead&&!lastDead)events.push({frame,type:'death',x:p.x,y:p.y,lives:p.lives,carry:api.campaign.carry,trials:api.campaign.trials.filter(t=>t.kind===spec.kind).map(state)});
   if(!p.dead&&lastDead)events.push({frame,type:'respawn',x:p.x,y:p.y,lives:p.lives,carry:api.campaign.carry,trials:api.campaign.trials.filter(t=>t.kind===spec.kind).map(state)});
   lastDead=!!p.dead;
  }
 }
 assert.equal(api.state,'clear');assert.equal(api.player.lives,2);assert.equal(frame,w.frames);assert.equal(api.campaign.trials.filter(t=>t.solved).length,10);assert.equal(events.filter(e=>e.type==='death').length,1);assert.equal(events.filter(e=>e.type==='respawn').length,1);
 const death=events.find(e=>e.type==='death'),beforeDeathPartials=[...partials.values()].filter(t=>t.frame<death.frame);assert.ok(beforeDeathPartials.length,'Expected partial progress before death');
 runs.push({filename,witnessHash:crypto.createHash('sha256').update(content).digest('hex'),level:spec.level,kind:spec.kind,frames:frame,complete:true,lives:2,beforeDeathPartials,events,partialAtDeath:death.trials.filter(partial).map(t=>t.id),campaignEvents:api.campaign.events});
}
const report={sourceHash:crypto.createHash('sha256').update(source).digest('hex'),scope:'Clean legal replays from each natural start; no state mutation, snapshots, previews, healing or direct die/reset calls. Partial before waiting is distinguished from partial still present at death.',runs};
fs.writeFileSync(path.join(__dirname,'reintentos-puzles-verificados.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(runs.map(r=>({kind:r.kind,frames:r.frames,partialAtDeath:r.partialAtDeath,events:r.events.map(e=>({frame:e.frame,type:e.type,x:e.x,y:e.y})),complete:r.complete})),null,2));
