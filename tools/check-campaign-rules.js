'use strict';
// State fixtures exercise boundary conditions. These are NOT playthroughs.
const assert=require('assert/strict'),fs=require('fs'),createGame=require('./route-harness');
const {api,route}=createGame(),cases=[];
function test(name,fn){fn();cases.push(name);console.log('PASS '+name);}
function load(l=4){api.newGame();api.loadLevel(l);api.startLevel();}
function locate(n){Object.assign(api.player,{x:n.x-5,y:n.y-9,vx:0,vy:0,dead:0});}
function use(n){locate(n);api.keys.ArrowDown=false;api.updateCampaign();api.keys.ArrowDown=true;api.updateCampaign();api.keys.ArrowDown=false;api.updateCampaign();}
test('Exactly two bosses N4 + N8; 40 gates in 20 campaign parts',()=>{
 const bosses=[];for(let l=0;l<8;l++){load(l);if(api.boss||api.campaign?.final)bosses.push(l+1);if(l>=4){assert.equal(api.campaign.trials.length,10);assert.equal(new Set(api.campaign.trials.map(t=>t.part)).size,5);}}
 assert.deepEqual(bosses,[4,8]);
});
test('Every mirror layout connects only with the intended beam turns',()=>{
 let count=0;for(let l=4;l<8;l++){load(l);for(const t of api.campaign.trials.filter(t=>t.kind==='mirror')){assert.equal(api.mirrorTrace(t),false);const solution=require('./solve-mirror-layout')(t,(c,r)=>api.isSolid(api.tileAt(c,r)));for(const n of t.nodes.filter(n=>n.role==='mirror')){const target=solution[n.id];if(n.angle!==target)use(n);}if(t.dualLight){for(let f=0;f<31;f++)api.updateCampaign();assert.equal(t.primed,true);assert.equal(t.solved,false);use(t.nodes.find(n=>n.role==='prism'));}assert.equal(api.mirrorTrace(t),true,t.id);for(let f=0;f<31;f++)api.updateCampaign();assert.equal(t.solved,true);count++;}}assert.ok(count>=7);
});
test('A single relay weight powers, retracts, anchors and is reused at the upper balance',()=>{
 load(5);const t=api.campaign.trials.find(t=>t.relay),n=id=>t.nodes.find(n=>n.id===id),bridges=on=>t.bridges.every(b=>b.on===on&&api.tileAt(t.x0/16+b.col,b.row)===(on?'=':'.'));
 assert.ok(bridges(false));use(n('3'));assert.equal(t.anchored,false);use(n('1'));use(n('4'));assert.equal(t.solved,false);assert.equal(api.campaign.carry,t.id);
 use(n('2'));assert.equal(t.solved,false);assert.ok(bridges(true));use(n('1'));assert.equal(api.campaign.carry,null);assert.equal(t.docked,'2');
 use(n('2'));assert.equal(api.campaign.carry,t.id);assert.ok(bridges(false));use(n('2'));use(n('3'));assert.equal(t.anchored,true);use(n('2'));assert.ok(bridges(true));assert.equal(api.campaign.carry,t.id);
 use(n('4'));assert.equal(t.solved,true);assert.equal(api.campaign.carry,null);assert.equal(t.docked,'4');assert.ok(bridges(true));
});
test('Relay death resets both state and supports at each incomplete stage',()=>{
 for(const stage of ['docked','anchored','retrieved']){load(5);const t=api.campaign.trials.find(t=>t.relay),n=id=>t.nodes.find(n=>n.id===id);use(n('1'));use(n('2'));if(stage!=='docked')use(n('3'));if(stage==='retrieved')use(n('2'));api.die('energy');for(let i=0;i<90;i++)route.step();assert.equal(api.player.lives,2);assert.equal(t.docked,null);assert.equal(t.anchored,false);assert.equal(api.campaign.carry,null);assert.ok(t.bridges.every(b=>!b.on&&api.tileAt(t.x0/16+b.col,b.row)==='.'));}
});
test('Clock switch geometry changes and expiration restores the safe initial configuration',()=>{
 load(5);const t=api.campaign.trials.find(t=>t.kind==='timed'&&t.bridges),n=id=>t.nodes.find(n=>n.id===id);use(n('1'));assert.deepEqual(t.bridges.map(b=>b.on),[true,true,false,false]);use(n('2'));assert.deepEqual(t.bridges.map(b=>b.on),[false,true,true,true]);api.simF=t.until+1;api.updateCampaign();assert.equal(t.progress,0);assert.ok(t.bridges.every(b=>!b.on));assert.equal(t.open,false);for(let c=t.gate-28;c<t.gate;c++)assert.equal(api.tileAt(t.x0/16+c,10),'#');use(n('1'));assert.ok(t.until>api.simF);
});
test('Prism cannot bypass R; R latches while the same beam is redirected to S; reset clears both',()=>{
 load(6);const t=api.campaign.trials.find(t=>t.dualLight),prism=t.nodes.find(n=>n.role==='prism');use(prism);assert.equal(prism.angle,0);const solution=require('./solve-mirror-layout')(t,(c,r)=>api.isSolid(api.tileAt(c,r)));for(const n of t.nodes.filter(n=>n.role==='mirror'))if(n.angle!==solution[n.id])use(n);for(let f=0;f<31;f++)api.updateCampaign();assert.equal(t.primed,true);assert.equal(t.lit,'R');assert.ok(t.bridges.every(b=>b.on));use(t.nodes.find(n=>n.id==='B'));assert.equal(api.mirrorTrace(t),false);assert.equal(t.primed,true);assert.ok(t.bridges.every(b=>b.on));api.resetCampaign();assert.equal(t.primed,false);assert.ok(t.bridges.every(b=>!b.on));assert.equal(prism.angle,0);assert.equal(t.solved,false);
});
test('Wrong rune resets; ordered input solves; holding DOWN counts once',()=>{
 load();const t=api.campaign.trials.find(t=>t.kind==='sequence');use(t.nodes[0]);assert.equal(t.progress,0);const n=t.nodes.find(n=>n.id===t.order[0]);locate(n);api.keys.ArrowDown=true;for(let i=0;i<20;i++)api.updateCampaign();assert.equal(t.progress,1);api.keys.ArrowDown=false;api.updateCampaign();for(const id of t.order.slice(1))use(t.nodes.find(n=>n.id===id));assert.equal(t.solved,true);
});
test('Weight requires pickup before deposit and survives wrong socket attempts',()=>{
 load();const t=api.campaign.trials.find(t=>t.kind==='weight');use(t.nodes[1]);assert.equal(t.solved,false);use(t.nodes[0]);assert.equal(api.campaign.carry,t.id);use(t.nodes[1]);assert.equal(t.solved,true);assert.equal(api.campaign.carry,null);
});
test('Seal requires charging guardian, not a stationary overlap or player',()=>{
 load();const t=api.campaign.trials[0],n=t.nodes[0],e=api.ents.find(e=>e.t==='K');locate(n);api.updateCampaign();assert.equal(n.active,false);e.x=n.x-e.w/2;e.y=n.y+8-e.h;e.state='idle';api.updateCampaign();assert.equal(n.active,false);e.state='charge';api.updateCampaign();assert.equal(t.solved,true);
});
test('Timer expiry before threshold resets, returns to switches, and cannot clear',()=>{
 load(5);const t=api.campaign.trials[0];use(t.nodes[0]);use(t.nodes[1]);assert.equal(t.open,true);api.player.x=t.gateX-20;api.simF=t.until+1;api.updateCampaign();assert.equal(t.open,false);assert.equal(t.progress,0);assert.equal(t.solved,false);assert.equal(api.tileAt(t.gateX/16,8),'#');api.levelClear();assert.equal(api.state,'play');
});
test('Threshold latches at exact deadline; no closing wall inside player',()=>{
 load(5);const t=api.campaign.trials[0];use(t.nodes[0]);use(t.nodes[1]);api.player.x=t.gateX-9;api.simF=t.until;api.updateCampaign();assert.equal(t.solved,true);api.simF+=100;api.updateCampaign();assert.equal(t.open,true);assert.equal(api.tileAt(t.gateX/16,8),'.');
});
test('Respawn retains solved puzzles, resets unsolved mirrors, weight and timer',()=>{
 load(6);const solved=api.campaign.trials.find(t=>t.kind==='sequence');for(const id of solved.order)use(solved.nodes.find(n=>n.id===id));const mirror=api.campaign.trials.find(t=>t.kind==='mirror'&&t.nodes.some(n=>n.id==='C'));use(mirror.nodes.find(n=>n.id==='A'));api.campaign.carry='fixture';api.resetCampaign();assert.equal(solved.solved,true);assert.equal(solved.open,true);assert.equal(api.campaign.carry,null);assert.equal(mirror.solved,false);assert.equal(mirror.nodes.find(n=>n.id==='C').angle,1);
});
test('N8 arena confines both edges at all heights and freezes during death',()=>{
 load(7);const b=api.campaign.final;api.player.x=b.x0+30;api.updateCampaign();assert.equal(b.active,true);for(const y of [16,48,80,120]){api.player.y=y;api.player.x=b.x0-25;api.updateCampaign();assert.ok(api.player.x>=b.x0+16);api.player.x=b.x1+20;api.updateCampaign();assert.ok(api.player.x+10<=b.x1-16);}const timer=b.timer;api.player.dead=20;api.updateCampaign();assert.equal(b.timer,timer);api.player.dead=0;api.resetCampaign();assert.equal(b.active,false);assert.equal(b.hp,6);
});
test('Boss vulnerability, phases, defeat delay and exit gate are coherent',()=>{
 load(7);const b=api.campaign.final;api.player.x=b.x0+30;api.updateCampaign();
 for(let hp=6;hp>0;hp--){b.state='open';b.timer=100;b.prevBottom=b.y-2;Object.assign(api.player,{x:b.x+25,y:b.y-17,vy:1,inv:0});api.updateCampaign();assert.equal(b.hp,hp-1);assert.equal(b.state,hp>1?'recover':'defeat');}
 assert.equal(b.defeated,false);Object.assign(api.player,{x:b.x0+35,y:142,vy:0});for(let f=0;f<121;f++)api.updateCampaign();assert.equal(b.defeated,true);for(let r=1;r<10;r++)assert.equal(api.tileAt(b.x1/16-1,r),'.');
});
test('Missed core opening returns to warning and offers another opening',()=>{
 load(7);const b=api.campaign.final;Object.assign(b,{active:true,state:'open',timer:1,hp:4,phase:2});
 Object.assign(api.player,{x:b.x0+45,y:62,vy:0,inv:1000});api.updateCampaign();assert.equal(b.state,'recover');assert.equal(b.hp,4);
 let frames=0;while(b.state!=='open'&&frames++<400)api.updateCampaign();assert.equal(b.state,'open');assert.equal(b.hp,4);assert.equal(b.defeated,false);
});
test('Lethal projectile on final stomp frame gives death, no simultaneous victory',()=>{
 load(7);const b=api.campaign.final;Object.assign(b,{active:true,state:'open',timer:100,hp:1,phase:3,prevBottom:60});
 Object.assign(api.player,{x:b.x+25,y:b.y-17,vy:1,inv:0,energy:1,lives:1});
 b.shots=[{x:api.player.x+5,y:api.player.y+9,vx:0,vy:0,life:10}];api.updateCampaign();
 assert.equal(api.player.lives,0);assert.ok(api.player.dead);assert.equal(b.hp,1);assert.equal(b.defeated,false);
 const timer=b.timer;for(let f=0;f<91;f++)route.step();assert.equal(api.state,'over');assert.equal(b.timer,timer);assert.equal(b.defeated,false);
});
test('Death during final defeat animation resets arena coherently before victory',()=>{
 load(7);const b=api.campaign.final;Object.assign(b,{active:true,state:'open',timer:100,hp:1,phase:3,prevBottom:60});
 Object.assign(api.player,{x:b.x+25,y:b.y-17,vy:1,inv:0});api.updateCampaign();assert.equal(b.state,'defeat');assert.equal(b.hp,0);
 api.die('energy');for(let f=0;f<90;f++)route.step();assert.equal(api.player.lives,2);assert.equal(b.defeated,false);assert.equal(b.hp,6);assert.equal(b.active,false);assert.equal(api.state,'play');
});
test('Snapshot restores campaign, map, both boss states and real input effects',()=>{
 load(7);const s=route.save();use(api.campaign.trials.find(t=>t.kind==='sequence').nodes[0]);api.campaign.final.hp=1;route.restore(s);assert.deepEqual(route.save(),s);
});
fs.writeFileSync('review/campaign-v3/rules.json',JSON.stringify({sourceHash:require('crypto').createHash('sha256').update(fs.readFileSync('index.html')).digest('hex'),scope:'Isolated state fixtures, not full input routes',passed:cases.length,cases},null,2));
