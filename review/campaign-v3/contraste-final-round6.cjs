const fs=require('fs'),path=require('path'),crypto=require('crypto'),create=require('./route-harness-round4-hints.cjs');
const dir=path.join(__dirname,'round6'),src=fs.readFileSync(path.join(dir,'index.html'),'utf8');
const output={hash:crypto.createHash('sha256').update(src).digest('hex'),scope:'Independent production-loop input replays; natural start per level. No fabricated gameplay state. Not human experience.',runs:[]};
const names=[];
for(const p of ['balanced','cautious','speed'])for(let level=1;level<=8;level++)names.push(level<=4?`reference-n${level}-${p}.json`:`route-n${level}${p==='balanced'?'':'-'+p}.json`);
names.push('route-n5-retry-weight-trial5-2.json','route-n6-retry-timed-active-trial5-2.json','route-n6-expire-trial4-2.json','route-n7-retry-mirror-trial5-2.json');
for(const name of names){
 const file=path.join(dir,name);if(!fs.existsSync(file)){output.runs.push({name,skipped:'not present'});continue;}
 const w=JSON.parse(fs.readFileSync(file));if(!w.complete){output.runs.push({name,skipped:'incomplete witness'});continue;}
 const {api,route}=create(src);api.newGame();api.loadLevel(w.level-1);api.startLevel();
 const commands=w.commands||w.inputs.map(i=>({a:w.actions[i],frames:w.framesPerAction}));
 let frames=0,stationary=0,hits=0,deaths=0,minEnergy=100;
 for(const c of commands){route.input(c.a);for(let f=0;f<c.frames&&api.state==='play';f++){
  const p=api.player,b={x:p.x,y:p.y,h:p.hurtT,dead:p.dead};route.step();frames++;
  if(Math.abs(p.x-b.x)+Math.abs(p.y-b.y)<.01)stationary++;
  if(p.hurtT>b.h)hits++;if(!b.dead&&p.dead)deaths++;minEnergy=Math.min(minEnergy,p.energy);
 }}
 const row={name,level:w.level,complete:api.state==='clear',frames,stationary,hits,deaths,minEnergy,events:api.campaign?.events||[],solved:api.campaign?.trials.filter(t=>t.solved).length};output.runs.push(row);
 console.log(JSON.stringify({...row,events:undefined}));
}
fs.writeFileSync(path.join(__dirname,'contraste-final-round6-evidencia.json'),JSON.stringify(output,null,2));
