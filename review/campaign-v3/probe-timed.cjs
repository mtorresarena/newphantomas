'use strict';
// Montaje de estado de borde: verifica el cierre, no una ruta alcanzada jugando.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const file=path.join(__dirname,'../../tools/campaign-runtime.js'),source=fs.readFileSync(file,'utf8');
const context={structuredClone,Math,simF:11,player:{x:168,y:142,w:10,h:18,dead:0},inp:{d:false,j:false},cam:{x:0},W:320,TS:16,
 L:{map:Array.from({length:12},()=>Array(30).fill('.'))},SFX:new Proxy({},{get:()=>()=>{}}),showMsg:()=>{},
 over:(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y};
const result=vm.runInNewContext(source+`
campaign={trials:[{id:'probe',kind:'timed',name:'probe',x0:0,gateX:160,open:true,solved:false,until:10,progress:2,nodes:[]}],hazards:[],foes:[],final:null,events:[],downHeld:false};
updateCampaign();
const occupied={...campaign.trials[0],nodes:[]};
player.x=177;simF++;updateCampaign();
({occupied,afterExit:{...campaign.trials[0],nodes:[]},gateTile:L.map[9][10],events:campaign.events});`,context,{timeout:1000});
const report={file,runtimeSha256:crypto.createHash('sha256').update(source).digest('hex'),scope:'Fabricated edge-state unit probe, not proof that a player reaches it on an authored route.',result};
fs.writeFileSync(path.join(__dirname,'probe-timed.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
