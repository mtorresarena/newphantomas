#!/usr/bin/env node
// Verificador de niveles de Phantomas.
// Carga index.html en un sandbox con stubs de canvas/DOM y explora por busqueda
// en anchura todas las posiciones "de pie" que el jugador puede alcanzar usando
// el motor de fisicas REAL del juego (updatePlayer + plataformas moviles).
// 1) Alcanzabilidad: llaves, sacos, pilas, ajos, metas y puertas.
// 2) Heuristicas de justicia (avisos): enemigos cuyo radio cubre acido o huecos,
//    enemigos pegados a puntos de control, objetos sobre pinchos/acido.
// Uso:  node tools/check-levels.js [indice de nivel]
'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const js=html.slice(html.indexOf('<script>')+8,html.lastIndexOf('</script>'));

// ---- stubs DOM ----
const noop=()=>{};
const ctxStub=new Proxy({},{get:(t,k)=>{if(k==='createLinearGradient'||k==='createRadialGradient')return()=>({addColorStop:noop});if(k==='measureText')return()=>({width:0});return noop;},set:()=>true});
const mkCanvas=()=>({width:0,height:0,style:{},getContext:()=>ctxStub,addEventListener:noop});
const el=()=>({addEventListener:noop,classList:{add:noop},style:{}});
const sandbox={console,Math,setInterval:()=>0,clearInterval:noop,setTimeout:()=>0,clearTimeout:noop,matchMedia:()=>({matches:false}),performance:{now:()=>Date.now()},requestAnimationFrame:noop,innerWidth:1280,innerHeight:720,
 addEventListener:noop,navigator:{},localStorage:{getItem:()=>null,setItem:noop},
 document:{getElementById:id=>id==='c'?mkCanvas():el(),createElement:mkCanvas,body:{classList:{add:noop}},hidden:false,addEventListener:noop,documentElement:{}},Proxy};
sandbox.window=sandbox;
let api=null;sandbox.__PHANTOMAS_TEST__=a=>{api=a;};
vm.createContext(sandbox);vm.runInContext(js,sandbox,{filename:'index.html'});
if(!api)throw new Error('El juego no expuso la API de test');

const {LEVELS,TS,ROWS,tileAt,isSolid,loadLevel,newGame,updatePlayer,updateMovers,keys,startLevel}=api;
const only=process.argv[2]!==undefined?parseInt(process.argv[2],10):null;
const STEP=4; // resolucion horizontal de estados (px)

function standingValid(x,r){ // jugador de 10x18 con los pies en la fila r
 const p={x,y:r*TS-18,w:10,h:18};
 for(let rr=Math.floor(p.y/TS);rr<=Math.floor((p.y+p.h-1)/TS);rr++)for(let c=Math.floor(p.x/TS);c<=Math.floor((p.x+p.w-1)/TS);c++)if(isSolid(tileAt(c,rr)))return false;
 let sup=false;for(let c=Math.floor(p.x/TS);c<=Math.floor((p.x+p.w-1)/TS);c++){const ch=tileAt(c,r);if(isSolid(ch)||ch==='='||ch==='_')sup=true;}
 return sup;}

// acciones: [teclas, frames maximos, frame en que se suelta el salto]
const ACTIONS=[
 [{ArrowRight:1,Space:1},110],[{ArrowLeft:1,Space:1},110],
 [{ArrowRight:1,Space:1},110,8],[{ArrowLeft:1,Space:1},110,8],
 [{Space:1},110],
 [{ArrowRight:1},14],[{ArrowLeft:1},14],
 [{ArrowRight:1},60],[{ArrowLeft:1},60],
 [{ArrowDown:1,Space:1},40],
 [{},200],                                   // esperar (plataformas moviles)
];

