import { createServer } from 'node:http';
import { readFileSync, statSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
const root=join(fileURLToPath(new URL('.',import.meta.url)),'game');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json'};
createServer((req,res)=>{const path=normalize(decodeURIComponent((req.url||'/').split('?')[0])).replace(/^([/\\]|\.\.(?:[/\\]|$))+/,'');const file=join(root,path||'index.html');try{if(!statSync(file).isFile())throw Error();res.writeHead(200,{'content-type':types[extname(file)]||'application/octet-stream'});res.end(readFileSync(file))}catch{res.writeHead(404);res.end('Not found')}}).listen(8080,'127.0.0.1');
