import {actorMotion} from './actor-motion';
// Original pixel sprites, painted on integer coordinates. Each NPC combines its
// own pose, silhouette, hair, headpiece, outfit pattern, palette and weapon.
const tones=['#77565e','#536c7b','#5c786a','#6a5884','#94744d','#765975','#485e76','#85665b','#457b7b','#936769','#76845c','#5f647c'];
const trims=['#d9b27a','#9dd9db','#c4d69a','#dfbfdc','#dfcd8f','#ef9b8d'];
const skins=['#f0c6ac','#e7bb94','#e4cabb','#c59a7c'];
function rect(c:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,color:string){c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),w,h);}
function line(c:CanvasRenderingContext2D,x0:number,y0:number,x1:number,y1:number,color:string,width=1){let x=Math.round(x0),y=Math.round(y0),x2=Math.round(x1),y2=Math.round(y1),dx=Math.abs(x2-x),sx=x<x2?1:-1,dy=-Math.abs(y2-y),sy=y<y2?1:-1,err=dx+dy;for(let i=0;i<100;i++){rect(c,x,y,width,width,color);if(x===x2&&y===y2)break;const e=2*err;if(e>=dy){err+=dy;x+=sx;}if(e<=dx){err+=dx;y+=sy;}}}
export type SpriteSpec={seed:number;claimed?:string[];classId?:string;root?:number;female?:boolean;npc?:boolean;pose?:number;facing?:number;moving?:boolean;attack?:boolean;realm?:number;dharmaId?:number|null;dharmaLevel?:number};
export function nameSeed(name:string){return [...name].reduce((a,c)=>a*31+c.charCodeAt(0),17)>>>0;}
function drawActorProcedural(c:CanvasRenderingContext2D,x:number,y:number,time:number,s:SpriteSpec,scale=1.8){
 const seed=s.seed>>>0,female=s.female??seed%2===1,npc=!!s.npc,pose=s.pose??seed%12,facing=s.facing||0,walking=!!s.moving,step=Math.floor(time/120)%4,bob=walking?(step%2):Math.floor(time/700)%2,skin=skins[seed%4],robe=npc?tones[seed%12]:({sword:'#414459',body:'#636367',fist:'#684251',spell:'#5b5080',spear:'#425768',healer:'#49655b'}[s.classId||'sword']||'#414459'),trim=npc?trims[Math.floor(seed/4)%6]:['#cf7c78','#d4bc8d','#8ed2cd','#acb5df','#deb980','#b2d095'][(s.root||0)%6],dark='#1b192a',hair=['#25202d','#211f30','#514650','#babbb4','#3e2f32'][npc?Math.floor(seed/8)%5:0],hairLight=hair==='#babbb4'?'#e9e1c9':'#514355',length=female?39:34+(seed%3)*3,bodyW=12+seed%3;
 c.save();c.translate(Math.round(x),Math.round(y));c.scale(scale,scale);c.imageSmoothingEnabled=false;
 // Long hair and cape behind the body, with a different hem for each figure.
 rect(c,-12,-length,24,length-7,dark);rect(c,-11,-length+1,22,length-8,hair);rect(c,-14,-30,5,23,dark);rect(c,10,-29,5,22,dark);rect(c,-13,-28,4,20,hair);rect(c,10,-28,4,19,hair);rect(c,-12,-18,2,12,hairLight);rect(c,11,-23,1,17,hairLight);
 if(seed%3===0||!npc){rect(c,-10,-29,20,23,dark);rect(c,-9,-29,18,22,robe);rect(c,-12,-16,5,9,robe);rect(c,9,-18,4,10,robe);rect(c,-9,-8,18,2,trim);}
 // Boots and walking stance.
 const leg=walking?(step<2?2:-2):(pose%3-1);rect(c,-8,-10,6,8,dark);rect(c,3,-10,6,8,dark);rect(c,-8+leg,-4,7,4,'#262438');rect(c,3-leg,-4,7,4,'#262438');rect(c,-8+leg,-2,8,2,'#5c5160');rect(c,3-leg,-2,8,2,'#5c5160');
 // Robe silhouette, belt, lapels, patterned sleeves.
 rect(c,-bodyW/2-2,-31-bob,bodyW+4,24,dark);rect(c,-bodyW/2-1,-30-bob,bodyW+2,22,robe);rect(c,-bodyW/2,-29-bob,bodyW,18,robe);rect(c,-7,-14-bob,14,8,robe);rect(c,-9,-9-bob,18,2,dark);rect(c,-8,-10-bob,16,1,trim);line(c,-5,-29-bob,0,-20-bob,trim,2);line(c,5,-29-bob,0,-20-bob,trim,2);rect(c,-7,-18-bob,14,3,dark);rect(c,-7,-18-bob,14,1,trim);rect(c,-2,-17-bob,3,11,trim);rect(c,1,-17-bob,2,8,'#927876');rect(c,-5,-26-bob,2,6,'#b2b0ab');
 for(let i=0;i<3;i++)if((seed+i)%2===0){rect(c,-5+i*4,-12-bob,1,2,trim);rect(c,-5+i*4,-24-bob,1,1,trim);}
 if(s.classId==='body'||seed%7===0){rect(c,-10,-29-bob,6,5,'#5b6874');rect(c,5,-29-bob,6,5,'#5b6874');rect(c,-9,-29-bob,4,1,'#d0c3a0');rect(c,6,-29-bob,4,1,'#d0c3a0');}
 // Arms use distinct integer offsets for individual NPC stances.
 const attack=!!s.attack,armL=walking?(step<2?-2:1):pose%4-2,armR=attack?-8:walking?(step<2?1:-2):Math.floor(pose/4)-1;
 rect(c,-12+armL,-28-bob,6,13,dark);rect(c,-11+armL,-27-bob,5,11,robe);rect(c,-10+armL,-19-bob,4,2,trim);rect(c,-9+armL,-17-bob,3,3,skin);
 rect(c,7,-28+armR-bob,6,13,dark);rect(c,8,-27+armR-bob,5,11,robe);rect(c,8,-19+armR-bob,4,2,trim);rect(c,9,-17+armR-bob,3,3,skin);
 // Neck, face and layered bangs. Back and side directions have their own face.
 rect(c,-3,-34-bob,6,5,skin);rect(c,-11,-49-bob,22,18,dark);rect(c,-10,-48-bob,20,17,hair);rect(c,-8,-43-bob,16,12,skin);rect(c,-8,-42-bob,2,8,'#c99484');rect(c,-7,-31-bob,14,1,'#b9807b');
 if(facing===3){rect(c,-9,-44-bob,18,13,hair);rect(c,-6,-42-bob,2,9,hairLight);rect(c,4,-43-bob,1,11,hairLight);}else{const side=facing===1?2:facing===2?-2:0;rect(c,-6+side,-38-bob,4,4,'#382d40');rect(c,3+side,-38-bob,4,4,'#382d40');rect(c,-5+side,-37-bob,2,2,female?'#c36c8d':'#86a8b9');rect(c,4+side,-37-bob,2,2,female?'#c36c8d':'#86a8b9');rect(c,-4+side,-38-bob,1,1,'#fff1da');rect(c,5+side,-38-bob,1,1,'#fff1da');rect(c,-2+side,-32-bob,4,1,'#b77579');if(female){rect(c,-7,-34-bob,2,1,'#d99299');rect(c,6,-34-bob,2,1,'#d99299');}}
 rect(c,-9,-48-bob,18,7,hair);rect(c,-11,-44-bob,4,12,hair);rect(c,8,-44-bob,4,13,hair);rect(c,-7,-43-bob,4,3,hair);rect(c,1,-43-bob,3,4,hair);rect(c,4,-43-bob,2,2,hair);line(c,-8,-46-bob,6,-46-bob,hairLight);rect(c,-11,-38-bob,1,13,hairLight);rect(c,10,-41-bob,1,16,hairLight);
 // Eight headpieces, including buns, crowns, veils and flowers.
 const hat=npc?Math.floor(seed/3)%8:0;if(hat===0){rect(c,-5,-54-bob,10,7,dark);rect(c,-4,-53-bob,8,5,hair);rect(c,-8,-48-bob,16,2,trim);rect(c,-13,-48-bob,3,1,trim);}else if(hat===1){rect(c,-10,-52-bob,20,5,dark);rect(c,-8,-53-bob,16,5,robe);rect(c,-5,-56-bob,10,3,robe);rect(c,-9,-49-bob,18,1,trim);}else if(hat===2){rect(c,-8,-52-bob,16,4,trim);rect(c,-9,-55-bob,3,6,trim);rect(c,-2,-56-bob,3,6,trim);rect(c,6,-55-bob,3,6,trim);}else if(hat===3){rect(c,-10,-48-bob,20,2,trim);rect(c,6,-51-bob,4,5,'#d996a0');rect(c,4,-49-bob,8,2,'#e5baa4');rect(c,7,-50-bob,2,2,'#f4d492');}else if(hat===4){rect(c,-12,-49-bob,24,2,trim);rect(c,-10,-50-bob,20,1,trim);rect(c,-8,-51-bob,16,1,trim);rect(c,9,-48-bob,2,15,trim);}else if(hat===5){rect(c,-5,-53-bob,10,5,hair);rect(c,-1,-56-bob,3,8,trim);rect(c,-9,-48-bob,18,1,trim);}else if(hat===6){rect(c,-11,-53-bob,22,6,robe);rect(c,-12,-48-bob,24,2,dark);rect(c,-10,-52-bob,20,1,trim);}else{rect(c,-6,-51-bob,12,3,trim);rect(c,7,-49-bob,3,20,trim);rect(c,-10,-47-bob,2,15,trim);}
 // Each class visibly carries its own implement.
 const classId=s.classId||(seed%5===0?'spell':seed%5===1?'spear':'sword');const handX=11,handY=-16+armR-bob;
 if(classId==='sword'||classId==='spear'){const tipX=attack?-18:19,tipY=attack?-35:classId==='spear'?-52:-37;line(c,handX,handY,tipX,tipY,dark,4);line(c,handX+1,handY-1,tipX+1,tipY-1,'#68c6d1',2);line(c,handX+2,handY-2,tipX+2,tipY-2,'#d2f0eb');rect(c,handX-3,handY,9,2,trim);line(c,handX,handY+1,handX-2,handY+5,'#936958',2);}else if(classId==='spell'||classId==='healer'){rect(c,14,-46-bob,2,35,'#967b62');rect(c,11,-46-bob,8,7,dark);rect(c,12,-47-bob,6,5,classId==='healer'?'#8acda4':'#af9be2');rect(c,14,-48-bob,2,2,'#fff1ca');rect(c,10,-45-bob,2,3,trim);}else if(classId==='body'||classId==='fist'){rect(c,7,-19+armR-bob,7,5,dark);rect(c,8,-18+armR-bob,5,3,trim);rect(c,-12+armL,-18-bob,6,4,dark);rect(c,-11+armL,-17-bob,4,2,trim);}
 c.restore();
}
function drawCompanionProcedural(c:CanvasRenderingContext2D,x:number,y:number,time:number,id:number,mount=false,moving=false){
 const type=id%4,palette=['#d2cec3','#849ac6','#ad706d','#79a9a1','#a88cbd','#b8a170'],coat=palette[Math.floor(id/4)%6],dark='#292b3a',shine='#e6d8b6';c.save();c.translate(Math.round(x),Math.round(y));c.scale(mount?2.1:1.35,mount?2.1:1.35);const gait=moving?Math.floor(time/130)%2:0;
 if(mount){rect(c,-18,-21,36,15,dark);rect(c,-17,-20,34,12,coat);rect(c,-12,-24,25,7,coat);rect(c,-16,-9,4,9+gait,dark);rect(c,-6,-9,4,8-gait,dark);rect(c,7,-9,4,9-gait,dark);rect(c,14,-9,4,8+gait,dark);rect(c,15,-35,10,19,dark);rect(c,16,-34,8,17,coat);rect(c,19,-39,2,8,shine);rect(c,23,-39,2,8,shine);rect(c,21,-29,2,2,'#d5eff1');rect(c,22,-25,7,5,coat);rect(c,-6,-23,14,4,'#67474d');rect(c,-5,-23,12,2,'#d5b278');line(c,-18,-15,-26,-25+gait*2,coat,3);if(id%3===1){line(c,-3,-18,-19,-33,coat,4);line(c,-19,-33,-25,-22,coat,3);rect(c,14,-41,3,7,shine);}}
 else if(type===0||type===1){rect(c,-9,-14,18,10,dark);rect(c,-8,-13,16,8,coat);rect(c,-7,-4,4,4,dark);rect(c,4,-4,4,4,dark);rect(c,4,-24,11,12,dark);rect(c,5,-23,9,10,coat);rect(c,5,-28,3,7,coat);rect(c,12,-27,3,6,coat);rect(c,8,-19,2,2,'#dfeef4');rect(c,13,-19,1,2,'#dfeef4');rect(c,10,-15,3,2,dark);line(c,-8,-12,-19,-20+Math.floor(time/260)%3,coat,5);line(c,-19,-20,-15,-27,coat,4);rect(c,-16,-28,4,3,shine);}
 else if(type===2){rect(c,-6,-14,12,10,dark);rect(c,-5,-13,10,8,coat);rect(c,-3,-21,8,10,coat);rect(c,3,-18,5,2,'#dfb476');rect(c,1,-19,2,2,'#d5ecf1');const flap=Math.floor(time/160)%2?5:-4;line(c,-4,-13,-16,-15+flap,coat,4);line(c,4,-13,16,-15+flap,coat,4);rect(c,-4,-4,2,3,shine);rect(c,2,-4,2,3,shine);}
 else{rect(c,-10,-14,20,10,dark);rect(c,-8,-16,16,11,coat);rect(c,-5,-15,10,9,'#5c797c');rect(c,-1,-14,2,7,shine);rect(c,-6,-10,12,2,shine);rect(c,9,-12,7,5,coat);rect(c,13,-11,2,1,shine);rect(c,-10,-5,5,4,coat);rect(c,6,-5,5,4,coat);}
 c.restore();
}
function drawEnemyProcedural(c:CanvasRenderingContext2D,x:number,y:number,time:number,e:{kind:number;appearance:number;boss?:boolean;worldBoss?:boolean}){
 const seed=e.appearance,kind=e.kind??seed%6,body=['#7a94b4','#737192','#af7a69','#6d9776','#a886b0','#a59073'][Math.floor(seed/6)%6],light=['#c4d9e1','#c3b5d7','#e3bfa2','#b2d1a5','#e0b8da','#d9d0af'][Math.floor(seed/6)%6],dark='#242535',bob=Math.floor(time/280+seed)%2;c.save();c.translate(Math.round(x),Math.round(y));c.scale(e.worldBoss?3.3:e.boss?2.3:1.6,e.worldBoss?3.3:e.boss?2.3:1.6);
 if(e.boss){rect(c,-15,-41,30,33,dark);rect(c,-13,-39,26,30,body);rect(c,-18,-31,8,18,dark);rect(c,11,-31,8,18,dark);rect(c,-17,-30,6,15,body);rect(c,12,-30,6,15,body);rect(c,-10,-12,7,12,dark);rect(c,4,-12,7,12,dark);rect(c,-12,-45,24,17,dark);rect(c,-10,-43,20,15,light);rect(c,-13,-53,4,15,light);rect(c,10,-53,4,15,light);rect(c,-16,-55,5,5,light);rect(c,12,-55,5,5,light);rect(c,-6,-39,4,3,'#d96c6c');rect(c,3,-39,4,3,'#d96c6c');rect(c,-4,-31,8,2,dark);rect(c,-10,-21,20,3,'#e1bf7f');rect(c,-2,-36,4,3,'#d2a660');rect(c,-2,-27,4,12,'#dbb772');if(e.worldBoss){for(let i=0;i<5;i++){rect(c,-18-i*3,-29-i*4,3,6,body);rect(c,16+i*3,-29-i*4,3,6,body);}rect(c,-4,-59,8,5,'#d4b372');}}
 else if(kind===0||kind===1||kind===2){rect(c,-13,-20+bob,26,13,dark);rect(c,-12,-19+bob,24,11,body);rect(c,-10,-8,4,8,dark);rect(c,7,-8,4,8,dark);rect(c,7,-31+bob,14,18,dark);rect(c,8,-30+bob,12,16,body);rect(c,9,-36+bob,4,10,body);rect(c,17,-36+bob,4,10,body);rect(c,9,-33+bob,2,5,light);rect(c,18,-33+bob,2,5,light);rect(c,12,-24+bob,3,3,'#e6e7e0');rect(c,19,-24+bob,2,3,'#e6e7e0');rect(c,14,-19+bob,9,3,light);line(c,-12,-16,-25,-24+bob*2,body,6);line(c,-25,-24,-20,-34,body,4);rect(c,-21,-36,5,4,light);if(kind===1){rect(c,-11,-24,12,5,body);line(c,-12,-15,-25,-11,body,3);}if(kind===2){rect(c,-10,-24,21,7,body);rect(c,13,-18,3,6,light);rect(c,20,-18,3,6,light);}}
 else if(kind===3){rect(c,-11,-19+bob,22,15,dark);rect(c,-9,-18+bob,18,12,body);rect(c,-4,-20,8,6,light);for(let i=0;i<4;i++){line(c,-8,-15+i*3,-21,-25+i*8,body,2);line(c,8,-15+i*3,21,-25+i*8,body,2);}rect(c,-4,-8,3,2,'#d88988');rect(c,2,-8,3,2,'#d88988');}
 else if(kind===4){rect(c,-9,-24+bob,18,20,dark);rect(c,-7,-23+bob,14,17,body);rect(c,-5,-32+bob,13,13,body);rect(c,4,-28+bob,2,2,light);rect(c,8,-25+bob,8,3,'#c7aa7c');const flap=Math.floor(time/160)%2?4:-4;line(c,-7,-19,-24,-26+flap,body,5);line(c,7,-19,24,-26+flap,body,5);rect(c,-6,-5,4,5,light);rect(c,3,-5,4,5,light);}
 else{rect(c,-13,-32+bob,26,24,dark);rect(c,-11,-30+bob,22,20,body);rect(c,-9,-10,6,10,dark);rect(c,4,-10,6,10,dark);rect(c,-9,-43+bob,18,14,dark);rect(c,-7,-41+bob,14,12,light);rect(c,-4,-37+bob,3,3,'#c97880');rect(c,2,-37+bob,3,3,'#c97880');rect(c,-20,-27+bob,8,16,body);rect(c,13,-27+bob,8,16,body);rect(c,-3,-25+bob,6,5,light);}
 c.restore();
}

