import * as THREE from 'three';

const palette={sand:0xb89570,cream:0xe1c9a4,white:0xd9d3c5,glass:0x52777b,blue:0x43656e,road:0x43494b,side:0xc2a887,green:0x53634c,water:0x456e78};
const mat=(color,roughness=.82,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
const boxGeo=new THREE.BoxGeometry(1,1,1);
export function roadHeight(x,z){return Math.sin(x*.009)*.06+Math.cos(z*.012)*.04}
export function createCity(scene){
 scene.background=new THREE.Color(0xd99561);scene.fog=new THREE.Fog(0xdca16e,190,610);
 const ground=new THREE.Mesh(new THREE.PlaneGeometry(1100,1100),mat(0xb49a79));ground.rotation.x=-Math.PI/2;ground.position.y=-.16;ground.receiveShadow=true;scene.add(ground);
 const water=new THREE.Mesh(new THREE.PlaneGeometry(720,360),new THREE.MeshStandardMaterial({color:0x39717d,roughness:.34,metalness:.12}));water.rotation.x=-Math.PI/2;water.position.set(-18,-.08,-255);scene.add(water);
 const roadmat=mat(palette.road),side=mat(palette.side),green=mat(palette.green),line=new THREE.MeshStandardMaterial({color:0xe9d4a8,roughness:.9});
 const road=new THREE.Mesh(new THREE.PlaneGeometry(680,58),roadmat);road.rotation.x=-Math.PI/2;road.position.set(0,-.1,25);road.receiveShadow=true;scene.add(road);
 const avenue=new THREE.Mesh(new THREE.PlaneGeometry(58,680),roadmat);avenue.rotation.x=-Math.PI/2;avenue.position.set(75,-.095,0);avenue.receiveShadow=true;scene.add(avenue);
 for(let p=-280;p<=280;p+=40){const cross=new THREE.Mesh(new THREE.PlaneGeometry(680,7),roadmat);cross.rotation.x=-Math.PI/2;cross.position.set(0,-.09,p+40);scene.add(cross);const cross2=new THREE.Mesh(new THREE.PlaneGeometry(7,680),roadmat);cross2.rotation.x=-Math.PI/2;cross2.position.set(p+40,-.088,0);scene.add(cross2)}
 for(let i=-300;i<360;i+=40){const dash=new THREE.Mesh(new THREE.PlaneGeometry(12,.24),line);dash.rotation.x=-Math.PI/2;dash.position.set(i,-.085,25);scene.add(dash)}
 for(let i=-300;i<340;i+=40){const dash=new THREE.Mesh(new THREE.PlaneGeometry(.24,12),line);dash.rotation.x=-Math.PI/2;dash.position.set(75,-.08,i);scene.add(dash)}
 const groups=new Map();const addBuilding=(x,z,w,d,h,color)=>{const key=`${color}`;if(!groups.has(key))groups.set(key,[]);groups.get(key).push({x,z,w,d,h})};
 for(let gx=-260;gx<=270;gx+=40)for(let gz=-250;gz<=270;gz+=40){if(Math.abs(gz-25)<101||Math.abs(gx-75)<53)continue;const east=gz>100;const waterfront=gz<-120;const w=12+(Math.abs(gx*7+gz*3)%7),d=12+(Math.abs(gx*2-gz*5)%7);let h=waterfront?20+(Math.abs(gx+gz)%34):east?15+(Math.abs(gx*3+gz)%26):16+(Math.abs(gx*5-gz*2)%42);if(Math.abs(gx)<85&&gz>100)h*=.7;let color=waterfront?palette.glass:(east?(Math.abs(gx)%3?palette.cream:palette.blue):palette.sand);addBuilding(gx,gz,w,d,h,color)}
 for(const [color,buildings] of groups){const mesh=new THREE.InstancedMesh(boxGeo,mat(Number(color),.56,.08),buildings.length);const o=new THREE.Object3D();buildings.forEach((b,i)=>{o.position.set(b.x,b.h/2,b.z);o.scale.set(b.w,b.h,b.d);o.updateMatrix();mesh.setMatrixAt(i,o.matrix)});mesh.castShadow=true;mesh.receiveShadow=true;scene.add(mesh)}
 for(const [x,z] of [[-185,110],[205,-85],[-105,-150],[205,190]]){const lawn=new THREE.Mesh(new THREE.PlaneGeometry(27,29),green);lawn.rotation.x=-Math.PI/2;lawn.position.set(x,-.04,z);scene.add(lawn);for(let i=0;i<5;i++){const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.28,.42,3,7),mat(0x68513c));trunk.position.set(x-9+(i*9)%18,1.5,z-9+Math.floor(i/2)*8);trunk.castShadow=true;scene.add(trunk);const crown=new THREE.Mesh(new THREE.IcosahedronGeometry(2.5,1),mat(i%2?0x64704e:0x7d8053));crown.position.set(trunk.position.x,4.2,trunk.position.z);crown.castShadow=true;scene.add(crown)}}
 const drop=new THREE.Group();drop.position.set(180,.1,204);const ring=new THREE.Mesh(new THREE.TorusGeometry(4,.16,8,44),new THREE.MeshBasicMaterial({color:0xffd166}));ring.rotation.x=Math.PI/2;drop.add(ring);const beam=new THREE.Mesh(new THREE.CylinderGeometry(.08,2.5,7,24,1,true),new THREE.MeshBasicMaterial({color:0xffce62,transparent:true,opacity:.22,side:THREE.DoubleSide}));beam.position.y=3.5;drop.add(beam);scene.add(drop);
 const billboard=new THREE.Group();billboard.position.set(-81,0,-78);const post=new THREE.Mesh(new THREE.BoxGeometry(.7,8,.7),mat(0x4d4740));post.position.y=4;billboard.add(post);const board=new THREE.Mesh(new THREE.BoxGeometry(22,8,.8),mat(0x344e55));board.position.y=9;billboard.add(board);scene.add(billboard);
 return {palette,drop,buildings:groups.size};
}
export function addSun(scene){scene.add(new THREE.HemisphereLight(0xffe4c2,0x67513f,1.35));const sun=new THREE.DirectionalLight(0xffc17a,3.2);sun.position.set(-115,120,55);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-210;sun.shadow.camera.right=210;sun.shadow.camera.top=210;sun.shadow.camera.bottom=-210;sun.shadow.bias=-.0002;scene.add(sun);return sun}
