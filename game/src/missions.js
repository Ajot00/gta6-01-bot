export const mission={x:1720,y:840,complete:false,payout:1250};
export function updateMission(player,mission){
  const close=Math.hypot(player.x-mission.x,player.y-mission.y)<64;
  if(close&&!mission.complete){mission.complete=true;document.querySelector('#objective').textContent='Drop secured  ·  +$1,250';document.querySelector('#cash').textContent='$ 3,700';}
  return close;
}
