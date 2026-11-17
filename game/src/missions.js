export function missionState(){return {phase:0,checkpoints:['Leave Marina Quarter','Cross East Promenade','Reach Pier 9'],payout:3200}}
export function advanceMission(m){m.phase=Math.min(m.phase+1,m.checkpoints.length-1);return m}
