'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto'),sha=s=>crypto.createHash('sha256').update(s).digest('hex');
// Harness adaptation only: keep distinct element objects and their production
// event listeners. This is an event-handler fixture, not browser CSS/hardware.
let harness=fs.readFileSync(path.join(__dirname,'route-harness-score1.cjs'),'utf8');
const old="const el=()=>({width:0,height:0,style:{},classList:{add:noop},getContext:()=>ctx,addEventListener:noop});";
const replacement="const elements=new Map();const el=()=>({width:0,height:0,style:{},classList:{add:noop},getContext:()=>ctx,handlers:new Map(),addEventListener(type,fn){if(!this.handlers.has(type))this.handlers.set(type,[]);this.handlers.get(type).push(fn);}});const elementById=id=>{if(!elements.has(id))elements.set(id,el());return elements.get(id);};";
assert.ok(harness.includes(old));harness=harness.replace(old,replacement).replace('getElementById:el','getElementById:elementById').replace('step(){step();parts=[];},','step(){step();parts=[];},readInput(){return structuredClone({touch,keys});},').replace('return {api,route:sandbox.route};',"sandbox.route.pointer=(id,type,pointerId)=>{for(const fn of elementById(id).handlers.get(type)||[])fn({pointerId,pointerType:'touch',preventDefault:noop});};return {api,route:sandbox.route};");
harness=harness.replaceAll('classList:{add:noop}','classList:{add:noop,toggle:noop}').replace('documentElement:{}','documentElement:{style:{setProperty:noop}}');
const mod={exports:{}};new Function('require','module','__dirname',harness)(require,mod,__dirname);const game=mod.exports,results=[];
for(const round of [8,9]){const source=fs.readFileSync(path.join(__dirname,`round${round}/index.html`),'utf8');for(const kind of ['touch','keyboard']){
 const {api,route}=game(source);api.newGame();api.loadLevel(4);api.startLevel();
 if(kind==='touch'){route.pointer('tr','pointerdown',11);route.pointer('tj','pointerdown',12);route.pointer('tp','pointerdown',13);}else{route.input([1,1,1]);route.press('KeyP',false);}
 assert.equal(api.state,'pause');const inputWhilePaused=route.readInput(),clock=api.simF;for(let f=0;f<30;f++)route.step();assert.equal(api.simF,clock);
 // Release outside the original element: the production body has no matching
 // release handler. DOM/CSS boundary events are intentionally not simulated.
 route.pointer('body','pointerup',11);route.pointer('body','pointerup',12);
 if(kind==='touch')route.pointer('tp','pointerdown',13);else route.press('KeyP',false);assert.equal(api.state,'play');const resumed=route.readInput();
 const relevant=kind==='touch'?Object.values(resumed.touch):['ArrowRight','Space','ArrowDown'].map(k=>resumed.keys[k]);const retained=relevant.some(Boolean);assert.equal(retained,round===8);
 if(round===9){for(let f=0;f<10;f++)route.step();const x=api.player.x;if(kind==='touch')route.pointer('tr','pointerdown',21);else route.input([1,0,0]);for(let f=0;f<12;f++)route.step();assert.ok(api.player.x>x+5,'A fresh press remains functional');}
 results.push({round,sourceHash:sha(source),kind,fixture:true,clockFrozen:true,inputWhilePaused,resumed,retained,freshPressVerified:round===9});console.log(JSON.stringify({round,kind,retained,clockFrozen:true,freshPressVerified:round===9}));
}}
fs.writeFileSync(path.join(__dirname,'pausa-controles-fuente89.json'),JSON.stringify({scope:'Independent headless production input-handler fixtures. Source8 retains held input; source9 clears it on pause and fresh input works. Does not model CSS boundary events or physical devices; browser evidence is separate.',results},null,2)+'\n');