function checkLevel(i){
 newGame();if(i>0)loadLevel(i);startLevel();
 const L=api.L,p=api.player,def=LEVELS[i];
 const wanted=api.items.filter(it=>'k$bjS'.includes(it.t)).map(it=>({t:it.t,x:it.x,y:it.y,w:it.w,h:it.h,col:Math.floor((it.x+it.w/2)/TS),row:Math.floor((it.y+it.h/2)/TS)}));
 if(def.boss&&api.boss){api.boss.conductors.forEach((c,idx)=>wanted.push({t:'boss_c',x:c.x,y:c.y,w:c.w,h:c.h,col:Math.floor((c.x+c.w/2)/TS),row:Math.floor((c.y+c.h/2)/TS),id:idx}));}
 const entsSaved=api.ents.slice();api.ents=[]; // sin enemigos: solo geometria (las plataformas moviles siguen)
 const doorsAll=[];for(let r=0;r<ROWS;r++)for(let c=0;c<L.cols;c++)if(L.map[r][c]==='D')doorsAll.push(c+','+r);
 const start={x:p.x,r:Math.round((p.y+p.h)/TS)};
 const seen=new Map();let goalReached=false,goalFrames=Infinity,detour=0;const hit=new Set(),hitF=new Map();
 function key(x,r){return Math.round(x/STEP)+','+r;}
 function simulate(sx,r,act,f0=0){
  p.x=sx;p.y=r*TS-18;p.vx=0;p.vy=0;p.onGround=true;p.inv=0;p.dead=0;p.jHeld=false;p.jbuf=0;p.coyote=0;p.drop=0;p.energy=100;p.mover=null;
  const [kd,maxF,release]=act;
  let f=0;try{for(;f<maxF;f++){Object.keys(keys).forEach(k=>keys[k]=false);Object.assign(keys,(release&&f>=release)?Object.fromEntries(Object.entries(kd).filter(([k])=>k!=='Space')):kd);
   p.energy=100;p.inv=0;api.stats.dawn=999;api.simF=api.simF+1;updateMovers();if(api.updateCrumbles)api.updateCrumbles();updatePlayer();
   for(const w of wanted){if(!hit.has(w)&&p.x<w.x+w.w&&p.x+p.w>w.x&&p.y<w.y+w.h&&p.y+p.h>w.y){hit.add(w);hitF.set(w,f0+f+1);}}
   if(api.state!=='play'){api.setState('play');goalReached=true;goalFrames=Math.min(goalFrames,f0+f+1);return null;}
   if(p.dead){p.dead=0;p.lives=3;return null;}
   if(f>2&&p.onGround&&!p.mover){return {x:p.x,r:Math.round((p.y+p.h)/TS),f:f0+f+1};}
   if(f>2&&p.onGround&&p.mover&&(f%10===0)){return {x:p.x,r:Math.round((p.y+p.h)/TS),onMover:true,f:f0+f+1};}
  }}finally{api.parts.length=0;}
  return null;}
 // Las puertas se abren solo cuando el BFS ha alcanzado mas llaves que puertas abiertas (orden real llave -> puerta)
 const doorColsAll=[...new Set(doorsAll.map(d=>+d.split(',')[0]))].sort((a,b)=>a-b);
 let passes=0,prevGot=-1,bossGateOpened=false;
 while(true){passes++;
  const q=[{...start,f:0}];seen.clear();seen.set(key(start.x,start.r),0);
  while(q.length){const s=q.shift();
   for(const act of ACTIONS){p.keys=0;const n=simulate(s.x,s.r,act,s.f||0);if(n&&n.r>=1&&n.r<=ROWS){const k=key(n.x,n.r);if(!seen.has(k)&&(n.onMover||standingValid(n.x,n.r))){seen.set(k,n.f);q.push(n);}}}}
  const closed=doorColsAll.filter(dc=>{for(let r=0;r<ROWS;r++)if(L.map[r][dc]==='D')return true;return false;});
  const keysHit=[...hit].filter(w=>w.t==='k').length,opened=doorColsAll.length-closed.length;
  if(keysHit>opened&&closed.length){const dc=closed[0];for(let r=0;r<ROWS;r++)if(L.map[r][dc]==='D')L.map[r][dc]='.';
   const kf=[...hit].filter(w=>w.t==='k').map(w=>hitF.get(w)||0);detour+=Math.max(0,...kf);continue;}
  if(def.boss&&api.boss&&!bossGateOpened){
    const conductorsHit=[...hit].filter(w=>w.t==='boss_c').length;
    if(conductorsHit>=api.boss.conductors.length){
     bossGateOpened=true;
     // Geometry pass abstracts combat AFTER reaching every conductor.
     // The separate boss test validates attacks, conductor hits and actual defeat.
     api.boss.defeated=true;api.boss.active=false;api.boss.gateRight=true;
     const cOut=Math.floor(api.boss.x1/TS)-1;
     L.map[8][cOut]='.';L.map[9][cOut]='.';
     continue;
    }
   }
  if(hit.size===prevGot)break;prevGot=hit.size;if(passes>10)break;}
 const missing=wanted.filter(w=>!hit.has(w)&&w.t!=='boss_c');
 const bossMissing=wanted.filter(w=>!hit.has(w)&&w.t==='boss_c');
 const warns=[];
 for(const bm of bossMissing)warns.push(`conductor de jefe inalcanzable en col ${bm.col} fila ${bm.row}`);
 const doorsLeft=doorsAll.filter(d=>{const [c,r]=d.split(',').map(Number);return L.map[r][c]==='D';});
 const keysN=wanted.filter(w=>w.t==='k').length,doorsN=new Set(doorsAll.map(d=>d.split(',')[0])).size;
 // ---- heuristicas de justicia ----
 const colDanger=c=>{const b=tileAt(c,10),b2=tileAt(c,11);return b==='~'||(b==='.'&&b2==='.');};
 const dangerIn=(x0,x1)=>{for(let c=Math.floor(x0/TS);c<=Math.floor(x1/TS);c++)if(c>=0&&c<L.cols&&colDanger(c))return c;return -1;};
 const cps=api.items.filter(it=>it.t==='C').map(it=>it.x).concat([start.x]);
 for(const e of entsSaved){const col=Math.floor(e.x/TS);
  if(e.t==='m'){ // peligroso solo si desde el borde del hueco (o una plataforma movil sobre el) un salto alcanza al murcielago
   for(let c=Math.floor((e.sx-60)/TS);c<=Math.floor((e.sx+72)/TS);c++){if(c<0||c>=L.cols||!colDanger(c))continue;let reach=false;
    for(let cc=c-1;cc<=c+1;cc++)for(let r=3;r<=10;r++){const ch=tileAt(cc,r);if((isSolid(ch)||ch==='=')&&!isSolid(tileAt(cc,r-1))&&r*TS<=e.sy+96)reach=true;}
    for(const m of api.movers)if(m.sx-m.rx<=(c+1)*TS&&m.sx+m.rx+m.w>=c*TS&&(m.sy-m.ry)<=e.sy+96)reach=true;
    if(reach){warns.push(`murcielago col ${col}: un salto junto al hueco/acido de col ${c} puede chocar con el y caer`);break;}}}
  if(e.t==='a'){const sc=Math.floor((e.sx+5)/TS);for(let cc=sc-2;cc<=sc+2;cc++)if(cc>=0&&cc<L.cols&&colDanger(cc)){warns.push(`araña col ${col} cuelga a menos de 2 columnas de un hueco/acido (col ${cc}): un choque en el salto puede tirar al jugador`);break;}}
  if(e.t==='g'||e.t==='v'){const c=dangerIn(e.sx-150,e.sx+162);if(c>=0)warns.push(`${e.t==='g'?'fantasma':'vampiro'} col ${col}: su radio de caza cubre acido/hueco en col ${c}`);}
  if('wrcug'.includes(e.t)){for(const cx of cps)if(Math.abs(e.x-cx)<56)warns.push(`enemigo '${e.t}' col ${col} a menos de 56 px de un punto de control/inicio`);}
  if(e.t==='g'||e.t==='v'){const rng=e.t==='v'?api.CFG.VAMP_RANGE:api.CFG.GHOST_RANGE;for(const cx of cps)if(Math.hypot(e.x-cx,e.y-142)<rng)warns.push(`${e.t==='g'?'fantasma':'vampiro'} col ${col} se activa nada mas reaparecer en un punto de control`);}
  if(e.t==='c'){for(let cc=Math.floor((e.sx-84)/TS);cc<=Math.floor((e.sx+94)/TS);cc++)if(cc>=0&&cc<L.cols&&tileAt(cc,9)==='^'){warns.push(`calavera col ${col} bota sobre pinchos en col ${cc}`);break;}}
  const onFloor=Math.floor((e.y+e.h)/TS)>=10;
  if((e.t==='w'||e.t==='u')&&onFloor){for(let cc=Math.floor((e.x-48)/TS);cc<=Math.floor((e.x+58)/TS);cc++)if(cc>=0&&cc<L.cols&&tileAt(cc,9)==='^'){warns.push(`enemigo '${e.t}' col ${col} nace a menos de 48 px de pinchos (col ${cc})`);break;}}
  if(e.t==='n'){const by0=e.y+3,by1=e.y+11;for(const cx of cps){const inLine=(e.dir>0?cx>e.x:cx<e.x)&&Math.abs(cx-e.x)<api.CFG.CANNON_RANGE;if(inLine&&by1>142&&by0<160)warns.push(`cañon col ${col} dispara a la altura del jugador de pie en el punto de control x=${cx}`);}}
  if((e.t==='w'||e.t==='r'||e.t==='u'||e.t==='c')&&onFloor&&colDanger(Math.floor((e.x+5)/TS)))warns.push(`enemigo '${e.t}' col ${col} nace sobre acido/hueco`);}
 for(const w of wanted){if(w.t==='S')continue;const below=tileAt(w.col,w.row+1);if(below==='^'||tileAt(w.col,w.row)==='^')warns.push(`objeto '${w.t}' col ${w.col} sobre pinchos`);}
 const doorCols=[...new Set(doorsAll.map(d=>+d.split(',')[0]))].sort((a,b)=>a-b);const keyXs=wanted.filter(w=>w.t==='k').map(w=>w.x).sort((a,b)=>a-b);
 doorCols.forEach((dc,i)=>{const before=keyXs.filter(x=>x<dc*TS).length;if(before<i+1)warns.push(`puerta col ${dc}: solo ${before} llave(s) antes de ella (hacen falta ${i+1})`);});
 const totalFrames=goalFrames<Infinity?goalFrames+detour:Infinity;
 if(def.dawn&&totalFrames<Infinity&&totalFrames/60>def.dawn*0.6)warns.push(`tiempo minimo hasta la meta (con desvios por llaves) ${(totalFrames/60).toFixed(0)} s frente a un amanecer de ${def.dawn} s (margen escaso)`);
 return {name:def.name,states:seen.size,passes,missing,goalReached,goalFrames:totalFrames,doorsLeft,keysN,doorsN,bags:wanted.filter(w=>w.t==='$').length,cols:L.cols,warns};}

