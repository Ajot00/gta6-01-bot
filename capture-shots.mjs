import {writeFileSync,mkdirSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';

// Reuse the already-running browser and freeze each local shot at a fixed viewport.
const root=fileURLToPath(new URL('.',import.meta.url)),meta=await(await fetch('http://127.0.0.1:9223/json/version')).json(),ws=new WebSocket(meta.webSocketDebuggerUrl);
await new Promise((resolve,reject)=>{ws.onopen=resolve;ws.onerror=reject});let serial=0;const pending=new Map();
ws.onmessage=event=>{const message=JSON.parse(event.data);if(message.id&&pending.has(message.id)){pending.get(message.id)(message);pending.delete(message.id)}};
function call(method,params={},sessionId){return new Promise((resolve,reject)=>{const id=++serial,timer=setTimeout(()=>{pending.delete(id);reject(Error(`CDP timeout: ${method}`))},9000);pending.set(id,message=>{clearTimeout(timer);message.error?reject(Error(message.error.message)):resolve(message)});ws.send(JSON.stringify({id,method,params,...(sessionId?{sessionId}:{})}))})}
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms)),names=['1-cover','2-busted','3-city','4-east'];mkdirSync(join(root,'screenshots'),{recursive:true});
for(let shot=1;shot<=4;shot++){const target=(await call('Target.createTarget',{url:'about:blank'})).result.targetId,session=(await call('Target.attachToTarget',{targetId:target,flatten:true})).result.sessionId;await call('Emulation.setDeviceMetricsOverride',{width:1280,height:720,deviceScaleFactor:1,mobile:false},session);await call('Page.enable',{},session);await call('Runtime.enable',{},session);await call('Page.navigate',{url:`${pathToFileURL(join(root,'game/index.html')).href}?shot=${shot}&seed=1`},session);let ready=false;for(let attempt=0;attempt<45;attempt++){await pause(150);const state=await call('Runtime.evaluate',{expression:'window.__shotReady===true',returnByValue:true},session);if(state.result?.result?.value){ready=true;break}}if(!ready)throw Error(`shot ${shot} not ready`);const image=await call('Page.captureScreenshot',{format:'jpeg',quality:82,fromSurface:true},session);writeFileSync(join(root,'screenshots',names[shot-1]+'.jpg'),Buffer.from(image.result.data,'base64'));await call('Target.closeTarget',{targetId:target})}
ws.close();console.log('Captured four staged JPEGs at 1280x720.');
