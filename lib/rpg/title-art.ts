import type {TitleDef} from './titles';
/** A bounded canvas effect shared by the hero, peers and title previews. */
export function drawTitleEffect(c:CanvasRenderingContext2D,x:number,y:number,time:number,title:TitleDef,compact=false){
 c.save();c.translate(x,y);c.strokeStyle=title.color;c.fillStyle=title.color;c.globalAlpha=.35;c.lineWidth=1+title.tier*.2;
 c.beginPath();c.ellipse(0,2,25+title.tier*2,10+title.tier,0,0,Math.PI*2);c.stroke();
 const count=compact?4:4+title.tier,phase=time/1400;
 for(let i=0;i<count;i++){
 const angle=i*Math.PI*2/count+phase,px=Math.cos(angle)*(30+title.tier*2),py=Math.sin(angle)*13-8;
 c.save();c.translate(px,py);c.globalAlpha=.5+.25*Math.sin(phase*2+i);c.rotate(angle);
 switch(title.effect){
 case 'swords':c.fillRect(-1,-9,2,17);c.fillRect(-4,4,8,2);break;
 case 'lightning':c.beginPath();c.moveTo(-3,-7);c.lineTo(3,-2);c.lineTo(-2,2);c.lineTo(3,8);c.stroke();break;
 case 'lotus':for(let j=0;j<3;j++){c.rotate(Math.PI/3);c.beginPath();c.ellipse(0,-3,2,5,0,0,Math.PI*2);c.stroke();}break;
 case 'flame':c.beginPath();c.moveTo(0,-8);c.quadraticCurveTo(7,3,0,6);c.quadraticCurveTo(-6,1,0,-8);c.fill();break;
 case 'stars':c.beginPath();for(let j=0;j<8;j++){const a=j*Math.PI/4,r=j%2?2:6;c.lineTo(Math.cos(a)*r,Math.sin(a)*r);}c.closePath();c.fill();break;
 case 'mist':c.beginPath();c.ellipse(0,0,7,2,0,0,Math.PI*2);c.stroke();break;
 }
 c.restore();
 }
 c.restore();
}
/** Ornate floating plaque with layered wings, jade crest and path-specific filigree. */
export function drawTitleBanner(c:CanvasRenderingContext2D,x:number,y:number,time:number,title:TitleDef){
 c.save();c.translate(x,y);c.font='15px VT323,monospace';
 let width=Math.min(248,c.measureText(title.name).width+40);if(c.measureText(title.name).width>width-28)c.font='12px VT323,monospace';
 const half=width/2,phase=time/900,color=title.color,accent={mist:'#97eaff',swords:'#64a7ff',flame:'#ff587a',stars:'#a58bff',lotus:'#f5a4d8',lightning:'#b693ff'}[title.effect];
 const metal=c.createLinearGradient(0,-17,0,19);metal.addColorStop(0,'#fff3c9');metal.addColorStop(.3,color);metal.addColorStop(.65,accent);metal.addColorStop(1,color);
 const ink=c.createLinearGradient(0,-12,0,13);ink.addColorStop(0,'#253244');ink.addColorStop(.5,'#0b1526');ink.addColorStop(1,'#27303c');
 // A faceted plaque with curled shoulders, rather than a rectangular box.
 c.beginPath();c.moveTo(-half+13,-13);c.lineTo(-22,-13);c.quadraticCurveTo(0,-23,22,-13);c.lineTo(half-13,-13);c.lineTo(half+1,-4);c.lineTo(half-5,5);c.lineTo(half-16,13);c.lineTo(20,13);c.quadraticCurveTo(0,20,-20,13);c.lineTo(-half+16,13);c.lineTo(-half+5,5);c.lineTo(-half-1,-4);c.closePath();
 c.fillStyle=ink;c.fill();c.strokeStyle=metal;c.lineWidth=2;c.stroke();
 c.strokeStyle=color;c.lineWidth=.7;c.beginPath();c.moveTo(-half+16,-9);c.lineTo(-18,-9);c.moveTo(18,-9);c.lineTo(half-16,-9);c.moveTo(-half+18,9);c.lineTo(-20,9);c.moveTo(20,9);c.lineTo(half-18,9);c.stroke();
 for(const side of [-1,1]){
  c.save();c.scale(side,1);c.translate(half-5,0);c.strokeStyle=metal;c.fillStyle=color;c.lineWidth=1.3;
  // Three swept feathers form the shoulder. Fine lines give each wing texture.
  for(let feather=0;feather<3;feather++){
   const reach=20+title.tier*2-feather*4,top=-14-feather*5;
   c.beginPath();c.moveTo(0,8-feather*2);c.quadraticCurveTo(12,-2,reach,top);c.quadraticCurveTo(reach-10,top+3,2,-6-feather*3);c.closePath();c.fillStyle=feather%2?accent:color;c.globalAlpha=feather%2?.9:.65;c.fill();c.globalAlpha=1;c.stroke();
   c.beginPath();c.moveTo(3,3-feather*3);c.lineTo(reach-3,top+3);c.stroke();
  }
  // Lower scrolls cradle the plaque; a gem marks the outer tip.
  c.beginPath();c.moveTo(-5,10);c.bezierCurveTo(14,25,34,8,22,3);c.bezierCurveTo(12,-1,11,15,20,12);c.stroke();
  c.shadowColor=color;c.shadowBlur=8;c.fillStyle=color;c.beginPath();c.moveTo(22,-6);c.lineTo(27,-1);c.lineTo(22,4);c.lineTo(17,-1);c.closePath();c.fill();c.fillStyle='#fff6db';c.fillRect(21,-3,2,3);c.shadowBlur=0;
  // Each cultivation path adds its own emblem to the outer wing.
  c.translate(8,-9);c.strokeStyle=color;c.fillStyle=color;
  if(title.effect==='swords'){c.beginPath();c.moveTo(-2,8);c.lineTo(7,-18);c.lineTo(7,-5);c.closePath();c.fill();c.beginPath();c.moveTo(-5,2);c.lineTo(5,6);c.stroke();}
  else if(title.effect==='lightning'){c.beginPath();c.moveTo(7,-17);c.lineTo(-1,-5);c.lineTo(6,-6);c.lineTo(0,8);c.lineTo(13,-7);c.lineTo(6,-5);c.closePath();c.fill();}
  else if(title.effect==='lotus'){for(let petal=0;petal<3;petal++){c.save();c.rotate((petal-1)*.5);c.beginPath();c.ellipse(0,-8,3,8,0,0,Math.PI*2);c.stroke();c.restore();}}
  else if(title.effect==='flame'){c.beginPath();c.moveTo(0,5);c.bezierCurveTo(-7,-4,7,-8,4,-19);c.bezierCurveTo(17,-3,7,5,0,5);c.stroke();}
  else if(title.effect==='mist'){c.beginPath();c.arc(2,-9,5,.4,Math.PI*1.7);c.arc(10,-6,4,Math.PI,Math.PI*2.7);c.stroke();}
  else{c.beginPath();c.moveTo(4,-18);c.lineTo(7,-11);c.lineTo(14,-8);c.lineTo(7,-5);c.lineTo(4,2);c.lineTo(1,-5);c.lineTo(-6,-8);c.lineTo(1,-11);c.closePath();c.stroke();}
  c.restore();
 }
 // Crown jewel, hanging pearl and moving star glints finish the frame.
 c.strokeStyle=metal;c.lineWidth=1.5;c.beginPath();c.moveTo(-12,-14);c.lineTo(-8,-21);c.lineTo(-3,-17);c.lineTo(0,-26);c.lineTo(3,-17);c.lineTo(8,-21);c.lineTo(12,-14);c.stroke();
 c.fillStyle=color;c.beginPath();c.ellipse(0,-17,4,5,0,0,Math.PI*2);c.fill();c.fillStyle='#fff1d2';c.fillRect(-1,-20,2,2);
 c.strokeStyle=color;c.beginPath();c.moveTo(0,15);c.lineTo(0,19);c.stroke();c.beginPath();c.arc(0,21,2,0,Math.PI*2);c.fillStyle=color;c.fill();
 c.fillStyle='#fff2d8';c.textAlign='center';c.textBaseline='middle';c.shadowColor=color;c.shadowBlur=title.tier>=4?5:2;c.fillText(title.name,0,0);c.shadowBlur=0;
 for(const side of [-1,1]){const sx=side*(half+15),sy=-14+Math.sin(phase+side)*4;c.globalAlpha=.55+.3*Math.sin(phase*2+side);c.strokeStyle='#fff8e1';c.lineWidth=1;c.beginPath();c.moveTo(sx-4,sy);c.lineTo(sx+4,sy);c.moveTo(sx,sy-4);c.lineTo(sx,sy+4);c.stroke();}
 c.restore();
}
