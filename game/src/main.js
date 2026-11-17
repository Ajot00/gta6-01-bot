import * as T from '../vendor/three/three.module.min.js';
import {buildCity} from './city.js';
import {makeTraffic} from './traffic.js';
import {makePolice} from './police.js';
import {missionState} from './missions.js';
import {paintMap} from './hud.js';
import {signal} from './audio.js';

const canvas=document.querySelector('#world');
const renderer=new T.WebGLRenderer({canvas,antialias:true});
renderer.setPixelRatio(1);renderer.setSize(innerWidth,innerHeight);
renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;
const scene=new T.Scene(),sky=document.createElement('canvas');sky.width=8;sky.height=512;
const gradient=sky.getContext('2d').createLinearGradient(0,0,0,512);
gradient.addColorStop(0,'#3a5a7a');gradient.addColorStop(.56,'#ff9a56');gradient.addColorStop(1,'#ffb36b');
sky.getContext('2d').fillStyle=gradient;sky.getContext('2d').fillRect(0,0,8,512);
const skyMap=new T.CanvasTexture(sky);skyMap.colorSpace=T.SRGBColorSpace;scene.background=skyMap;
scene.fog=new T.Fog(0xd88a63,180,850);scene.add(new T.HemisphereLight(0xffe4c2,0x67513f,1.35));
const sun=new T.DirectionalLight(0xffc17a,3.2);sun.position.set(-180,55,80);sun.castShadow=true;
sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-210,right:210,top:210,bottom:-210});sun.shadow.bias=-.0002;scene.add(sun);
buildCity(scene,renderer);
const player=new T.Group(),car=new T.Mesh(new T.BoxGeometry(3.8,1.2,6.4),new T.MeshStandardMaterial({color:'#cf332d',roughness:.5}));
car.position.y=.9;player.add(car);const windshield=new T.Mesh(new T.BoxGeometry(2.6,.8,3),new T.MeshStandardMaterial({color:'#233b48',metalness:.3}));
windshield.position.set(0,1.8,-.4);player.add(windshield);scene.add(player);
const traffic=makeTraffic(scene),police=makePolice(scene),mission=missionState();
const camera=new T.PerspectiveCamera(55,innerWidth/innerHeight,.1,2000),shot=Number(new URLSearchParams(location.search).get('shot')||0);
let walking=shot===2,locked=shot>0,speed=shot===1?86:0;const keys={};
function articulated(x,z,color,accent='#323541'){const group=new T.Group(),coat=new T.MeshStandardMaterial({color}),detail=new T.MeshStandardMaterial({color:accent}),skin=new T.MeshStandardMaterial({color:'#b87e5d'});const piece=(shape,material,px,py,pz)=>{const part=new T.Mesh(shape,material);part.position.set(px,py,pz);group.add(part)};piece(new T.BoxGeometry(.62,.84,.32),coat,0,1.12,0);piece(new T.SphereGeometry(.22,12,10),skin,0,1.72,0);piece(new T.BoxGeometry(.13,.72,.36),detail,.27,1.18,0);for(const side of [-1,1]){piece(new T.BoxGeometry(.18,.68,.2),coat,side*.17,.38,0);piece(new T.BoxGeometry(.15,.62,.18),coat,side*.39,1.12,0)}group.position.set(x,0,z);scene.add(group);return group}
let nia;
if(shot===2){player.visible=false;nia=articulated(0,0,'#262d38','#ba3440');document.querySelector('#busted').style.display='block';document.querySelector('#place').textContent='MARINA QUARTER'}
if(shot===4){player.position.x=240;document.querySelector('#district').textContent='EAST PROMENADE';document.querySelector('#place').textContent='EAST PROMENADE'}
if(shot===3)document.querySelector('#place').textContent='MARINA QUARTER';
for(let i=0;i<traffic.length;i++)traffic[i].g.position.set([-15,-9,9,15,0,-18,18,4][i],0,[8,7,8,7,20,22,20,24][i]);
for(let i=0;i<police.length;i++)police[i].position.set(i?-5:5,0,shot===1?14+i*4:25+i*8);
const crowd=shot===1||shot===2?[-5,-3,3,5].map((x,i)=>articulated(x,shot===1?4:-2,['#dc744d','#345e78','#ebc05e','#8b4945'][i])):[];
const sunDisc=new T.Mesh(new T.SphereGeometry(13,24,16),new T.MeshBasicMaterial({color:'#ffd58b'}));sunDisc.position.set(-115,32,-430);scene.add(sunDisc);
addEventListener('keydown',event=>{const key=event.key.toLowerCase();keys[key]=true;if(key==='e')walking=!walking;if(key==='f'){mission.cash+=50;document.querySelector('#cash').textContent='$'+mission.cash.toLocaleString();document.querySelector('#stars').textContent='★★☆';signal()}});
addEventListener('keyup',event=>keys[event.key.toLowerCase()]=false);
function render(){if(!locked){if(keys.w)speed=Math.min(110,speed+1);if(keys.s)speed=Math.max(0,speed-2);if(keys.a)player.rotation.y+=.035;if(keys.d)player.rotation.y-=.035;if(walking){player.position.x+=(keys.d?1:0)-(keys.a?1:0);player.position.z+=(keys.s?1:0)-(keys.w?1:0)}else player.translateZ(-speed*.001)}
document.querySelector('#speed').innerHTML=String(Math.round(speed)).padStart(3,'0')+' <small>KM/H</small>';
document.querySelector('#prompt').textContent=walking?'F · TALK / STEAL　 E · ENTER VEHICLE':'E · EXIT VEHICLE';document.querySelector('#district').textContent=shot===4?'EAST PROMENADE':'MARINA QUARTER';
if(shot===1){camera.position.set(0,3.2,36);camera.lookAt(0,1,0)}else if(shot===2){camera.position.set(0,4.5,9);camera.lookAt(0,1,0)}else if(shot===3){camera.position.set(40,115,190);camera.lookAt(0,0,0)}else if(shot===4){camera.position.set(240,4,18);camera.lookAt(240,1,0)}else{camera.position.set(player.position.x,6,18);camera.lookAt(player.position.x,1,player.position.z)}
renderer.render(scene,camera);paintMap(document.querySelector('#map canvas'),shot===4?'east':'west');if(shot>0)window.__shotReady=true;requestAnimationFrame(render)}
render();addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});
