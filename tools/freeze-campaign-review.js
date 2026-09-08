'use strict';
// Freeze completed witnesses without replacing an earlier measurement silently.
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const root=path.join(__dirname,'..'),round=Number((process.argv.find(a=>a.startsWith('--round='))||'').split('=')[1])||0,dir=path.join(root,'review/campaign-v3',round?'round'+round:'harmonized-v2');
fs.mkdirSync(dir,{recursive:true});
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
function freeze(name,bytes){const p=path.join(dir,name);if(fs.existsSync(p)&&hash(fs.readFileSync(p))!==hash(bytes))throw Error('Frozen evidence changed: '+name);if(!fs.existsSync(p))fs.writeFileSync(p,bytes);return hash(bytes);}
const sourcePath=process.argv.includes('--existing-source')?path.join(dir,'index.html'):path.join(root,'index.html');
const sourceHash=freeze('index.html',fs.readFileSync(sourcePath)),files=[];
for(const policy of ['balanced','cautious','speed'])for(let level=1;level<=8;level++){
 const name=level<=4?`reference-n${level}-${policy}.json`:`route-n${level}${policy==='balanced'?'':'-'+policy}.json`,p=path.join(round?dir:path.join(root,'review/campaign-v3'),name);
 if(!fs.existsSync(p))continue;let data,bytes;try{bytes=fs.readFileSync(p);data=JSON.parse(bytes);}catch{continue;}
 if(data.protocol!=='harmonized-v2'||!data.complete)continue;
 files.push({level,policy,name,hash:freeze(name,bytes)});
}
const manifest={sourceHash,protocol:'harmonized-v2',...(round?{round}:{}),expected:24,frozen:files.length,complete:files.length===24,files};
fs.writeFileSync(path.join(dir,'manifest.json'),JSON.stringify(manifest,null,2));console.log(JSON.stringify(manifest,null,2));
