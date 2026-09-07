/* Presentation only: shared pixel materials, scenery and enemies for all four levels. */
(function(root){
 'use strict';
 const base=new URL('.',document.currentScript.src), images={}, cache=new Map();
 for(const name of ['scenery','enemies','props']){const im=new Image();images[name]=im;im.src=new URL('world-'+name+'.png',base).href;im.onerror=()=>console.warn('Phantomas: recurso '+name+' no disponible; usando dibujo de respaldo.');}
 const ready=n=>images[n].complete&&images[n].naturalWidth>0;
 const rect=(g,c,x,y,w,h)=>{g.fillStyle=c;g.fillRect(x,y,w,h);};
 const shade=(c,k)=>'#'+[1,3,5].map(i=>Math.min(255,Math.max(0,Math.round(parseInt(c.slice(i,i+2),16)*k))).toString(16).padStart(2,'0')).join('');
 function bitmap(key,w,h,draw){if(!cache.has(key)){const c=document.createElement('canvas');c.width=w*2;c.height=h*2;const g=c.getContext('2d');g.scale(2,2);draw(g);cache.set(key,c);}return cache.get(key);}
 function blit(g,im,x,y,w,h){g.save();g.imageSmoothingEnabled=false;g.drawImage(im,x,y,w,h);g.restore();return true;}
 const groups={hall:0,library:1,archive:1,attic:1,warehouse:1,crypt:2,tower:2,moat:2,court:2,armory:2,dungeon:2,bell:2,coffin:2,keep:2,sewer:2,roof:3,roof2:3,roof3:3,bridges:3,museum:4,gallery:4,ballroom:4,vault:4,egypt:5};
 function background(g,name,t,cx,time,dawn){
  if(name==='moat')return root.GardenArt.drawBackground(g,cx,time);
  if(!(name in groups)||!ready('scenery'))return false;
  const i=groups[name],im=images.scenery,sw=im.naturalWidth/2;
  // Measured panel boundaries: generated rows are not exactly equal in height.
  const rows=[0,383/1254,794/1254,1],sy=rows[Math.floor(i/2)]*im.naturalHeight,sh=(rows[Math.floor(i/2)+1]-rows[Math.floor(i/2)])*im.naturalHeight;
  g.save();g.imageSmoothingEnabled=false;
  // Bounded drift avoids visible seams between the six distinct illustration plates.
  const drift=12*Math.sin(cx/650);
  g.drawImage(im,(i%2)*sw+2,sy+2,sw-4,sh-4,-24-drift,-10,368,220.8);
  const tint={coffin:'#630925',crypt:'#102237',dungeon:'#091622',sewer:'#12472b',archive:'#24451d',attic:'#442412',warehouse:'#372516',ballroom:'#11385c',vault:'#112a40',armory:'#49151b',tower:'#251955'}[name];
  if(tint){g.globalAlpha=.22;rect(g,tint,0,0,320,192);g.globalAlpha=1;}
  // Different rooms share masonry while keeping their own architectural identity.
  if(['attic','warehouse'].includes(name)){for(let x=-((cx*.16)%80)-80;x<340;x+=80){rect(g,'#1c1720',x,12,6,180);rect(g,'#694932',x,12,1,180);for(let y=35;y<170;y+=48){rect(g,'#292029',x,y,80,5);rect(g,'#805638',x,y,80,1);}}}
  if(name==='sewer'){for(let y of [28,79]){rect(g,'#152b2b',0,y,320,7);rect(g,'#5a7462',0,y,320,1);for(let x=-((cx*.2)%48);x<320;x+=48){rect(g,'#819181',x,y-1,3,9);rect(g,'#243b31',x+1,y,1,7);}}}
  if(name==='coffin'){for(let x=-((cx*.12)%100);x<320;x+=100){rect(g,'#471329',x+20,25,25,100);rect(g,'#83233c',x+21,25,3,94);rect(g,'#c18e42',x+18,23,29,2);}}
  if(name==='vault'){for(let x=-((cx*.1)%40);x<320;x+=40){rect(g,'#12232f',x,18,3,148);rect(g,'#51637b',x,18,1,148);}}
  if(i===3&&dawn>0){g.globalAlpha=dawn*.36;rect(g,'#ee8958',0,0,320,192);g.globalAlpha=1;}
  for(let n=0;n<9;n++){g.globalAlpha=.12+.12*Math.sin(time*.018+n);rect(g,i===3?'#bce7ff':'#ffe7a0',((n*47-cx*.22)%340+340)%340,35+(n*29)%120,.5,.5);}
  g.restore();return true;
 }
 function tile(g,name,t,ch,x,y,col,row){
  if(ch==='='&&!t.plank)return root.GardenTerrain.drawTile(g,ch,x,y,col,row,0);
  if(['G','g','^'].includes(ch))return root.GardenTerrain.drawTile(g,ch,x,y,col,row,0);
  if(!['#','%','#f','%f','='].includes(ch))return false;
  const variant=((col*7+row*3)%4+4)%4, key='tile:'+name+ch+variant;
  const im=bitmap(key,16,16,q=>{
   const c=t.wall;
   if(ch==='='){const p=t.plank==='metal'?['#cadce7','#657e98','#26394f']:t.plank==='stone'?['#e2d3ae','#978b7e','#3d3c51']:['#ffcd74','#b47539','#4d2e27'];rect(q,p[2],0,0,16,6);rect(q,p[1],0,1,16,4);rect(q,p[0],0,0,16,1);for(let xx of [2,12]){rect(q,p[2],xx,2,2,2);rect(q,p[0],xx,2,1,.5);}return;}
   rect(q,t.mortar,0,0,16,16);
   for(let yy=0;yy<16;yy+=8){const shift=yy?4:0;for(let xx=-shift;xx<16;xx+=8){const k=.84+((xx+shift+variant*3+yy)%7)*.04;rect(q,shade(c,k),xx+.5,yy+.5,7.5,7);rect(q,shade(c,k*1.3),xx+1,yy+.5,7,1);rect(q,shade(c,.56),xx+1,yy+6.5,7,1);rect(q,shade(c,k*1.12),xx+2,yy+2,2,.5);}}
   for(let n=0;n<12;n++){const xx=(n*7+variant*3)%16,yy=(n*5+variant)%16;rect(q,shade(c,n%2?1.12:.73),xx,yy,1,.5);}
   if(ch.endsWith('f')){rect(q,shade(c,1.55),0,0,16,1);rect(q,shade(c,1.15),0,1,16,1);}
   if(['crypt','dungeon','sewer','moat'].includes(name)){rect(q,'#45614d',variant*3,9,3,1);rect(q,'#688367',variant*3+1,9,1,.5);}
  });return blit(g,im,x,y,16,16);
 }
 const pairs={guard:0,mummy:1,rat:2,spider:3,ghost:4,vampire:5,cannon:6,flame:7};
 function enemy(g,name,x,y,time,face=1,options={}){
  if(!ready('enemies')||!root.WorldFrames)return false;
  const pair=pairs[name],index=pair*2+(name==='cannon'?(options.fire?1:0):Math.floor(Math.abs(time)/8)%2),box=root.WorldFrames.frames[index];
  const ref=root.WorldFrames.pairs[pair], im=images.enemies;
  const heights={guard:19,mummy:19,rat:8,spider:9,ghost:17,vampire:20,cannon:12,flame:options.height||12};
  const scale=heights[name]/ref.height,w=box.w*scale,h=box.h*scale;
  const center={guard:5,mummy:5,rat:6,spider:5,ghost:6,vampire:6,cannon:8,flame:(options.width||8)/2}[name];
  const bottom={guard:18,mummy:18,rat:6,spider:6,ghost:16,vampire:18,cannon:12,flame:0}[name];
  g.save();g.imageSmoothingEnabled=false;g.translate(x+center,y+bottom);if(face<0)g.scale(-1,1);
  if(options.alpha!==undefined)g.globalAlpha*=options.alpha;if(options.flee)g.globalAlpha*=.75;
  g.drawImage(im,box.x,box.y,box.w,box.h,-w/2,-h,w,h);g.restore();return true;
 }
 // Small functional objects use deterministic pixel artwork at the collision scale.
 function atlasProp(g,index,x,y,w,h){if(!ready('props')||!root.WorldPropFrames)return false;const b=root.WorldPropFrames.frames[index];g.save();g.imageSmoothingEnabled=false;g.drawImage(images.props,b.x,b.y,b.w,b.h,x,y,w,h);g.restore();return true;}
 function prop(g,name,x,y,opt={}){
  const goalIndex={safe:12,coffin:13,balloon:14,diamond:15}[name];
  if(goalIndex!==undefined&&atlasProp(g,goalIndex,x,y,32,32))return true;
  const dims={battery:[8,12],garlic:[8,10],socket:[16,16],door:[16,16],safe:[32,32],coffin:[32,32],balloon:[32,32],diamond:[32,32],alarm:[16,6],ball:[8,8]};
  if(!dims[name])return false;const [w,h]=dims[name];
  const im=bitmap('prop:'+name+Number(!!opt.on)+Number(!!opt.top),w,h,q=>{
   const R=(c,a,b,d,e)=>rect(q,c,a,b,d,e), gold='#edbb57',light='#fff0aa',dark='#182034',silver='#a0b4c9';
   if(name==='battery'){R(dark,0,1,8,11);R('#42b958',1,2,6,9);R('#90f17d',1,2,1,8);R(silver,2,0,4,2);R(light,4,3,2,3);R(light,2,5,3,2);R(light,3,7,1,3);}
   if(name==='garlic'){R('#50864c',3,0,2,3);R('#95889a',1,4,6,5);R('#fff0d5',2,3,4,6);R('#ccbbad',4,4,1,5);R('#fff9ed',2,4,1,3);}
   if(name==='socket'){R(dark,1,1,14,14);R(silver,2,2,12,12);R('#e3edf0',2,2,12,1);R('#344657',5,6,2,4);R('#344657',9,6,2,4);R(opt.on?'#a5ff77':'#567878',7,12,2,1);}
   if(name==='door'){R(dark,0,0,16,16);R('#845232',2,opt.top?4:0,12,opt.top?12:16);R('#c08b4c',3,opt.top?4:0,1,16);for(let a of [6,10])R('#422c2d',a,4,1,12);R('#7e93a5',2,opt.top?11:5,12,2);if(!opt.top){R(gold,10,9,3,3);R(dark,11,10,1,4);}else{R('#845232',4,2,8,2);R('#c08b4c',5,2,6,1);}}
   if(name==='safe'){R(dark,0,0,32,32);R('#70849b',1,1,30,30);R('#c2d1dd',2,2,28,1);R('#263b53',4,5,23,23);R('#526983',5,6,21,21);R(gold,8,11,11,11);R(light,9,11,9,1);R(dark,10,13,7,7);R(gold,13,14,1,5);R(silver,23,10,3,14);R('#eff6ed',23,10,1,13);}
   if(name==='coffin'){R(dark,5,0,22,32);R('#784632',6,2,20,28);R('#bb8145',7,2,18,1);R('#45242b',9,5,14,23);R(gold,15,7,2,17);R(gold,10,12,12,2);for(let a of [7,24]){R(gold,a,8,1,3);R(gold,a,22,1,3);}}
   if(name==='balloon'){for(let yy=0;yy<22;yy++){const ww=yy<4?12+yy*3:yy>16?24-(yy-16)*2:24;R('#b83155',16-ww/2,yy,ww,1);R('#ff8268',16-ww/2+1,yy,2,1);R(gold,12,yy,3,1);R('#ffe7a0',18,yy,2,1);}R(silver,9,21,1,6);R(silver,22,21,1,6);R('#845332',9,26,14,6);R(gold,9,26,14,1);R('#b78043',11,28,10,2);}
   if(name==='diamond'){R('#5d4635',3,25,26,7);R(gold,3,25,26,1);R('#79a6b8',6,2,20,1);R('#79a6b8',6,2,1,23);R('#c9f6f5',25,2,1,23);for(let yy=0;yy<14;yy++){const ww=yy<5?6+yy*2:16-(yy-5)*1.6;R('#31badb',16-ww/2,6+yy,ww,1);R('#9efcff',16-ww/2,6+yy,Math.max(1,ww/3),1);}R('#efffff',12,9,8,1);}
   if(name==='alarm'){R(dark,0,0,16,6);R('#8f3449',1,1,14,4);R('#ed927a',1,1,14,1);R(opt.on?'#fff3a0':'#d83e53',7,3,2,2);}
   if(name==='ball'){R(dark,2,0,4,8);R(dark,0,2,8,4);R('#697e92',1,2,6,4);R('#bed2dd',2,1,3,2);R('#364259',3,5,4,2);}
  });return blit(g,im,x,y,w,h);
 }
 function mover(g,m,x,y,cx){g.save();if(m.t==='v'){for(let xx of [x+4,x+27])for(let yy=0;yy<y;yy+=3){rect(g,'#344a5d',xx,yy,1,3);rect(g,'#a2b8c3',xx-.5,yy,2,1);}}else rect(g,'#354b61',m.sx-m.rx-cx,y+3,m.rx*2+m.w,1);rect(g,'#23354b',x,y,m.w,6);rect(g,'#e9cf8a',x,y,m.w,1);rect(g,'#9a8058',x,y+1,m.w,3);for(let xx=2;xx<m.w;xx+=8){rect(g,'#34495d',x+xx,y+2,3,2);rect(g,'#bef6ed',x+xx,y+2,1,1);}g.restore();return true;}
 function decor(g,d,x,original,time){
  if(d.t==='T')return root.GardenArt.drawTree(g,x+8,d.y+16,53);
  if(d.t==='|'){rect(g,'#52617b',x+4,16,8,d.y+2);rect(g,'#d5d3bb',x+4,16,2,d.y+2);rect(g,'#a6abac',x+2,16,12,3);rect(g,'#ddd6b0',x+2,d.y+12,12,1);rect(g,'#8b92a2',x+2,d.y+13,12,3);return true;}
  const sizes={W:[16,24,0],p:[16,16,0],B:[16,32,-16],t:[8,16,0],o:[16,16,0],x:[16,16,0],s:[16,16,0],C:[16,32,0],A:[16,32,-16],V:[16,24,-8],q:[16,24,0],L:[16,32,-16],Q:[16,16,0],h:[16,16,0],y:[32,5,11],O:[16,12,4],z:[4,16,0]};
  const size=sizes[d.t];if(!size||!original[d.t])return false;
  const [w,h,dy]=size,key='decor:'+d.t;
  const index={W:0,p:1,B:2,t:3,o:4,A:5,V:6,q:7,L:8,Q:9,O:10,h:11}[d.t];
  if(index!==undefined&&atlasProp(g,index,x+(d.t==='t'?4:0),d.y+dy,w,h)){if(d.t==='t')enemy(g,'flame',x+5.5,d.y+2, time+d.x,1,{width:5,height:7});return true;}
  if(!cache.has(key)){
   // Reuse original object silhouettes, rasterized on a half-unit pixel grid.
   const c=document.createElement('canvas');c.width=w*2;c.height=h*2;const q=c.getContext('2d');q.drawImage(original[d.t],0,0,c.width,c.height);
   const pixels=q.getImageData(0,0,c.width,c.height);for(let i=0;i<pixels.data.length;i+=4){for(let j=0;j<3;j++)pixels.data[i+j]=Math.min(255,Math.round(pixels.data[i+j]/24)*24);pixels.data[i+3]=pixels.data[i+3]<90?0:255;}q.putImageData(pixels,0,0);cache.set(key,c);
  }
  if(d.t==='z'){for(let yy=0;yy<d.y+16;yy+=16)blit(g,cache.get(key),x+6,yy,4,Math.min(16,d.y+16-yy));}
  else blit(g,cache.get(key),x+(d.t==='t'?4:0),d.y+dy+(d.t==='Q'?Math.round(Math.sin(time*.05+d.x)):0),w,h);
  if(d.t==='t')enemy(g,'flame',x+5.5,d.y+6.5,time+d.x,1,{width:5,height:7});
  return true;
 }
 root.WorldArt={background,tile,enemy,prop,mover,decor,ready,groups,get cacheSize(){return cache.size;}};
})(window);
