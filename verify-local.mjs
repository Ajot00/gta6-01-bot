import {readdir,readFile,stat} from 'node:fs/promises';
import {resolve,join,extname,relative,normalize} from 'node:path';
import {buildDossier} from './vendor/makefun-game.ts';
import {terrainHeight,TERRAIN_RANGE_MIN} from './game/src/city.js';
const root=resolve(new URL('.',import.meta.url).pathname),out=resolve(process.env.MAKEFUN_OUTPUT_DIR||'/output');
const gates=[];function gate(name,ok,note=''){gates.push([name,Boolean(ok),note])}
const all=await readdir(join(root,'game'),{recursive:true}),plain=[];let bytes=0;
for(const name of all){const s=await stat(join(root,'game',name));if(s.isFile()){plain.push(name);bytes+=s.size}}
gate('game_files',plain.length<=993&&bytes<=48*1024*1024&&(await stat(join(root,'game/index.html'))).size<=1024*1024,`${plain.length} files / ${bytes} bytes`);
const visited=new Set(),queue=['index.html'];let refsOk=true;
while(queue.length){const name=normalize(queue.pop());if(visited.has(name))continue;visited.add(name);const abs=resolve(join(root,'game',name));if(!abs.startsWith(join(root,'game')+'/')){refsOk=false;continue}let source;try{source=await readFile(abs,'utf8')}catch{refsOk=false;continue}if(/(?:src|href)=["']https?:|from\s*["']https?:|import\(["']https?:/.test(source))refsOk=false;for(const m of source.matchAll(/(?:src|href)=["']([^"']+)|(?:from\s*|import\()["']([^"']+)/g)){const ref=m[1]||m[2];if(ref.startsWith('data:')||ref.startsWith('#'))continue;if(/^[a-z]+:/i.test(ref))continue;const clean=ref.split(/[?#]/)[0];if(clean)queue.push(normalize(join(name,'..',clean)))} }
gate('references',refsOk,'local script, style, and asset graph');
const names=await readdir(join(root,'screenshots'));let imageOk=names.length>=3&&names.length<=4;
for(const name of names){const data=await readFile(join(root,'screenshots',name));let width=0,height=0,limit=2;while(limit<data.length){if(data[limit++]!==0xff)continue;let marker=data[limit++];while(marker===0xff)marker=data[limit++];if([0xc0,0xc1,0xc2,0xc3,0xc5,0xc6,0xc7,0xc9,0xca,0xcb,0xcd,0xce,0xcf].includes(marker)){height=data.readUInt16BE(limit+3);width=data.readUInt16BE(limit+5);break}limit+=data.readUInt16BE(limit)}const info=await stat(join(root,'screenshots',name));imageOk&&=extname(name).toLowerCase()==='.jpg'&&info.size<=262144&&width<=1280&&height<=1280&&Math.min(width,height)>=480}
gate('screenshots',imageOk,`${names.length} JPEG captures`);
const expected=Buffer.from(buildDossier(out,{text_max_bytes:163840,screenshots:{max:4,max_bytes:262144},game_max_files:993,game_max_bytes:50331648})),actual=await readFile(join(out,'dossier.json')).catch(()=>Buffer.alloc(0));
gate('dossier_matches',expected.equals(actual),'rebuilt dossier byte comparison');
const city=await readFile(join(root,'game/src/city.js'),'utf8'),cars=await readFile(join(root,'game/src/traffic.js'),'utf8'),police=await readFile(join(root,'game/src/police.js'),'utf8'),main=await readFile(join(root,'game/src/main.js'),'utf8');
const cones=[...city.matchAll(/ConeGeometry\(([^,]+)/g)].map(m=>Number(m[1]));gate('no_pyramid',cones.every(x=>x<=5),`ConeGeometry first arguments: ${cones.join(',')||'none'}`);
const heights=[];for(let x=-240;x<=240;x+=80)for(let z=-220;z<=220;z+=80)heights.push(terrainHeight(x,z));
gate('uneven_terrain',Math.max(...heights)-Math.min(...heights)>=TERRAIN_RANGE_MIN&&city.includes('bezierCurveTo'),'sampled height field range and tire-track texture');
gate('detailed_cars',cars.includes('CylinderGeometry')&&cars.includes('windowBand')&&cars.includes('lightBar'),'four wheels, glazing, lamps');
gate('officers_present',/OFFICER_COUNT\s*=\s*4/.test(police)&&main.includes('buildPolice'),'four officers and two pursuit cars');
gate('street_density',/length:6/.test(cars)&&/i<10/.test(main)&&/i<12/.test(main),'six traffic cars, pedestrians, patrol');
for(const [name,ok,note]of gates)console.log(`${ok?'PASS':'FAIL'} ${name} — ${note}`);console.log(`SUMMARY ${gates.filter(g=>g[1]).length}/${gates.length}`);if(gates.some(g=>!g[1]))process.exitCode=1;
