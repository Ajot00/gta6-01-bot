// A short optional interaction cue; unsupported or locked audio stays silent.
export function audioCue(){try{const C=window.AudioContext||window.webkitAudioContext;if(!C)return;const c=new C(),o=c.createOscillator(),g=c.createGain();o.frequency.value=220;g.gain.value=.02;o.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+.08)}catch{}}
