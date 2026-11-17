import { WORLD } from './city.js';
export function createTraffic(){
  const cars=[{x:850,y:400,angle:0,speed:1.05,color:'#e8e3d8'},{x:1180,y:530,angle:Math.PI/2,speed:.8,color:'#b45b46'},{x:1510,y:400,angle:0,speed:.9,color:'#8a9b9a'},{x:520,y:900,angle:Math.PI/2,speed:.72,color:'#d2b45b'}];
  const people=Array.from({length:24},(_,i)=>({x:690+(i%8)*45,y:720+Math.floor(i/8)*58,phase:i*.91,speed:.28+(i%3)*.08}));
  return {cars,people};
}
export function updateTraffic(traffic,dt){
  for(const car of traffic.cars){car.x+=Math.cos(car.angle)*car.speed*60*dt;car.y+=Math.sin(car.angle)*car.speed*60*dt;if(car.x>2000)car.x=420;if(car.y>1550)car.y=380;}
  for(const p of traffic.people){p.phase+=dt*p.speed;p.x+=Math.sin(p.phase)*dt*7;p.y+=Math.cos(p.phase*.7)*dt*5;}
}
