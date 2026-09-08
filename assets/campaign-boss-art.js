(function(root){
 'use strict';
 const im=new Image();im.src=new URL('campaign-boss.png',document.currentScript.src).href;
 root.CampaignBossArt={ready:()=>im.complete&&im.naturalWidth>0&&!!root.CampaignBossFrames,draw(g,x,y,state,frame){
  if(!im.complete||!im.naturalWidth||!root.CampaignBossFrames)return false;
  const pose=state==='open'?2:state==='defeat'?3:['warn','attack'].includes(state)?1:0;
  const b=root.CampaignBossFrames[pose],h=76,w=b.w/b.h*h;
  g.save();g.imageSmoothingEnabled=false;g.drawImage(im,b.x,b.y,b.w,b.h,x+32-w/2,y-3,w,h);
  if(state==='open'){g.strokeStyle='#80ffe0';g.lineWidth=1;g.beginPath();g.moveTo(x+10,y-5);g.lineTo(x+32,y-1);g.lineTo(x+54,y-5);g.stroke();}
  g.restore();return true;
 }};
})(window);
