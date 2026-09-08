const fs=require('fs'),path=require('path'),crypto=require('crypto');
const create=require('./route-harness-round4-hints.cjs');
const root=path.join(__dirname,'round4'), source=fs.readFileSync(path.join(root,'index.html'),'utf8');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'manifest.json')));
const output={sourceHash:crypto.createHash('sha256').update(source).digest('hex'),scope:'Independent input replay. No restore, invulnerability or state editing. Input telemetry is not a human decision count.',runs:[],definitions:[]};
for(const file of manifest.files){
 const w=JSON.parse(fs.readFileSync(path.join(root,file.name))),g=create(source),{api,route}=g;
 api.newGame();api.loadLevel(file.level-1);api.startLevel();
 const commands=w.commands||w.inputs.map(i=>({a:w.actions[i],frames:w.framesPerAction}));
 const r={level:file.level,policy:file.policy,frames:0,stationary:0,neutralInput:0,charging:0,moving:0,backwardDistance:0,forwardDistance:0,hits:0,minEnergy:100,deaths:0,interactions:0,bossFrames:0,bossTrace:[],trialTimes:[]};
 let lastBoss='',eventCount=0;
 for(const c of commands){route.input(c.a);for(let f=0;f<c.frames&&api.state==='play';f++){
  const p=api.player,before={x:p.x,y:p.y,hurt:p.hurtT,dead:p.dead,keys:p.keys};
  route.step();r.frames++;r.minEnergy=Math.min(r.minEnergy,p.energy);
  const moved=Math.abs(p.x-before.x)+Math.abs(p.y-before.y)>.01;
  if(moved)r.moving++;else r.stationary++;
  if(c.a.every(x=>!x))r.neutralInput++;
  if(p.charging)r.charging++;
  if(p.x>before.x)r.forwardDistance+=p.x-before.x;else r.backwardDistance+=before.x-p.x;
  if(p.hurtT>before.hurt)r.hits++;
  if(!before.dead&&p.dead)r.deaths++;
  const b=api.campaign?.final||api.boss;
  if(b?.active){r.bossFrames++;const key=b.state+':'+b.hp+':'+(b.phase||'');if(key!==lastBoss){r.bossTrace.push({frame:r.frames,state:b.state,hp:b.hp,phase:b.phase,x:Math.round(p.x-b.x0),y:Math.round(p.y),energy:+p.energy.toFixed(2)});lastBoss=key;}}
  const ev=api.campaign?.events||[];
  while(eventCount<ev.length){const e=ev[eventCount++];if(['activate','rotate','deposit','charge-seal'].includes(e.type))r.interactions++;if(e.type==='solved')r.trialTimes.push(e);}
 }}
 r.complete=api.state==='clear';r.solved=api.campaign?.trials.filter(t=>t.solved).length;
 r.events=api.campaign?.events||[];output.runs.push(r);
 console.log(JSON.stringify({level:r.level,policy:r.policy,frames:r.frames,neutral:r.neutralInput,stationary:r.stationary,charging:r.charging,hits:r.hits,deaths:r.deaths,complete:r.complete,interactions:r.interactions}));
}
for(let li=4;li<8;li++){
 const {api}=create(source);api.newGame();api.loadLevel(li);api.startLevel();
 output.definitions.push({level:li+1,trials:api.campaign.trials.map(t=>({id:t.id,kind:t.kind,nodes:t.nodes.map(n=>({role:n.role,col:n.col-t.nodes[0].col,row:n.row,angle:n.initialAngle})),order:t.order,duration:t.duration}))});
}
fs.writeFileSync(path.join(__dirname,'contraste-diseno-evidencia.json'),JSON.stringify(output,null,2));
