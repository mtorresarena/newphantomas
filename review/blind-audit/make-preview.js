const fs=require('fs');
let html=fs.readFileSync(__dirname+'/../index.html','utf8');
html=html.replace('<head>','<head><base href="../">').replace('<script>','<script>window.requestAnimationFrame=()=>0;window.setInterval=()=>0;window.__PHANTOMAS_TEST__=a=>a.preview(new URLSearchParams(location.search).get("mode")||"room:0:0");</script><script>');
fs.writeFileSync(__dirname+'/render-preview.html',html);
