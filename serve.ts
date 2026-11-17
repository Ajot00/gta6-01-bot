import { createReadStream, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, resolve, join, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
const base=resolve(fileURLToPath(new URL('./game',import.meta.url)));
const port=Number(process.argv[2])||8080;
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json'};
createServer((req,res)=>{const url=new URL(req.url||'/',`http://127.0.0.1:${port}`);const rel=decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname);const file=resolve(join(base,rel));if(file!==base&&!file.startsWith(base+sep)){res.writeHead(403).end();return}try{const stat=statSync(file);if(!stat.isFile())throw Error();res.writeHead(200,{'content-type':types[extname(file)]||'application/octet-stream','content-length':stat.size,'cache-control':'no-store'});createReadStream(file).pipe(res)}catch{res.writeHead(404).end('not found')}}).listen(port,'127.0.0.1',()=>console.log(`Solmere at http://127.0.0.1:${port}`));
