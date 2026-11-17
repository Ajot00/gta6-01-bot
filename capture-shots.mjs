import fs from 'node:fs';
const ws=new WebSocket('ws://127.0.0.1:9223/devtools/browser/a7e28695-081f-4561-b8f0-6a7e33f9be6b');
await new Promise((resolve,reject)=>{ws.onopen=resolve;ws.onerror=reject});let seq=0;const waits=new Map();ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id&&waits.has(m.id)){waits.get(m.id)(m);waits.delete(m.id)}};
const send=(method,params={},sessionId)=>new Promise(resolve=>{const id=++seq;waits.set(id,resolve);ws.send(JSON.stringify({id,method,params,...(sessionId?{sessionId}:{})}))});
const names=['1-cover','2-busted','3-city','4-east'];
for(let i=1;i<=4;i++){const target=await send('Target.createTarget',{url:'about:blank'});const id=target.result.targetId;const attached=await send('Target.attachToTarget',{targetId:id,flatten:true});const session=attached.result.sessionId;await send('Emulation.setDeviceMetricsOverride',{width:1280,height:720,deviceScaleFactor:1,mobile:false},session);await send('Page.enable',{},session);await send('Page.navigate',{url:`file://${process.cwd()}/game/index.html?shot=${i}`},session);await new Promise(r=>setTimeout(r,3000));const shot=await send('Page.captureScreenshot',{format:'jpeg',quality:82,fromSurface:true},session);fs.writeFileSync(`screenshots/${names[i-1]}.jpg`,Buffer.from(shot.result.data,'base64'));await send('Target.closeTarget',{targetId:id})}
ws.close();
