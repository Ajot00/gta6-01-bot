export function createAudio(){
  let context=null,osc=null,gain=null,muted=false;
  function start(){
    if(context)return;
    context=new AudioContext();osc=context.createOscillator();gain=context.createGain();
    osc.type='sawtooth';osc.frequency.value=540;gain.gain.value=0;osc.connect(gain);gain.connect(context.destination);osc.start();
  }
  return {
    activate(){start();},
    siren(active){if(!context)return;gain.gain.setTargetAtTime(active&&!muted?0.025:0,context.currentTime,.12);osc.frequency.setTargetAtTime(540+Math.sin(context.currentTime*3)*190,context.currentTime,.08);},
    toggle(){muted=!muted;if(muted&&gain)gain.gain.setTargetAtTime(0,context.currentTime,.04);return muted;},
  };
}
