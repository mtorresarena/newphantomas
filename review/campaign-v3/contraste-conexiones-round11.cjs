const fs=require('fs'),path=require('path'),crypto=require('crypto'),create=require('./route-harness-round4-hints.cjs');
const dir=path.join(__dirname,'round11'),source=fs.readFileSync(path.join(dir,'index.html'),'utf8');
const output={hash:crypto.createHash('sha256').update(source).digest('hex'),scope:'Independent legal balanced input replays of N6 and N7; no state edits. Bridge contact is evidence of use, not necessity or human decision count.',runs:[]};
for(const li of [5,6]){
 const {api,route}=create(source),w=JSON.parse(fs.readFileSync(path.join(dir,`route-n${li+1}.json`)));api.newGame();api.loadLevel(li);api.startLevel();
 const connected=api.campaign.trials.filter(t=>t.bridges),contacts={},events=[];let frames=0,hits=0,deaths=0,ei=0;
 for(const t of connected)contacts[t.id]=t.bridges.map(()=>({frames:0,first:null,last:null}));
 for(const c of w.commands){route.input(c.a);for(let f=0;f<c.frames&&api.state==='play';f++){
  const p=api.player,oldHurt=p.hurtT,oldDead=p.dead;route.step();frames++;if(p.hurtT>oldHurt)hits++;if(!oldDead&&p.dead)deaths++;
  for(const t of connected)for(const [i,b] of t.bridges.entries()){
   const bx=t.x0+b.col*16;
   if(b.on&&p.onGround&&Math.abs(p.y+p.h-b.row*16)<.01&&p.x+p.w>bx&&p.x<bx+b.width*16){const s=contacts[t.id][i];s.frames++;s.first??=frames;s.last=frames;}
  }
  while(ei<api.campaign.events.length){const e=api.campaign.events[ei++],t=connected.find(t=>t.id===e.id);if(t)events.push({...e,position:{x:p.x-t.x0,y:p.y},state:{progress:t.progress,docked:t.docked,anchored:t.anchored,primed:t.primed,lit:t.lit,carry:api.campaign.carry,bridges:t.bridges.map(b=>b.on),angles:t.nodes.filter(n=>['mirror','prism'].includes(n.role)).map(n=>[n.id,n.angle])}});}
 }}
 const row={level:li+1,complete:api.state==='clear',frames,hits,deaths,contacts,events};output.runs.push(row);console.log(JSON.stringify(row));
}
fs.writeFileSync(path.join(__dirname,'contraste-conexiones-round11-evidencia.json'),JSON.stringify(output,null,2));
