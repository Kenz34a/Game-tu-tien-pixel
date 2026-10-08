/** Original animated props for the novice village. Coordinates match the playable map. */
export function drawStarterVillage(c:CanvasRenderingContext2D,time:number){
 c.save();
 // Cool mountain light and wisps drifting through the lower courtyard.
 const light=c.createLinearGradient(0,270,0,850);light.addColorStop(0,'#76c7c719');light.addColorStop(1,'#061a222b');c.fillStyle=light;c.fillRect(0,260,1536,680);
 for(let i=0;i<5;i++){const x=350+i*240+Math.sin(time/4000+i)*35,y=745+(i%2)*55;const mist=c.createRadialGradient(x,y,8,x,y,145);mist.addColorStop(0,'#c1e9dd10');mist.addColorStop(1,'#c1e9dd00');c.fillStyle=mist;c.fillRect(x-145,y-70,290,145);}
 // Jade inlaid meditation dais, with eight seals travelling around it.
 const x=680,y=600,pulse=time?Math.sin(time/500)*.15:0;
 c.fillStyle='#182b30a6';c.beginPath();c.ellipse(x,y+5,64,29,0,0,Math.PI*2);c.fill();
 for(const [r,color] of [[57,'#8a94786a'],[46,'#84d9c99c'],[31,'#c7c09288']] as const){c.strokeStyle=color;c.lineWidth=1.3;c.beginPath();c.ellipse(x,y,r,r*.43,0,0,Math.PI*2);c.stroke();}
 c.strokeStyle='#a6dec76e';for(let i=0;i<8;i++){const a=i*Math.PI/4+(time?time/7000:0);c.beginPath();c.moveTo(x+Math.cos(a)*22,y+Math.sin(a)*10);c.lineTo(x+Math.cos(a)*45,y+Math.sin(a)*19);c.stroke();c.fillStyle='#cece9fab';c.fillRect(x+Math.cos(a)*52-2,y+Math.sin(a)*23-2,4,4);}
 const glow=c.createRadialGradient(x,y,3,x,y,55);glow.addColorStop(0,`rgba(101,218,187,${.13+pulse*.25})`);glow.addColorStop(1,'#5be4cd00');c.fillStyle=glow;c.fillRect(x-55,y-55,110,110);
 // Lanterns and silk standards mark the safe village and the eastern training path.
 for(const [lx,ly] of [[415,530],[485,785],[748,365],[782,790]] as const){
  c.fillStyle='#4b392c';c.fillRect(lx-2,ly-93,4,96);c.fillStyle='#baa17b';c.fillRect(lx-2,ly-94,38,3);
  const swing=time?Math.sin(time/850+lx)*3:0;c.save();c.translate(lx+24+swing,ly-71);c.fillStyle='#4b221f';c.beginPath();c.ellipse(0,0,13,17,0,0,Math.PI*2);c.fill();const silk=c.createLinearGradient(-10,0,10,0);silk.addColorStop(0,'#883d2f');silk.addColorStop(.5,'#f1ae58');silk.addColorStop(1,'#9d4c30');c.fillStyle=silk;c.beginPath();c.ellipse(0,0,11,15,0,0,Math.PI*2);c.fill();c.strokeStyle='#f7d68c77';c.lineWidth=1;for(const lineX of [-7,-3,3,7]){c.beginPath();c.ellipse(lineX*.3,0,Math.abs(lineX)+2,14,0,-Math.PI/2,Math.PI/2);c.stroke();}c.fillStyle='#e2c28a';c.fillRect(-7,-17,14,3);c.fillRect(-7,14,14,3);c.fillStyle='#815332';c.fillRect(-5,-20,10,3);c.strokeStyle='#c59456';c.beginPath();c.moveTo(0,-20);c.lineTo(0,-26);c.stroke();c.font='12px serif';c.textAlign='center';c.fillStyle='#7b3425';c.fillText('福',0,4);c.fillStyle='#dfaa67';c.fillRect(-1,17,2,9);c.fillRect(-3,25,6,3);c.restore();
  const halo=c.createRadialGradient(lx+24,ly-70,5,lx+24,ly-70,45);halo.addColorStop(0,'#f3b46b24');halo.addColorStop(1,'#f3b46b00');c.fillStyle=halo;c.fillRect(lx-21,ly-115,90,90);
 }
 for(const [bx,by] of [[390,680],[780,490]] as const){c.fillStyle='#52473c';c.fillRect(bx,by-103,4,106);c.fillStyle='#b69a69';c.fillRect(bx-4,by-104,55,3);for(let row=0;row<12;row++){const wave=time?Math.sin(time/500+row*.3+bx)*3:0;c.fillStyle=row%3?'#365555':'#768b6c';c.fillRect(bx+7+wave,by-98+row*5,34,5);}c.font='19px serif';c.textAlign='center';c.fillStyle='#d8cc9d';c.fillText('道',bx+24,by-64);}
 // A herb bed around the collection point, without placing NPCs on top of the crop.
 c.strokeStyle='#78826588';c.strokeRect(581,665,75,40);for(let i=0;i<7;i++){const hx=588+i*9,hy=696+(i%2)*3;c.fillStyle='#274938';c.fillRect(hx,hy-11,2,13);const sw=time?Math.sin(time/700+i)*1.5:0;c.fillStyle='#75ad79';c.fillRect(hx-5+sw,hy-8,6,3);c.fillRect(hx+1+sw,hy-13,6,3);c.fillStyle='#d9c58a';c.fillRect(hx,hy-17,3,3);}
 // Petals and spirit motes cover the whole opening, even before monsters unlock.
 for(let i=0;i<32;i++){const drift=time?time*.025:0,px=330+(i*83+drift*(1+i%3*.2))%820,py=345+(i*47+(time?time*.012:0))%490;c.save();c.translate(px,py);c.rotate(time?time/1500+i:i);c.fillStyle=i%4===0?'#e8d1ad8a':'#eab6ba8c';c.fillRect(-2,-1,5,2);c.restore();}
 c.restore();
}
export function drawNpcGesture(c:CanvasRenderingContext2D,x:number,y:number,time:number,merchant:boolean){
 c.save();const phase=time?time/650+x*.03:0;const glow=c.createRadialGradient(x,y-42,2,x,y-42,36);glow.addColorStop(0,merchant?'#e6a97925':'#90d9c72b');glow.addColorStop(1,'#c0efdd00');c.fillStyle=glow;c.fillRect(x-36,y-78,72,72);c.strokeStyle=merchant?'#e6c18370':'#98dbce70';c.lineWidth=1.2;c.beginPath();c.ellipse(x,y+3,30,10,0,0,Math.PI*2);c.stroke();
 for(let i=0;i<3;i++){const a=phase+i*Math.PI*2/3;c.fillStyle=merchant?'#f0ce94':'#a5e5d7';c.fillRect(x+Math.cos(a)*30,y-44+Math.sin(a)*11,2,2);}c.restore();
}
