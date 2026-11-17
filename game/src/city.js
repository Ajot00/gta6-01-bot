export const WORLD = { width: 2600, height: 1800, road: 126, block: 360 };
const colors = ['#dfc8a4','#d6b990','#bdab8e','#e8d2b1','#b9c1b5','#c6ae8c'];

export function roadAt(x, y) {
  const gx = ((x % WORLD.block) + WORLD.block) % WORLD.block;
  const gy = ((y % WORLD.block) + WORLD.block) % WORLD.block;
  return gx < WORLD.road || gy < WORLD.road;
}

export function drawCity(ctx, camera, shot) {
  const {width:w,height:h}=ctx.canvas;
  const offsetX = shot === '3' ? 0 : camera.x;
  const offsetY = shot === '3' ? 0 : camera.y;
  const px=(x)=>x-offsetX+w/2, py=(y)=>y-offsetY+h/2;
  ctx.fillStyle='#dca96e';ctx.fillRect(0,0,w,h);
  ctx.fillStyle='#7fbbc1';ctx.fillRect(px(2130),0,w-px(2130),h);
  ctx.fillStyle='#ead7b6';ctx.fillRect(px(2010),0,120,h);
  for(let x=-600;x<3400;x+=WORLD.block){
    for(let y=-400;y<2500;y+=WORLD.block){
      const sx=px(x),sy=py(y),rw=WORLD.road,r=WORLD.block;
      ctx.fillStyle='#555653';ctx.fillRect(sx,sy,w-rw,rw);ctx.fillRect(sx,sy,rw,h-rw);
      ctx.fillStyle='#c5b08d';ctx.fillRect(sx+rw,sy+rw,r-rw-10,r-rw-10);
      const ix=sx+rw+22,iy=sy+rw+22,iw=r-rw-54,ih=r-rw-58;
      const height=55+((Math.floor(x/360)*13+Math.floor(y/360)*19+900)%6)*18;
      ctx.fillStyle='#857258';ctx.fillRect(ix+18,iy+height,iw,ih);
      ctx.fillStyle=colors[Math.abs(Math.floor(x/360*3+y/360*5))%colors.length];ctx.fillRect(ix,iy,iw,ih);
      ctx.fillStyle='#b9a07a';ctx.fillRect(ix,iy,iw,8);
      ctx.fillStyle='#82999a';
      for(let wx=ix+12;wx<ix+iw-6;wx+=26)for(let wy=iy+15;wy<iy+ih-6;wy+=24)ctx.fillRect(wx,wy,12,9);
      ctx.fillStyle='#b2a07e';ctx.fillRect(sx+rw,sy+rw+8,10,r-rw-24);
    }
  }
  // Waterfront promenade and a broad sunlit civic square.
  ctx.fillStyle='#d9c7a7';ctx.fillRect(px(2010),py(480),120,530);
  ctx.fillStyle='#7baab0';ctx.beginPath();ctx.ellipse(px(1350),py(1180),245,145,-.2,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#d9c09b';ctx.fillRect(px(720),py(720),310,180);
  ctx.fillStyle='#87926f';for(let i=0;i<14;i++){let tx=px(750+(i%7)*43),ty=py(744+Math.floor(i/7)*72);ctx.beginPath();ctx.arc(tx,ty,12,0,7);ctx.fill();ctx.fillStyle='#665b43';ctx.fillRect(tx-2,ty,4,17);ctx.fillStyle='#87926f';}
  ctx.fillStyle='#fff0cc';ctx.font='900 25px Arial';ctx.fillText('MARINA QUARTER',px(1120),py(118));
  ctx.fillStyle='#243839';ctx.font='900 22px Arial';ctx.fillText('SOLMERE  /  EAST PROMENADE',px(580),py(1530));
}

export function drawCar(ctx, car, camera, color, police=false) {
  const x=car.x-camera.x+ctx.canvas.width/2,y=car.y-camera.y+ctx.canvas.height/2;
  ctx.save();ctx.translate(x,y);ctx.rotate(car.angle);
  ctx.fillStyle='#2d2924';ctx.fillRect(-27,-12,54,24);
  ctx.fillStyle=color;ctx.fillRect(-24,-14,48,27);
  ctx.fillStyle=police?'#d8e0d7':'#263a3a';ctx.fillRect(-10,-11,20,21);
  ctx.fillStyle='#f5d783';ctx.fillRect(18,-10,5,6);ctx.fillRect(18,5,5,6);
  if(police){ctx.fillStyle='#f2d26e';ctx.fillRect(-6,-16,12,4);}
  ctx.restore();
}

export function drawPerson(ctx,p,camera,color='#413e39'){
  const x=p.x-camera.x+ctx.canvas.width/2,y=p.y-camera.y+ctx.canvas.height/2;
  ctx.fillStyle='#342c24';ctx.beginPath();ctx.ellipse(x+2,y+6,9,5,0,0,7);ctx.fill();
  ctx.fillStyle=color;ctx.beginPath();ctx.arc(x,y-1,6,0,7);ctx.fill();
  ctx.fillStyle='#d8ac78';ctx.beginPath();ctx.arc(x,y-10,4,0,7);ctx.fill();
}
