import { writeFileSync } from 'node:fs';
const targets = await (await fetch('http://localhost:9223/json/list')).json();
const target = targets.find(item => item.type === 'page');
if (!target) throw new Error('No page in the existing Chrome CDP session');
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { socket.onopen=resolve; socket.onerror=reject; });
let nextId=0; const pending=new Map();
socket.onmessage=event=>{const msg=JSON.parse(event.data);if(msg.id&&pending.has(msg.id)){const p=pending.get(msg.id);pending.delete(msg.id);msg.error?p.reject(new Error(msg.error.message)):p.resolve(msg.result);}};
function send(method,params={}){const id=++nextId;return new Promise((resolve,reject)=>{pending.set(id,{resolve,reject});socket.send(JSON.stringify({id,method,params}));});}
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride',{width:1280,height:720,deviceScaleFactor:1,mobile:false});
for(const [n,name] of [['1','1-cover'],['2','2-busted'],['3','3-city'],['4','4-east']]){
  await send('Page.navigate',{url:`file://${process.cwd()}/game/index.html?shot=${n}`});
  await wait(1200);
  const shot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false,fromSurface:true});
  writeFileSync(new URL(`./screenshots/${name}.png`,import.meta.url),Buffer.from(shot.data,'base64'));
}
socket.close();
