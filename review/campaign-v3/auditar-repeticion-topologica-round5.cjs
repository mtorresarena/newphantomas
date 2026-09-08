'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),game=require('./route-harness-score1.cjs'),sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const source=fs.readFileSync(path.join(__dirname,'round5/index.html'),'utf8'),{api}=game(source),results=[];
for(const level of [5,6,7,8]){api.newGame();api.loadLevel(level-1);const raw=api.buildLevel(api.LEVELS[level-1]);const entries=[];
 for(const t of api.campaign.trials){const origin=t.gateX-28*16,c0=origin/16,c1=t.gateX/16+1;
  const topology={kind:t.kind,duration:t.duration??null,order:t.order??null,nodes:t.nodes.map(n=>({id:n.id,role:n.role,x:n.x-t.gateX,y:n.y,initialAngle:n.initialAngle??null,direction:n.role==='source'?(n.dir??1):null})),map:raw.map.map(row=>row.slice(c0,c1).join(''))};
  entries.push({id:t.id,part:t.part,kind:t.kind,gateX:t.gateX,topologyHash:sha(JSON.stringify(topology)),topology});
 }
 const groups=new Map();for(const e of entries){const prev=groups.get(e.topologyHash)||[];prev.push(e.id);groups.set(e.topologyHash,prev);}
 const repeated=[...groups].filter(([,ids])=>ids.length>1).map(([hash,ids])=>({hash,ids,kind:entries.find(e=>e.topologyHash===hash).kind}));results.push({level,entries,repeated});console.log(JSON.stringify({level,repeated}));
}
fs.writeFileSync(path.join(__dirname,'repeticion-topologica-round5.json'),JSON.stringify({sourceHash:sha(source),scope:'Static trial topology normalized to its gate: kind, deadline, ordered nodes/angles/heights and complete 29-column chamber tile matrix. Does not equate global enemy timing, resource state, route experience or surrounding transitions. No grade.',results},null,2)+'\n');
