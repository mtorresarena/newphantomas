'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto'),game=require('./route-harness-score1.cjs');
const root=path.join(__dirname,'round3-review-frozen'),source=fs.readFileSync(path.join(root,'index.html'),'utf8');
const specs=[{id:'N5-P4',level:5,x0:6992,keyX:7188,door:463},{id:'N6-P2',level:6,x0:2944,keyX:3172,door:217},{id:'N6-P4',level:6,x0:7584,keyX:7844,door:511}];
const policies={right:f=>[1,0,0],rightJumpHeld:f=>[1,1,0],rightJumpPulsed:f=>[1,f%24<12?1:0,0],downRepeated:f=>[0,0,f%2===0?1:0]};
const results=[];
function fresh(level){const g=game(source);g.api.newGame();g.api.loadLevel(level-1);g.api.startLevel();return g;}
function chunks(w){return w.commands||w.inputs.map(i=>({a:w.actions[i],frames:w.framesPerAction}));}
for(const spec of specs){
 const raw=fs.readFileSync(path.join(root,`route-n${spec.level}.json`),'utf8'),w=JSON.parse(raw),commands=chunks(w),baseline=fresh(spec.level);let frame=0,prefix=null,collect=null,opened=null,minY=999,maxY=0,moverFrames=0;const supports=new Set();
 for(const c of commands){baseline.route.input(c.a);for(let f=0;f<c.frames&&baseline.api.state==='play';f++){
  const p=baseline.api.player;if(prefix===null&&p.x>=spec.x0&&p.onGround&&baseline.api.items.some(i=>i.t==='k'&&i.x===spec.keyX))prefix={frame,player:{x:p.x,y:p.y,energy:p.energy,keys:p.keys},input:c.a};
  baseline.route.step();frame++;
  if(prefix&&!opened){minY=Math.min(minY,p.y);maxY=Math.max(maxY,p.y);if(p.mover){moverFrames++;supports.add(JSON.stringify({sx:p.mover.sx,sy:p.mover.sy,rx:p.mover.rx,ry:p.mover.ry}));}}
  if(prefix&&!collect&&!baseline.api.items.some(i=>i.t==='k'&&i.x===spec.keyX))collect={frame,x:p.x,y:p.y,keys:p.keys};
  if(prefix&&!opened&&!baseline.api.L.map.some(r=>r[spec.door]==='D'))opened={frame,x:p.x,y:p.y,keys:p.keys};
 }}
 assert.ok(prefix&&collect&&opened);assert.equal(baseline.api.state,'clear');
 const branches=[];
 for(const [policy,control] of Object.entries(policies)){
  const g=fresh(spec.level);let f=0;outer:for(const c of commands){g.route.input(c.a);for(let j=0;j<c.frames;j++){if(f===prefix.frame)break outer;g.route.step();f++;}}
  assert.equal(g.api.player.x,prefix.player.x,'Prefix replay must match naturally');const startHurt=g.api.player.hurtT;let previousHurt=startHurt,hits=0,steps=0,gotKey=false,doorOpen=false,maxX=g.api.player.x,lowY=g.api.player.y;
  for(;steps<900&&g.api.state==='play'&&!g.api.player.dead;steps++){g.route.input(control(steps));g.route.step();const p=g.api.player;if(p.hurtT>previousHurt)hits++;previousHurt=p.hurtT;gotKey ||= !g.api.items.some(i=>i.t==='k'&&i.x===spec.keyX);doorOpen ||= !g.api.L.map.some(r=>r[spec.door]==='D');maxX=Math.max(maxX,p.x);lowY=Math.min(lowY,p.y);if(doorOpen&&p.x>(spec.door+1)*16){steps++;break;}}
  branches.push({policy,steps,gotKey,doorOpen,passedDoor:g.api.player.x>(spec.door+1)*16,dead:!!g.api.player.dead,hits,maxX,minimumY:lowY,energy:g.api.player.energy,end:{x:g.api.player.x,y:g.api.player.y}});
 }
 results.push({...spec,witnessHash:crypto.createHash('sha256').update(raw).digest('hex'),prefix,baseline:{collect,opened,frames:frame,minY,maxY,moverFrames,supports:[...supports].map(JSON.parse)},branches});
 console.log(JSON.stringify({id:spec.id,prefix:prefix.frame,collect:collect.frame,opened:opened.frame,moverFrames,branches}));
}
fs.writeFileSync(path.join(__dirname,'excursiones-round3-probes.json'),JSON.stringify({sourceHash:crypto.createHash('sha256').update(source).digest('hex'),fixture:false,scope:'Every branch replays original legal controls from the origin to a naturally grounded prefix; then 900 frames of simple controls. No state injection. Failure is not proof against every possible shortcut.',results},null,2)+'\n');
