'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto'),game=require('./route-harness-score1.cjs'),sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const source=fs.readFileSync(path.join(__dirname,'connected-inspection-649512e5fb49.html'),'utf8'),sourceHash=sha(source),out=path.join(__dirname,'connected-witnesses-649512e5fb49');fs.mkdirSync(out,{recursive:true});
const snapshots={},replays=[];
for(const level of [6,7]){const name=`route-n${level}.json`,raw=fs.readFileSync(path.join(__dirname,'round10',name)),w=JSON.parse(raw);assert.ok(w.complete);const saved=path.join(out,name);if(fs.existsSync(saved))assert.equal(sha(fs.readFileSync(saved)),sha(raw));else fs.writeFileSync(saved,raw);
 const g=game(source),{api,route}=g;api.newGame();api.loadLevel(level-1);api.startLevel();let frame=0,cursor=0;const events=[];
 for(const c of w.commands){route.input(c.a);for(let f=0;f<c.frames&&api.state==='play';f++){route.step();frame++;for(const e of api.campaign.events.slice(cursor)){if(['receiver','anchor','retrieve'].includes(e.type)||e.id===(level===6?'5-1':'5-2'))events.push({...e,x:api.player.x,y:api.player.y});if(level===7&&e.type==='receiver'&&e.id==='5-2'&&!snapshots.primed)snapshots.primed={frame,x:api.player.x,y:api.player.y};}cursor=api.campaign.events.length;}}
 assert.equal(api.state,'clear');assert.equal(frame,w.frames);assert.equal(api.player.lives,3);replays.push({level,frames:frame,sourceHash,declaredWitnessSourceHash:w.sourceHash,witnessHash:sha(raw),events});console.log(JSON.stringify({level,frames:frame,complete:true,specialEvents:events.filter(e=>['receiver','anchor','retrieve'].includes(e.type))}));
}
// Legal branch: retain the natural prefix through R, descend at C (outside new
// bridges), then approach E on the ground and operate it during a short jump.
const w=JSON.parse(fs.readFileSync(path.join(out,'route-n7.json'))),{api,route}=game(source);api.newGame();api.loadLevel(6);api.startLevel();let frame=0;const commands=[];
function input(a){const last=commands.at(-1);if(last&&JSON.stringify(last.a)===JSON.stringify(a))last.frames++;else commands.push({a:a.slice(),frames:1});route.input(a);route.step();frame++;}
outer:for(const c of w.commands)for(let f=0;f<c.frames;f++){if(frame===snapshots.primed.frame)break outer;input(c.a);}
const t=api.campaign.trials.find(t=>t.dualLight),C=t.nodes.find(n=>n.id==='C'),E=t.nodes.find(n=>n.id==='E'),branchStart=frame,trace=[],contacts=[];assert.ok(t.primed);assert.equal(t.solved,false);
function advance(a){input(a);const p=api.player;const bridges=t.bridges.filter(b=>p.onGround&&Math.abs(p.y+p.h-b.row*16)<.7&&p.x+p.w>t.x0+b.col*16&&p.x<t.x0+(b.col+b.width)*16);if(bridges.length)contacts.push({frame,bridges:bridges.map(b=>({col:b.col,row:b.row})),x:p.x,y:p.y});trace.push({frame,a,x:p.x,y:p.y,ground:p.onGround,angle:E.angle,primed:t.primed,solved:t.solved});assert.equal(api.player.dead,0);}
// First get onto ground while staying near the existing C/D platforms, whose
// columns do not overlap either new bridge.
for(let f=0;f<500&&!(api.player.onGround&&api.player.y>135);f++){const d=C.x-5-api.player.x,dir=Math.abs(d)>3?Math.sign(d):0;advance([dir,+(f%12<6),+(f%12<6)]);}
assert.ok(api.player.onGround&&api.player.y>135,'Ground reached legally');
for(let f=0;f<500&&Math.abs(api.player.x+5-E.x)>2;f++)advance([Math.sign(E.x-5-api.player.x),0,0]);
for(let f=0;f<16;f++)advance([0,0,0]);const groundBeforeJump={frame,x:api.player.x,y:api.player.y,ground:api.player.onGround};assert.ok(groundBeforeJump.ground&&groundBeforeJump.y>135);
for(let f=0;f<9;f++)advance([0,1,0]);advance([0,0,1]);const operated={frame,x:api.player.x,y:api.player.y,angle:E.angle};
for(let f=0;f<65;f++)advance([0,0,0]);const solvedWithoutBridge=t.solved&&contacts.length===0;
for(let f=0;f<1800&&api.state==='play';f++)advance([1,0,0]);
const report={sourceHash,fixture:false,replays,branch:{prefixFrame:branchStart,prefixSourceHash:w.sourceHash,groundBeforeJump,operated,newBridgeContacts:contacts,solvedWithoutBridge,finalState:api.state,finalFrames:frame,lives:api.player.lives,trace},scope:'Full production input routes; only read-only observation. N7 source-declared older controls are actually replayed on pinned source. Branch replays natural prefix, then changes controls only. Bridge contact is foot/top overlap while onGround; no state restoration or direct priming.'};
fs.writeFileSync(path.join(__dirname,'conectados-649512e5fb49.json'),JSON.stringify(report,null,2)+'\n');fs.writeFileSync(path.join(out,'route-n7-ground-prism.json'),JSON.stringify({sourceHash,level:7,complete:api.state==='clear',frames:frame,fixture:false,commands},null,2)+'\n');console.log(JSON.stringify(report.branch));