let actorAtlas:HTMLImageElement|null=null;
const portraitCache=new Map<string,HTMLCanvasElement>();
function atlasSprite(frame:number,hue:number):HTMLCanvasElement|null {
 if(typeof Image==='undefined')return null;
 if(!actorAtlas){actorAtlas=new Image();actorAtlas.onload=()=>window.dispatchEvent(new Event('rpg-atlas-ready'));actorAtlas.src='/rpg/cultivators.png';}
 if(!actorAtlas.complete||!actorAtlas.naturalWidth)return null;
 const key=frame+':'+hue;if(portraitCache.has(key))return portraitCache.get(key)!;
 const cell=document.createElement('canvas');cell.width=192;cell.height=128;const ctx=cell.getContext('2d');if(!ctx)return null;
 ctx.imageSmoothingEnabled=false;if(hue)ctx.filter='hue-rotate('+hue+'deg)';ctx.drawImage(actorAtlas,(frame%4)*384,Math.floor(frame/4)*256,384,256,0,0,192,128);portraitCache.set(key,cell);return cell;
}
export function drawActor(c:CanvasRenderingContext2D,x:number,y:number,time:number,s:SpriteSpec,scale=1.8){
 const seed=s.seed>>>0,npc=!!s.npc,female=s.female??seed%2===1,step=Math.floor(time/160)%2;
 const maleFrames=[4,7,8,10,12,14],femaleFrames=[5,6,9,11,13,15];
 let frame=npc?(female?femaleFrames:maleFrames)[Math.floor(seed/2)%6]:s.classId==='body'||s.classId==='fist'?10:s.classId==='spear'?7:s.classId==='spell'?8:s.classId==='healer'?11:s.attack?3:s.moving?1+step:0;
 const hue=npc?Math.floor(seed/12)*17:(s.root||0)*5;
 const sprite=atlasSprite(frame,hue);if(!sprite){drawActorProcedural(c,x,y,time,s,scale);return;}
 c.save();c.translate(Math.round(x),Math.round(y));c.scale(scale,scale);c.imageSmoothingEnabled=false;
 // Full pose frames for sword cultivators, with animated cloth and footfall.
 const rig=actorMotion(time,seed,s.moving,s.attack),flip=s.facing===2||(npc&&Math.floor(seed/24)%2===1);
 if(flip)c.scale(-1,1);c.rotate(rig.sway);
 // Layered strips let the robe and hair move independently of the grounded feet.
 for(let row=0;row<16;row++){const sy=row*8,weight=Math.sin(row/15*Math.PI),cloth=rig.cloth*weight,breath=rig.breath*(1-row/15),stride=rig.stride*Math.max(0,(row-10)/5);c.drawImage(sprite,0,sy,192,8,-36+cloth+stride,-55+row*3.5-breath,72,3.65);}
 if(time>0&&!s.moving&&!s.attack){const color=npc?'#c6d8a2':['#d5c48d','#93d6b2','#95d8e8','#ef9f88','#d6c69c','#b8a0e7','#addef6','#99e0d2'][(s.root||0)%8];c.globalAlpha=.45;for(let i=0;i<3;i++){const a=time/900+seed+i*2.1;c.fillStyle=color;c.fillRect(Math.cos(a)*22,-16-((time/45+i*17+seed)%42),1.2,1.2);}c.globalAlpha=1;}
 // Each NPC also carries an individual insignia and stance ornament.
 if(npc&&seed>=12){const trim=trims[Math.floor(seed/12)%6];rect(c,-1,-21,2,2,trim);if(seed%3===0){line(c,-4,-20,-7-Math.sin(time/650+seed)*2,-12,trim);}}
 c.restore();
}

