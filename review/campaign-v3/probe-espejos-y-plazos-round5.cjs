'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict'),game=require('./route-harness-score1.cjs');
const source=fs.readFileSync(path.join(__dirname,'round5/index.html'),'utf8'),hash=crypto.createHash('sha256').update(source).digest('hex');assert.equal(hash,'faeccc2abdcd3ccff53bd12e98f91720e6d3704f72f1f1d90a8e2606d2dfd427');const mirrors=[],timers=[];
for(let level=5;level<=8;level++){const {api}=game(source);api.newGame();api.loadLevel(level-1);api.startLevel();
 for(const t of api.campaign.trials){
  if(t.kind==='mirror'){const ms=t.nodes.filter(n=>n.role==='mirror'),initial=ms.map(n=>n.angle),initialSolves=api.mirrorTrace(t),solutions=[],byMask=[];
   for(let mask=0;mask<2**ms.length;mask++){ms.forEach((n,i)=>n.angle=(mask>>i)&1);const solved=api.mirrorTrace(t);byMask.push(solved);if(solved)solutions.push({mask,angles:ms.map(n=>n.angle),beam:structuredClone(t.beams)});}
   const essential=ms.map((n,i)=>({id:n.id,affectsSolution:byMask.some((solves,mask)=>solves!==byMask[mask^(1<<i)])}));ms.forEach((n,i)=>n.angle=initial[i]);
   mirrors.push({level,id:t.id,part:t.part,sourceDirection:t.nodes.find(n=>n.role==='source').dir??1,mirrorCount:ms.length,initial,initialSolves,solutions,essential});
  }
  if(t.kind==='timed'){const ordered=t.order.map(id=>t.nodes.find(n=>n.id===id));assert.ok(ordered.every(Boolean));let horizontalLowerDistance=0;for(let i=1;i<ordered.length;i++)horizontalLowerDistance+=Math.max(0,Math.abs(ordered[i].x-ordered[i-1].x)-50);horizontalLowerDistance+=Math.max(0,t.gateX-ordered.at(-1).x-35);
   timers.push({level,id:t.id,order:t.order,duration:t.duration,nodes:ordered.map(n=>({id:n.id,x:n.x,y:n.y})),gateX:t.gateX,maximumHorizontalSpeed:api.CFG.SPEED,horizontalLowerFrames:horizontalLowerDistance/api.CFG.SPEED,impossibleEvenIgnoringVerticalTravel:horizontalLowerDistance/api.CFG.SPEED>t.duration});
  }
 }
}
const report={sourceHash:hash,fixture:true,scope:'Exhaustive binary-angle mirror logic fixtures and optimistic horizontal timer bounds. No legal route accessibility, human difficulty or timing sufficiency is inferred.',mirrors,timers};fs.writeFileSync(path.join(__dirname,'espejos-y-plazos-round5.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({mirrors:mirrors.map(m=>({level:m.level,id:m.id,count:m.mirrorCount,initialSolves:m.initialSolves,solutions:m.solutions.map(s=>s.angles),essential:m.essential})),timers:timers.map(t=>({level:t.level,id:t.id,duration:t.duration,horizontalLowerFrames:t.horizontalLowerFrames,impossible:t.impossibleEvenIgnoringVerticalTravel}))},null,2));
