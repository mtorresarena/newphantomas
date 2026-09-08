'use strict';
// Montaje exploratorio de arena, explícitamente NO una ruta completa de N4.
const fs=require('node:fs'),path=require('node:path');
const createGame=require('./route-harness-review.cjs');
const source=fs.readFileSync(path.join(__dirname,'index-base-31d4610.html'),'utf8');
const {api,route}=createGame(source);api.newGame();api.loadLevel(3);api.startLevel();
api.player.x=api.boss.x0+24;api.player.y=142;api.player.vx=api.player.vy=0;
let hold=0,prevJump=false,events=[],inputs=[],previousHp=3;
for(let frame=0;frame<2400&&!api.player.dead&&!api.boss.defeated;frame+=10){
 const b=api.boss,p=api.player,id=b.conductors.findIndex(c=>!c.charged),t=id===0?{x:b.x0+106,y:151}:id===1?{x:b.x0+38,y:103}:{x:b.x0+267,y:103};
 const dx=t.x-p.x-5;let dir=Math.abs(dx)>3?Math.sign(dx):0,jump=false,down=false;
 if(hold>0){jump=true;hold--;}
 else if(p.onGround&&!prevJump&&p.y+9>t.y+10){jump=true;hold=2;}
 else if(p.onGround&&!prevJump&&p.y+9<t.y-15){jump=true;down=true;}
 route.input([dir,+jump,+down]);prevJump=jump;for(let micro=0;micro<10;micro++){route.step();inputs.push([dir,+jump,+down]);}
 if(b.hp!==previousHp){events.push({frame:frame+10,hp:b.hp,conductor:id,x:p.x,y:p.y,energy:p.energy});previousHp=b.hp;}
}
const result={scope:'Fabricated arena start only; not completion evidence for N4.',defeated:api.boss.defeated,hp:api.boss.hp,dead:api.player.dead,energy:api.player.energy,player:{x:api.player.x,y:api.player.y},bossState:api.boss.state,events,inputs};
fs.writeFileSync(path.join(__dirname,'probe-jefe-base-10.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({...result,inputs:inputs.length},null,2));

