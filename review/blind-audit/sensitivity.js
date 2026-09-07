'use strict';const fs=require('fs'),create=require('../tools/route-harness');let out={perturb:[],jumpWindows:[],jumpReadout:null};
function fresh(li){const g=create();g.api.newGame();g.api.loadLevel(li);g.api.startLevel();return g;}
function tick(g,v){g.route.input(v);g.route.step();}
// Sensitivity of shortcut: use existing checkpoint coordinates and time phases.
for(const [li,part,period] of [[4,4,60],[4,5,60],[6,1,30],[6,5,30]])for(const offset of [-8,0,8])for(const phase of [0,30,90]){
 const g=fresh(li),a=g.api,z=a.L.zones.find(z=>z.part===part&&!z.transition);a.simF=phase;Object.assign(a.player,{x:z.x0+52+offset,y:142,onGround:true,jHeld:false});let hits=0,frames=0;
 for(;frames<1000&&a.state==='play'&&!a.player.dead;frames++){let old=a.player.energy;tick(g,[1,frames%period<period-2,0]);if(a.player.energy<old-2)hits++;if(a.player.x>z.x1+50)break;}
 out.perturb.push({level:li+1,part,offset,phase,frames,state:a.state,x:a.player.x,hits,dead:!!a.player.dead,keys:a.player.keys});
}
// Natural maximal horizontal-speed jumps from safe floor, landing on first platform over liquid.
for(const [li,part] of [[4,3],[5,2],[5,4],[7,3]]){let base=fresh(li),z=base.api.L.zones.find(z=>z.part===part&&!z.transition);const acid=z.x0+192;let attempts=[];
 for(let d=60;d>=10;d-=2){const g=fresh(li),a=g.api;Object.assign(a.player,{x:acid-d,y:142,vx:1.5,onGround:true,jHeld:false});let landed=null;for(let f=0;f<95;f++){tick(g,[1,1,0]);if(a.player.dead)break;if(f>3&&a.player.onGround){landed={f,x:a.player.x,y:a.player.y,mover:!!a.player.mover};break;}}attempts.push({d,landed,dead:!!a.player.dead});}
 out.jumpWindows.push({level:li+1,part,acid,attempts});
}
const g=fresh(5),a=g.api;Object.assign(a.player,{x:50,y:142,vx:1.5,onGround:true,jHeld:false});let minY=142;for(let f=0;f<80;f++){tick(g,[1,1,0]);minY=Math.min(minY,a.player.y);if(f>2&&a.player.onGround){out.jumpReadout={frames:f+1,height:142-minY,dx:a.player.x-50};break;}}
fs.writeFileSync(__dirname+'/sensitivity-results.json',JSON.stringify(out,null,2));console.log(JSON.stringify({perturb:out.perturb,jumpReadout:out.jumpReadout,jumpWindows:out.jumpWindows.map(w=>({level:w.level,part:w.part,safeDistances:w.attempts.filter(x=>x.landed&&x.landed.x>=w.acid).map(x=>x.d)}))},null,2));
