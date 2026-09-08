'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto'),game=require('./route-harness-round4-hints.cjs');
const root=path.join(__dirname,'round4'),source=fs.readFileSync(path.join(root,'index.html'),'utf8'),sha=s=>crypto.createHash('sha256').update(s).digest('hex');assert.equal(sha(source),'8eef8b28ed89122e03c5eb04ebed91d5923fe87b51b6b12dd6f999699e35c65b');
const policies={right:f=>[1,0,0],rightJumpHeld:f=>[1,1,0],rightJumpPulsed:f=>[1,f%24<12?1:0,0],downRepeated:f=>[0,0,f%2===0?1:0]},results=[];
function fresh(){const g=game(source);g.api.newGame();g.api.loadLevel(5);g.api.startLevel();return g;}
for(const policy of ['balanced','cautious','speed']){
 const name=`route-n6${policy==='balanced'?'':'-'+policy}.json`,raw=fs.readFileSync(path.join(root,name),'utf8'),w=JSON.parse(raw);assert.equal(w.complete,true);assert.equal(w.sourceHash,sha(source));const commands=w.commands||w.inputs.map(i=>({a:w.actions[i],frames:w.framesPerAction})),g=fresh();let frame=0,collected=null,opened=null,minX=Infinity,maxX=0,previousSign=0,inversions=0;const prefixes={},hintSamples=[];
 for(const c of commands){g.route.input(c.a);for(let f=0;f<c.frames&&g.api.state==='play';f++){
  const p=g.api.player,keyPresent=g.api.items.some(i=>i.t==='k'&&i.x===7572);
  if(!prefixes.entry&&keyPresent&&p.onGround&&p.x>=7408)prefixes.entry={frame,x:p.x,y:p.y,energy:p.energy};
  if(!prefixes.balcony83&&keyPresent&&p.onGround&&Math.abs(p.y-78)<.1&&p.x+p.w>7616&&p.x<7696)prefixes.balcony83={frame,x:p.x,y:p.y,energy:p.energy};
  if(prefixes.entry&&!opened){minX=Math.min(minX,p.x);maxX=Math.max(maxX,p.x);if(c.a[0]&&previousSign&&c.a[0]!==previousSign)inversions++;if(c.a[0])previousSign=c.a[0];if(frame%60===0)hintSamples.push({frame,x:p.x,y:p.y,...g.route.readHints()});}
  g.route.step();frame++;
  if(!collected&&!g.api.items.some(i=>i.t==='k'&&i.x===7572))collected={frame,x:p.x,y:p.y,keys:p.keys};
  if(!opened&&!g.api.L.map.some(r=>r[511]==='D'))opened={frame,x:p.x,y:p.y,keys:p.keys};
 }}assert.equal(g.api.state,'clear');assert.equal(frame,w.frames);assert.ok(collected&&opened);
 const branches=[];
 if(policy==='balanced')for(const [prefixName,prefix]of Object.entries(prefixes))for(const [simple,input]of Object.entries(policies)){
  const b=fresh();let f=0;outer:for(const c of commands){b.route.input(c.a);for(let j=0;j<c.frames;j++){if(f===prefix.frame)break outer;b.route.step();f++;}}assert.equal(b.api.player.x,prefix.x);
  let steps=0,hits=0,lastHurt=b.api.player.hurtT,gotKey=false,doorOpen=false,maxX=b.api.player.x,minY=b.api.player.y;
  for(;steps<900&&b.api.state==='play'&&!b.api.player.dead;steps++){b.route.input(input(steps));b.route.step();const p=b.api.player;if(p.hurtT>lastHurt)hits++;lastHurt=p.hurtT;gotKey ||= !b.api.items.some(i=>i.t==='k'&&i.x===7572);doorOpen ||= !b.api.L.map.some(r=>r[511]==='D');maxX=Math.max(maxX,p.x);minY=Math.min(minY,p.y);if(doorOpen&&p.x>8192){steps++;break;}}
  branches.push({prefixName,prefix,policy:simple,steps,hits,gotKey,doorOpen,passedDoor:b.api.player.x>8192,dead:!!b.api.player.dead,maxX,minY,energy:b.api.player.energy});
 }
 const record={policy,witnessHash:sha(raw),frames:frame,prefixes,collected,opened,minX,maxX,commandDirectionChanges:inversions,hintSamples,branches};results.push(record);console.log(JSON.stringify({...record,hintSamples:hintSamples.slice(0,2)}));
}
fs.writeFileSync(path.join(__dirname,'excursion-round4-probes.json'),JSON.stringify({sourceHash:sha(source),fixture:false,scope:'Legal full witnesses and branches replaying natural controls to the stated grounded prefix. Read-only hint getter. Command inversions are not human decisions.',results},null,2)+'\n');
