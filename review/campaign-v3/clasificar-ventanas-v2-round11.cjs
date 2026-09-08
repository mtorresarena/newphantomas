'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto'),game=require('./route-harness-semantic.cjs'),sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const root=path.join(__dirname,'round11-review-frozen'),out=path.join(__dirname,'semantic-windows-v2-round11');fs.mkdirSync(out,{recursive:true});const source=fs.readFileSync(path.join(root,'index.html'),'utf8'),manifest=JSON.parse(fs.readFileSync(path.join(root,'manifest.json'))),registry=JSON.parse(fs.readFileSync(path.join(__dirname,'segmentos-conectados-b9f1a7b93ca1.json')));assert.equal(sha(source),manifest.sourceHash);const observerHash=sha(fs.readFileSync(__filename)),protocolHash=sha(fs.readFileSync(path.join(__dirname,'PROTOCOLO-SEMANTICO-VENTANAS-V2.md'))),summaries=[];
for(const entry of manifest.files){const file=path.join(out,`n${entry.level}-${entry.policy}.json`),raw=fs.readFileSync(path.join(root,entry.name)),w=JSON.parse(raw);assert.equal(sha(raw),entry.hash);
 if(fs.existsSync(file)){const old=JSON.parse(fs.readFileSync(file));assert.equal(old.observerHash,observerHash);assert.equal(old.witnessHash,entry.hash);summaries.push(old.summary);continue;}
 const measured=JSON.parse(fs.readFileSync(path.join(__dirname,'round11-classification',`n${entry.level}-${entry.policy}.json`))).result;assert.equal(measured.witnessHash,entry.hash);const spec=registry.levels.find(l=>l.level===entry.level),g=game(source),{api,route}=g;api.newGame();api.loadLevel(entry.level-1);api.startLevel();
 const definitions=new Map((api.campaign?.trials||[]).map(t=>[t.id,structuredClone(t)])),milestones=[],finalAngles=new Map(),trace=[];let frame=0,eventCursor=0;const commands=w.commands||w.inputs.map(i=>({a:w.actions[i],frames:w.framesPerAction}));
 for(const c of commands){route.input(c.a);for(let j=0;j<c.frames&&api.state==='play';j++){
  const p=api.player,before={x:p.x,y:p.y,dead:p.dead,hurt:p.hurtT,carry:api.campaign?.carry,bags:api.stats.bags,stable:(api.campaign?.trials||[]).map(t=>[t.id,t.stable])};route.step();frame++;const events=(api.campaign?.events||[]).slice(eventCursor);eventCursor=api.campaign?.events.length||0;
  const insideB=spec.B.find(s=>p.x+5>=s.x0&&p.x+5<s.x1),t=insideB&&api.campaign.trials.find(t=>t.id===insideB.trialId),boss=api.campaign?.final||api.boss,dyn=route.telemetry();
  const guards=api.ents.filter(e=>e.puzzleGuard&&t&&e.sx>=insideB.x0&&e.sx<insideB.x1),mechanismWait=!!(t?.kind==='mirror'&&t.stable>0&&before.stable.some(([id,s])=>id===t.id&&t.stable>s))||guards.some(e=>['alert','charge','recover'].includes(e.state));
  const hazards=[...api.ents,...(api.campaign?.foes||[]),...(api.campaign?.hazards||[]),...dyn.balls,...dyn.orbs],nearThreat=hazards.some(e=>e.alive!==false&&Math.abs(e.x-(p.x+5))<64);
  const r=Math.floor((p.y+p.h+1)/16),col=Math.floor((p.x+5)/16),below=api.L.map[r]?.[col]||'.';
  trace.push({frame,x0:before.x,y0:before.y,x:p.x,y:p.y,ground:p.onGround,mover:!!p.mover,moved:Math.abs(p.x-before.x)>.01||Math.abs(p.y-before.y)>.01,input:c.a,charging:!!p.charging,dead:!!p.dead,reset:events.some(e=>['order-reset','timeout'].includes(e.type)),hurt:p.hurtT>before.hurt,stun:p.stun,carry:before.carry||api.campaign?.carry||null,bag:api.stats.bags>before.bags,fixedFloor:api.isSolid(below)||below==='=',nearThreat,trialId:t?.id||null,mechanismWait,bossActive:!!(boss?.active&&!boss.defeated),bossWait:!!(boss?.active&&!boss.defeated&&boss.timer>0)});
  if(!before.carry&&api.campaign?.carry){const trial=definitions.get(api.campaign.carry),n=trial.nodes.find(n=>n.role==='stone');milestones.push({frame,trialId:trial.id,type:'pickup',x:n.x,y:n.y});}
  for(const e of events){const def=definitions.get(e.id);if(!def)continue;const current=api.campaign.trials.find(t=>t.id===e.id),node=current.nodes.find(n=>n.id===e.detail);
   if(['activate','charge-seal','rotate','deposit','solved'].includes(e.type))milestones.push({frame,trialId:e.id,type:e.type,nodeId:node?.id,angle:node?.angle,x:node?.x??(e.type==='deposit'?def.nodes.find(n=>n.role==='socket').x:def.gateX),y:node?.y??(e.type==='deposit'?def.nodes.find(n=>n.role==='socket').y:145)});
   if(e.type==='solved')finalAngles.set(e.id,Object.fromEntries(current.nodes.filter(n=>n.role==='mirror').map(n=>[n.id,n.angle])));
  }
 }}assert.equal(api.state,'clear');assert.equal(frame,measured.frames);
 const windows=[],assignment=Array(frame).fill(null),priority={E:5,B:4,A:3,C:2,D:1};
 function add(window,filter=()=>true){windows.push(window);const wi=windows.length-1;for(let f=Math.max(1,window.startFrame);f<=Math.min(frame,window.endFrame);f++){if(!filter(trace[f-1]))continue;const old=assignment[f-1];if(old===null||priority[window.family]>priority[windows[old].family])assignment[f-1]=wi;}}
 for(const b of spec.B){const marks=milestones.filter(m=>m.trialId===b.trialId&&(m.type!=='rotate'||finalAngles.get(m.trialId)?.[m.nodeId]===m.angle)).sort((a,b)=>a.frame-b.frame);let start=trace.find(q=>q.x+5>=b.x0&&q.x+5<b.x1)?.frame; if(!start)continue;
  for(const mark of marks){if(mark.frame<start)continue;add({family:'B',id:b.id,startFrame:start,endFrame:mark.frame,endMilestone:mark,goal:{x:mark.x,y:mark.y}},q=>q.x+5>=b.x0&&q.x+5<b.x1);start=mark.frame+1;}
 }
 for(const ep of measured.episodes.filter(e=>e.qualified))add({family:ep.category,id:ep.id,startFrame:ep.startFrame+1,endFrame:ep.endFrame,qualification:'Existing common causal classifier qualified this crossing/response.'});
 for(const event of measured.events.filter(e=>e.family==='A'&&!measured.excludedSurplusKeys.includes(e.id))){const a=spec.A.find(a=>a.id===event.id);let start=event.frame,access=false;
  if(a?.kind==='key'&&a.y<110){for(let f=event.frame-1;f>=Math.max(0,event.frame-601);f--){const q=trace[f];if(Math.abs(q.x-a.x0)>256)break;if(q.ground&&q.y>=125){start=q.frame;access=true;break;}}}
  add({family:'A',id:event.id,startFrame:start,endFrame:event.frame,accessWindow:access,goal:a?{x:a.x0+8,y:a.y??145}:null});
 }
 let bossStart=null;for(const q of trace){if(q.bossActive&&bossStart===null)bossStart=q.frame;if(!q.bossActive&&bossStart!==null){add({family:'E',id:'boss-active',startFrame:bossStart,endFrame:q.frame-1});bossStart=null;}}if(bossStart!==null)add({family:'E',id:'boss-active',startFrame:bossStart,endFrame:frame});
 const mandatoryMoments=new Set(measured.events.filter(e=>!measured.excludedSurplusKeys.includes(e.id)).map(e=>e.frame)),counts={mandatory_objective_execution:0,simple_transit:0,mechanism_wait:0,optional_collection:0,repetition:0,resource_management_unresolved:0,unattributed:0},subtypes={},runs=[];let away=0;
 for(const q of trace){const win=assignment[q.frame-1]===null?null:windows[assignment[q.frame-1]],neutral=q.input.every(n=>!n);let category='unattributed',subtype=q.moved?'unattributed_maneuver':'unattributed_still';
  if(q.dead||q.reset){category='repetition';subtype=q.dead?'death_respawn':'progress_lost';}
  else if(mandatoryMoments.has(q.frame)){category='mandatory_objective_execution';subtype='milestone';}
  else if(q.charging){category='resource_management_unresolved';subtype='recharge_observed_not_minimal_need';}
  else if(win){
   if(neutral&&q.mover){category='mechanism_wait';subtype='passive_moving_platform';}
   else if((q.moved&&!q.stun)||q.input[2]){category='mandatory_objective_execution';subtype=win.family==='B'?(q.carry?'carry_transport':'puzzle_access_or_interaction'):win.family==='A'?'key_ascent':win.family==='C'?'qualified_crossing':win.family==='D'?'qualified_enemy_response':'combat_movement';
    if(win.goal&&Math.hypot(q.x-win.goal.x,q.y-win.goal.y)>Math.hypot(q.x0-win.goal.x,q.y0-win.goal.y)+.01)away++;
   }else if(neutral&&(q.mechanismWait||q.bossWait)){category='mechanism_wait';subtype=win.family==='E'?'boss_latency':'puzzle_latency';}else subtype='objective_window_without_attributed_activity';
  }else if(q.bag){category='optional_collection';subtype='incidental_bag';}
  else if(q.ground&&q.fixedFloor&&q.x>q.x0+.01&&Math.abs(q.y-q.y0)<.01&&!q.input[1]&&!q.input[2]&&!q.hurt&&!q.stun&&!q.nearThreat){category='simple_transit';subtype='ordinary_horizontal_travel';}
  counts[category]++;subtypes[subtype]=(subtypes[subtype]||0)+1;const last=runs.at(-1);if(last&&last.category===category&&last.subtype===subtype&&last.windowId===(win?.id||null))last.endFrame=q.frame;else runs.push({startFrame:q.frame,endFrame:q.frame,category,subtype,windowId:win?.id||null});
 }
 assert.equal(Object.values(counts).reduce((a,b)=>a+b,0),frame);const classified=frame-counts.unattributed-counts.resource_management_unresolved,summary={level:entry.level,policy:entry.policy,frames:frame,seconds:frame/60,counts,subtypes,coveragePercent:100*classified/frame,movingAwayFromNextMilestoneFrames:away,windows:windows.length};summaries.push(summary);
 fs.writeFileSync(file,JSON.stringify({sourceHash:sha(source),witnessHash:entry.hash,observerHash,protocolHash,summary,windows,runs,scope:'Operational execution windows, not minimum causal frame necessity or human time. A–E counts unchanged. Resource necessity and unassigned movement remain explicit. Movement away from a target may be required geometry, not proven waste.'},null,2)+'\n');console.log(JSON.stringify(summary));
}
fs.writeFileSync(path.join(out,'summary.json'),JSON.stringify({sourceHash:sha(source),observerHash,protocolHash,processed:summaries.length,summaries},null,2)+'\n');
