'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto'),game=require('./route-harness-score1.cjs'),sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const source=fs.readFileSync(path.join(__dirname,'round6/index.html'),'utf8');assert.equal(sha(source),'5963bcc02f71090a958df9737eca2b8fd5a96ed0a615f4a9dcbe4be4dc04ef21');
const targets=['3-1','4-2','5-1','5-2'].map(id=>({level:6,id,kind:'timed'}));
const frozen=path.join(__dirname,'round6-review-prefixes');fs.mkdirSync(frozen,{recursive:true});const witnesses=new Map(),prefixes=new Map();
function fresh(level){const g=game(source);g.api.newGame();g.api.loadLevel(level-1);g.api.startLevel();return g;}
for(const level of [6]){const raw=fs.readFileSync(path.join(__dirname,'round6',`route-n${level}.json`)),w=JSON.parse(raw);assert.equal(w.complete,true);assert.equal(w.sourceHash,sha(source));const saved=path.join(frozen,`route-n${level}.json`);if(fs.existsSync(saved))assert.equal(sha(fs.readFileSync(saved)),sha(raw));else fs.writeFileSync(saved,raw);witnesses.set(level,{...w,hash:sha(raw)});
 const {api,route}=fresh(level);let frame=0;
 for(const c of w.commands){route.input(c.a);for(let f=0;f<c.frames&&api.state==='play';f++){
  for(const spec of targets.filter(t=>t.level===level)){const key=`N${level}/${spec.id}`;if(prefixes.has(key))continue;const t=api.campaign.trials.find(t=>t.id===spec.id),p=api.player;
   const eligible=t.kind==='charge'?api.ents.some(e=>e.puzzleGuard&&e.sx>=t.x0+(t.gate-28)*16&&e.sx<t.gateX&&e.state==='idle'&&Math.abs(p.x+5-e.x-e.w/2)<145&&Math.abs(p.y+9-e.y-e.h/2)<28):t.nodes.some(n=>!['source','receiver','plate'].includes(n.role)&&Math.hypot(p.x+5-n.x,p.y+9-n.y)<25);
   if(!t.solved&&eligible)prefixes.set(key,{frame,x:p.x,y:p.y,energy:p.energy,progress:t.progress,activeNodes:t.nodes.filter(n=>n.active).map(n=>n.id),angles:t.nodes.filter(n=>n.role==='mirror').map(n=>[n.id,n.angle]),carry:api.campaign.carry});
  }route.step();frame++;
 }}assert.equal(api.state,'clear');assert.equal(frame,w.frames);
}
const policies={right:f=>[1,0,0],jumpHeld:f=>[1,1,0],jumpPulsed:f=>[1,+(f%12<10),0],downRepeated:f=>[0,0,+(f%2===0)],wait:f=>[0,0,0]},runs=[];
for(const spec of targets){const key=`N${spec.level}/${spec.id}`,prefix=prefixes.get(key);assert.ok(prefix,key+' legal approach exists');const w=witnesses.get(spec.level);
 for(const [policy,input]of Object.entries(policies)){const {api,route}=fresh(spec.level);let frame=0;outer:for(const c of w.commands){route.input(c.a);for(let f=0;f<c.frames;f++){if(frame===prefix.frame)break outer;route.step();frame++;}}assert.equal(api.player.x,prefix.x);const t=api.campaign.trials.find(t=>t.id===spec.id),startEvents=api.campaign.events.length;let steps=0,hits=0,lastHurt=api.player.hurtT;
  for(;steps<900&&!api.player.dead&&!t.solved;steps++){route.input(input(steps));route.step();if(api.player.hurtT>lastHurt)hits++;lastHurt=api.player.hurtT;}
  runs.push({...spec,prefix,policy,steps,solved:t.solved,progress:t.progress,activeNodes:t.nodes.filter(n=>n.active).map(n=>n.id),dead:!!api.player.dead,hits,energy:api.player.energy,witnessHash:w.hash,events:api.campaign.events.slice(startEvents)});
 }
 console.log(JSON.stringify({target:key,kind:spec.kind,prefixFrame:prefix.frame,initialProgress:prefix.progress,initialActive:prefix.activeNodes,results:runs.filter(r=>r.level===spec.level&&r.id===spec.id).map(r=>({policy:r.policy,solved:r.solved,progress:r.progress,hits:r.hits,dead:r.dead}))}));
}
fs.writeFileSync(path.join(__dirname,'variantes-legales-n6-round6.json'),JSON.stringify({sourceHash:sha(source),fixture:false,scope:'20 branches over four changed N6 timed variants. Every branch replays legal controls from the natural start to the recorded first approach/use proximity, then changes input only for up to900frames. No teleport, restore, direct death, healing or enemy deletion. All prefixes reached by complete N6 balanced route; local policies do not establish global optimality.',runs},null,2)+'\n');
