'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),game=require('./route-harness-score1.cjs');const reports=[];
for(const dir of ['round5','round6']){const source=fs.readFileSync(path.join(__dirname,dir,'index.html'),'utf8'),mirrors=[];
 for(const level of [7,8]){const {api}=game(source);api.newGame();api.loadLevel(level-1);api.startLevel();for(const t of api.campaign.trials.filter(t=>t.kind==='mirror')){
  const ns=t.nodes.filter(n=>n.role==='mirror'),initial=ns.map(n=>n.angle),evaluate=angles=>{ns.forEach((n,i)=>n.angle=angles[i]);return api.mirrorTrace(t);};
  const solutions=[];for(let mask=0;mask<2**ns.length;mask++){const angles=ns.map((n,i)=>(mask>>i)&1);if(evaluate(angles))solutions.push({mask,angles,toggleMask:angles.reduce((m,v,i)=>m|((v^initial[i])<<i),0)});}
  const common={unchanged:evaluate(initial),toggleAllOnce:evaluate(initial.map(n=>1-n)),setAllZero:evaluate(initial.map(()=>0)),setAllOne:evaluate(initial.map(()=>1))};ns.forEach((n,i)=>n.angle=initial[i]);
  mirrors.push({level,id:t.id,count:ns.length,initial,sourceDirection:t.nodes.find(n=>n.role==='source').dir??1,common,solutions});
 }}
 const advanced=mirrors.filter(m=>!(m.level===7&&m.id==='1-1')),report={source:dir,sourceHash:crypto.createHash('sha256').update(source).digest('hex'),fixture:true,scope:'Logical state fixtures, no movement/accessibility proof. A uniform angle policy is not a full legal route.',advancedToggleAllSolves:advanced.filter(m=>m.common.toggleAllOnce).map(m=>`N${m.level}/${m.id}`),mirrors};reports.push(report);console.log(JSON.stringify(report,null,2));
}
fs.writeFileSync(path.join(__dirname,'politicas-espejos-rondas56.json'),JSON.stringify({reports},null,2)+'\n');
