import * as T from '../vendor/three/three.module.min.js';

export const CAR_PARTS={hood:true,cabin:true,trunk:true,wheels:4,windowBand:true,headlights:2,taillights:2};
const paints=['#d84935','#f0c65e','#4a9ca7','#e8e0cb','#5878a1','#7a5141'];
export function makeCar(scene,color,police=false){
 const g=new T.Group(),body=new T.MeshStandardMaterial({color,roughness:.58}),glass=new T.MeshStandardMaterial({color:'#182735',metalness:.18,roughness:.22}),rubber=new T.MeshStandardMaterial({color:'#17191a',roughness:.92}),rim=new T.MeshStandardMaterial({color:'#aeb2ae',metalness:.45,roughness:.45}),black=new T.MeshStandardMaterial({color:'#202c42'});
 function part(geo,mat,x,y,z){const m=new T.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=true;g.add(m);return m}
 part(new T.BoxGeometry(2.05,.58,4.25),body,0,.62,0); // lower body
 part(new T.BoxGeometry(1.85,.27,1.05),body,0,.88,-1.52); // hood
 part(new T.BoxGeometry(1.9,.24,.72),body,0,.83,1.75); // trunk
 part(new T.BoxGeometry(1.62,.66,2.08),glass,0,1.18,-.16); // dark window band / cabin
 for(const x of [-1,1])for(const z of [-1.43,1.38]){const tire=part(new T.CylinderGeometry(.38,.38,.2,12),rubber,x,.4,z);tire.rotation.z=Math.PI/2;const hub=part(new T.CylinderGeometry(.17,.17,.22,10),rim,x,.4,z);hub.rotation.z=Math.PI/2}
 for(const x of [-.68,.68]){part(new T.BoxGeometry(.31,.14,.08),new T.MeshStandardMaterial({color:'#ffedbd',emissive:'#ffd37d',emissiveIntensity:.75}),x,.67,-2.13);part(new T.BoxGeometry(.3,.13,.08),new T.MeshStandardMaterial({color:'#ec443c',emissive:'#a92327',emissiveIntensity:.65}),x,.65,2.13)}
 if(police){for(const side of [-1,1])part(new T.BoxGeometry(.06,.2,2.45),black,side*1.04,.72,.25);part(new T.BoxGeometry(1.1,.12,.28),black,0,1.59,-.12);part(new T.BoxGeometry(.43,.19,.26),new T.MeshStandardMaterial({color:'#f33d42',emissive:'#f02c3b',emissiveIntensity:1.5}),-.31,1.62,-.12);part(new T.BoxGeometry(.43,.19,.26),new T.MeshStandardMaterial({color:'#438aff',emissive:'#287bff',emissiveIntensity:1.5}),.31,1.62,-.12)}
 g.userData.parts={...CAR_PARTS,lightbar:police};g.userData.police=police;if(scene)scene.add(g);return g
}
export function makeTraffic(scene){const cars=[];for(let i=0;i<9;i++){const g=makeCar(scene,paints[i%paints.length]);g.position.set([-17,-10,10,17,-22,22,-4,5,13][i],0,[16,19,17,15,42,45,58,61,64][i]);cars.push({g,base:g.position.z,phase:i*.7,traffic:true})}return cars}