let beastAtlas:HTMLImageElement|null=null;
const beastCache=new Map<string,HTMLCanvasElement>();
function beastSprite(frame:number,hue=0){
 if(typeof Image==='undefined')return null;
 if(!beastAtlas){beastAtlas=new Image();beastAtlas.onload=()=>window.dispatchEvent(new Event('rpg-atlas-ready'));beastAtlas.src='/rpg/beasts.png';}
 if(!beastAtlas.complete||!beastAtlas.naturalWidth)return null;
 const key=frame+':'+hue;if(beastCache.has(key))return beastCache.get(key)!;
 const cell=document.createElement('canvas');cell.width=192;cell.height=128;const ctx=cell.getContext('2d');if(!ctx)return null;
 ctx.imageSmoothingEnabled=false;ctx.filter=hue?'hue-rotate('+hue+'deg)':'none';ctx.drawImage(beastAtlas,(frame%4)*384,Math.floor(frame/4)*256,384,256,0,0,192,128);
 const alpha=ctx.getImageData(0,0,192,128).data;let left=192,top=128,right=0,bottom=0;
 for(let y=0;y<128;y++)for(let x=0;x<192;x++)if(alpha[(y*192+x)*4+3]>90){left=Math.min(left,x);top=Math.min(top,y);right=Math.max(right,x);bottom=Math.max(bottom,y);}
 const trimmed=document.createElement('canvas');trimmed.width=right-left+1;trimmed.height=bottom-top+1;trimmed.getContext('2d')!.drawImage(cell,left,top,trimmed.width,trimmed.height,0,0,trimmed.width,trimmed.height);beastCache.set(key,trimmed);return trimmed;
}
export function drawEnemy(c:CanvasRenderingContext2D,x:number,y:number,time:number,e:{kind:number;appearance:number;boss?:boolean;worldBoss?:boolean}){
 const index=e.appearance%14,worldBoss=e.worldBoss||e.appearance>=810;
 const frame=worldBoss?9+((e.appearance-810)%3+3)%3:e.boss?8:[0,1,2,3,4,5,6,7,1,3,2,11,8,8][index];
 const sprite=beastSprite(frame,worldBoss?0:Math.floor(e.appearance/14)%12*13);
 if(!sprite){drawEnemyProcedural(c,x,y,time,e);return;}
 const size=worldBoss?190:e.boss?128:index>=10?74:64,scale=Math.min((worldBoss?235:e.boss?160:90)/sprite.width,size/sprite.height),w=Math.round(sprite.width*scale),h=Math.round(sprite.height*scale),bob=Math.sin(time/(index===6?160:360)+e.appearance)*(index===6||index===7?2:1);
 c.save();c.imageSmoothingEnabled=false;c.drawImage(sprite,Math.round(x-w/2),Math.round(y-h+bob),w,h);c.restore();
}
export function drawCompanion(c:CanvasRenderingContext2D,x:number,y:number,time:number,id:number,mount=false,moving=false){
 const type=mount?((id-40)%3+3)%3:id%4;
 if(!mount&&type===3){drawCompanionProcedural(c,x,y,time,id,mount,moving);return;}
 const frame=mount?[14,15,10][type]:[12,13,6][type],sprite=beastSprite(frame,Math.floor((mount?id-40:id)/(mount?3:4))*18);
 if(!sprite){drawCompanionProcedural(c,x,y,time,id,mount,moving);return;}
 const scale=Math.min((mount?100:48)/sprite.width,(mount?78:40)/sprite.height),w=Math.round(sprite.width*scale),h=Math.round(sprite.height*scale),bob=moving?Math.floor(time/130)%2:Math.sin(time/600+id);
 c.save();c.imageSmoothingEnabled=false;c.drawImage(sprite,Math.round(x-w/2),Math.round(y-h+bob),w,h);c.restore();
}
