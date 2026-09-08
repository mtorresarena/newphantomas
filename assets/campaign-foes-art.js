(function(root){
 'use strict';const im=new Image();im.src=new URL('campaign-foes.png',document.currentScript.src).href;
 root.CampaignFoeArt={ready:()=>im.complete&&im.naturalWidth>0&&!!root.CampaignFoeFrames,draw(g,f,x,frame){
  if(!im.complete||!im.naturalWidth||!root.CampaignFoeFrames)return false;
  const scarab=f.kind==='beetle',pose=scarab?((frame>>4)&1):({patrol:0,warn:1,dive:2,return:3}[f.state]??0),b=root.CampaignFoeFrames[(scarab?0:4)+pose];
  const scale=scarab?13/190:22/278,w=b.w*scale,h=b.h*scale;
  g.save();g.imageSmoothingEnabled=false;g.translate(x+8,f.y+12);if(f.dir>0)g.scale(-1,1);
  const anchor=scarab?b.w/2:([146,686,1000,1500][pose]-b.x);
  g.drawImage(im,b.x,b.y,b.w,b.h,-anchor*scale,-h,w,h);g.restore();return true;
 }};
})(window);
