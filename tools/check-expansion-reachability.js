'use strict';
const assert=require('assert/strict'),fs=require('fs'),path=require('path'),crypto=require('crypto'),{checkLevel}=require('./check-levels');
const results=[];
for(let li=4;li<8;li++){
 const result=checkLevel(li);results.push({level:li+1,...result});
 console.log(`N${li+1}: meta=${result.goalReached}, objetos inaccesibles=${result.missing.length}, puertas cerradas=${result.doorsLeft.length}`);
 assert.ok(result.goalReached&&!result.missing.length&&!result.doorsLeft.length,`N${li+1}: geometría incompleta`);
}
const sourceSha256=crypto.createHash('sha256').update(fs.readFileSync(path.join(__dirname,'..','index.html'))).digest('hex');
fs.writeFileSync(path.join(__dirname,'..','review','reachability-v2.3.json'),JSON.stringify({sourceSha256,scope:'Geometry only; enemies removed by BFS harness',results},null,2)+'\n');
