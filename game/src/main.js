import * as T from '../vendor/three/three.module.min.js';
import {buildCity,terrainHeight,repairTerrainAxis} from './city.js';
import {buildTraffic,makeCar} from './traffic.js';
import {buildPolice} from './police.js';
import {paintMap} from './hud.js';
import {GLASSLINE} from './missions.js';

const shot=Number(new URLSearchParams(location.search).get('shot')||0);
document.body.dataset.shot=shot;
const renderer=new T.WebGLRenderer({canvas:document.querySelector('#world'),antialias:true});
renderer.setPixelRatio(1);renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;
renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.outputColorSpace=T.SRGBColorSpace;
renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;
const sky=document.createElement('canvas');sky.width=1024;sky.height=512;
const skyCtx=sky.getContext('2d'),gradient=skyCtx.createLinearGradient(0,0,0,512);
gradient.addColorStop(0,'#55446f');gradient.addColorStop(.48,'#a06b83');gradient.addColorStop(.78,'#ef9268');gradient.addColorStop(1,'#f5b16f');skyCtx.fillStyle=gradient;skyCtx.fillRect(0,0,1024,512);
for(let i=0;i<24;i++){skyCtx.fillStyle=i%2?'#75608488':'#e68a7b66';skyCtx.beginPath();skyCtx.ellipse(i*71%1024,90+i*31%180,70+i%5*15,10+i%4*5,0,0,Math.PI*2);skyCtx.fill()}
const skyTex=new T.CanvasTexture(sky);skyTex.mapping=T.EquirectangularReflectionMapping;skyTex.colorSpace=T.SRGBColorSpace;
const scene=new T.Scene();scene.background=skyTex;scene.fog=new T.Fog('#bd8275',220,620);
scene.add(new T.HemisphereLight('#ffd4ad','#30293a',1.25));
const sun=new T.DirectionalLight('#ffd39a',3.2);sun.position.set(-95,115,-115);sun.castShadow=true;
sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-210;sun.shadow.camera.right=210;
sun.shadow.camera.top=210;sun.shadow.camera.bottom=-210;sun.shadow.bias=-.0002;scene.add(sun);
const disc=new T.Mesh(new T.CircleGeometry(12,32),new T.MeshBasicMaterial({color:'#ffb45e'}));
disc.position.set(0,44,-350);scene.add(disc);
buildCity(scene);
scene.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true}});
repairTerrainAxis(scene);
const player=makeCar(scene,'#263d51'),traffic=buildTraffic(scene),police=buildPolice(scene),people=[];
function person(x,z,color,redAccent=false){const g=new T.Group(),cloth=new T.MeshStandardMaterial({color}),skin=new T.MeshStandardMaterial({color:'#c68b69'});function part(geo,m,a,b,c){const o=new T.Mesh(geo,m);o.position.set(a,b,c);o.castShadow=true;g.add(o)}part(new T.BoxGeometry(.46,.72,.3),cloth,0,1.05,0);part(new T.SphereGeometry(.17,10,8),skin,0,1.6,0);if(redAccent)part(new T.BoxGeometry(.12,.65,.33),new T.MeshStandardMaterial({color:'#c6363e'}),.2,1.08,0);for(const s of [-1,1]){part(new T.BoxGeometry(.14,.6,.16),cloth,s*.34,1.05,0);part(new T.BoxGeometry(.16,.65,.18),cloth,s*.14,.35,0)}g.position.set(x,0,z);g.userData.pedestrian=true;scene.add(g);people.push(g);return g}
for(let i=0;i<10;i++)person(-24+i*5,20+i%3*4,['#dd8250','#357088','#dfbf64','#77434a'][i%4]);
for(let i=0;i<12;i++)person(262+i%4*8,28+Math.floor(i/4)*9,['#e58251','#326b7d','#dfbf64'][i%3]);
const nia=person(-7,-105,'#202a36',true),camera=new T.PerspectiveCamera(57,innerWidth/innerHeight,.1,1100);
let speed=84,driving=true;const prompt=document.querySelector('.prompt');
paintMap(document.querySelector('.map canvas'),shot===4?'east':'marina');
function orientAlongX(obj){obj.rotation.y=Math.PI/2}
function stage(){
 if(shot===1){player.position.set(0,terrainHeight(0,-110),-110);orientAlongX(player);camera.position.set(-16,4.8,-110);camera.lookAt(34,1.3,-110);camera.fov=57;camera.updateProjectionMatrix();police.cars[0].position.set(-5,0,-107);police.cars[1].position.set(-10,0,-113);police.cars.forEach(orientAlongX);traffic.forEach((c,i)=>{c.position.set(28+i*15,0,-110+(i%2?4:-4));orientAlongX(c)});for(let i=0;i<6;i++)person(28+i*8,-97,'#d77b4b');document.querySelector('.place').textContent='MARINA QUARTER'}
 else if(shot===2){player.visible=false;camera.position.set(0,10,29);camera.lookAt(0,0,0);nia.position.set(-2,0,2);document.querySelector('.place').textContent='MARINA QUARTER';prompt.textContent='F · TALK / STEAL'}
 else if(shot===3){camera.position.set(160,205,205);camera.lookAt(150,0,0);camera.fov=48;camera.updateProjectionMatrix();document.querySelector('.place').textContent='SOLMERE WATERFRONT'}
 else if(shot===4){police.cars.forEach(c=>c.visible=false);camera.position.set(7,8,27);camera.lookAt(0,0,-15);document.querySelector('.place').textContent='EAST PROMENADE';prompt.textContent='E · STEAL VEHICLE'}
 else{camera.position.set(0,5,14);camera.lookAt(0,1,-20)}
}
stage();addEventListener('keydown',e=>{const k=e.key.toLowerCase();if(k==='w'){speed=Math.min(140,speed+4);document.querySelector('#speed').textContent=String(speed).padStart(3,'0')}if(k==='e'){driving=!driving;prompt.textContent=driving?'E · EXIT VEHICLE':'E · ENTER VEHICLE'}if(k==='f')prompt.textContent='F · TALK / STEAL'});
let ready=false;function render(){renderer.render(scene,camera);if(shot&&!ready){ready=true;window.__shotReady=true}requestAnimationFrame(render)}render();
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});
window.__game={GLASSLINE,terrainHeight,traffic,people,police,player};
