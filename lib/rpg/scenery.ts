// Original pixel props make each map's biome and layout distinct.
export function drawScenery(c:CanvasRenderingContext2D,mapId:number,time:number){if(mapId===0)return;const biome=mapId%18,seed=mapId*7919+113;const tile=(x:number,y:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),w,h);};
 for(let i=0;i<18;i++){const edge=i%2===0,x=edge?325+(seed+i*157)%850:360+(seed+i*211)%820,y=edge?340+(i%3)*9:810+(i%3)*8;
  if([1,6,9].includes(biome)){for(let j=0;j<3;j++){const h=22+(seed+i+j*7)%27;tile(x+j*5,y-h,2,h,'#527d59');for(let k=1;k<4;k++){tile(x+j*5-5,y-k*h/4,12,2,'#92a572');tile(x+j*5,y-k*h/4-4,6,2,'#709970');}}}
  else if([4,8,11].includes(biome)){const col=biome===11?'#bb91b9':'#b5d4d4';for(let j=0;j<3;j++){const h=15+(i*7+j*4)%22;tile(x+j*7,y-h,5,h,col);tile(x+j*7+1,y-h-3,3,4,'#e0e7cf');tile(x+j*7+3,y-h+4,2,h-4,'#6b9cae');}}
  else if([5,15].includes(biome)){for(let j=0;j<5;j++){tile(x+j*5,y-j%3*4,8,2,'#723e34');tile(x+j*5+1,y-j%3*4,4,1,'#e4914f');}if(biome===5){tile(x+10,y-10,3,7,'#d6904d');tile(x+11,y-14-Math.floor(time/180+i)%3,2,5,'#e3bd71');}}
  else if([2,10,16].includes(biome)){tile(x,y-36,4,36,'#584834');tile(x+1,y-36,1,35,'#a68d62');tile(x-9,y-30,21,3,'#847052');tile(x-6,y-27,14,17,biome===10?'#ceb981':'#9b6059');tile(x,y-24,2,11,'#d6b88a');tile(x-6,y-11,14,2,'#624e40');}
  else if([7,14,17].includes(biome)){tile(x-10,y-28,25,29,'#536363');tile(x-8,y-26,21,24,'#829387');tile(x-11,y-30,27,4,'#a4aa91');tile(x-6,y-20,4,2,'#576c61');tile(x+2,y-16,7,2,'#596c64');tile(x-2,y-14,2,9,'#596c64');tile(x-12,y-2,29,5,'#3a524d');}
  else if(biome===13){for(let j=0;j<3;j++){tile(x-12-j*4,y-j*3,30+j*8,1,'#83bbb575');tile(x-8-j*4,y-j*3+1,20+j*8,1,'#a3c6bc65');}}
  else{tile(x-8,y-12,20,12,'#526b62');tile(x-4,y-15,13,3,'#9ba893');tile(x+7,y-9,5,8,'#3d5550');tile(x-7,y-12,5,2,'#809384');}
 }
 if([3,12,14].includes(biome)){for(let i=0;i<35;i++){const x=(seed+i*57+time*.008)%1500,y=390+(i*103)%400;tile(x,y+Math.sin(time/800+i)*4,2,2,biome===14?'#b093c44f':'#a7caca5e');}}
}
