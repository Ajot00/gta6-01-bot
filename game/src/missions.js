export function createMission(city){return {name:'GLASSLINE RUN',objective:'Reach the glassline drop',marker:city.drop,complete:false,payout:1250}}
export function updateMission(m,player){if(!m.complete&&player.position.distanceTo(m.marker.position)<7){m.complete=true;return true}return false}
