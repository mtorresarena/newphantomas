'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const createGame=require('./route-harness-score1.cjs');
const source=fs.readFileSync(path.join(__dirname,'candidate-score1.html'),'utf8');
const chosen=new Map(),prefixes=new Map();
function advanced(t){return t.kind==='charge'?t.nodes.length>1:t.kind==='sequence'?t.order.length>3:t.kind==='timed'?t.order.length>2:t.kind==='mirror'?t.nodes.filter(n=>n.role==='mirror').length>2:t.nodes.some(n=>n.role==='socket'&&n.row===3);}
for(let level=5;level<=8;level++){
 const {api,route}=createGame(source);api.newGame();api.loadLevel(level-1);api.startLevel();
 for(const t of api.campaign.trials){const key=t.kind+'-'+(advanced(t)?'advanced':'intro');if(!chosen.has(key))chosen.set(key,{key,level,id:t.id,kind:t.kind,advanced:advanced(t),nodes:t.nodes.map(n=>({id:n.id,role:n.role,col:n.col,row:n.row})),order:t.order,duration:t.duration});}
 const targets=[...chosen.values()].filter(t=>t.level===level),w=JSON.parse(fs.readFileSync(path.join(__dirname,`score1-route-n${level}.json`),'utf8'));let frame=0;
 for(const c of w.commands){route.input(c.a);for(let f=0;f<c.frames&&api.state==='play';f++){
  for(const spec of targets){if(prefixes.has(spec.key))continue;const t=api.campaign.trials.find(t=>t.id===spec.id),p=api.player;
   const eligible=t.kind==='charge'?api.ents.some(e=>e.puzzleGuard&&e.sx>=t.x0+(t.gate-28)*16&&e.sx<t.gateX&&e.state==='idle'&&Math.abs(p.x+5-e.x-e.w/2)<145&&Math.abs(p.y+9-e.y-e.h/2)<28):t.nodes.some(n=>!['source','receiver','plate'].includes(n.role)&&Math.hypot(p.x+5-n.x,p.y+9-n.y)<25);
   if(!t.solved&&eligible)prefixes.set(spec.key,{frames:frame,x:p.x,y:p.y,energy:p.energy,progress:t.progress,carry:api.campaign.carry,remainingDeadline:t.until?t.until-api.simF:null});
  }route.step();frame++;
 }}
}
const policies={right:f=>[1,0,0],right_jump_held:f=>[1,1,0],right_jump_pulsed:f=>[1,+(f%12<10),0],down_repeated:f=>[0,0,+(f%2===0)],wait:f=>[0,0,0]};
const runs=[];
for(const spec of chosen.values()){
 const prefix=prefixes.get(spec.key);assert.ok(prefix,spec.key+' has reachable entry');const w=JSON.parse(fs.readFileSync(path.join(__dirname,`score1-route-n${spec.level}.json`),'utf8'));
 for(const [policy,fn] of Object.entries(policies)){
  const {api,route}=createGame(source);api.newGame();api.loadLevel(spec.level-1);api.startLevel();let cursor=0;
  outer:for(const c of w.commands){route.input(c.a);for(let f=0;f<c.frames;f++){if(cursor===prefix.frames)break outer;route.step();cursor++;}}
  const t=api.campaign.trials.find(t=>t.id===spec.id);assert.equal(t.solved,false);assert.equal(cursor,prefix.frames);const startEvents=api.campaign.events.length,startEnergy=api.player.energy;let hits=0,lastHurt=api.player.hurtT,frames=0,jumps=0;
  for(;frames<900&&!api.player.dead&&!t.solved;frames++){const vy=api.player.vy;route.input(fn(frames));route.step();if(api.player.hurtT>lastHurt)hits++;lastHurt=api.player.hurtT;if(api.player.vy<-3&&vy>=0)jumps++;}
  runs.push({...spec,prefix,policy,frames,solved:t.solved,progress:t.progress,activeNodes:t.nodes.filter(n=>n.active).map(n=>n.id),carry:api.campaign.carry,hits,jumps,dead:!!api.player.dead,lives:api.player.lives,energy:api.player.energy,startEnergy,x:api.player.x,y:api.player.y,events:api.campaign.events.slice(startEvents)});
 }
}
const output={sourceHash:crypto.createHash('sha256').update(source).digest('hex'),scope:'Each branch replays original legal score1 inputs from the natural level start to a preregistered first approach/interaction radius, then uses actual input only for up to900frames. No snapshot restore, teleport, healing or enemy removal. Partial challenge probes, not full-level completions.',selection:'First intro and first advanced instance of each of five families. Charge entry precedes the first warning; other entries are the first node-use proximity in the recorded route, not a solved setup.',policies:'right; right+held jump (one rising edge); right+jump pulsed10/12frames; stationary Down edges every2frames; stationary wait.',runs};
fs.writeFileSync(path.join(__dirname,'politicas-simples.json'),JSON.stringify(output,null,2)+'\n');console.log(JSON.stringify(runs.map(r=>({key:r.key,policy:r.policy,solved:r.solved,progress:r.progress,hits:r.hits,dead:r.dead,jumps:r.jumps})),null,2));
