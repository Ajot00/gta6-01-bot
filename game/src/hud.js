export function paintMap(canvas,player,mission,police,traffic){
  const c=canvas.getContext('2d'),w=canvas.width,h=canvas.height;
  c.fillStyle='#172627';c.fillRect(0,0,w,h);
  c.save();c.translate(w/2-player.x*.09,h/2-player.y*.09);c.scale(.09,.09);
  c.strokeStyle='#716b5f';c.lineWidth=23;
  for(let x=0;x<2600;x+=360){c.beginPath();c.moveTo(x,0);c.lineTo(x,1800);c.stroke();}
  for(let y=0;y<1800;y+=360){c.beginPath();c.moveTo(0,y);c.lineTo(2600,y);c.stroke();}
  c.fillStyle='#568c91';c.fillRect(2130,0,480,1800);
  for(const car of traffic.cars){c.fillStyle='#e3d4b7';c.fillRect(car.x-14,car.y-9,28,18);}
  for(const car of police.cars){c.fillStyle='#f2cd60';c.beginPath();c.arc(car.x,car.y,19,0,7);c.fill();}
  c.fillStyle='#ffe36b';c.beginPath();c.arc(mission.x,mission.y,24,0,7);c.fill();
  c.fillStyle='#eff6e5';c.beginPath();c.arc(player.x,player.y,24,0,7);c.fill();c.restore();
  c.strokeStyle='#d4c7a8';c.lineWidth=2;c.strokeRect(1,1,w-2,h-2);
}
export function updateHud(player,police,mission,seconds,car){
  document.querySelector('#wanted').textContent='★ '.repeat(police.wanted)+'☆ '.repeat(Math.max(0,3-police.wanted));
  document.querySelector('#speed').textContent=`${car?Math.round(car.speed*17):0} KM/H`;
  document.querySelector('#timer').textContent=`${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(Math.floor(seconds%60)).padStart(2,'0')}`;
  document.querySelector('#district').textContent=player.x>1650?'EAST PROMENADE':player.y>1000?'CIVIC GARDENS':'MARINA QUARTER';
}
