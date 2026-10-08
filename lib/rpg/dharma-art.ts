import {currentDharma,DHARMAS} from './immortal';
import type {Profile} from './model';
let atlas:HTMLImageElement|null=null;const cache=new Map<number,HTMLCanvasElement>();
export function dharmaImage(id:number){if(typeof Image==='undefined')return null;if(id>=6)return secretDharmaImage(id);if(!atlas){atlas=new Image();atlas.onload=()=>window.dispatchEvent(new Event('rpg-atlas-ready'));atlas.src='/rpg/dharmas.png';}if(!atlas.complete||!atlas.naturalWidth)return null;if(cache.has(id))return cache.get(id)!;const cell=document.createElement('canvas');cell.width=256;cell.height=256;const c=cell.getContext('2d')!;c.imageSmoothingEnabled=false;c.drawImage(atlas,id%3*512,Math.floor(id/3)*512,512,512,0,0,256,256);cache.set(id,cell);return cell;}
export function drawDharma(c:CanvasRenderingContext2D,x:number,y:number,time:number,p:Pick<Profile,'realm'|'dharmaId'> & {claimed?:string[];dharmaLevel?:number;cooldowns?:Record<string,number>},small=false){const d=currentDharma(p);if(!d)return;const img=dharmaImage(d.id);if(!img)return;const active=(p.cooldowns?.dharmaActive||0)>Date.now(),size=Math.round((175+Math.min(d.realm,40)*2.2+(p.dharmaLevel||1)*1.5)*(small?.8:1)),bob=Math.sin(time/850)*3;
 c.save();c.imageSmoothingEnabled=false;c.globalAlpha=active?.92:.55;c.drawImage(img,Math.round(x-size/2),Math.round(y-size-14+bob),size,size);c.globalAlpha=active?.85:.45;c.strokeStyle=d.color;c.lineWidth=1.5;c.beginPath();c.ellipse(x,y+2,active?58:43,active?22:15,0,0,Math.PI*2);c.stroke();c.globalAlpha=.45;
 for(let i=0;i<7;i++){const a=time/2300+i*Math.PI*2/7,r=48+d.id*3;c.fillStyle=d.color;c.fillRect(Math.round(x+Math.cos(a)*r),Math.round(y-35+Math.sin(a)*r*.6),2,5);}
 c.restore();}

function secretDharmaImage(id:number){
 if(cache.has(id))return cache.get(id)!;const d=DHARMAS.find(d=>d.id===id);if(!d)return null;
 const cell=document.createElement('canvas');cell.width=256;cell.height=256;const c=cell.getContext('2d')!;c.translate(128,136);c.strokeStyle=d.color;c.fillStyle=d.color;c.lineWidth=3;c.shadowColor=d.color;c.shadowBlur=12;
 const circle=(r:number)=>{c.beginPath();c.arc(0,0,r,0,Math.PI*2);c.stroke();};circle(84);circle(92);
 if(d.form==='lotus'){for(let i=0;i<10;i++){c.save();c.rotate(i*Math.PI/5);c.globalAlpha=.55;c.beginPath();c.ellipse(0,-40,17,49,0,0,Math.PI*2);c.fill();c.globalAlpha=1;c.stroke();c.restore();}circle(26);}
 else if(d.form==='swords'){for(let i=0;i<9;i++){c.save();c.rotate(i*Math.PI*2/9);c.beginPath();c.moveTo(0,-108);c.lineTo(7,-55);c.lineTo(0,-44);c.lineTo(-7,-55);c.closePath();c.globalAlpha=.6;c.fill();c.globalAlpha=1;c.stroke();c.fillRect(-12,-43,24,3);c.fillRect(-2,-42,4,15);c.restore();}}
 else if(d.form==='moon'){c.lineWidth=14;c.beginPath();c.arc(0,-8,60,.35,Math.PI*1.65);c.stroke();c.lineWidth=2;for(let i=0;i<7;i++){c.fillRect(-60+i*20,65-Math.abs(i-3)*8,4,4);}}
 else if(d.form==='mirror'){c.save();c.rotate(Math.PI/4);c.strokeRect(-52,-52,104,104);c.strokeRect(-42,-42,84,84);c.restore();circle(31);c.font='48px serif';c.textAlign='center';c.fillText('道',0,16);}
 else if(d.form==='stars'){for(let i=0;i<12;i++){const a=i*2.4,rr=20+i*6,x=Math.cos(a)*rr,y=Math.sin(a)*rr;c.fillRect(x-3,y-3,6,6);if(i){c.lineTo(x,y);c.stroke();}c.beginPath();c.moveTo(x,y);}circle(38);}
 else{for(let i=0;i<3;i++){c.save();c.rotate(i*Math.PI*2/3);c.strokeRect(-24,-79,48,48);c.font='32px serif';c.textAlign='center';c.fillText(['守','心','道'][i],0,-44);c.restore();}circle(44);}
 cache.set(id,cell);return cell;
}
