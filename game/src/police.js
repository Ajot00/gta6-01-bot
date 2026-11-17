// Patrol vehicles use the same road-scale chassis as local traffic.
import {makeCar} from './traffic.js';
export function makePolice(scene){return [0,1].map((n)=>{const car=makeCar(scene,n?'#f1eee5':'#e9e6dc',true);scene.add(car);return car})}
