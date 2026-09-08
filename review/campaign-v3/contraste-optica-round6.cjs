const fs=require('fs'),path=require('path'),crypto=require('crypto'),create=require('./route-harness-round4-hints.cjs');
const source=fs.readFileSync(path.join(__dirname,'round6/index.html'),'utf8');
const result={hash:crypto.createHash('sha256').update(source).digest('hex'),scope:'Exhaustive fabricated optical configurations; does not prove legal player routes or rendered legibility',cases:[]};
for(let li=6;li<8;li++){
 const {api}=create(source);api.newGame();api.loadLevel(li);api.startLevel();
 for(const t of api.campaign.trials.filter(t=>t.kind==='mirror')){
  const m=t.nodes.filter(n=>n.role==='mirror'),initial=m.map(n=>n.angle),initialSolves=api.mirrorTrace(t),solutions=[];
  for(let mask=0;mask<(1<<m.length);mask++){m.forEach((n,j)=>n.angle=(mask>>j)&1);if(api.mirrorTrace(t))solutions.push(m.map(n=>n.angle));}
  m.forEach((n,j)=>n.angle=1-initial[j]);result.cases.push({level:li+1,id:t.id,initial,initialSolves,solutions,toggleAllSolves:api.mirrorTrace(t),mustRotate:solutions[0]?.map((a,j)=>a!==initial[j]?m[j].id:null).filter(Boolean)});
 }
}
fs.writeFileSync(path.join(__dirname,'contraste-optica-round6-evidencia.json'),JSON.stringify(result,null,2));
console.log(JSON.stringify(result,null,2));
