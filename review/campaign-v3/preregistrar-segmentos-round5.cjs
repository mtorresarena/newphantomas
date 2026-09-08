'use strict';
// Static registration only: loads geometry, never steps or reads a route witness.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const createGame=require('./route-harness-score1.cjs');
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
const src={base:fs.readFileSync(path.join(__dirname,'index-base-31d4610.html'),'utf8'),candidate:fs.readFileSync(path.join(__dirname,'round5/index.html'),'utf8')};
function merge(spans,gap){const out=[];for(const s of spans.sort((a,b)=>a.x0-b.x0)){const p=out.at(-1);if(p&&s.x0-p.x1<=gap){p.x1=Math.max(p.x1,s.x1);p.anchors.push(...s.anchors);}else out.push({...s,anchors:s.anchors.slice()});}return out;}
const levels=[];
for(let li=0;li<8;li++){
 const source=li<4?src.base:src.candidate,{api}=createGame(source);api.newGame();api.loadLevel(li);
 const raw=api.buildLevel(api.LEVELS[li]),goal=api.items.find(i=>i.t==='S'),start=api.player.x+api.player.w/2,end=goal.x+8;
 const A=[],B=[],C=[],D=[],E=[];
 for(const i of api.items.filter(i=>i.t==='k'&&i.x+8>=start&&i.x<end))A.push({id:`N${li+1}-key-${i.x}-${i.y}`,kind:'key',x0:i.x,x1:i.x+16,y:i.y});
 for(let c=Math.floor(start/16);c<Math.ceil(end/16);c++)if(raw.map.some(r=>r[c]==='D'))A.push({id:`N${li+1}-door-${c}`,kind:'door',x0:c*16,x1:(c+1)*16});
 for(const t of api.campaign?.trials||[])B.push({id:`N${li+1}-trial-${t.id}`,trialId:t.id,kind:t.kind,x0:t.x0+(t.gate-28)*16,x1:t.x0+(t.gate+1)*16});
 const boss=api.campaign?.final||api.boss;if(boss)E.push({id:`N${li+1}-boss`,kind:li===3?'conductors':'heart',x0:boss.x0,x1:boss.x1});
 const primary=[...B,...E],inside=(x,spans)=>spans.some(s=>x>=s.x0&&x<s.x1);
 const candidates=[];
 for(let c=Math.floor(start/16);c<Math.ceil(end/16);c++){
  const x=c*16+8;if(inside(x,primary)||inside(x,A.filter(a=>a.kind==='door')))continue;
  const ch=r=>raw.map[r]?.[c]||'.';
  const harmful=[ch(9),ch(10),ch(11)].some(t=>'~^'.includes(t));
  const voidFloor=![ch(10),ch(11)].some(t=>api.isSolid(t)||t==='='||t==='_');
  const bodyBlocked=[ch(8),ch(9)].some(t=>api.isSolid(t));
  if(harmful||voidFloor||bodyBlocked)candidates.push({x0:c*16,x1:(c+1)*16,anchors:[{column:c,harmful,voidFloor,bodyBlocked}]});
 }
 for(const s of merge(candidates,32))C.push({...s,id:`N${li+1}-transit-${s.x0/16}-${s.x1/16}`,observeX0:Math.max(start,s.x0-16),observeX1:Math.min(end,s.x1+16),qualified:false,qualification:'Pending actual crossing and fixed neutral-horizontal counterfactual.'});
 const anchors=[...api.ents.map((e,i)=>({x:e.sx??e.x,kind:e.t,id:`ent-${i}`})),...(api.campaign?.foes||[]).map((e,i)=>({x:e.sx??e.x,kind:e.kind,id:`foe-${i}`})),...(api.campaign?.hazards||[]).map((e,i)=>({x:e.x,kind:e.kind,id:`hazard-${i}`}))];
 const excluded=[...primary,...C],spans=[];
 for(const a of anchors){if(a.x<start||a.x>end||inside(a.x,excluded))continue;let pieces=[{x0:Math.max(start,a.x-48),x1:Math.min(end,a.x+48),anchors:[a]}];for(const cut of excluded)pieces=pieces.flatMap(p=>cut.x1<=p.x0||cut.x0>=p.x1?[p]:[{...p,x1:Math.min(p.x1,cut.x0)},{...p,x0:Math.max(p.x0,cut.x1)}].filter(q=>q.x1>q.x0));spans.push(...pieces);}
 for(const s of merge(spans,0))D.push({...s,id:`N${li+1}-encounter-${s.x0}-${s.x1}`,qualified:false,qualification:'Pending observed response and fixed neutral-horizontal counterfactual; no automatic enemy count.'});
 levels.push({level:li+1,source:li<4?'base':'candidate',start,end,zones:raw.zones,A,B,C,D,E});
}
const manifest={version:1,registered:'2026-09-08',protocol:'PREREGISTRO-RONDA3-EXCURSIONES.md',sourceHashes:{base:hash(src.base),candidate:hash(src.candidate)},scope:'Static candidate episodes; no route read, no simulation step, no measured meaningful-action counts.',levels};
const output=JSON.stringify(manifest,null,2)+'\n';fs.writeFileSync(path.join(__dirname,'segmentos-preregistrados-round5.json'),output);console.log(JSON.stringify({file:'segmentos-preregistrados-round5.json',sha256:hash(output),levels:levels.length,simulationSteps:0}));