// ---- pruebas de motor (regresiones detectadas en revisiones) ----
function engineTests(){const out=[];
 // A) gracia de amanecer tras cualquier muerte
 {const li=LEVELS.findIndex(l=>l.dawn);if(li>=0){newGame();loadLevel(li);startLevel();api.ents=[];const p=api.player;api.stats.dawn=2;p.energy=0.0001;p.lives=3;
  for(let f=0;f<100;f++){/* morir por energia y esperar la reaparicion */Object.keys(keys).forEach(k=>keys[k]=false);updateMovers();updatePlayer();}
  let ok=api.stats.dawn>=api.CFG.DAWN_GRACE-1&&p.lives===2;out.push([ok,`gracia de amanecer tras morir: dawn=${api.stats.dawn.toFixed(1)} vidas=${p.lives}`]);}}
 // B) plataforma vertical: el jugador permanece de pie 700 frames
 {let found=null;for(let li=0;li<LEVELS.length&&!found;li++){newGame();if(li>0)loadLevel(li);startLevel();const m=api.movers.find(m=>m.t==='v');if(m)found={li,m};}
  if(found){const {m}=found;api.ents=[];const p=api.player;p.x=m.sx+8;p.y=m.y-p.h;p.vy=0;let off=0;
   for(let f=0;f<700;f++){Object.keys(keys).forEach(k=>keys[k]=false);api.simF=api.simF+1;updateMovers();p.energy=100;api.stats.dawn=999;updatePlayer();if(f>5&&!(p.onGround&&p.mover))off++;}
   out.push([off===0,`ascensor: frames sin apoyo en 700 = ${off}`]);}
  else out.push([true,'ascensor: no hay plataformas verticales que probar']);}
 // C) plataforma horizontal: arrastre sin perder el apoyo
 {let found=null;for(let li=0;li<LEVELS.length&&!found;li++){newGame();if(li>0)loadLevel(li);startLevel();const m=api.movers.find(m=>m.t==='h');if(m)found={li,m};}
  if(found){const {m}=found;api.ents=[];const p=api.player;p.x=m.x+16;p.y=m.y-p.h;p.vy=0;let off=0;
   for(let f=0;f<700;f++){Object.keys(keys).forEach(k=>keys[k]=false);api.simF=api.simF+1;updateMovers();p.energy=100;api.stats.dawn=999;updatePlayer();if(f>5&&!(p.onGround&&p.mover))off++;}
   out.push([off===0,`puente movil: frames sin apoyo en 700 = ${off}`]);}}
 // D) de pie sobre plataforma '=' y sobre suelo solido: onGround en todos los frames y altura constante
 {newGame();startLevel();api.ents=[];const p=api.player;const L=api.L;let plat=null,sol=null;
  for(let r=2;r<ROWS&&!(plat&&sol);r++)for(let c=1;c<L.cols&&!(plat&&sol);c++){const ch=L.map[r][c];const free=L.map[r-1][c]==='.'&&L.map[r-2][c]==='.';if(!plat&&ch==='='&&free)plat={c,r};if(!sol&&isSolid(ch)&&free)sol={c,r};}
  for(const [name,t] of [['plataforma =',plat],['suelo solido',sol]]){if(!t){out.push([true,name+': no encontrado']);continue;}p.x=t.c*TS+3;p.y=t.r*TS-18;p.vx=0;p.vy=0;p.onGround=true;p.mover=null;let off=0,y0=p.y,dy=0;
   for(let f=0;f<120;f++){Object.keys(keys).forEach(k=>keys[k]=false);p.energy=100;api.stats.dawn=999;updateMovers();updatePlayer();if(!p.onGround)off++;dy=Math.max(dy,Math.abs(p.y-y0));}
   out.push([off===0&&dy<0.01,`quieto sobre ${name}: frames sin apoyo=${off}, desvio vertical=${dy.toFixed(2)} px`]);}}
 // E) guardias, momias y ratas no cambian de fila en 300 frames
 {const bad=[];for(let li=0;li<LEVELS.length;li++){newGame();if(li>0)loadLevel(li);startLevel();const p=api.player;p.x=-999;p.y=-999;const ground=api.ents.filter(e=>'wur'.includes(e.t));const rows=ground.map(e=>Math.floor((e.y+e.h)/TS));
   for(let f=0;f<300;f++){api.simF=api.simF+1;updateMovers();api.updateEnts();}
   ground.forEach((e,i)=>{const r=Math.floor((e.y+e.h)/TS);if(r!==rows[i])bad.push(`nivel ${li+1} '${e.t}' col ${Math.floor(e.sx/TS)}: fila ${rows[i]}->${r}`);});}
  out.push([bad.length===0,'enemigos terrestres mantienen su fila'+(bad.length?': '+bad.join('; '):'')]);}
 // F) tope exacto contra un muro por la derecha y por la izquierda
 {newGame();startLevel();api.ents=[];const p=api.player;const L=api.L;let wall=null;
  for(let c=2;c<L.cols-1&&!wall;c++){if(isSolid(L.map[9][c])&&L.map[9][c-1]==='.'&&L.map[9][c-2]==='.'&&L.map[8][c-1]==='.'&&L.map[8][c-2]==='.'&&isSolid(L.map[10][c-1]))wall=c;}
  if(wall){p.x=wall*TS-30;p.y=10*TS-18;p.vx=0;p.vy=0;let inside=0,maxR=0;for(let f=0;f<60;f++){Object.keys(keys).forEach(k=>keys[k]=false);keys.ArrowRight=true;p.energy=100;api.stats.dawn=999;updateMovers();updatePlayer();maxR=Math.max(maxR,p.x+p.w);if(p.x+p.w>wall*TS+1e-6)inside++;}
   out.push([inside===0&&Math.abs(maxR-wall*TS)<1e-6,`tope exacto contra muro: penetracion=${(maxR-wall*TS).toFixed(3)} px, frames dentro=${inside}`]);}
  else out.push([true,'tope contra muro: no hay muro de prueba']);}
 // G) las plataformas moviles no dan un salto brusco al empezar el nivel
 {let worst=0;for(let li=0;li<LEVELS.length;li++){newGame();if(li>0)loadLevel(li);startLevel();for(const m of api.movers){const x0=m.x,y0=m.y;api.simF=api.simF+1;updateMovers();worst=Math.max(worst,Math.hypot(m.x-x0,m.y-y0));}}
  out.push([worst<2,`desplazamiento de plataformas moviles en el primer frame: ${worst.toFixed(2)} px`]);}
 // H) reaparecer en cada punto de control con los enemigos activos: 60 frames sin daño
 {const bad=[];for(let li=0;li<LEVELS.length;li++){newGame();if(li>0)loadLevel(li);startLevel();const p=api.player;const cps=api.items.filter(it=>it.t==='C').map(it=>({x:it.x,y:it.y+14})).concat([{x:p.x,y:p.y}]);
   // como en respawn(): 120 frames de invulnerabilidad; quieto 150 frames; falla si muere o recibe dos golpes
   for(const cp of cps){p.x=cp.x;p.y=cp.y;p.vx=0;p.vy=0;p.energy=100;p.inv=120;p.dead=0;p.stun=0;p.mover=null;api.ents.forEach(e=>{if(e.t==='g'||e.t==='v'){e.active=false;e.x=e.sx;e.y=e.sy;}});
    for(let f=0;f<150;f++){Object.keys(keys).forEach(k=>keys[k]=false);api.stats.dawn=999;api.simF=api.simF+1;updateMovers();updatePlayer();api.updateEnts();if(p.dead)break;}
    if(p.dead||p.energy<70)bad.push(`nivel ${li+1} punto de control x=${cp.x}: energia ${p.energy.toFixed(1)}${p.dead?' MUERTO':''}`);}}
  out.push([bad.length===0,'reaparicion segura (2 s de invulnerabilidad, 150 frames quieto) en todos los puntos de control'+(bad.length?': '+bad.join('; '):'')]);}
 // I) puerta: sin llave bloquea; con llave se abre entera y consume la llave
 {newGame();startLevel();api.ents=[];const p=api.player;const L=api.L;let dc=-1,dr=-1;for(let c=0;c<L.cols&&dc<0;c++)for(let r=0;r<ROWS;r++)if(L.map[r][c]==='D'){dc=c;dr=r;}
  if(dc>=0){const run=(k)=>{p.x=dc*TS-40;p.y=(dr+1)*TS-18;while(!isSolid(api.tileAt(Math.floor(p.x/TS),Math.floor((p.y+p.h)/TS))))p.y+=TS;p.vx=0;p.vy=0;p.keys=k;p.energy=100;p.inv=0;for(let f=0;f<80;f++){Object.keys(keys).forEach(x=>keys[x]=false);keys.ArrowRight=true;api.stats.dawn=999;updateMovers();updatePlayer();}return {open:!L.map.some(row=>row[dc]==='D'),keys:p.keys,x:p.x+p.w};};
   const a=run(0);const b=run(1);out.push([!a.open&&a.x<=dc*TS+1e-6&&b.open&&b.keys===0,`puerta col ${dc}: sin llave cerrada=${!a.open} (tope ${(a.x-dc*TS).toFixed(2)}), con llave abierta=${b.open} llaves restantes=${b.keys}`]);}
  else out.push([true,'puerta: no hay puertas que probar']);}
 // J) el acido mata; K) la bala de cañon hiere
 {newGame();startLevel();api.ents=[];const p=api.player;const L=api.L;let ac=-1;for(let c=0;c<L.cols&&ac<0;c++)if(L.map[10][c]==='~')ac=c;
  if(ac>=0){p.x=ac*TS+3;p.y=6*TS;p.vx=0;p.vy=0;p.energy=100;p.inv=0;p.dead=0;let died=false;for(let f=0;f<80;f++){Object.keys(keys).forEach(x=>keys[x]=false);api.stats.dawn=999;updateMovers();updatePlayer();if(p.dead){died=true;break;}}out.push([died,'el acido quita una vida al caer en el']);}
  else out.push([true,'acido: no hay charcas que probar']);
  newGame();startLevel();api.ents=[];const q=api.player;q.energy=100;q.inv=0;const e0=q.energy;api.ents.push({t:'n',x:-999,y:-999,w:16,h:12,dir:1,cd:9999});
  // simular una bola encima del jugador a traves de la API real de balas: creamos un cañon y forzamos su disparo junto al jugador
  const cannon=api.ents[api.ents.length-1];cannon.x=q.x-20;cannon.y=q.y+3;cannon.cd=1;for(let f=0;f<40;f++){Object.keys(keys).forEach(x=>keys[x]=false);api.stats.dawn=999;api.simF=api.simF+1;updateMovers();updatePlayer();api.updateEnts();}
  out.push([e0-q.energy>=api.CFG.DMG_HIT-1,`la bala de cañon hiere: energia ${e0.toFixed(0)} -> ${q.energy.toFixed(1)}`]);}
 // L) placa de alarma: saltarla no la activa, pisarla si, y expira sola
 {let found=null;for(let li=0;li<LEVELS.length&&!found;li++){newGame();if(li>0)loadLevel(li);startLevel();const it=api.items.find(i=>i.t==='@');if(it)found={li,it};}
  if(found){const {it}=found;api.ents=[];const p=api.player;const run=(x0,jump)=>{p.x=x0;p.y=10*TS-18;p.vx=0;p.vy=0;p.onGround=true;p.jHeld=false;p.jbuf=0;p.energy=100;p.inv=0;api.alarmT=0;
    for(let f=0;f<60;f++){Object.keys(keys).forEach(k=>keys[k]=false);keys.ArrowRight=true;if(jump&&f<12)keys.Space=true;api.stats.dawn=999;api.simF=api.simF+1;updateMovers();updatePlayer();}return api.alarmT;};
   const over=run(it.x-44,true),step=run(it.x-30,false);let exp=api.alarmT;api.alarmT=5;for(let f=0;f<10;f++){Object.keys(keys).forEach(k=>keys[k]=false);p.x=-500;api.stats.dawn=999;updateMovers();updatePlayer();}exp=api.alarmT;
   out.push([over===0&&step>0&&exp===0,`placa de alarma: saltandola no se activa=${over===0}, pisandola se activa=${step>0}, expira sola=${exp===0}`]);}
  else out.push([true,'alarma: no hay placas que probar']);}
 // M) los patrulleros no salen de su sala ni pisan pinchos en 60 s
 {const bad=[];for(let li=0;li<LEVELS.length;li++){newGame();if(li>0)loadLevel(li);startLevel();const p=api.player;p.x=-9999;p.y=-9999;
   const pat=api.ents.filter(e=>'wruc'.includes(e.t));const home=pat.map(e=>e.zone);
   for(let f=0;f<3600;f++){api.simF=api.simF+1;updateMovers();api.updateEnts();
    if(f%15===0)pat.forEach((e,i)=>{const cx=e.x+e.w/2;if(home[i]&&(cx<home[i].x0||cx>=home[i].x1))bad.push(`nivel ${li+1} '${e.t}' col ${Math.floor(e.sx/TS)} salio de su sala`);
     const cc=Math.floor(cx/TS),rr=Math.floor((e.y+e.h-1)/TS);if(tileAt(cc,rr)==='^'||tileAt(cc,rr+1)==='^')bad.push(`nivel ${li+1} '${e.t}' col ${Math.floor(e.sx/TS)} pisa pinchos en col ${cc}`);});}}
  const uniq=[...new Set(bad)];out.push([uniq.length===0,'patrulleros dentro de su sala y fuera de los pinchos'+(uniq.length?': '+uniq.slice(0,4).join('; ')+(uniq.length>4?` (+${uniq.length-4})`:''):'')]);}
  // N) encuentro con El Custodio del Diamante (jefe de N4): arena, telegrafiado, 3 conductores, derrota y reaparicion segura
  {newGame();loadLevel(3);startLevel();
   const b=api.boss, p=api.player;
   let ok=b&&!b.active&&!b.defeated&&b.hp===3&&b.gateLeft&&!b.gateRight;
   // 1. Entrar en la arena
   p.x=b.x0+32;p.y=160-18;p.vx=0;p.vy=0;
   for(let f=0;f<5;f++){api.simF++;api.updateBoss();}
   ok=ok&&b.active&&b.state==='intro'&&!b.gateLeft;
   // 2. Esperar a fase aim
   for(let f=0;f<100;f++){api.simF++;api.updateBoss();if(b.state==='aim')break;}
   ok=ok&&b.state==='aim';
   // 3. Situar al jugador para que el rayo impacte en conductor 0 (suelo)
   p.x=b.conductors[0].x+4;p.y=160-18;
   for(let f=0;f<120;f++){api.simF++;api.updateBoss();if(b.conductors[0].charged)break;}
   ok=ok&&b.conductors[0].charged&&b.hp===2;
   // 4. Conductor 1 (plataforma izquierda)
   for(let f=0;f<120;f++){api.simF++;api.updateBoss();if(b.state==='aim')break;}
   p.x=b.conductors[1].x+4;p.y=112-18;
   for(let f=0;f<120;f++){api.simF++;api.updateBoss();if(b.conductors[1].charged)break;}
   ok=ok&&b.conductors[1].charged&&b.hp===1;
   // 5. Conductor 2 (plataforma derecha)
   for(let f=0;f<180;f++){api.simF++;api.updateBoss();if(b.state==='aim')break;}
   p.x=b.conductors[2].x+4;p.y=112-18;
   for(let f=0;f<120;f++){api.simF++;api.updateBoss();if(b.conductors[2].charged)break;}
   ok=ok&&b.conductors[2].charged&&b.hp===0;
   // 6. Esperar apertura de salida tras derrota
   for(let f=0;f<150;f++){api.simF++;api.updateBoss();if(b.defeated)break;}
   const cOut=Math.floor(b.x1/TS)-1;
   ok=ok&&b.defeated&&b.gateRight&&api.L.map[8][cOut]==='.';
   // 7. Reintento seguro al morir en la arena
   newGame();loadLevel(3);startLevel();
   const b2=api.boss;api.player.x=b2.x0+32;api.player.y=160-18;
   for(let f=0;f<5;f++){api.simF++;api.updateBoss();}
   api.player.energy=0.001;api.updatePlayer();
   for(let f=0;f<120;f++){api.simF++;api.updatePlayer();if(api.player.dead===0)break;}
   ok=ok&&!b2.active&&b2.hp===3&&b2.gateLeft;
   out.push([ok,'encuentro con El Custodio: arena, telegrafiado, 3 conductores, derrota, apertura de salida y reinicio seguro']);}
   // O) Centinela de piedra: aviso telegrafiado, carga horizontal recta, choque contra muro, recuperacion inocua
   {newGame();loadLevel(0);startLevel();api.ents=[];
    const p=api.player;p.x=60;p.y=160-18;p.energy=100;p.inv=0;
    const sent={t:'K',x:140,y:160-24,w:18,h:24,sx:140,sy:160-24,dir:-1,vy:0,anim:0,state:'idle',timer:0,traveled:0,zone:api.L.zones[0]};
    api.ents.push(sent);
    // 1. Detectar al jugador en linea visual y activar aviso
    api.simF++;api.updateEnts();
    let ok=sent.state==='alert'&&sent.timer===api.CFG.SENTINEL_NOTICE;
    // 2. Transcurrir aviso sin moverse
    const xBefore=sent.x, alertTime=sent.timer;
    for(let f=0;f<alertTime;f++){api.simF++;api.updateEnts();}
    ok=ok&&sent.state==='charge'&&sent.x===xBefore;
    // 3. Cargar hacia la izquierda e impactar en el jugador
    for(let f=0;f<40;f++){api.simF++;api.updateEnts();api.updatePlayer();if(p.hurtT>0)break;}
    ok=ok&&p.energy<=100-api.CFG.DMG_HIT;
    // 4. Esperar a que entre en recuperacion
    for(let f=0;f<60;f++){api.simF++;api.updateEnts();if(sent.state==='recover')break;}
    ok=ok&&sent.state==='recover';
    // 5. Durante recuperacion es inocuo: situar al jugador encima sin recibir daño
    p.energy=100;p.inv=0;p.hurtT=0;p.x=sent.x;p.y=sent.y;
    for(let f=0;f<30;f++){api.simF++;api.updatePlayer();}
    ok=ok&&p.hurtT===0&&p.energy>95;
    out.push([ok,'centinela de piedra: aviso telegrafiado, carga recta, daño en carrera y recuperacion inocua']);}
   // P) Plataforma agrietada: pisar activa temblor, salto breve no cancela, colapso y reconstruccion segura
   {newGame();loadLevel(0);startLevel();
    const p=api.player;p.x=60;p.y=160-18;p.energy=100;
    const cr={c:4,r:10,x:64,y:160,state:'solid',timer:0,tutorial:false};
    api.crumbles.length=0;api.crumbles.push(cr);
    // 1. Colocar al jugador encima (apoyo real)
    p.x=cr.x+2;p.y=cr.y-18;p.onGround=true;p.vy=0;
    api.simF++;api.updateCrumbles();
    let ok=cr.state==='shaking'&&cr.timer===api.CFG.CRUMBLE_SHAKE;
    // 2. Saltar brevemente: la cuenta no se reinicia
    p.onGround=false;p.vy=-3;
    for(let f=0;f<15;f++){api.simF++;api.updateCrumbles();}
    ok=ok&&cr.state==='shaking'&&cr.timer===(api.CFG.CRUMBLE_SHAKE-15);
    // 3. Dejar que termine de temblar y colapse
    while(cr.state==='shaking'){api.simF++;api.updateCrumbles();}
    ok=ok&&cr.state==='gone'&&cr.timer===api.CFG.CRUMBLE_GONE;
    // 4. Esperar hasta que entre en aviso de reconstruccion
    while(cr.state==='gone'){api.simF++;api.updateCrumbles();}
    ok=ok&&cr.state==='rebuilding';
    // 5. Si el jugador esta dentro de su volumen, NO reactiva solido inmediatamente
    p.x=cr.x+2;p.y=cr.y-4; // dentro del volumen de la plataforma
    for(let f=0;f<api.CFG.CRUMBLE_WARN+10;f++){api.simF++;api.updateCrumbles();}
    ok=ok&&cr.state==='rebuilding'; // retenido para no atraparlo
    // 6. Al salir del volumen, se solidifica
    p.x=cr.x+40;p.y=160-18;
    api.simF++;api.updateCrumbles();
    ok=ok&&cr.state==='solid';
    // 7. Tras morir/respawn, vuelve a solid
    cr.state='shaking';cr.timer=20;
    p.dead=1;api.simF++;api.updatePlayer(); // activa respawn
    ok=ok&&cr.state==='solid'&&cr.timer===0;
    out.push([ok,'plataforma agrietada: activacion al pisar, vibracion, colapso y reconstruccion segura sin atrapamiento']);}
    // Q) Vigia espectral: aviso telegrafiado, fijacion previa, orbe bloqueable y recuperacion inocua
    {newGame();loadLevel(0);startLevel();
     const p=api.player;p.x=40;p.y=160-18;p.energy=100;p.inv=0;p.hurtT=0;
     const wat={t:'Y',x:160,y:130,w:14,h:16,sx:160,sy:130,dir:-1,anim:0,state:'idle',timer:0,tx:0,ty:0,ph:0,tutorial:false,zone:api.zoneAt(160)};
     api.ents.length=0;api.ents.push(wat);api.orbs.length=0;
     // 1. Con muro intermedio, no debe alertarse
     wat.state='idle';wat.timer=0;
     api.L.map[8][6]='#';api.L.map[9][6]='#'; // columna en col 6 (x=96)
     for(let f=0;f<30;f++){api.simF++;api.updateEnts();}
     let ok=wat.state==='idle';
     // 2. Al retirar el muro, entra en 'prepare'
     api.L.map[8][6]='.';api.L.map[9][6]='.';
     api.simF++;api.updateEnts();
     ok=ok&&wat.state==='prepare'&&wat.timer===api.CFG.WATCHER_PREPARE;
     // 3. Al agotarse prepare, pasa a 'lock' y fija el punto tx, ty
     while(wat.state==='prepare'){api.simF++;api.updateEnts();}
     const lockedX=wat.tx,lockedY=wat.ty;
     ok=ok&&wat.state==='lock'&&wat.timer===api.CFG.WATCHER_LOCK&&lockedX===(p.x+5)&&lockedY===(p.y+9);
     // 4. Mover al jugador durante lock: tx, ty NO cambian (telegrafiado fijo)
     p.x=80;p.y=120;
     for(let f=0;f<10;f++){api.simF++;api.updateEnts();}
     ok=ok&&wat.state==='lock'&&wat.tx===lockedX&&wat.ty===lockedY;
     // 5. Al terminar lock, dispara orbe y entra en 'recover'
     while(wat.state==='lock'){api.simF++;api.updateEnts();}
     ok=ok&&wat.state==='recover'&&wat.timer===api.CFG.WATCHER_RECOVER&&api.orbs.length===1;
     // 6. El orbe choca con un muro y se extingue sin atravesar
     const orb=api.orbs[0];
     const colWall=Math.max(0,Math.floor((orb.x-20)/api.TS));
     const rowWall=Math.floor((orb.y+4)/api.TS);
     api.L.map[rowWall][colWall]='#';
     let loops=0;
     while(api.orbs.length>0&&loops++<200){api.simF++;api.updateEnts();}
     ok=ok&&api.orbs.length===0;
     // 7. Generar orbe directo hacia jugador: hace dano
     p.energy=100;p.inv=0;p.hurtT=0;
     api.orbs.push({x:p.x,y:p.y,w:8,h:8,vx:-1,vy:0,life:60});
     api.simF++;api.updatePlayer();
     ok=ok&&Math.abs(p.energy-(100-api.CFG.DMG_HIT))<1&&p.hurtT>0;
     // 8. Durante recover, el vigia es inocuo por contacto
     p.energy=100;p.inv=0;p.hurtT=0;p.x=wat.x;p.y=wat.y;wat.state='recover';wat.timer=60;
     for(let f=0;f<30;f++){api.simF++;api.updatePlayer();}
     ok=ok&&p.hurtT===0&&p.energy>95;
     // 9. Respawn limpia los orbes
     api.orbs.push({x:100,y:100,w:8,h:8,vx:1,vy:0,life:60});
     p.dead=1;api.simF++;api.updatePlayer();
     ok=ok&&api.orbs.length===0;
     out.push([ok,'vigia espectral: aviso telegrafiado, fijacion previa, orbe bloqueable y recuperacion inocua']);}
    // Regression: attacks must not begin through cover or finish off camera.
    {newGame();loadLevel(0);startLevel();api.ents=[];
     const p=api.player;p.x=40;p.y=142;
     const sent={t:'K',x:140,y:136,w:18,h:24,sx:140,sy:136,dir:-1,vy:0,anim:0,state:'idle',timer:0,traveled:0,zone:api.L.zones[0]};
     api.ents.push(sent);api.L.map[8][6]='#';api.L.map[9][6]='#';api.updateEnts();
     let ok=sent.state==='idle';
     const wat={t:'Y',x:160,y:130,w:14,h:16,sx:160,sy:130,dir:-1,anim:0,state:'lock',timer:1,tx:45,ty:151,ph:0};
     api.ents=[wat];api.orbs.length=0;api.updateEnts();ok=ok&&api.orbs.length===0;
     wat.x=330;wat.state='lock';wat.timer=1;api.updateEnts();ok=ok&&api.orbs.length===0;
     out.push([ok,'cobertura y camara: centinela no detecta a traves de muro, vigia cancela tiro oculto o fuera de vista']);}
    {newGame();loadLevel(0);startLevel();api.ents=[];api.orbs.length=0;
     api.L.map[8][6]='#';api.orbs.push({x:86,y:122,w:8,h:8,vx:3,vy:0,life:80});
     api.updateEnts();
     out.push([api.orbs.length===0,'orbe: el borde del proyectil choca con esquina del muro aunque su centro pase por fuera']);}
    {newGame();loadLevel(0);startLevel();api.orbs.length=0;
     const wat={t:'Y',x:160,y:130,w:14,h:16,sx:160,sy:130,dir:-1,anim:0,state:'lock',timer:1,tx:45,ty:151,ph:0};
     api.ents=[wat];for(let i=0;i<api.CFG.WATCHER_MAX_ORBS;i++)api.orbs.push({x:280,y:90,w:8,h:8,vx:0,vy:0,life:100});
     api.updateEnts();let ok=api.orbs.length===api.CFG.WATCHER_MAX_ORBS;
     api.orbs.length=0;api.orbs.push({x:280,y:90,w:8,h:8,vx:0,vy:0,life:100,owner:wat});wat.state='lock';wat.timer=1;api.updateEnts();
     out.push([ok&&api.orbs.length===1,'vigia: limite global de orbes y un proyectil activo por propietario']);}
    {newGame();loadLevel(3);startLevel();api.levelClear();let ok=api.state==='play';
     api.boss.defeated=true;api.levelClear();ok=ok&&api.state==='clear';const counted=api.total.total;api.levelClear();ok=ok&&api.total.total===counted;
     out.push([ok&&api.state==='clear','meta del museo: requiere derrotar al jefe y no se reactiva desde la pantalla de cierre']);}
    return out;}
