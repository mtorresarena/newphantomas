'use strict';
const fs=require('fs'),path=require('path'),assert=require('assert/strict'),crypto=require('crypto'),createGame=require('./route-harness');
const dir='review/campaign-v3',source=fs.readFileSync('index.html','utf8'),sourceHash=crypto.createHash('sha256').update(source).digest('hex');
const round=Number((process.argv.find(a=>a.startsWith('--round='))||'--round=4').split('=')[1]);
const names=round>=6?['route-n5-cautious-retry-weight-trial5-2','route-n7-retry-mirror-trial5-2','route-n6-expire-trial4-2','route-n6-retry-timed-active-trial5-2']:['route-n5-retry-charge','route-n5-retry-sequence','route-n5-cautious-retry-weight','route-n6-retry-timed-active','route-n7-retry-mirror','route-n8-retry','route-n8-retry-phase2','route-n8-retry-phase3','route-n5-retry-service-key-4','route-n5-retry-service-door-4','route-n6-retry-service-key-2','route-n6-retry-service-door-2','route-n6-retry-service-key-4','route-n6-retry-service-door-4'];
const results=[];let pending=false;
for(const name of names){let file,w;for(const folder of (round>=6?['round'+round,'round6']:['round4','round3',''])){const p=path.join(dir,folder,name+'.json');if(fs.existsSync(p)){const candidate=JSON.parse(fs.readFileSync(p));if(candidate.complete){file=p;w=candidate;break;}}}if(!w){pending=true;console.log('PENDING '+name);continue;}
 const {api,route}=createGame(source);api.newGame();api.loadLevel(w.level-1);api.startLevel();let wasDead=false;const transitions=[];
 for(const c of w.commands){route.input(c.a);for(let f=0;f<c.frames&&api.state==='play';f++){route.step();if(!!api.player.dead!==wasDead){transitions.push({frame:api.simF,dead:!!api.player.dead,lives:api.player.lives,keys:api.player.keys,x:api.player.x,solved:api.campaign.trials.filter(t=>t.solved).map(t=>t.id),timed:api.campaign.trials.filter(t=>t.until).map(t=>({id:t.id,progress:t.progress,remaining:t.until-api.simF})),boss:api.campaign.final?{hp:api.campaign.final.hp,phase:api.campaign.final.phase,state:api.campaign.final.state}:null});wasDead=!!api.player.dead;}}}
 const deathCount=name.includes('-expire-')?0:1;
 assert.equal(api.state,'clear',name);assert.equal(api.player.lives,3-deathCount,name);assert.equal(transitions.filter(t=>t.dead).length,deathCount,name);assert(api.campaign.trials.every(t=>t.solved),name);
 if(!deathCount)assert(api.campaign.events.some(e=>e.type==='timeout'&&e.id==='4-2'),name);
 if(name.includes('timed-active'))assert(transitions.find(t=>t.dead).timed.some(t=>t.progress>0&&t.remaining>0),name);
 results.push({name,file,recordedSourceHash:w.sourceHash,inputHash:crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'),frames:api.simF,transitions,final:{state:api.state,lives:api.player.lives}});console.log('PASS '+name);
}
fs.writeFileSync(dir+'/round'+round+'/recovery-replays.json',JSON.stringify({sourceHash,scope:'Legal control traces from natural spawn through deliberate death or timer expiry to level completion; no gameplay state injection. Earlier compatible recovery evidence remains archived.',expected:names.length,complete:!pending,results},null,2));
if(pending)process.exitCode=2;
