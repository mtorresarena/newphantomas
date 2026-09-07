'use strict';
// Paired geometric controls: target reachable normally, unreachable when removing
// the named support mechanic from this part. This is not an enemy difficulty test.
const fs=require('fs'),path=require('path'),{api,checkLevel}=require('./check-levels');
const cases=[[5,2,'_'],[5,3,'!'],[5,4,'-'],[5,5,'!'],[5,5,'_'],[6,4,'_'],[6,5,'_'],[7,2,'_'],[7,3,'-'],[7,3,'_'],[7,4,'!'],[7,4,'_'],[7,5,'!'],[7,5,'_']];
const report=[];let failed=0;
for(const [li,part,mechanic] of cases){
 const original=api.LEVELS[li],room=original.segs.find(s=>s.part===part&&!s.transition);
 const probe=remove=>{api.LEVELS[li]={...original,segs:[{...room,rows:room.rows.map(r=>remove?r.split(mechanic).join('.'):r)}]};const r=checkLevel(li);return !r.missing.some(i=>i.t==='k'||i.t==='S')&&(room.rows.some(r=>r.includes('S'))?r.goalReached:true);};
 const baseline=probe(false),removed=probe(true);api.LEVELS[li]=original;
 const ok=baseline&&!removed;report.push({level:li+1,part,mechanic,baseline,removed,ok});if(!ok)failed++;
 console.log(`${ok?'PASS':'FAIL'} N${li+1} P${part} ${mechanic}: normal=${baseline}, sin soporte=${removed}`);
}
fs.writeFileSync(path.join(__dirname,'..','review','required-mechanics-v2.3.json'),JSON.stringify(report,null,2)+'\n');
process.exitCode=failed?1:0;
