'use strict';
// Geometry-only regression: a fall onto the dry end bank must not strand the
// player below the goal/key. Real physics BFS, with enemies removed by its harness.
const assert=require('assert/strict'),fs=require('fs'),path=require('path'),{api,checkLevel}=require('./check-levels');
const cases=[[4,5,50],[5,5,52],[6,5,57],[7,4,62],[7,5,74]],results=[];
for(const [li,part,col] of cases){
 const original=api.LEVELS[li],room=original.segs.find(s=>s.part===part&&!s.transition);
 const rows=room.rows.map(r=>r.replace(/[PC]/g,'.').split(''));rows[9][col]='P';
 api.LEVELS[li]={...original,segs:[{...room,rows:rows.map(r=>r.join(''))}]};
 const result=checkLevel(li);api.LEVELS[li]=original;
 const target=part===5?'S':'k',reachable=target==='S'?result.goalReached:!result.missing.some(i=>i.t==='k');
 results.push({level:li+1,part,startColumn:col,target,reachable});
 assert.ok(reachable,`N${li+1} P${part}: caída en suelo seco sin retorno al objetivo`);
}
fs.writeFileSync(path.join(__dirname,'..','review','dry-floor-recovery-v2.3.json'),JSON.stringify(results,null,2)+'\n');console.log(JSON.stringify(results,null,2));
