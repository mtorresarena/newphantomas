'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto'),game=require('./route-harness-semantic.cjs');
const sha=s=>crypto.createHash('sha256').update(s).digest('hex'),root=path.join(__dirname,'harmonized-v2'),out=path.join(__dirname,'semantic-classification');fs.mkdirSync(out,{recursive:true});
const manifest=JSON.parse(fs.readFileSync(path.join(root,'manifest.json'))),source=fs.readFileSync(path.join(root,'index.html'),'utf8');assert.equal(sha(source),manifest.sourceHash);
const registry=JSON.parse(fs.readFileSync(path.join(__dirname,'segmentos-preregistrados.json'))),categories=['mandatory_action','simple_transit','necessary_mechanism_wait','optional','repetition'];
const observerHash=sha(fs.readFileSync(__filename)),protocolHash=sha(fs.readFileSync(path.join(__dirname,'PROTOCOLO-SEMANTICO-CONSERVADOR.md'))),summaries=[];
for(const entry of manifest.files){
 const file=path.join(root,entry.name),raw=fs.readFileSync(file),w=JSON.parse(raw);assert.equal(sha(raw),entry.hash);const output=path.join(out,`n${entry.level}-${entry.policy}.json`);
 if(fs.existsSync(output)){const previous=JSON.parse(fs.readFileSync(output));assert.equal(previous.observerHash,observerHash);assert.equal(previous.witnessHash,entry.hash);summaries.push(previous.summary);continue;}
 const measured=JSON.parse(fs.readFileSync(path.join(__dirname,'harmonized-classification',`n${entry.level}-${entry.policy}.json`))).result;assert.equal(measured.witnessHash,entry.hash);
 const progressFrames=new Set(measured.events.filter(e=>!measured.excludedSurplusKeys.includes(e.id)).map(e=>e.frame));
 const spec=registry.levels.find(l=>l.level===entry.level),g=game(source);g.api.newGame();g.api.loadLevel(entry.level-1);g.api.startLevel();const {api,route}=g;
 const lower=Object.fromEntries(categories.map(c=>[c,0])),upper={...lower},reasons={},ambiguousContexts={},runs=[];let frame=0,certain=0,ambiguous=0;
 const spans=[...spec.B,...spec.C,...spec.D,...spec.E],near=(x,s,m)=>x>=s.x0-m&&x<s.x1+m;
 function simple(before,after,input){
  if(input[0]!==1||input[1]||input[2]||!before.onGround||!after.onGround||after.x<=before.x+.01||Math.abs(after.y-before.y)>.01||before.carry||api.campaign?.carry||before.charging||after.charging||after.stun||after.hurtT>before.hurtT||after.mover)return false;
  const x=after.x+5;if(spans.some(s=>near(x,s,32))||spec.A.some(s=>near(x,s,64)))return false;
  const dynamic=route.telemetry(),threats=[...api.ents,...dynamic.balls,...dynamic.orbs,...api.movers,...(api.campaign?.foes||[]),...(api.campaign?.hazards||[])];
  if(threats.some(e=>e.alive!==false&&Math.abs(e.x-x)<128))return false;
  const c=Math.floor(x/16),r=Math.floor((after.y+after.h+1)/16);
  for(let k=c;k<=c+3;k++){const t=api.L.map[r]?.[k]||'.';if(!api.isSolid(t)||t==='D'||t==='B')return false;for(const br of [r-1,r-2])if(api.isSolid(api.L.map[br]?.[k]||'.'))return false;}
  return true;
 }
 function context(x){if(api.player.charging)return 'energy_recharge';if(spec.E.some(s=>near(x,s,0)))return 'boss';if(spec.B.some(s=>near(x,s,0)))return 'puzzle';if(spec.C.some(s=>near(x,s,0)))return 'obstacle';if(spec.D.some(s=>near(x,s,0)))return 'encounter';return 'other';}
 const commands=w.commands||w.inputs.map(i=>({a:w.actions[i],frames:w.framesPerAction}));
 for(const c of commands){route.input(c.a);for(let j=0;j<c.frames&&api.state==='play';j++){
  const p=api.player,before={x:p.x,y:p.y,onGround:p.onGround,hurtT:p.hurtT,charging:p.charging,carry:api.campaign?.carry,bags:api.stats.bags,events:api.campaign?.events.length||0,stable:(api.campaign?.trials||[]).map(t=>({id:t.id,stable:t.stable,solved:t.solved}))};
  route.step();frame++;const events=(api.campaign?.events||[]).slice(before.events),moved=Math.abs(p.x-before.x)>.01||Math.abs(p.y-before.y)>.01,neutral=c.a.every(n=>!n),bag=api.stats.bags>before.bags;
  const reset=events.some(e=>['order-reset','timeout'].includes(e.type));
  const progress=progressFrames.has(frame)||events.some(e=>['activate','charge-seal','deposit'].includes(e.type))||(!before.carry&&api.campaign?.carry);
  const stable=(api.campaign?.trials||[]).some(t=>t.kind==='mirror'&&before.stable.some(b=>b.id===t.id&&!b.solved&&t.stable>b.stable));
  let label=null,reason=null,possible=[];
  if(p.dead||reset){label='repetition';reason=p.dead?'death_respawn':'progress_reset';}
  else if(progress){label='mandatory_action';reason='verified_progress_transition';}
  else if(stable&&!moved&&neutral){label='necessary_mechanism_wait';reason='correct_mirror_stability_latency';}
  else if(bag){label='optional';reason='bag_collection_instant';}
  else if(simple(before,p,c.a)){label='simple_transit';reason='forward_fixed_safe_floor_outside_challenge_margins';}
  if(label){certain++;lower[label]++;upper[label]++;reasons[reason]=(reasons[reason]||0)+1;}
  else{ambiguous++;const ctx=context(p.x+5);ambiguousContexts[ctx]=(ambiguousContexts[ctx]||0)+1;reason=ctx;
   possible=moved?['mandatory_action','simple_transit','optional','repetition']:['necessary_mechanism_wait','optional','repetition'];
   if(!moved&&(stable||events.length))possible.push('mandatory_action');
   for(const category of possible)upper[category]++;
  }
  const key=JSON.stringify({label:label||'ambiguous',reason,possible}),last=runs.at(-1);if(last?.key===key)last.endFrame=frame;else runs.push({key,startFrame:frame,endFrame:frame,label:label||'ambiguous',reason,possible});
 }}
 assert.equal(api.state,'clear');assert.equal(frame,measured.frames);assert.equal(certain+ambiguous,frame);assert.equal(Object.values(lower).reduce((a,b)=>a+b,0),certain);
 const summary={level:entry.level,policy:entry.policy,frames:frame,seconds:frame/60,certainFrames:certain,certainPercent:100*certain/frame,ambiguousFrames:ambiguous,lower,upper,reasons,ambiguousContexts};
 fs.writeFileSync(output,JSON.stringify({sourceHash:sha(source),witnessHash:entry.hash,observerHash,protocolHash,summary,runs:runs.map(({key,...r})=>r),limitations:['Lower bounds count only narrowly attributed frames, not whole tasks.','Upper bounds overlap and cannot be summed.','Mechanism latency can overlap useful movement; stationary behavior is not globally mandatory.','Recharge and reversals do not establish necessity or optionality.','No human duration or enjoyment inference.']},null,2)+'\n');summaries.push(summary);console.log(JSON.stringify(summary));
}
fs.writeFileSync(path.join(out,'summary.json'),JSON.stringify({sourceHash:sha(source),observerHash,protocolHash,processed:summaries.length,summaries},null,2)+'\n');
