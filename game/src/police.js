export function createPolice(){return {cars:[{x:490,y:405,angle:0,speed:0},{x:450,y:430,angle:0,speed:0}],officer:{x:480,y:465},wanted:0,decay:0,visible:true};}
export function raiseWanted(police){police.wanted=Math.max(police.wanted,2);police.decay=0;}
export function updatePolice(police,player,dt){
  for(const cop of police.cars){const dx=player.x-cop.x,dy=player.y-cop.y,a=Math.atan2(dy,dx);cop.angle=a;cop.speed=Math.min(2.3,cop.speed+dt*.45);cop.x+=Math.cos(a)*cop.speed*58*dt;cop.y+=Math.sin(a)*cop.speed*58*dt;}
  if(police.wanted){const nearest=police.cars[0],d=Math.hypot(nearest.x-player.x,nearest.y-player.y);police.visible=d<580;if(!police.visible){police.decay+=dt;if(police.decay>4){police.wanted=0;police.decay=0;}}else police.decay=0;}
}
