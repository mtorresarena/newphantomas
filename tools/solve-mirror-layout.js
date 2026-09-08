'use strict';
// Planning helper: solve the visible optical geometry, without changing game state.
module.exports=function solveMirror(t,solid){
 const mirrors=t.nodes.filter(n=>n.role==='mirror'),source=t.nodes.find(n=>n.role==='source'),receiver=t.nodes.find(n=>n.role==='receiver');
 const answers=[];
 for(let mask=0;mask<(1<<mirrors.length);mask++){
  const angles=Object.fromEntries(mirrors.map((n,i)=>[n.id,(mask>>i)&1]));let x=source.x,y=source.y,dir=source.dir??1;const seen=new Set();let hit=false;
  for(let step=0;step<160;step++){x+=[0,16,0,-16][dir];y+=[-16,0,16,0][dir];const k=[x,y,dir].join(',');if(seen.has(k))break;seen.add(k);if(x<t.x0||x>t.gateX||y<16||y>158||solid(Math.floor(x/16),Math.floor(y/16)))break;if(Math.abs(x-receiver.x)<2&&Math.abs(y-receiver.y)<2){hit=true;break;}const m=mirrors.find(n=>Math.abs(n.x-x)<2&&Math.abs(n.y-y)<2);if(m)dir=angles[m.id]?[1,0,3,2][dir]:[3,2,1,0][dir];}
  if(hit)answers.push(angles);
 }
 if(answers.length!==1)throw Error('Expected a unique optical solution in '+t.id+', found '+answers.length);
 return answers[0];
};