let bad=0;
console.log('=== Pruebas de motor ===');for(const [ok,msg] of engineTests()){console.log(`  ${ok?'OK  ':'FALLA'} ${msg}`);if(!ok)bad++;}
for(let i=0;i<LEVELS.length;i++){if(only!==null&&i!==only)continue;
 const t0=Date.now();const r=checkLevel(i);const ms=Date.now()-t0;
 const ok=r.missing.length===0&&r.goalReached&&r.doorsLeft.length===0&&r.keysN>=r.doorsN;
 console.log(`\n=== Nivel ${i+1}: ${r.name} (${r.cols} cols, ${r.bags} sacos, ${r.keysN} llaves / ${r.doorsN} puertas) ===`);
 console.log(`  estados alcanzados: ${r.states}  pasadas: ${r.passes}  tiempo: ${ms} ms`);
 console.log(`  meta alcanzada: ${r.goalReached?'SI (camino minimo ~'+(r.goalFrames/60).toFixed(0)+' s por BFS, con desvios por llaves)':'NO'}   puertas sin abrir: ${r.doorsLeft.length?r.doorsLeft.join(' '):'ninguna'}`);
 for(const m of r.missing)console.log(`  INALCANZABLE: '${m.t}' en col ${m.col} fila ${m.row} (x=${m.x}, y=${m.y})`);
 for(const w of r.warns)console.log(`  AVISO: ${w}`);
 console.log(ok?'  RESULTADO: OK':'  RESULTADO: FALLA');if(!ok)bad++;}
process.exit(bad?1:0);
