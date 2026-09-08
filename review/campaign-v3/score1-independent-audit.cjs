'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const createGame=require('./route-harness-score1.cjs');
const source=fs.readFileSync(path.join(__dirname,'candidate-score1.html'),'utf8'),runs=[];
for(let level=5;level<=8;level++){
 const witness=JSON.parse(fs.readFileSync(path.join(__dirname,`score1-route-n${level}.json`),'utf8')),{api,route}=createGame(source);api.newGame();api.loadLevel(level-1);api.startLevel();
 const counts={frames:0,jumpStarts:0,directionCommandsChanged:0,neutral:0,useHeld:0,useEdges:0,charging:0,hits:0,bossHits:0,bossDamageTaken:0,mothDives:0,watcherShots:0,sentinelCharges:0,beetleStomps:0};
 const parts=Object.fromEntries(api.L.zones.filter(z=>!z.transition).map(z=>[z.part,{frames:0,verticalSupport:0,horizontalSupport:0,crumbleSupport:0}]));
 let direction=0,wasUse=false,minEnergy=100,previousHurt=0;
 for(const c of witness.commands){route.input(c.a);if(c.a[0]&&direction&&c.a[0]!==direction)counts.directionCommandsChanged++;if(c.a[0])direction=c.a[0];
  for(let f=0;f<c.frames&&api.state==='play';f++){
   const before={vy:api.player.vy,bossHp:api.campaign.final?.hp,bossActive:api.campaign.final?.active,ents:api.ents.map(e=>e.state),foes:api.campaign.foes.map(e=>e.state),orbSet:new Set(api.orbs)};
   route.step();counts.frames++;assert.equal(api.player.dead,0);assert.equal(api.player.lives,3);const p=api.player,part=parts[route.part().part];part.frames++;minEnergy=Math.min(minEnergy,p.energy);
   if(!c.a[0]&&!c.a[1]&&!c.a[2])counts.neutral++;const use=!!c.a[2]&&!c.a[1];if(use)counts.useHeld++;if(use&&!wasUse)counts.useEdges++;wasUse=use;
   if(p.vy<-3&&before.vy>=0)counts.jumpStarts++;if(p.charging)counts.charging++;
   if(p.hurtT>previousHurt){counts.hits++;if(before.bossActive)counts.bossDamageTaken++;}previousHurt=p.hurtT;
   if(api.campaign.final&&api.campaign.final.hp<before.bossHp)counts.bossHits++;
   counts.sentinelCharges+=api.ents.filter((e,i)=>e.t==='K'&&e.state==='charge'&&before.ents[i]!=='charge').length;
   counts.mothDives+=api.campaign.foes.filter((e,i)=>e.kind==='moth'&&e.state==='dive'&&before.foes[i]!=='dive').length;
   counts.watcherShots+=api.orbs.filter(o=>!before.orbSet.has(o)).length;
   if(p.mover?.t==='v')part.verticalSupport++;if(p.mover?.t==='h')part.horizontalSupport++;
   if(p.onGround&&api.crumbles.some(cr=>['solid','shaking'].includes(cr.state)&&Math.abs(cr.y-p.y-p.h)<.6&&p.x+p.w>cr.x&&p.x<cr.x+16))part.crumbleSupport++;
  }
 }
 counts.beetleStomps=api.campaign.events.filter(e=>e.type==='stomp').length;
 assert.equal(api.state,'clear');assert.equal(api.campaign.trials.filter(t=>t.solved).length,10);assert.equal(counts.frames,witness.frames);
 const kinds=[...new Set(api.campaign.trials.map(t=>t.kind))];
 runs.push({level,complete:true,counts,minEnergy,parts,puzzleKinds:kinds,finalTrialKind:api.campaign.trials.at(-1).kind,events:api.campaign.events});
}
const report={sha256:crypto.createHash('sha256').update(source).digest('hex'),scope:'Independent clean replays of frozen score-1 source/witnesses. Actual controls and observed mechanical events; no state injection or claim of human decisions.',runs};
fs.writeFileSync(path.join(__dirname,'score1-independent-audit.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(runs.map(({level,counts,minEnergy,parts,puzzleKinds,finalTrialKind})=>({level,counts,minEnergy,parts,puzzleKinds,finalTrialKind})),null,2));
