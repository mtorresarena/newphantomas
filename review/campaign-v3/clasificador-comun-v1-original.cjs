'use strict';
// Implements PREREGISTRO-ACTIVIDAD-RONDA2.md. No inputs are selected by this observer.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const createGame=require('./route-harness-score1.cjs');
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
function classify(witnessPath,sourcePath){
 const source=fs.readFileSync(sourcePath,'utf8'),w=JSON.parse(fs.readFileSync(witnessPath,'utf8'));
 const registry=JSON.parse(fs.readFileSync(path.join(__dirname,'segmentos-preregistrados.json'),'utf8'));
 const level=w.level,spec=registry.levels.find(l=>l.level===level);assert.ok(spec,'Level must be one-based');
 assert.equal(sha(source),registry.sourceHashes[spec.source],'Use preregistered source; material/visual revisions require explicit source audit, not silent acceptance.');
 const {api,route}=createGame(source),cf=createGame(source);api.newGame();api.loadLevel(level-1);api.startLevel();cf.api.newGame();cf.api.loadLevel(level-1);cf.api.startLevel();
 const commands=w.commands||w.inputs.map(i=>({a:w.actions[i],frames:w.framesPerAction}));
 const candidates=[...spec.C.map(s=>({...s,category:'C'})),...spec.D.map(s=>({...s,category:'D',observeX0:s.x0,observeX1:s.x1}))];
 const pending=new Map(),done=new Set(),episodes=[],events=[],contexts={};
 const counted={A:new Set(),B:new Set(),E:new Set()};let frame=0,lastDirection=1,lastHurt=0,deaths=0,lastDead=false,physicalHits=0,minEnergy=100;
 const inside=(x,s)=>x>=s.x0&&x<s.x1;
 const snapshotNeeded=x=>candidates.some(s=>!done.has(s.id)&&!pending.has(s.id)&&x>=s.observeX0&&x<s.observeX1);
 function contrast(s,e){
  cf.route.restore(e.snapshot);cf.route.input([e.direction,0,0]);let hits=0,dead=false,crossed=false,n=0,previousHurt=cf.api.player.hurtT;
  const requested=frame-e.startFrame+60,limit=Math.min(600,requested);
  for(;n<limit&&cf.api.state==='play';n++){
   cf.route.step();const p=cf.api.player;if(p.hurtT>previousHurt)hits++;previousHurt=p.hurtT;
   if(p.dead){dead=true;break;}if(p.x+p.w/2>=s.observeX1){crossed=true;break;}
  }
  const actualHits=physicalHits-e.hitsAtEntry,actualFrames=frame-e.startFrame;
  const incomplete=requested>600&&!dead&&!crossed;
  const improved=!dead&&crossed?hits>actualHits:!incomplete;
  const response=e.controlChanged||e.verticalMotion;
  const qualified=!incomplete&&response&&improved&&!e.actualDeath;
  return {id:s.id,category:s.category,startFrame:e.startFrame,endFrame:frame,actualFrames,actualHits,actualDeath:e.actualDeath,controlChanged:e.controlChanged,verticalMotion:e.verticalMotion,qualified,status:incomplete?'not-demonstrated':qualified?'qualified':'not-qualified',counterfactual:{direction:e.direction,limit,frames:n+1,hits,dead,crossed,requestedFrames:requested},note:incomplete?'Counterfactual cap prevents a conclusive result.':'Local causal contrast; never used to complete the legal witness.'};
 }
 for(const c of commands){route.input(c.a);if(c.a[0])lastDirection=c.a[0];
  for(let f=0;f<c.frames&&api.state==='play';f++){
   const p=api.player,x=p.x+p.w/2;
   const before={x:p.x,y:p.y,keys:p.keys,hp:(api.campaign?.final||api.boss)?.hp,keyItems:api.items.filter(i=>i.t==='k').map(i=>({x:i.x,y:i.y})),snapshot:snapshotNeeded(x)?route.save():null};
   for(const s of candidates)if(!done.has(s.id)&&!pending.has(s.id)&&x>=s.observeX0&&x<s.observeX1){pending.set(s.id,{startFrame:frame,snapshot:before.snapshot,direction:lastDirection,hitsAtEntry:physicalHits,controlChanged:false,verticalMotion:false,actualDeath:false});}
   route.step();frame++;minEnergy=Math.min(minEnergy,p.energy);if(p.hurtT>lastHurt)physicalHits++;lastHurt=p.hurtT;
   if(p.dead&&!lastDead)deaths++;lastDead=!!p.dead;
   for(const i of before.keyItems)if(!api.items.some(j=>j.t==='k'&&j.x===i.x&&j.y===i.y)){
    const a=spec.A.find(a=>a.kind==='key'&&a.x0===i.x&&a.y===i.y);if(a&&!counted.A.has(a.id)){counted.A.add(a.id);events.push({frame,family:'A',id:a.id,kind:'key'});}
   }
   if(p.keys<before.keys)for(const a of spec.A.filter(a=>a.kind==='door'&&!counted.A.has(a.id)))if(!api.L.map.some(row=>row[Math.floor(a.x0/16)]==='D')){counted.A.add(a.id);events.push({frame,family:'A',id:a.id,kind:'door'});}
   for(const t of api.campaign?.trials||[]){const id=`N${level}-trial-${t.id}`;if(t.solved&&!counted.B.has(id)){counted.B.add(id);events.push({frame,family:'B',id,kind:t.kind});}}
   const boss=api.campaign?.final||api.boss;if(boss&&boss.hp<before.hp){const id=`N${level}-boss-progress-${boss.hp}`;if(!counted.E.has(id)){counted.E.add(id);events.push({frame,family:'E',id,hp:boss.hp});}}
   for(const s of candidates){const e=pending.get(s.id);if(!e)continue;e.controlChanged ||= c.a[0]!==e.direction||!!c.a[1]||!!c.a[2];e.verticalMotion ||= Math.abs(p.y-before.y)>.01;e.actualDeath ||= !!p.dead;
    if(p.x+p.w/2>=s.observeX1){episodes.push(contrast(s,e));pending.delete(s.id);done.add(s.id);}
   }
   const nowX=p.x+p.w/2;
   let context=p.dead?'death_or_respawn':boss?.active?'boss_context':spec.B.some(s=>inside(nowX,s)&&!api.campaign.trials.find(t=>t.id===s.trialId)?.solved)?'unsolved_puzzle_context':spec.C.some(s=>inside(nowX,s))?'transit_obstacle_context':spec.D.some(s=>inside(nowX,s))?'encounter_context':p.charging?'effective_charging':Math.abs(p.x-before.x)>.01||Math.abs(p.y-before.y)>.01?'other_movement':'other_still';
   contexts[context]=(contexts[context]||0)+1;
  }
 }
 assert.equal(api.state,'clear','A partial witness cannot be used as a complete comparison');
 const keyEvents=events.filter(e=>e.family==='A'&&e.kind==='key'),doorEvents=events.filter(e=>e.family==='A'&&e.kind==='door');
 const neededKeys=Math.min(keyEvents.length,doorEvents.length),excludedSurplusKeys=keyEvents.slice(neededKeys).map(e=>e.id);
 const vector={A:neededKeys+doorEvents.length,B:counted.B.size,C:episodes.filter(e=>e.category==='C'&&e.qualified).length,D:episodes.filter(e=>e.category==='D'&&e.qualified).length,E:counted.E.size};
 return {protocol:registry.protocol,sourceHash:sha(source),registryHash:sha(fs.readFileSync(path.join(__dirname,'segmentos-preregistrados.json'))),witness:path.basename(witnessPath),witnessHash:sha(fs.readFileSync(witnessPath)),level,complete:true,comparisonEligible:deaths===0&&api.player.lives===3,frames:frame,deaths,lives:api.player.lives,minEnergy,hits:physicalHits,vector,totalLowerBound:Object.values(vector).reduce((a,b)=>a+b,0),uncertainEpisodes:episodes.filter(e=>e.status==='not-demonstrated').map(e=>e.id),excludedSurplusKeys,events,episodes,uncompletedCandidates:[...pending.keys()],contextFrames:contexts,semanticActiveFrames:null,semanticCoverage:'Context is not semantic activity. Mandatory waiting/optional exploration are not established by this observer.',limitations:['Static entry can inherit a previously initiated jump; undercount is reported rather than moving boundaries retrospectively.','D uses a fixed observation radius, not actual enemy attack range.','Counterfactual fixtures establish only local response causality, not global necessity or human decisions.','Failure/recovery witnesses are ineligible for the no-death policy comparison.']};
}
module.exports={classify};
if(require.main===module){assert.ok(process.argv[2]&&process.argv[3]&&process.argv[4],'Usage: node clasificador-comun.cjs witness source output');const result=classify(process.argv[2],process.argv[3]);fs.writeFileSync(process.argv[4],JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({level:result.level,eligible:result.comparisonEligible,frames:result.frames,vector:result.vector,totalLowerBound:result.totalLowerBound,uncertain:result.uncertainEpisodes.length}));}
