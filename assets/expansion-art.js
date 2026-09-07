/* Pixel-art presentation for expansion actors and trophies; shared by Canvas and Pixi layers. */
(function(root){
 'use strict';
 const im=new Image();im.src=new URL('expansion-enemies-v2.png',document.currentScript.src).href;
 im.onerror=()=>console.warn('Phantomas: atlas de expansión no disponible; dibujo de respaldo.');
 const props=new Image();props.src=new URL('expansion-props-v2.png',document.currentScript.src).href;
 const propsReady=()=>props.complete&&props.naturalWidth>0;
 const ready=()=>im.complete&&im.naturalWidth>0;
 function actor(g,type,x,y,state,timer,dir=1,anim=0){
  if(!ready()||!root.ExpansionFrames)return false;
  const row=type==='sentinel'?0:type==='watcher'?1:2;
  const pose=row===0?({idle:0,alert:1,charge:2,recover:3}[state]??0):row===1?({idle:0,prepare:1,lock:2,recover:3}[state]??0):({idle:0,intro:0,aim:1,fire:1,zap:2,defeat:2,dead:3}[state]??0);
  const b=root.ExpansionFrames.frames[row*4+pose],ref=root.ExpansionFrames.groups[row];
  const scale=[25,20,56][row]/ref.height,w=b.w*scale,h=b.h*scale;
  const center=[9,7,24][row],bottom=[24,18,56][row];
  const bob=state==='idle'?(row===1?Math.sin(anim*.06)*.6:0):0;
  g.save();g.imageSmoothingEnabled=false;g.translate(x+center,y+bottom+bob);
  if(row===0&&dir<0)g.scale(-1,1);
  g.drawImage(im,b.x,b.y,b.w,b.h,-w/2,-h,w,h);
  // Stable status signals use shape as well as color, without covering the sprite.
  if((row===0&&state==='alert')||(row===1&&(state==='prepare'||state==='lock'))){
   g.fillStyle=row===0?'#ffe6a1':'#d9baff';g.fillRect(-.6,-h-5,1.2,2.5);g.fillRect(-.6,-h-1.5,1.2,1);
  }
  if(row===0&&state==='recover'){g.fillStyle='#83dfe6';for(let i=0;i<3;i++)g.fillRect(-4+i*4,-h-2+Math.sin(anim*.08+i)*.6,1,1);}
  g.restore();return true;
 }
 function prop(g,name,x,y){
  if(!propsReady()||!root.ExpansionPropFrames)return false;
  const n={seal:0,gear:1,lens:2,heart:3}[name];if(n===undefined)return false;
  const b=root.ExpansionPropFrames.frames[n],h=30,w=h*b.w/b.h;
  g.save();g.imageSmoothingEnabled=false;g.drawImage(props,b.x,b.y,b.w,b.h,x+16-w/2,y+32-h,w,h);g.restore();return true;
 }
 root.ExpansionArt={actor,prop,ready,propsReady};
})(window);
