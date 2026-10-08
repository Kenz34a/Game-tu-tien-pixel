import {FIELD_SIZE,monsterCamps} from './map-layout';
export type ViewRect={left:number;top:number;right:number;bottom:number};
const villageEdges=new WeakMap<HTMLImageElement,HTMLCanvasElement>();
function villageImage(image:HTMLImageElement){
 let canvas=villageEdges.get(image);if(canvas)return canvas;
 canvas=document.createElement('canvas');canvas.width=1536;canvas.height=1024;const c=canvas.getContext('2d')!;c.drawImage(image,0,0,1536,1024);c.globalCompositeOperation='destination-in';
 const east=c.createLinearGradient(1320,0,1536,0);east.addColorStop(0,'#fff');east.addColorStop(1,'#ffffff00');c.fillStyle=east;c.fillRect(0,0,1536,1024);
 const south=c.createLinearGradient(0,870,0,1024);south.addColorStop(0,'#fff');south.addColorStop(1,'#ffffff00');c.fillStyle=south;c.fillRect(0,0,1536,1024);villageEdges.set(image,canvas);return canvas;
}
// Draw only the visible terrain cells; distant camps cost no canvas work.
export function drawField(c:CanvasRenderingContext2D,image:HTMLImageElement|undefined,mapId:number,view:ViewRect){
 const ready=image?.complete&&image.naturalWidth;
 c.fillStyle=['#7a845b','#66857c','#666878'][Math.floor(mapId/18)];c.fillRect(0,0,FIELD_SIZE.width,FIELD_SIZE.height);
 if(ready){for(let y=Math.max(0,Math.floor(view.top/256)*256);y<Math.min(FIELD_SIZE.height,view.bottom);y+=256)for(let x=Math.max(0,Math.floor(view.left/256)*256);x<Math.min(FIELD_SIZE.width,view.right);x+=256){c.save();c.translate(x+(Math.floor(x/256)%2?256:0),y+(Math.floor(y/256)%2?256:0));c.scale(Math.floor(x/256)%2?-1:1,Math.floor(y/256)%2?-1:1);c.drawImage(image,480,450,160,160,0,0,256,256);c.restore();}c.drawImage(villageImage(image),0,0);}
 const camps=monsterCamps(mapId);
 c.save();c.lineCap='round';c.lineJoin='round';
 for(const camp of camps){const prev=camp.id===0?{x:760,y:620}:camps[camp.id===5?1:camp.id-1];for(const [width,color] of [[66,'#4b593848'],[48,'#baa37266'],[23,'#d2bb8855']] as const){c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.moveTo(prev.x,prev.y);c.lineTo((prev.x+camp.x)/2,prev.y);c.lineTo(camp.x,camp.y);c.stroke();}}
 for(let i=0;i<360;i++){const x=180+(i*887+mapId*149)%4220,y=170+(i*593+mapId*211)%2700;if(x<1536&&y<1024||x<view.left-70||x>view.right+70||y<view.top-100||y>view.bottom+40||camps.some(a=>Math.hypot(a.x-x,a.y-y)<260))continue;
  c.fillStyle='#142f2940';c.beginPath();c.ellipse(x,y+3,24,9,0,0,Math.PI*2);c.fill();
  if(i%4===0){c.fillStyle='#526962';c.fillRect(x-16,y-22,32,22);c.fillStyle='#a0a488';c.fillRect(x-12,y-27,20,9);c.fillStyle='#3e5650';c.fillRect(x+8,y-13,10,12);}
  else{for(let j=0;j<4;j++){const h=48+(i*7+j*13)%50,tx=x+j*7-10;c.fillStyle='#405e40';c.fillRect(tx,y-h,3,h);c.fillStyle='#92ac66';c.fillRect(tx+1,y-h,1,h);for(let k=1;k<5;k++){c.fillStyle=i%3?'#57834b':'#968348';c.fillRect(tx-11,y-k*h/5,24,4);c.fillRect(tx-5,y-k*h/5-5,17,3);}}}
 }
 for(const camp of camps){if(camp.x<view.left-270||camp.x>view.right+270||camp.y<view.top-270||camp.y>view.bottom+270)continue;c.strokeStyle=camp.boss?'#ae76574a':'#788c6344';c.lineWidth=3;c.setLineDash([12,18]);c.beginPath();c.ellipse(camp.x,camp.y,215,180,0,0,Math.PI*2);c.stroke();c.setLineDash([]);c.fillStyle='#4c4734';c.fillRect(camp.x-92,camp.y-160,4,50);c.fillRect(camp.x+88,camp.y-160,4,50);c.fillStyle='#283d35';c.fillRect(camp.x-95,camp.y-159,190,28);c.strokeStyle='#bca877';c.lineWidth=1;c.strokeRect(camp.x-95,camp.y-159,190,28);c.textAlign='center';c.font='16px monospace';c.fillStyle='#e4d29b';c.fillText(`${camp.id+1} · Bãi ${camp.name}`,camp.x,camp.y-140);}
 c.restore();
}
