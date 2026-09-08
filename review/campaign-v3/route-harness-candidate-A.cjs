'use strict';
// Headless real game loop. Snapshot/restore exists only in this test VM, never in production.
const fs=require('fs'),path=require('path'),vm=require('vm');
module.exports=function createGame(source){
 const html=source||fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
 const js=html.slice(html.indexOf('<script>')+8,html.lastIndexOf('</script>'));
 const noop=()=>{};
 const ctx=new Proxy({},{get:(t,k)=>k==='createLinearGradient'||k==='createRadialGradient'?()=>({addColorStop:noop}):k==='measureText'?()=>({width:0}):noop,set:()=>true});
 const el=()=>({width:0,height:0,style:{},classList:{add:noop},getContext:()=>ctx,addEventListener:noop});
 const sandbox={console,Math,structuredClone,setInterval:()=>0,clearInterval:noop,setTimeout:()=>0,clearTimeout:noop,
  matchMedia:()=>({matches:false}),performance:{now:()=>0},requestAnimationFrame:noop,innerWidth:1280,innerHeight:720,
  addEventListener:noop,navigator:{},localStorage:{getItem:()=>null,setItem:noop},
  document:{getElementById:el,createElement:el,body:{classList:{add:noop}},hidden:false,addEventListener:noop,documentElement:{}}};
 sandbox.window=sandbox;let api;sandbox.__PHANTOMAS_TEST__=a=>{api=a;};vm.createContext(sandbox);
 vm.runInContext(js+`
 window.route={
  save(){return {...structuredClone({player,ents,orbs,balls,movers,crumbles,items,check,stats,total,cam,frame,tick,simF,state,continued,alarmT,doorCd,shake,zoneName,msg,fadeT,boss,campaign:typeof campaign==='undefined'?null:campaign}),map:L.map.map(r=>r.join(''))};},
  restore(s){({player,ents,orbs,balls,movers,crumbles,items,check,stats,total,cam,frame,tick,simF,state,continued,alarmT,doorCd,shake,zoneName,msg,fadeT,boss}=structuredClone(s));if(typeof campaign!=='undefined')campaign=structuredClone(s.campaign);L.map=s.map.map(r=>typeof r==='string'?r.split(''):r.slice());parts=[];},
  input(a){clearInput();keys.ArrowRight=a[0]>0;keys.ArrowLeft=a[0]<0;keys.Space=!!a[1];keys.ArrowDown=!!a[2];},
  step(){step();parts=[];},
  camera(){return cam.x;},
  part(){return zoneAt(player.x+5);}
 };`,sandbox,{filename:'index.html'});
 return {api,route:sandbox.route};
};
