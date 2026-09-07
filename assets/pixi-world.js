/* Pixi presentation for all levels. Canvas remains the compatibility renderer. */
(function () {
 'use strict';
 const options=new URLSearchParams(location.search);if(options.get('renderer')==='canvas')return;
 const diagnostic=options.get('demo')==='pixi';
 const base=new URL('.',document.currentScript.src);
 let app,PIXI,loaded=false,failed=false,enabled=true,effects=true,active=false;
 let layers,pool=[],cursor=0,textures={},terrain=new Map(),lastSize='',fpsFrames=0,fpsStart=performance.now();
 const panel=document.createElement('div');panel.id='pixiDemoPanel';
 panel.innerHTML='<strong>EFECTOS VISUALES</strong><button id="pixiCompare" disabled>Preparando PixiJS…</button><button id="pixiEffects" disabled>Efectos: sí</button><button id="pixiRestart">Reiniciar sala</button><span id="pixiStatus" role="status">Cargando recursos locales…</span>';
 const style=document.createElement('style');style.textContent='#pixiDemoPanel{position:fixed;bottom:40px;left:50%;transform:translateX(-50%);z-index:20;display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:8px;padding:8px 12px;background:#081323ee;border:1px solid #43677d;border-radius:8px;color:#ddf9ff;font:12px system-ui;max-width:94vw;width:max-content}#pixiDemoPanel strong{font-size:10px;letter-spacing:1px}#pixiDemoPanel button{background:#14384a;color:#ddf9ff;border:1px solid #528294;border-radius:4px;padding:7px;cursor:pointer;touch-action:manipulation;-webkit-touch-callout:none}#pixiDemoPanel button:disabled{opacity:.55}#pixiStatus{font-size:11px;color:#9fc6d6}body.touch #pixiDemoPanel{bottom:auto;top:64px;max-width:90vw}';
 style.textContent+='#pixiDemoPanel{display:none}body.pixiDiagnostic #pixiDemoPanel{display:flex}';
 if(diagnostic)document.body.classList.add('pixiDiagnostic');document.head.append(style);document.body.append(panel);
 const compare=panel.querySelector('#pixiCompare'),effectButton=panel.querySelector('#pixiEffects'),status=panel.querySelector('#pixiStatus');
 function refresh(){compare.textContent=enabled?'Ver Canvas':'Ver PixiJS';compare.setAttribute('aria-pressed',String(enabled));effectButton.textContent='Efectos: '+(effects?'sí':'no');effectButton.setAttribute('aria-pressed',String(effects));}
 compare.onclick=()=>{enabled=!enabled;refresh();compare.blur();};
 effectButton.onclick=()=>{effects=!effects;refresh();effectButton.blur();};
 panel.querySelector('#pixiRestart').onclick=()=>{window.startPixiGardenDemo?.();panel.querySelector('#pixiRestart').blur();};
 function sprite(texture,x,y,w,h,layer=layers.world,alpha=1,tint=0xffffff,blend='normal'){
  let s=pool[cursor++];if(!s){s=new PIXI.Sprite(texture);pool.push(s);}layer.addChild(s);
  s.visible=true;s.texture=texture;s.position.set(x,y);s.scale.set(1,1);s.rotation=0;s.anchor.set(0,0);s.width=w;s.height=h;s.alpha=alpha;s.tint=tint;s.blendMode=blend;return s;
 }
 function glow(x,y,w,h,color,alpha,layer=layers.light){return sprite(textures.glow,x-w/2,y-h/2,w,h,layer,alpha,color,'add');}
 function canvasTexture(w,h,draw){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'));return PIXI.Texture.from(c);}
 function tileTexture(ch,c,r,phase,surface){const key=[ch,c%8,r,phase,surface].join(':');if(!terrain.has(key))terrain.set(key,canvasTexture(64,64,g=>{g.scale(4,4);if(ch==='~')window.GardenTerrain.drawAcid(g,0,0,c%8,r,phase*7,surface);else if(!window.GardenTerrain.drawTile(g,ch,0,0,c%8,r,0))window.WorldArt.tile(g,'garden',{wall:'#4a3018',mortar:'#2a1808'},r>=10?ch+'f':ch,0,0,c%8,r);}));return terrain.get(key);}
 function crop(source,frames){return frames.map(b=>new PIXI.Texture({source:source.source,frame:new PIXI.Rectangle(b.x,b.y,b.w,b.h)}));}
 function robot(p,cx,time){if(p.dead&&p.dead<=50)return;const pose=p.dead||p.hurtT>0?'hurt':!p.onGround?(p.vy>1?'fall':'jump'):Math.abs(p.vx)>.3?'run':'idle';
  const n=pose==='run'?Math.floor(p.anim/6)%4:pose==='jump'?5:pose==='fall'?6:pose==='hurt'?7:4,b=window.GardenFrames.robot.frames[n],sc=18/window.GardenFrames.robot.referenceHeight;
  const s=sprite(textures.robot[n],p.x+5-cx,p.y+18,b.w*sc,b.h*sc,layers.world,p.inv>0?((p.inv>>2)&1)?.35:.85:1);s.anchor.set(.5,1);if(p.face<0)s.scale.x*=-1;
  if(effects&&!p.dead)glow(p.x+5-cx,p.y+6,24,22,0x46d9ff,.15);
 }
 function render(v){
  const eligible=v.gardenLook;
  const garden=v.L.zones.filter(z=>z.x1>v.cx&&z.x0<v.cx+320).every(z=>z.t==='garden');
  if(!loaded||failed||!enabled||!eligible){hide(v.cv);if(loaded&&!failed)status.textContent=!v.gardenLook?'Canvas · aspecto anterior':enabled&&!eligible?'Canvas · fuera de la sala de prueba':'Canvas · dibujo actual';return false;}
  try{
   const size=v.S+':'+v.VH;if(size!==lastSize){app.renderer.resolution=v.S;app.renderer.resize(320,v.VH);lastSize=size;}
   Object.assign(app.canvas.style,{width:v.cv.style.width,height:v.cv.style.height,left:v.cv.offsetLeft+'px',top:v.cv.offsetTop+'px',display:'block'});
   v.cv.style.background='transparent';active=true;cursor=0;app.stage.position.set(0,v.vOff+v.sy);
   const time=v.frame,cx=v.cx;
   if(!garden){paintRoom(v);roomEffects(v);}
   else{
   sprite(textures.background,-32-Math.max(0,Math.min(32,cx*.055)),-20,384,230.4,layers.back);
   if(effects){
    glow(249-cx*.015,36,125,112,0x448dff,.22,layers.haze);
    for(let i=0;i<6;i++){const x=((i*91-cx*.12+time*.035)%530+530)%530-100;glow(x,115+i%3*18,180,26,0x528ba8,.10,layers.haze);}
   }
   for(const d of v.decor){const x=d.x-cx;if(x< -60||x>380)continue;if(d.t==='T'){const b=window.GardenFrames.props.frames[0],h=53,w=h*b.w/b.h;sprite(textures.props[0],x+8-w/2,d.y+16-h,w,h);}}
   const c0=Math.max(0,Math.floor(cx/16)),c1=Math.min(v.L.cols-1,Math.floor((cx+320)/16));
   for(let r=0;r<12;r++)for(let c=c0;c<=c1;c++){
    let ch=v.L.map[r][c];if(ch==='.')continue;const x=c*16-cx,y=r*16;
    if(ch==='G'&&r>0&&v.L.map[r-1][c]==='G')ch='g';
    if(ch==='D'){sprite(textures.door[r===0||v.L.map[r-1][c]!=='D'?0:1],x,y,16,16);continue;}
    if(['G','g','=','^','#','%','~'].includes(ch)){
     const phase=ch==='~'?Math.floor(time/7)%8:0,surface=r===0||v.L.map[r-1][c]!=='~';
     sprite(tileTexture(ch,c,r,phase,surface),x,y,16,16);
     if(effects&&ch==='~'&&surface){glow(x+8,y+9,44,33,0x87ff2d,.20);for(let j=0;j<2;j++){const yy=y-((time*.22+c*13+j*19)%27);sprite(PIXI.Texture.WHITE,x+((c*7+j*11)%15),yy,.6,.6,layers.light,.7,0xcfff73,'add');}}
    }
   }
   for(const it of v.items){const x=it.x-cx,y=it.y+Math.sin(time*.08+it.x)*1.5;if(x< -30||x>350)continue;
    if(it.t==='$'){sprite(textures.props[1],x-.5,y-1,11,13);if(effects)glow(x+5,y+5,23,23,0xffc35f,.12);}
    if(it.t==='k'){sprite(textures.props[2],x-.5,y-.5,10,6);if(effects)glow(x+4,y+2,22,22,0xffd765,.16);}
   }
   for(const e of v.ents){const x=e.x-cx;if(x< -35||x>355)continue;
    if(e.t==='c')sprite(textures.props[3],x-.5,e.y-.5,11,11);
    if(e.t==='m'){const n=4+Math.floor((time+e.ph*10)/5)%4,b=window.GardenFrames.props.frames[n],sc=23/window.GardenFrames.props.batWidth;
     const s=sprite(textures.props[n],x+6,e.y+3.5,b.w*sc,b.h*sc);s.anchor.set(b.pivotX/b.w,b.pivotY/b.h);if(e.dir<0)s.scale.x*=-1;if(effects)glow(x+6,e.y+3,13,11,0xff318a,.14);}
   }
   robot(v.player,cx,time);
   for(const p of v.parts)sprite(PIXI.Texture.WHITE,p.x-cx,p.y,1,1,layers.light,Math.min(1,p.life/12),p.col);
   if(effects){
    for(let i=0;i<25;i++){const x=((i*47-cx*.5+Math.sin(time*.013+i)*9)%360+360)%360-20,y=82+(i*29)%75+Math.sin(time*.023+i)*5,alpha=.2+Math.max(0,Math.sin(time*.045+i*3))*.65;glow(x,y,6,6,0x9dff74,alpha*.28);sprite(PIXI.Texture.WHITE,x,y,.5,.5,layers.light,alpha,0xc4ffaa,'add');}
    for(let i=0;i<3;i++)glow(((i*151+time*.06-cx*.28)%540+540)%540-90,156+i*8,180,18,0x367982,.07);
   }
   }
   for(let i=cursor;i<pool.length;i++)pool[i].visible=false;
   app.render();fpsFrames++;const now=performance.now();if(now-fpsStart>=750){status.textContent='PixiJS · WebGL · '+Math.round(fpsFrames*1000/(now-fpsStart))+' img/s';fpsStart=now;fpsFrames=0;}return true;
  }catch(error){failed=true;hide(v.cv);status.textContent='PixiJS no disponible: continúa Canvas';console.error('Pixi world:',error);return false;}
 }
 // Fixed-size reusable surfaces bound CPU/GPU memory independently of room count.
 const surfaces={};
 function paintRoom(v){
  for(const name of ['back','world']){
   if(!surfaces[name]){const canvas=document.createElement('canvas');canvas.width=960;canvas.height=576;
    const texture=PIXI.Texture.from(canvas);texture.source.scaleMode='nearest';
    surfaces[name]={canvas,texture,g:canvas.getContext('2d')};}
   const {canvas,texture,g}=surfaces[name];g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,canvas.width,canvas.height);g.setTransform(3,0,0,3,0,0);g.imageSmoothingEnabled=false;
   v.paintLayer(g,name,v.cx);texture.source.update();sprite(texture,0,0,320,192,layers[name]);
  }
 }
 function roomEffects(v){
  if(!effects)return;
  const time=v.frame,cx=v.cx;
  const zone=v.L.zones.find(z=>cx+160>=z.x0&&cx+160<z.x1)||v.L.zones[0],name=zone.t;
  const outdoor=['garden','moat','roof','roof2','roof3','bridges'].includes(name);
  const cold=['crypt','tower','dungeon','coffin','keep','sewer','bell'].includes(name);
  const color=name==='sewer'?0x7bd28a:cold?0x698cda:outdoor?0x73afd4:0xd9ad70;
  for(let i=0;i<4;i++)glow(((i*107-cx*.12+time*.035)%490+490)%490-70,115+i%3*18,160,24,color,.07,layers.haze);
  for(let i=0;i<16;i++){
   const x=((i*47-cx*.45+Math.sin(time*.013+i)*9)%360+360)%360-20,y=40+(i*29)%116+Math.sin(time*.018+i)*5;
   const a=.12+Math.max(0,Math.sin(time*.04+i*3))*.4;
   glow(x,y,outdoor?6:4,outdoor?6:4,color,a*.18);sprite(PIXI.Texture.WHITE,x,y,.45,.45,layers.light,a,color,'add');
  }
  for(const d of v.decor){const x=d.x-cx;if(x< -50||x>370)continue;
   if(['t','W','L','V'].includes(d.t))glow(x+8,d.y+(d.t==='W'?12:d.t==='L'?-12:4),52,60,d.t==='W'?0x80bfff:0xffb74c,.13+Math.sin(time*.13+d.x)*.025);
  }
  for(const e of v.ents){if(e.t==='f')glow(e.x+4-cx,e.y+6,40,48,0xff842d,.2);}
  for(const it of v.items){const x=it.x-cx;if(x< -40||x>360)continue;
   if(['E','S','k','$'].includes(it.t))glow(x+8,it.y+8,it.t==='S'?48:24,it.t==='S'?48:24,it.t==='E'?0x65ffaf:0xffcf71,.12);
  }
  for(let c=Math.max(0,Math.floor(cx/16));c<=Math.min(v.L.cols-1,Math.floor((cx+320)/16));c++)for(let r=0;r<12;r++){
   if(v.L.map[r][c]==='~'&&(r===0||v.L.map[r-1][c]!=='~'))glow(c*16+8-cx,r*16+8,40,32,0x87ff2d,.2);
  }
  if(!v.player.dead)glow(v.player.x+5-cx,v.player.y+6,24,22,0x46d9ff,.15);
 }
 function hide(cv){if(app)app.canvas.style.display='none';if(cv)cv.style.background='';active=false;}
 window.PhantomasPixi={render,hide,get ready(){return loaded;},get active(){return active;},get error(){return failed;}};
 async function init(){try{
  await new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=new URL('pixi-8.16.0.min.js',base);s.onload=resolve;s.onerror=reject;document.head.append(s);});PIXI=window.PIXI;
  app=new PIXI.Application();await app.init({width:320,height:192,resolution:3,autoStart:false,preference:'webgl',antialias:false,background:0x050a18});
  Object.assign(app.canvas.style,{position:'absolute',pointerEvents:'none',display:'none',zIndex:'0'});app.canvas.setAttribute('aria-hidden','true');document.getElementById('wrap').prepend(app.canvas);const cv=document.getElementById('c');cv.style.position='relative';cv.style.zIndex='1';
  app.canvas.addEventListener('webglcontextlost',()=>{failed=true;hide(cv);status.textContent='Contexto gráfico perdido: Canvas activo';});
  const [bg,robotSheet,propSheet]=await Promise.all(['garden-background.png','garden-robot.png','garden-props.png'].map(f=>PIXI.Assets.load(new URL(f,base).href)));
  for(const t of [bg,robotSheet,propSheet])t.source.scaleMode='nearest';
  textures.background=bg;textures.robot=crop(robotSheet,window.GardenFrames.robot.frames);textures.props=crop(propSheet,window.GardenFrames.props.frames);
  textures.glow=canvasTexture(128,128,g=>{const gradient=g.createRadialGradient(64,64,0,64,64,64);gradient.addColorStop(0,'#ffffff');gradient.addColorStop(.25,'rgba(255,255,255,.45)');gradient.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gradient;g.fillRect(0,0,128,128);});
  textures.door=[true,false].map(top=>canvasTexture(64,64,g=>{g.scale(4,4);window.WorldArt.prop(g,'door',0,0,{top});}));
  layers={};for(const name of ['back','haze','world','light']){layers[name]=new PIXI.Container();app.stage.addChild(layers[name]);}
  compare.disabled=false;effectButton.disabled=false;loaded=true;refresh();status.textContent='PixiJS listo · cuatro niveles';
 }catch(error){failed=true;status.textContent='Este navegador no pudo iniciar PixiJS; Canvas sigue disponible.';console.error('Pixi initialization:',error);}}
 init();
})();
