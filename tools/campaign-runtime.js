// Authored campaign rules. Inlined by build-campaign.py so the shipped game and
// the VM tests execute exactly the same state machine, without a build at deploy.
let campaign=null;
function initCampaign(){
 if(!L.def.campaign)return null;
 const s={trials:[],hazards:[],foes:[],carry:null,downHeld:false,events:[],final:null,prompt:'',hints:{}};
 L.def.segs.forEach((seg,i)=>{const z=L.zones[i],base=z.x0;
  for(const def of seg.trials||[]){const t=structuredClone(def);t.x0=base;t.part=z.part;t.solved=false;t.progress=0;t.until=0;t.stable=0;t.beams=[];
   t.nodes=(t.nodes||[]).map((n,j)=>({...n,id:n.id||String(j+1),x:base+n.col*TS+8,y:n.row*TS+8,active:false,angle:n.angle||0,initialAngle:n.angle||0}));
   t.gateX=base+t.gate*TS;t.open=false;t.docked=null;t.anchored=false;t.primed=false;s.trials.push(t);for(let r=1;r<10;r++)L.map[r][t.gateX/TS]='#';
   campaignBridges(t);
  }
  for(const h of seg.hazards||[])s.hazards.push({...h,x:base+h.col*TS,y:h.row*TS,phase:h.phase||0});
  for(const f of seg.foes||[])s.foes.push({...f,x:base+f.col*TS,y:f.row*TS,sx:base+f.col*TS,sy:f.row*TS,w:16,h:12,dir:-1,vy:0,timer:0,state:'patrol',alive:true});
  if(seg.finalArena)s.final={x0:base,x1:base+320,x:base+152,y:62,w:64,h:72,active:false,defeated:false,hp:6,phase:1,state:'idle',timer:0,cycle:0,shots:[],marks:[],prevBottom:0};
 });
 for(const t of s.trials.filter(t=>t.kind==='charge'))for(const e of ents)if(e.t==='K'&&e.sx>=t.x0+(t.gate-28)*TS&&e.sx<t.gateX){e.puzzleGuard=true;e.chargeDist=t.nodes.length>1?160:CFG.SENTINEL_DIST;}
 if(s.final){const col=s.final.x1/TS-1;for(let r=1;r<10;r++)L.map[r][col]='#';}
 return s;
}
function campaignEvent(type,id,detail=''){if(campaign.events.length<2000)campaign.events.push({frame:simF,type,id,detail});}
function campaignGate(t,open){
 // Expiring doors defer closure while occupied; never materialize inside a body.
 if(!open&&over(player,{x:t.gateX,y:16,w:16,h:144}))return;
 for(let r=1;r<10;r++)L.map[r][t.gateX/TS]=open?'.':'#';t.open=open;
}
function campaignBridges(t){
 for(const b of t.bridges||[]){const on=t.solved||(t.relay?(t.anchored||t.docked==='2'):t.dualLight?t.primed:b.stages.includes(t.progress));b.on=!!on;
  // Only one-way supports change. They cannot enclose or crush a body.
  for(let dx=0;dx<b.width;dx++)L.map[b.row][t.x0/TS+b.col+dx]=on?'=':'.';
 }
}
function solveTrial(t){if(t.solved)return;t.solved=true;campaignGate(t,true);campaignBridges(t);campaignEvent('solved',t.id);SFX.door();showMsg('PASO ABIERTO: '+t.name,130,'#80e6ed');}
function resetCampaign(){
 if(!campaign)return;campaign.carry=null;campaign.downHeld=true;
 for(const t of campaign.trials){if(t.solved)continue;t.progress=0;t.until=0;t.stable=0;t.docked=null;t.anchored=false;t.primed=false;t.nodes.forEach(n=>{n.active=false;n.angle=n.initialAngle||0;});campaignGate(t,false);campaignBridges(t);}
 for(const f of campaign.foes){f.x=f.sx;f.y=f.sy;f.vy=0;f.state='patrol';f.alive=true;f.timer=0;}
 const b=campaign.final;if(b&&!b.defeated){Object.assign(b,{x:b.x0+152,y:62,active:false,hp:6,phase:1,state:'idle',timer:0,cycle:0,flash:0,shots:[],marks:[],target:0,targetY:0,prevBottom:0});for(let r=1;r<10;r++){L.map[r][b.x0/TS]='.';L.map[r][b.x1/TS-1]='#';}}
 campaignEvent('respawn','campaign');
}
function mirrorTrace(t){
 const source=t.nodes.find(n=>n.role==='source');t.lit=null;
 let x=source.x,y=source.y,dir=source.dir??1,last={x,y};const seen=new Set(),beams=[];
 for(let step=0;step<160;step++){
  x+=[0,16,0,-16][dir];y+=[-16,0,16,0][dir];const key=x+','+y+','+dir;if(seen.has(key))break;seen.add(key);
  if(x<t.x0||x>t.gateX||y<16||y>158||isSolid(tileAt(Math.floor(x/16),Math.floor(y/16)))){beams.push({x0:last.x,y0:last.y,x1:x,y1:y});break;}
  const receiver=t.nodes.find(n=>n.role==='receiver'&&Math.abs(x-n.x)<2&&Math.abs(y-n.y)<2);
  if(receiver){beams.push({x0:last.x,y0:last.y,x1:x,y1:y});t.beams=beams;t.lit=receiver.id;return !t.dualLight||(t.primed&&receiver.id==='S');}
  const mirror=t.nodes.find(n=>(n.role==='mirror'||(n.role==='prism'&&n.angle))&&Math.abs(n.x-x)<2&&Math.abs(n.y-y)<2);
  if(mirror){beams.push({x0:last.x,y0:last.y,x1:x,y1:y});last={x,y};dir=mirror.role!=='prism'&&mirror.angle?[1,0,3,2][dir]:[3,2,1,0][dir];}
 }
 t.beams=beams;return false;
}
function useCampaignNode(t,n){
 if(t.solved)return;
 if(t.kind==='mirror'){if(n.role==='prism'&&!t.primed){showMsg('R DEBE ALIMENTAR PRIMERO LA PASARELA',150,'#ffd23a');SFX.lock();return;}if(!['mirror','prism'].includes(n.role))return;n.angle=1-n.angle;t.stable=0;SFX.tick();campaignEvent('rotate',t.id,n.id);return;}
 if(t.kind==='weight'){
  if(t.relay){
   if(n.role==='latch'){if(t.docked==='2'&&!t.anchored){t.anchored=true;n.active=true;campaignBridges(t);campaignEvent('anchor',t.id);SFX.door();showMsg('ESCALERA FIJADA: RECUPERA EL PESO',150,'#80e6ed');}else if(!t.anchored)showMsg('LA BALANZA BAJA DEBE TENER PESO',120,'#ffd23a');return;}
   if(n.role==='socket'){
    if(t.docked===n.id){t.docked=null;n.active=false;campaign.carry=t.id;campaignBridges(t);campaignEvent('retrieve',t.id,n.id);SFX.pick();return;}
    if(campaign.carry===t.id){if(n.id==='4'&&!t.anchored){showMsg('FIJA PRIMERO EL CERROJO 3',120,'#ffd23a');SFX.lock();return;}campaign.carry=null;t.docked=n.id;n.active=true;campaignBridges(t);campaignEvent('deposit',t.id,n.id);SFX.door();if(n.id==='4')solveTrial(t);else showMsg('LA BALANZA HA DESPLEGADO LA ESCALERA',150,'#80e6ed');}return;
   }
   if(t.docked)return;
  }
  if(n.role==='stone'&&!n.active){if(campaign.carry===t.id){campaign.carry=null;SFX.tick();}else if(!campaign.carry){campaign.carry=t.id;SFX.pick();}return;}
  if(n.role==='socket'&&campaign.carry===t.id){campaign.carry=null;t.nodes.forEach(k=>k.active=true);campaignEvent('deposit',t.id);solveTrial(t);}return;
 }
 if(t.kind==='charge')return;
 const expected=(t.order||t.nodes.map(k=>k.id))[t.progress];
 if(n.id!==expected){t.progress=0;t.until=0;t.nodes.forEach(k=>k.active=false);campaignBridges(t);SFX.lock();showMsg('ORDEN: '+t.order.join(' - '),130,'#ffd23a');campaignEvent('order-reset',t.id,n.id);return;}
 if(t.kind==='timed'&&!t.until)t.until=simF+t.duration;
 n.active=true;t.progress++;campaignBridges(t);SFX.tick();campaignEvent('activate',t.id,n.id);
 if(t.bridges)showMsg(t.progress===1?'PASARELA DE SUBIDA ABIERTA':'PASARELAS CAMBIADAS: MIRA LOS APOYOS',120,'#80e6ed');
 if(t.progress===(t.order||t.nodes).length){if(t.kind==='timed')campaignGate(t,true);else solveTrial(t);}
}
function expireCampaignTimers(){
 if(!campaign||player.dead)return;
 for(const t of campaign.trials)if(t.kind==='timed'&&!t.solved&&t.until&&simF>t.until){
  t.progress=0;t.until=0;t.nodes.forEach(n=>n.active=false);campaignBridges(t);
  // Run before player movement. Recovery for an imported/invalid overlapping
  // state returns the body to the safe entrance bank, never behind the lock.
  if(over(player,{x:t.gateX,y:16,w:16,h:144})){player.x=t.gateX-player.w-.01;player.vx=Math.min(0,player.vx);}
  campaignGate(t,false);campaignEvent('timeout',t.id);
 }
}
function updateCampaign(){
 if(!campaign||player.dead)return;expireCampaignTimers();const c=campaign;c.prompt='';
 const use=inp.d&&!c.downHeld&&!inp.j;c.downHeld=inp.d;
 let nearest=null;
 for(const t of c.trials){
  if(t.solved)continue;
  if(t.kind==='mirror'){if(mirrorTrace(t)){t.stable++;if(t.stable>=30)solveTrial(t);}else if(t.dualLight&&!t.primed&&t.lit==='R'){if(++t.stable>=30){t.primed=true;t.stable=0;t.nodes.find(n=>n.id==='R').active=true;campaignBridges(t);campaignEvent('receiver',t.id,'R');SFX.door();showMsg('R FIJA LA PASARELA. EL PRISMA E YA RESPONDE',150,'#80e6ed');}}else t.stable=0;}
  if(t.kind==='charge'){
   for(const n of t.nodes)if(!n.active&&ents.some(e=>e.t==='K'&&e.state==='charge'&&Math.abs(e.x+e.w/2-n.x)<18&&Math.abs(e.y+e.h-n.y-8)<18)){n.active=true;SFX.bossZap();campaignEvent('charge-seal',t.id,n.id);}
   if(t.nodes.every(n=>n.active))solveTrial(t);
  }
  if(t.kind==='timed'&&t.until){
   // Reaching the open threshold before expiry latches it permanently. This
   // avoids crushing a player inside a closing door or locking them beyond it.
   if(t.open&&player.x+player.w>t.gateX&&simF<=t.until){solveTrial(t);continue;}
  }
  if(t.kind==='timed'&&!t.until&&t.open)campaignGate(t,false);
  for(const n of t.nodes){if(['source','receiver','plate'].includes(n.role))continue;const d=Math.hypot(player.x+5-n.x,player.y+9-n.y);if(d<25&&(!nearest||d<nearest.d))nearest={t,n,d};}
 }
 if(nearest){const {t,n}=nearest;c.prompt=n.role==='latch'?'ABAJO: FIJAR ESCALERA':n.role==='prism'?'ABAJO: DESVIAR HACIA S':t.docked===n.id?'ABAJO: RECUPERAR PESO':t.kind==='mirror'?'ABAJO: GIRAR ESPEJO':t.kind==='weight'?(n.role==='socket'?(c.carry===t.id?'ABAJO: ENCAJAR CONTRAPESO':'FALTA EL CONTRAPESO'):(c.carry===t.id?'ABAJO: DEVOLVER A BASE':'ABAJO: TOMAR CONTRAPESO')):'ABAJO: '+n.id;if(use)useCampaignNode(t,n);}
 updateCampaignHazards();updateCampaignFoes();updateHeart();
}
function campaignHazardState(h){const clock=(simF+h.phase)%(h.period||210),warn=h.warn||55,active=h.active||65;return clock<warn?'warn':clock<warn+active?'active':'rest';}
function updateCampaignHazards(){
 for(const h of campaign.hazards){if(h.x<cam.x-60||h.x>cam.x+W+60)continue;
  if(h.kind==='pendulum'){const angle=Math.sin((simF+h.phase)*.025)*.9;h.px=h.x+Math.sin(angle)*h.length;h.py=h.y+Math.cos(angle)*h.length;if(Math.hypot(player.x+5-h.px,player.y+9-h.py)<13)hurt(18,player.x<h.px?-2:2,-2.5,80,'hit');}
  else if(campaignHazardState(h)==='active'&&over(player,{x:h.x,y:h.y,w:(h.width||2)*16,h:160-h.y}))hurt(h.damage||15,player.face*-1.4,-3,80,'flame');
 }
}
function updateCampaignFoes(){
 for(const f of campaign.foes){if(!f.alive||Math.abs(f.x-player.x)>400)continue;
  if(f.kind==='beetle'){
   if(lvl===4&&zoneAt(f.sx).part===1&&Math.abs(f.x-player.x)<64&&!campaign.prompt)campaign.prompt='ESCARABAJO: PUEDES PISARLO';
   const hit=moveX(f,f.dir*.8);f.vy=Math.min(4,f.vy+.2);moveY(f,f.vy);if(hit||!groundAhead(f,f.dir,2)||Math.abs(f.x-f.sx)>64)f.dir*=-1;
   if(over(player,f)){if(player.vy>0&&player.y+player.h<f.y+8){f.alive=false;player.vy=-4;player.onGround=false;SFX.land();burst(f.x+8,f.y+6,10,'#d9b15f');campaignEvent('stomp','beetle');}else hurt(18,player.x<f.x?-2:2,-2.5,80,'hit');}
  }else{
   if(f.state==='patrol'){f.y=f.sy+Math.sin(simF*.06)*4;if(Math.abs(player.x-f.x)<95){f.state='warn';f.timer=55;f.tx=player.x;f.ty=player.y;}}
   else if(f.state==='warn'){if(--f.timer<=0){f.state='dive';f.timer=50;}}
   else if(f.state==='dive'){const dx=f.tx-f.x,dy=f.ty-f.y,d=Math.hypot(dx,dy)||1;f.x+=dx/d*1.8;f.y+=dy/d*1.8;if(--f.timer<=0){f.state='return';f.timer=100;}}
   else{f.x+=(f.sx-f.x)*.04;f.y+=(f.sy-f.y)*.04;if(--f.timer<=0)f.state='patrol';}
   if(f.state==='dive'&&over(player,f))hurt(16,player.x<f.x?-2:2,-2.5,80,'hit');
  }
 }
}
function updateHeart(){
 const b=campaign.final;if(!b||b.defeated)return;
 if(!b.active&&player.x>=b.x0+24&&player.x<b.x1){b.active=true;b.state='intro';b.timer=150;b.prevBottom=player.y+player.h;for(let r=1;r<10;r++)L.map[r][b.x0/16]='#';SFX.bossAwaken();showMsg('SALTA SOBRE EL NÚCLEO CUANDO SE ABRA',150,'#ffd23a');campaignEvent('boss-start','heart');}
 if(!b.active)return;
 player.x=Math.max(b.x0+16,Math.min(b.x1-16-player.w,player.x));const nextPhase=b.hp>4?1:b.hp>2?2:3;
 if(nextPhase!==b.phase){b.phase=nextPhase;SFX.bossPhase();showMsg(b.phase===2?'FASE 2: ABANDONA LA DIRECCIÓN MARCADA':'FASE 3: MARCA Y BARRIDO COMBINADOS',120,'#f4b3d7');}
 if(b.flash>0)b.flash--;
 if(b.state==='open'){b.x=b.x0+152+Math.sin(simF*.012)*((b.phase-1)*12);b.y=62;}
 if(--b.timer<=0){
  if(b.state==='intro'||b.state==='recover'){b.state='warn';b.timer=70;b.cycle++;b.target=player.x+5;b.targetY=player.y+9;b.marks=b.phase===3?[b.target]:[];SFX.bossAim();}
  else if(b.state==='warn'){b.state='attack';b.timer=b.phase===1?50:70;
   if(b.phase>=2){for(const d of [-.25,0,.25]){const dx=b.target-b.x-32,dy=b.targetY-b.y-40,a=Math.atan2(dy,dx)+d;b.shots.push({x:b.x+32,y:b.y+40,vx:Math.cos(a)*1.8,vy:Math.sin(a)*1.8,life:150});}}
   SFX.bossFire();
  }else if(b.state==='attack'){b.state='open';b.timer=150;b.marks=[];SFX.bossZap();campaignEvent('boss-open','heart',String(b.phase));}
  else if(b.state==='open'){b.state='recover';b.timer=55;}
  else if(b.state==='defeat'){b.defeated=true;b.active=false;b.shots=[];for(let r=1;r<10;r++)L.map[r][b.x1/16-1]='.';campaignEvent('boss-defeated','heart');showMsg('EL CORAZÓN HA DEJADO DE LATIR',160,'#80e6ed');}
 }
 if(b.state==='attack'){
  if(b.phase===1||b.phase===3){const high=b.cycle%2===0,y=high?96:146;if(player.y+player.h>y&&player.y<y+8)hurt(15,player.face*-2,-3,80,'flame');}
  if(b.phase===3&&Math.abs(player.x+5-b.target)<12)hurt(18,player.face*-2,-3,80,'hit');
 }
 for(const s of b.shots){s.x+=s.vx;s.y+=s.vy;s.life--;if(over(player,{x:s.x-4,y:s.y-4,w:8,h:8})){hurt(15,s.vx>0?2:-2,-3,80,'hit');s.life=0;}}
 b.shots=b.shots.filter(s=>s.life>0&&s.x>b.x0&&s.x<b.x1&&s.y>16&&s.y<160);
 const core={x:b.x+8,y:b.y,w:b.w-16,h:b.h};
 if(b.state==='open'&&player.vy>0&&b.prevBottom<=core.y+8&&player.y+player.h>=core.y&&player.x+player.w>core.x&&player.x<core.x+core.w){
  b.hp--;player.y=core.y-player.h;player.vy=-4.3;player.onGround=false;player.inv=Math.max(player.inv,30);b.state=b.hp?'recover':'defeat';b.timer=b.hp?70:120;b.flash=24;shake=3;b.shots=[];b.marks=[];if(b.hp)SFX.bossImpact();else SFX.bossDefeat();burst(b.x+32,b.y+24,20,'#ff8a75');campaignEvent('boss-hit','heart',String(b.hp));
 }else if(!['intro','defeat','recover'].includes(b.state)&&over(player,core))hurt(18,player.x<b.x?-2:2,-3,80,'hit');
 b.prevBottom=player.y+player.h;
}
function drawCampaignWarning(x,y){
 // High-flying moths place the warning below their body, clear of both HUD rows.
 const wy=y<64?Math.max(48,y+17):y-17;circ(ctx,x+8,wy+3,5,'#211529');text('!',x+8,wy,'#ffd23a',1,'center');
}
function drawCampaign(cx){
 if(!campaign)return;
 for(const t of campaign.trials){
  if(t.gateX<cx-200||t.x0>cx+W)continue;
  for(const beam of t.beams||[]){ctx.strokeStyle=t.solved?'#77f6d1':'#ffe6a0';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(beam.x0-cx,beam.y0);ctx.lineTo(beam.x1-cx,beam.y1);ctx.stroke();}
  for(const n of t.nodes){const x=n.x-cx,y=n.y;if(x<-20||x>W+20)continue;
   if(n.role==='stone'&&(campaign.carry===t.id||n.active||t.docked))continue;
   if(n.role==='plate'){const col=n.active?'#80efb5':'#dfb76b';ctx.fillStyle='#333944';ctx.fillRect(x-9,y+5,18,3);ctx.fillStyle=col;ctx.fillRect(x-6,y+5,12,1);text(n.active?'OK':'!',x,y-6,col,1,'center');continue;}
   const col=n.active||t.solved?'#80efb5':'#dfb76b';rrect(ctx,x-7,y-8,14,16,1,lgr(ctx,x,y-8,x,y+8,['#76604c','#303141','#131c2e']),col);
   ctx.fillStyle='#0b1220';ctx.fillRect(x-5,y-6,10,12);ctx.fillStyle='#a89a7b';for(const dx of [-5,5])for(const dy of [-6,6])ctx.fillRect(x+dx,y+dy,1,1);ctx.fillStyle='#3b4050';ctx.fillRect(x-9,y+8,18,2);
   if(n.role==='mirror'||n.role==='prism'){const slope=n.role==='prism'?(n.angle?-1:0):(n.angle?1:-1);ctx.strokeStyle='#c2f6ff';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x-4,y+slope*5);ctx.lineTo(x+4,y-slope*5);ctx.stroke();rrect(ctx,x-5,y-18,10,9,1,'#091321');text(n.id,x,y-16,'#c2f6ff',1,'center');}
   else if(n.role==='plate'){ctx.fillStyle=col;ctx.fillRect(x-7,y+5,14,3);text('!',x,y-5,col,1,'center');}
   else if(n.role==='stone'){circ(ctx,x,y,5,'#a8874d');ctx.fillStyle='#ffe2a0';ctx.fillRect(x-2,y-3,2,2);}
   else if(n.role==='socket'){ctx.strokeStyle=col;ctx.strokeRect(x-4,y-4,8,8);if(n.active)circ(ctx,x,y,4,'#d0a861');if(t.relay){rrect(ctx,x-5,y-18,10,9,1,'#091321');text(n.id,x,y-16,'#ffe4a1',1,'center');}}
   else text(n.glyph||n.id,x,y-3,col,1,'center');
  }
  for(const b of t.bridges||[]){const x=t.x0+b.col*TS-cx,y=b.row*TS;if(x>W||x+b.width*TS<0)continue;ctx.strokeStyle=b.on?'#73e8d5':'#536477';ctx.lineWidth=1;ctx.setLineDash(b.on?[]:[3,4]);ctx.beginPath();ctx.moveTo(x,y+2);ctx.lineTo(x+b.width*TS,y+2);ctx.stroke();ctx.setLineDash([]);}
  const gx=t.gateX-cx;if(gx>=-16&&gx<=W){if(!t.open)drawBossBarrier(gx);text(t.solved?'OK':t.kind==='timed'&&t.until?String(Math.max(0,Math.ceil((t.until-simF)/60))):t.symbol||'?',gx+8,22,t.solved?'#80efb5':'#ffd23a',1,'center');}
 }
 for(const h of campaign.hazards){const x=h.x-cx;if(x<-150||x>W+150)continue;
  if(h.kind==='pendulum'){const px=(h.px??h.x)-cx,py=h.py??h.y+h.length;ctx.strokeStyle='#9c927e';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x,h.y);ctx.lineTo(px,py);ctx.stroke();circ(ctx,px,py,9,'#293347');circ(ctx,px,py,6,'#a6b6c1');text('!',px,py-3,'#ffbc63',1,'center');}
  else{const st=campaignHazardState(h),w=(h.width||2)*16;ctx.fillStyle='#8f7b65';ctx.fillRect(x,158,w,2);ctx.fillStyle='#111829';for(let dx=2;dx<w;dx+=5)ctx.fillRect(x+dx,158,2,2);if(st!=='rest'){ctx.fillStyle=st==='active'?'rgba(255,120,50,.7)':'rgba(255,220,100,.3)';ctx.fillRect(x,h.y,w,160-h.y);}if(st==='warn')text('!',x+w/2,h.y-10,'#ffe38c',1,'center');}
 }
 for(const f of campaign.foes){if(!f.alive)continue;const x=f.x-cx;if(x<-24||x>W+24)continue;
  if(window.CampaignFoeArt?.draw(ctx,f,x,simF)){if(f.state==='warn')drawCampaignWarning(x,f.y);continue;}
  if(f.kind==='beetle'){rrect(ctx,x,f.y+3,16,9,3,'#342d38','#b38b53');rrect(ctx,x+2,f.y,12,8,3,'#a87943','#edd197');ctx.fillStyle='#242432';ctx.fillRect(x+7,f.y,2,10);for(let i=0;i<3;i++){ctx.fillStyle='#d4ab73';ctx.fillRect(x+1+i*6,f.y+10+(simF>>3)%2,2,3);}ctx.fillStyle='#73ebeb';ctx.fillRect(x+(f.dir<0?0:13),f.y+6,3,2);}
  else{drawBat(ctx,x,f.y,simF,f.dir);if(f.state==='warn')drawCampaignWarning(x,f.y);}
 }
 if(campaign.carry){ctx.fillStyle='#d0a861';ctx.fillRect(player.x-cx-1,player.y-8,12,7);ctx.fillStyle='#fff0b0';ctx.fillRect(player.x-cx+2,player.y-7,3,2);}
 const b=campaign.final;if(!b)return;
 if(b.active&&!b.defeated){drawBossBarrier(b.x0-cx);drawBossBarrier(b.x1-16-cx);}
 if(b.x-cx>W+90||b.x+b.w<cx)return;
 if(b.defeated){circ(ctx,b.x+32-cx,151,10,'#392537');return;}
 ctx.save();if(b.state==='defeat')ctx.globalAlpha=Math.max(.08,b.timer/120);
 if(!window.CampaignBossArt?.draw(ctx,b.x-cx,b.y,b.state,simF)){ctx.save();ctx.translate(b.x+32-cx,b.y+35);ctx.fillStyle='#a96853';ctx.beginPath();ctx.moveTo(-38,-20);ctx.lineTo(-60,-38);ctx.lineTo(-46,10);ctx.lineTo(-22,18);ctx.lineTo(22,18);ctx.lineTo(46,10);ctx.lineTo(60,-38);ctx.lineTo(38,-20);ctx.fill();circ(ctx,0,0,27,'#4a253d');circ(ctx,0,0,b.state==='open'?20:12,b.state==='open'?'#ff8c91':'#944257');ctx.restore();}
 ctx.restore();
 if(b.flash>0||b.state==='open'){ctx.strokeStyle=b.flash>0?'#ffe4bb':'#80f0dc';ctx.lineWidth=b.flash>0?2:1;ctx.beginPath();ctx.arc(b.x+32-cx,b.y+24,b.flash>0?28+(24-b.flash)*1.2:25+Math.sin(simF*.12)*2,0,Math.PI*2);ctx.stroke();}
 if(b.active&&!b.defeated){
  if(b.state==='warn'&&b.phase>=2){ctx.strokeStyle='#f1b9dd';ctx.lineWidth=.7;ctx.setLineDash([3,4]);const a=Math.atan2(b.targetY-b.y-40,b.target-b.x-32);for(const d of [-.25,0,.25]){ctx.beginPath();ctx.moveTo(b.x+32-cx,b.y+40);ctx.lineTo(b.x+32-cx+Math.cos(a+d)*220,b.y+40+Math.sin(a+d)*220);ctx.stroke();}ctx.setLineDash([]);}
  if(['warn','attack'].includes(b.state)){const y=b.cycle%2===0?96:146;ctx.fillStyle=b.state==='attack'?'rgba(255,120,80,.7)':'rgba(255,205,110,.3)';if(b.phase!==2)ctx.fillRect(b.x0+16-cx,y,288,8);if(b.phase===3)ctx.fillRect(b.target-10-cx,20,20,140);}
  for(const s of b.shots){circ(ctx,s.x-cx,s.y,4,'#ff9ad5');circ(ctx,s.x-cx-1,s.y-1,1,'#ffffff');}
 }
}
function campaignClock(){return campaign?.trials.find(t=>!t.solved&&t.kind==='timed'&&t.until>0)||null;}
function drawCampaignHUD(){
 if(!campaign)return;
 const clock=campaignClock();if(clock){const seconds=Math.max(0,Math.ceil((clock.until-simF)/60)),col=seconds<=3?'#ffbe79':'#ffe4a1';rrect(ctx,271,18,46,12,2,'#101927',col);text('RELOJ '+seconds+'s',294,20.4,col,1,'center');}
 if(campaign.prompt&&!msg?.t){const y=IS_TOUCH?32:174;rrect(ctx,70,y,180,12,2,'rgba(8,12,25,.88)');text(campaign.prompt,W/2,y+3,'#ffe4a1',1,'center');}
 const t=campaign.trials.find(t=>!t.solved&&player.x>=t.x0&&player.x<=t.gateX+16),service=campaignService();
 if((t||service)&&zoneName.n<=0&&!msg?.t){const line=service?(player.keys?'LA LLAVE ABRE LA COMPUERTA':service.title):t.kind==='sequence'?'ORDEN: '+t.order.join(' > '):t.kind==='timed'?(t.until?'TIEMPO '+Math.max(0,Math.ceil((t.until-simF)/60))+'s':'ACTIVA '+t.order.join(' > ')+' Y CRUZA'):t.kind==='weight'?'LLEVA EL CONTRAPESO AL HUECO':t.kind==='charge'?'ATRÁELO SOBRE LOS SELLOS':'ORIENTA LA LUZ AL RECEPTOR';rrect(ctx,54,18,212,11,2,'rgba(8,12,25,.8)');text(line,W/2,20,'#e2d8b3',1,'center');}
 const b=campaign.final;if(b?.active&&!b.defeated){rrect(ctx,64,18,192,17,3,'#170f28','#aa5c9b');text('CORAZÓN DEL BARÓN · '+b.phase+'/3',160,20,'#f4b3d7',1,'center');for(let i=0;i<6;i++){ctx.fillStyle=i<b.hp?'#f48cab':'#483343';ctx.fillRect(130+i*10,29,8,3);}if(b.state==='open')text('¡NÚCLEO ABIERTO: SALTA ENCIMA!',160,39,'#80f0dc',1,'center');}
}
function campaignService(){
 if(!campaign)return null;
 for(let i=0;i<L.def.segs.length;i++){const s=L.def.segs[i].service,z=L.zones[i];if(s&&player.x>=z.x0+s.start*16&&player.x<=z.x0+s.door*16+16&&tileAt(z.x0/16+s.door,9)==='D')return s;}
 return null;
}
function campaignLesson(t){
 if(t.relay||t.dualLight||(t.kind==='timed'&&t.bridges))return t.hint;
 const base={charge:'Provoca la carga desde el lado del sello y salta para esquivarla. El guardián vuelve a su pedestal tras fallar.',weight:'Abajo toma el contrapeso. Caminarás más lento: usa cada apoyo. Abajo lo encaja en el hueco; en su base lo devuelve.',sequence:'Activa con Abajo las runas en este orden: '+(t.order||[]).join(' > ')+'. Si te equivocas, vuelve a empezar sin perder energía.',timed:'Abajo activa los pulsadores '+(t.order||[]).join(' > ')+'. Alcanza la puerta en '+Math.round((t.duration||0)/60)+' segundos. Si falla, vuelve al primero.',mirror:'Abajo gira el espejo cercano. Conserva los que ya guían bien la luz. Sigue el rayo desde L hasta R; la orientación se conserva al alejarte.'};
 return (t.hint?t.hint+' ':'')+(base[t.kind]||'')+(lvl===4&&t.part===1?' También puedes pisar los escarabajos desde arriba para eliminarlos; esquivarlos sigue siendo una alternativa.':'');
}
function campaignHint(){
 if(!campaign)return null;
 const z=zoneAt(player.x+5),service=campaignService(),t=campaign.trials.find(t=>!t.solved&&player.x>=t.x0&&player.x<=t.gateX+16);
 if(campaign.final?.active)return {id:'heart',title:'EL CORAZÓN DEL BARÓN',steps:['Observa el aviso antes de cada ataque y busca cuándo cambia el núcleo. Abajo + Salto permite bajar de una plataforma.','Las líneas anuncian dónde atacará. Cambia de altura ante el barrido; deja atrás la posición marcada. El núcleo abierto admite un golpe desde arriba.','Espera en los apoyos laterales, abandona las marcas durante el aviso y baja de plataforma si hace falta. Cuando el núcleo se abra, salta encima y repite. La última fase combina barrido y proyectiles.']};
 if(service)return {id:'service-'+z.part,title:service.title,steps:['La compuerta necesita una llave. Mira los balcones y los apoyos que permiten regresar.','Busca la llave por encima del camino principal. Puedes explorar y volver antes de intentar cruzar la compuerta.',service.hint]};
 if(t){
  const first={charge:'Los sellos reaccionan al impacto del guardián. Observa desde qué lado llega y usa las columnas como refugio.',weight:'Un contrapeso modifica la balanza. Abajo lo toma o lo encaja; al llevarlo caminarás más lento.',sequence:'El orden está escrito sobre la cámara. Observa las alturas de las runas antes de activarlas con Abajo.',timed:'El reloj empieza con el primer pulsador. Puedes reconocer el recorrido antes de activarlo con Abajo.',mirror:'Sigue el recorrido visible de la luz. Abajo gira el espejo cercano; algunos ya apuntan en la dirección correcta.'};
  const second={charge:'Colócate al otro lado del sello respecto al guardián. Cuando anuncie la carga, salta o usa el refugio y deja que su cuerpo alcance el sello.',weight:'Busca una escalera de apoyos antes de recoger el peso. Puedes devolverlo a su base si necesitas explorar sin carga.',sequence:'Recuerda el camino entre las runas del orden indicado. Una runa incorrecta reinicia la secuencia, pero puedes volver a intentarlo.',timed:'Identifica dónde debes cambiar de dirección o altura. El último pulsador abre la puerta; también debes cruzarla antes de que termine el tiempo.',mirror:'Parte de L y revisa cada cambio de dirección hasta R. Conserva los espejos que ya conectan correctamente el siguiente tramo.'};
  if(t.relay){first.weight='Hay dos balanzas y un solo peso. Los apoyos con línea discontinua cambian con el mecanismo. Abajo permite tomar, depositar y recuperar el peso.';second.weight='La balanza baja mantiene la escalera desplegada mientras tiene peso. Busca cómo fijarla antes de recuperar ese peso para la balanza superior.';}
  if(t.bridges&&t.kind==='timed'){first.timed+=' Mira también los apoyos discontinuos.';second.timed='Cada pulsador cambia las pasarelas. El segundo retira un apoyo bajo y abre otro alto. Si el reloj caduca, el suelo permite regresar al primero.';}
  if(t.dualLight){first.mirror='Un solo haz y dos receptores: R alimenta la pasarela y S abre la salida. Observa también el prisma E. Abajo gira los mecanismos.';second.mirror='Conecta primero R para fijar la pasarela. Luego usa el prisma E para desviar el mismo haz hacia S; la energía de R queda almacenada.';}
  return {id:'trial-'+t.id,title:t.name,steps:[first[t.kind],second[t.kind],campaignLesson(t)]};
 }
 return {id:'part-'+z.part,title:z.label,steps:['Observa los avisos de los peligros y los apoyos antes de avanzar. P pausa el juego; Abajo + Salto permite bajar de una plataforma.','Alterna avance y refugio. Las plataformas móviles permiten preparar el salto; las frágiles avisan antes de caer. Los enchufes recargan al tocarlos.',z.lesson||'Sigue los apoyos hacia la derecha. Explora las alturas para encontrar llaves o mecanismos y regresa a la ruta principal.']};
}
function requestCampaignHint(){if(state!=='pause'||!campaign)return;const h=campaignHint();campaign.hints[h.id]=Math.min(2,(campaign.hints[h.id]||0)+1);syncCampaignHelp();}
function syncCampaignHelp(){
 const panel=document.getElementById('campaignHelp');if(!panel)return;panel.hidden=state!=='pause'||!campaign;if(panel.hidden)return;
 const h=campaignHint(),stage=campaign.hints[h.id]||0;
 const key=lvl+':'+h.id+':'+stage;if(panel.hintKey===key)return;panel.hintKey=key;
 document.getElementById('helpTitle').textContent=h.title;
 document.getElementById('helpStage').textContent=['OBSERVA · 1/3','PISTA · 2/3','SOLUCIÓN · 3/3'][stage];
 document.getElementById('helpText').textContent=h.steps[stage];
 const more=document.getElementById('hintMore');more.disabled=stage===2;more.textContent=stage===0?'Dame una pista · H':stage===1?'Ver solución · H':'Solución mostrada';
}
// The native HTML panel keeps the same readable font and real buttons in both
// orientations, independently of the pixel canvas and its letterbox scaling.
function drawCampaignPortraitPause(){
 if(!campaign)return false;
 ctx.fillStyle='rgba(2,4,12,.85)';ctx.fillRect(0,-vOff,W,VH);
 return true;
}
