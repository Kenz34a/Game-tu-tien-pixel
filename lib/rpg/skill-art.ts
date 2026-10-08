export type SpellVisual={x:number;y:number;fromX:number;fromY:number;skill:number;classId:string;root:number};
const palette:Record<string,string[]>={sword:['#9ae7ff','#e5faff'],spell:['#c1a0ff','#fff0ff'],body:['#edbd62','#fff1bf'],fist:['#ff967e','#ffe5bf'],spear:['#8df2db','#e4fff5'],healer:['#a3ebb0','#fff4bb']};
/** Cast seal, travelling trail, impact and afterglow; at most 24 particles. */
export function drawSpellVisual(c:CanvasRenderingContext2D,e:SpellVisual,age:number,reduced=false){
 if(age<0||age>1.3)return;
 const colors=palette[e.classId]||palette.sword,skill=Math.max(0,Math.min(3,e.skill||0)),impact=Math.max(0,(age-.24)/.85),fade=Math.max(0,1-age/1.3),r=22+impact*(35+skill*18),phase=age*5;
 c.save();c.strokeStyle=colors[0];c.fillStyle=colors[1];c.lineWidth=2;c.globalAlpha=fade;c.shadowColor=colors[0];c.shadowBlur=6;
 if(reduced){c.beginPath();c.ellipse(e.x,e.y-15,28+skill*8,14+skill*4,0,0,Math.PI*2);c.stroke();c.restore();return;}
 // The ground seal identifies the casting tier without covering the actor.
 c.globalAlpha=fade*.55;c.beginPath();c.ellipse(e.fromX,e.fromY,24+skill*9,12+skill*4,0,0,Math.PI*2);c.stroke();
 for(let i=0;i<6+skill*2;i++){const a=i*Math.PI*2/(6+skill*2)+phase;c.fillRect(e.fromX+Math.cos(a)*(26+skill*9)-2,e.fromY+Math.sin(a)*(13+skill*4)-2,4,4);}
 // A luminous travelling streak joins the caster and impact point.
 if(age<.45){const q=Math.min(1,age/.3),x=e.fromX+(e.x-e.fromX)*q,y=e.fromY-35+(e.y-e.fromY+10)*q;c.globalAlpha=fade;c.beginPath();c.moveTo(e.fromX,e.fromY-35);c.quadraticCurveTo((e.x+e.fromX)/2,(e.y+e.fromY)/2-55,x,y);c.stroke();c.fillRect(x-3,y-3,6,6);}
 if(age<.2){c.restore();return;}
 c.translate(e.x,e.y-18);c.globalAlpha=fade*.8;
 const glow=c.createRadialGradient(0,0,0,0,0,r);glow.addColorStop(0,colors[1]+'77');glow.addColorStop(.35,colors[0]+'33');glow.addColorStop(1,colors[0]+'00');c.save();c.fillStyle=glow;c.beginPath();c.arc(0,0,r,0,Math.PI*2);c.fill();c.restore();
 c.beginPath();c.ellipse(0,12,r,r*.4,0,0,Math.PI*2);c.stroke();
 for(let i=0;i<8+skill*4;i++){
  const a=i*Math.PI*2/(8+skill*4)+phase*.3,px=Math.cos(a)*r,py=Math.sin(a)*r*.55;c.save();c.translate(px,py);c.rotate(a);
  if(e.classId==='sword'||e.classId==='spear'){
   c.lineWidth=skill===3?4:2;c.beginPath();c.moveTo(-16-skill*5,0);c.lineTo(16+skill*5,0);c.stroke();c.fillStyle=colors[1];c.beginPath();c.moveTo(18+skill*5,0);c.lineTo(7+skill*5,-3);c.lineTo(-13,-2);c.lineTo(-13,2);c.lineTo(7+skill*5,3);c.closePath();c.fill();
  }else if(e.classId==='spell'){
   c.beginPath();c.moveTo(-8,-18);c.lineTo(3,-5);c.lineTo(-4,4);c.lineTo(9,20);c.stroke();
  }else if(e.classId==='healer'){
   for(let j=0;j<3;j++){c.rotate(Math.PI/3);c.beginPath();c.ellipse(0,-5,3,9,0,0,Math.PI*2);c.stroke();}
  }else{
   c.strokeRect(-5,-5,10,10);c.beginPath();c.moveTo(-16,0);c.lineTo(-7,0);c.moveTo(7,0);c.lineTo(16,0);c.stroke();
  }
  c.restore();
 }
 // Distinct finishing strokes for each path; supreme skills add an inner seal.
 c.lineWidth=3+skill;c.globalAlpha=fade;
 if(e.classId==='sword'||e.classId==='spear'){for(let i=0;i<skill+1;i++){c.beginPath();c.arc(0,-15,r*.7,i*.8+phase,i*.8+phase+1.5);c.stroke();}}
 else if(e.classId==='spell'){c.beginPath();for(let i=0;i<=8;i++){const a=i*Math.PI/4;c.lineTo(Math.cos(a)*r*.65,Math.sin(a)*r*.65);}c.stroke();}
 else if(e.classId==='healer'){c.beginPath();c.ellipse(0,-10,r*.6,r*.35,0,0,Math.PI*2);c.stroke();}
 else{c.beginPath();c.arc(0,0,r*.55,0,Math.PI*2);c.stroke();c.fillRect(-3,-30,6,60);}
 // The signature impact makes each cultivation path recognizable.
 c.shadowBlur=12;c.strokeStyle=colors[1];c.fillStyle=colors[1];c.globalAlpha=fade*.9;
 if(e.classId==='spell'){
  for(let bolt=0;bolt<1+skill;bolt++){const offset=(bolt-skill/2)*18;c.beginPath();c.moveTo(offset-10,-95-skill*14);c.lineTo(offset+7,-60);c.lineTo(offset-6,-42);c.lineTo(offset+4,-14);c.lineTo(offset,4);c.lineWidth=2;c.stroke();c.beginPath();c.moveTo(offset-6,-42);c.lineTo(offset-25,-34);c.lineTo(offset-30,-15);c.lineWidth=1;c.stroke();}
 }else if(e.classId==='body'){
  c.font=(28+skill*5)+'px serif';c.textAlign='center';c.fillText('罡',0,7);c.lineWidth=2;c.beginPath();c.arc(0,-5,24+skill*5,0,Math.PI*2);c.stroke();
 }else if(e.classId==='fist'){
  c.fillRect(-12,-13,24,23);for(let finger=0;finger<4;finger++)c.fillRect(-12+finger*6,-23,5,16);c.fillRect(10,-7,7,14);c.strokeStyle=colors[0];c.lineWidth=2;c.strokeRect(-12,-13,24,23);
 }else if(e.classId==='spear'){
  const direction=Math.atan2(e.y-e.fromY,e.x-e.fromX);c.rotate(direction);for(let shaft=0;shaft<2+skill;shaft++){const py=(shaft-(1+skill)/2)*14;c.beginPath();c.moveTo(-r,py);c.lineTo(r*.35,py);c.lineTo(r*.2,py-5);c.moveTo(r*.35,py);c.lineTo(r*.2,py+5);c.lineWidth=2;c.stroke();}
 }else if(e.classId==='sword'){
  c.lineWidth=5+skill;c.beginPath();c.arc(0,-8,r*.8,phase+.2,phase+1.7);c.stroke();c.shadowBlur=0;c.lineWidth=1;c.beginPath();c.arc(0,-8,r*.8-5,phase+.2,phase+1.7);c.stroke();
 }else if(e.classId==='healer'){
  for(let petal=0;petal<6;petal++){c.save();c.rotate(petal*Math.PI/3+phase*.15);c.beginPath();c.ellipse(0,-r*.24,r*.12,r*.28,0,0,Math.PI*2);c.stroke();c.restore();}c.beginPath();c.arc(0,0,5+skill*2,0,Math.PI*2);c.fill();
 }
 if(skill===3){c.globalAlpha=fade*.5;c.lineWidth=1;c.beginPath();c.arc(0,0,r*.9,-phase,-phase+Math.PI*1.6);c.stroke();}
 c.restore();
}
