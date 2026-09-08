const fs=require('fs'),path=require('path'),crypto=require('crypto'),create=require('./route-harness-round4-hints.cjs');
const dir=path.join(__dirname,'round5'),src=fs.readFileSync(path.join(dir,'index.html'),'utf8');
const result={sourceHash:crypto.createHash('sha256').update(src).digest('hex'),replays:[],mirrorUnitTests:[]};
for(let li=4;li<8;li++){
 const {api,route}=create(src);api.newGame();api.loadLevel(li);api.startLevel();
 const w=JSON.parse(fs.readFileSync(path.join(dir,'route-n'+(li+1)+'.json')));
 if(!w.complete){result.replays.push({level:li+1,witnessComplete:false,replayed:false,reason:'Incomplete witness is not a failure of the game or proof of completion'});continue;}
 let frames=0,hits=0,deaths=0,eventIndex=0;const charges=[];
 for(const c of w.commands){route.input(c.a);for(let j=0;j<c.frames&&api.state==='play';j++){
  const hurt=api.player.hurtT,dead=api.player.dead;route.step();frames++;
  if(api.player.hurtT>hurt)hits++;if(!dead&&api.player.dead)deaths++;
  while(eventIndex<api.campaign.events.length){const e=api.campaign.events[eventIndex++];if(e.type==='charge-seal')charges.push({...e,playerX:api.player.x,guards:api.ents.filter(x=>x.t==='K'&&x.state==='charge').map(x=>({x:x.x,dir:x.dir}))});}
 }}
 const row={level:li+1,witnessComplete:true,replayed:true,complete:api.state==='clear',frames,hits,deaths,solved:api.campaign.trials.filter(t=>t.solved).length,events:api.campaign.events,charges};result.replays.push(row);console.log(JSON.stringify({...row,events:undefined,charges:undefined}));
}
for(let li=6;li<8;li++){
 const {api}=create(src);api.newGame();api.loadLevel(li);api.startLevel();
 for(const t of api.campaign.trials.filter(t=>t.kind==='mirror')){
  const mirrors=t.nodes.filter(n=>n.role==='mirror'),initial=mirrors.map(n=>n.angle),solutions=[];
  // Fabricated configurations, exhaustive unit test of optical topology only. Not a legal completion route.
  for(let mask=0;mask<(1<<mirrors.length);mask++){mirrors.forEach((n,j)=>n.angle=(mask>>j)&1);if(api.mirrorTrace(t))solutions.push(mirrors.map(n=>n.angle));}
  mirrors.forEach((n,j)=>n.angle=1-initial[j]);result.mirrorUnitTests.push({level:li+1,id:t.id,initial,solutions,toggleAllSolves:api.mirrorTrace(t)});
 }
}
fs.writeFileSync(path.join(__dirname,'contraste-diseno-round5-evidencia.json'),JSON.stringify(result,null,2));
