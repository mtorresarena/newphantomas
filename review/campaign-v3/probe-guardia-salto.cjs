'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const createGame=require('./route-harness-score1.cjs'),source=fs.readFileSync(path.join(__dirname,'candidate-score1.html'),'utf8'),w=JSON.parse(fs.readFileSync(path.join(__dirname,'score1-route-n5.json'),'utf8'));
const runs=[],holdFrames=+(process.argv[2]||1);
for(const [advanced,prefix] of [[false,37],[true,2789]]){
 const {api,route}=createGame(source);api.newGame();api.loadLevel(4);api.startLevel();let cursor=0;
 outer:for(const c of w.commands){route.input(c.a);for(let f=0;f<c.frames;f++){if(cursor===prefix)break outer;route.step();cursor++;}}
 const t=api.campaign.trials.find(t=>t.kind==='charge'&&(t.nodes.length>1)===advanced),e=api.ents.find(e=>e.t==='K'&&e.sx>=t.x0+(t.gate-28)*16&&e.sx<t.gateX);
 const inputs=[],events=[];let prevHurt=api.player.hurtT,hits=0,jumps=0,hold=0;
 for(let f=0;f<240&&!api.player.dead;f++){
  const p=api.player;if(e.state==='charge'&&Math.abs(e.x+e.w/2-p.x-5)<40&&p.onGround&&hold===0)hold=holdFrames;
  const a=[0,+(hold>0),0],vy=p.vy;if(hold>0)hold--;
  route.input(a);route.step();inputs.push(a);if(p.hurtT>prevHurt){hits++;events.push({frame:f+1,type:'hit'});}prevHurt=p.hurtT;if(p.vy<-3&&vy>=0){jumps++;events.push({frame:f+1,type:'jump',distance:Math.abs(e.x+e.w/2-p.x-5)});}
 }
 runs.push({advanced,prefix,frames:inputs.length,hits,jumps,dead:!!api.player.dead,events,inputs});
}
fs.writeFileSync(path.join(__dirname,holdFrames===1?'guardia-salto-reactivo.json':`guardia-salto-reactivo-hold${holdFrames}.json`),JSON.stringify({scope:'Legal original N5 input prefix; then jump only when charging guardian comes within40px. No state mutation, not a complete puzzle solution.',holdFrames,runs},null,2));console.log(JSON.stringify(runs.map(({inputs,...r})=>r)));
