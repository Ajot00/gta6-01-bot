import { drawCity, drawCar, drawPerson, roadAt } from './city.js';
import { createTraffic, updateTraffic } from './traffic.js';
import { createPolice, raiseWanted, updatePolice } from './police.js';
import { paintMap, updateHud } from './hud.js';
import { mission, updateMission } from './missions.js';
import { createAudio } from './audio.js';

const canvas=document.querySelector('#world'),ctx=canvas.getContext('2d'),map=document.querySelector('#map');
const query=new URLSearchParams(location.search),shot=query.get('shot');
const player={x:1000,y:450,angle:.3,health:84,onFoot:shot==='2',cash:2450};
const car={x:1000,y:450,angle:.3,speed:0};
const traffic=createTraffic(),police=createPolice(),keys=new Set();
const audio=createAudio();
let bustedUntil=shot==='2'?performance.now()+1e9:0,wastedUntil=0,started=performance.now(),last=started;
if(shot==='1'){car.x=1120;car.y=480;player.onFoot=false;raiseWanted(police);police.cars[0]={x:930,y:390,angle:.7,speed:1.1};police.cars[1]={x:850,y:610,angle:.3,speed:1};}
if(shot==='2'){player.x=1030;player.y=450;police.wanted=2;police.officer={x:1080,y:470};}
if(shot==='3'){player.x=1200;player.y=850;player.onFoot=false;car.x=1200;car.y=850;}
if(shot==='4'){player.x=1850;player.y=1000;player.onFoot=true;}
window.addEventListener('keydown',e=>{keys.add(e.key.toLowerCase());audio.activate();if([' ','arrowup','arrowdown'].includes(e.key.toLowerCase()))e.preventDefault();if(e.key.toLowerCase()==='e')toggleCar();if(e.key.toLowerCase()==='f')crime();if(e.key.toLowerCase()==='m')audio.toggle();});
window.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));
function toggleCar(){if(player.onFoot&&Math.hypot(player.x-car.x,player.y-car.y)<100){player.onFoot=false;player.x=car.x;player.y=car.y;}else if(!player.onFoot){player.onFoot=true;player.x=car.x+48;player.y=car.y;}}
function crime(){const nearby=traffic.people.some(p=>Math.hypot(player.x-p.x,player.y-p.y)<170)||Math.hypot(player.x-police.officer.x,player.y-police.officer.y)<190;if(nearby){raiseWanted(police);player.health=Math.max(0,player.health-4);if(player.health===0)wastedUntil=performance.now()+2000;}}
function update(dt,now){
  if(shot)return;
  updateTraffic(traffic,dt);
  const target=player.onFoot?player:car;
  if(player.onFoot){let dx=(keys.has('d')?1:0)-(keys.has('a')?1:0),dy=(keys.has('s')?1:0)-(keys.has('w')?1:0);const n=Math.hypot(dx,dy)||1;target.x+=dx/n*150*dt;target.y+=dy/n*150*dt;}
  else{const throttle=(keys.has('w')?1:0)-(keys.has('s')?1:0);car.speed=Math.max(-1.3,Math.min(3.3,car.speed+throttle*2.1*dt));if(keys.has(' '))car.speed*=.95;car.angle+=((keys.has('d')?1:0)-(keys.has('a')?1:0))*car.speed*.68*dt;car.x+=Math.cos(car.angle)*car.speed*64*dt;car.y+=Math.sin(car.angle)*car.speed*64*dt;}
  target.x=Math.max(90,Math.min(2050,target.x));target.y=Math.max(90,Math.min(1690,target.y));
  if(!roadAt(target.x,target.y)&&player.onFoot){target.x-=((keys.has('d')?1:0)-(keys.has('a')?1:0))*150*dt;target.y-=((keys.has('s')?1:0)-(keys.has('w')?1:0))*150*dt;}
  player.x=target.x;player.y=target.y;player.angle=player.onFoot?player.angle:car.angle;
  updatePolice(police,player,dt);updateMission(player,mission);updateHud(player,police,mission,Math.max(0,260-(now-started)/1000),player.onFoot?null:car);
  audio.siren(police.wanted>0);
  if(police.wanted&&player.onFoot&&Math.hypot(player.x-police.officer.x,player.y-police.officer.y)<34){bustedUntil=now+2000;police.wanted=0;player.x=1000;player.y=450;}
}
function render(now){
  const cam=player.onFoot?player:car, camera=shot==='3'?{x:1300,y:830}:cam;
  drawCity(ctx,camera,shot);
  for(const npc of traffic.cars)drawCar(ctx,npc,camera,npc.color);
  for(const p of traffic.people)drawPerson(ctx,p,camera);
  for(const cop of police.cars)drawCar(ctx,cop,camera,'#e8e5d8',true);
  if(shot==='2')drawPerson(ctx,police.officer,camera,'#182b35');
  const sx=mission.x-camera.x+640,sy=mission.y-camera.y+360;
  ctx.fillStyle='#f3cf62';ctx.beginPath();ctx.ellipse(sx,sy,15,8,0,0,7);ctx.fill();ctx.fillRect(sx-3,sy-70,6,70);ctx.fillStyle='#fff1ba';ctx.font='bold 14px Arial';ctx.fillText('A',sx-5,sy-78);
  if(player.onFoot)drawPerson(ctx,player,camera,'#263d3b');else drawCar(ctx,car,camera,'#dd5f43');
  if(shot==='1'){ctx.fillStyle='#fff';ctx.font='bold 24px Arial';ctx.fillText('CHASE ACTIVE',930,680);}
  if(shot==='4'){ctx.fillStyle='#253b3a';ctx.font='900 22px Arial';ctx.fillText('EAST PROMENADE',70,675);}
  paintMap(map,player,mission,police,traffic);
  document.querySelector('#plate').hidden=now>bustedUntil;
  document.querySelector('#wasted').hidden=now>wastedUntil;
  if(shot){window.__shotReady=true;return;}
  const time=now;update(Math.min(.05,(time-last)/1000),time);last=time;requestAnimationFrame(render);
}
if(shot){updateHud(player,police,mission,260,shot==='1'?car:null);render(performance.now());}
else{document.querySelector('#plate').hidden=true;requestAnimationFrame(render);}
