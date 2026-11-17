import { writeFileSync } from 'node:fs';
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
for(const [n,name] of [['1','1-cover'],['2','2-busted'],['3','3-city'],['4','4-east']]){
  const target=await(await fetch('http://127.0.0.1:9223/json/new?about:blank',{method:'PUT'})).json();
  const socket=new WebSocket(target.webSocketDebuggerUrl);await new Promise((r,j)=>{socket.onopen=r;socket.onerror=j;});
  let id=0;const pending=new Map();socket.onmessage=e=>{const m=JSON.parse(e.data);if(m.id&&pending.has(m.id)){const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(Error(m.error.message)):p.resolve(m.result);}};
  const send=(method,params={})=>new Promise((resolve,reject)=>{const mid=++id;pending.set(mid,{resolve,reject});socket.send(JSON.stringify({id:mid,method,params}));});
  await send('Page.enable');await send('Runtime.enable');await send('Emulation.setDeviceMetricsOverride',{width:1280,height:720,deviceScaleFactor:1,mobile:false});
  await send('Page.navigate',{url:`file://${process.cwd()}/game/index.html?shot=${n}`});
  let state;for(let i=0;i<30;i++){await wait(400);try{state=await send('Runtime.evaluate',{expression:'JSON.stringify({ready:window.__shotReady===true,errors:window.__errors||[]})',returnByValue:true});if(JSON.parse(state.result.value).ready)break;}catch{}}
  const ready=state&&JSON.parse(state.result.value).ready;if(!ready)throw Error(`shot ${n} did not become ready`);
  const shot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false,fromSurface:true});
  writeFileSync(new URL(`./screenshots/${name}.png`,import.meta.url),Buffer.from(shot.data,'base64'));console.log(`${name}: captured`);socket.close();
}
