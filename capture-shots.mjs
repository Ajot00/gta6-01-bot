import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('.', import.meta.url));
const game = new URL('./game/index.html', import.meta.url).href;
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
let sequence = 0;
async function capture(number, name) {
  const tab = await (await fetch('http://127.0.0.1:9223/json/new?about:blank', { method: 'PUT' })).json();
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
  const pending = new Map();
  ws.onmessage = event => { const msg = JSON.parse(event.data); if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg.result || {}); pending.delete(msg.id); } };
  const send = (method, params = {}) => new Promise(resolve => { const id = ++sequence; pending.set(id, resolve); ws.send(JSON.stringify({ id, method, params })); });
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 720, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: `${game}?shot=${number}` });
  for (let i=0;i<30;i++) { await sleep(250); const value=await send('Runtime.evaluate',{expression:'window.__shotReady===true',returnByValue:true}); if(value.result?.value)break; }
  await sleep(1400);
  const image=await send('Page.captureScreenshot',{format:'jpeg',quality:78,fromSurface:true});
  writeFileSync(join(root,'screenshots',name),Buffer.from(image.data,'base64'));
  ws.close();
  return Buffer.from(image.data,'base64').length;
}
mkdirSync(join(root,'screenshots'),{recursive:true});
for (const [number,name] of [[1,'1-cover.jpg'],[2,'2-busted.jpg'],[3,'3-city.jpg'],[4,'4-east.jpg']]) {
  const size=await capture(number,name);
  console.log(`${name}: ${size} bytes`);
}
