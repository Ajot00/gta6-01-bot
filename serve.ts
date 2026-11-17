import { createServer } from 'node:http';
import { readFileSync, statSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('.', import.meta.url)), 'game');
const types = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.json':'application/json' };
createServer((req,res)=>{const path=normalize(decodeURIComponent((req.url||'/').split('?')[0]));const file=join(root,path==='/'?'index.html':path);try{if(!file.startsWith(root)||!statSync(file).isFile())throw Error();res.writeHead(200,{'content-type':`${types[extname(file)]||'application/octet-stream'}; charset=utf-8`,'cache-control':'no-store'});res.end(readFileSync(file))}catch{res.writeHead(404);res.end('Not found')}}).listen(8080,'127.0.0.1',()=>console.log('Solmere available on http://127.0.0.1:8080'));
