export const REALMS=['Luyện Khí','Trúc Cơ','Kim Đan','Nguyên Anh','Hóa Thần'];
export const SKILLS=[{name:'Thanh Vân Kiếm',cost:0,cd:650,range:150,damage:34,color:'#d4efef'},{name:'Băng Liên Trận',cost:25,cd:5000,range:220,damage:62,color:'#70e0ff'},{name:'Thiên Lôi Quyết',cost:40,cd:8000,range:280,damage:105,color:'#bd9cff'},{name:'Vạn Kiếm Quy Tông',cost:65,cd:14000,range:300,damage:165,color:'#f6ca73'}];
export const maxHp=(level:number)=>360+(level-1)*120;
export const maxMp=(level:number)=>180+(level-1)*45;
export const xpNeed=(level:number)=>level*150;
export const MONSTERS=[{id:'fox1',kind:0,x:860,y:540,hp:160,max_hp:160},{id:'fox2',kind:0,x:910,y:595,hp:160,max_hp:160},{id:'fox3',kind:0,x:790,y:675,hp:160,max_hp:160},{id:'wolf1',kind:1,x:1010,y:520,hp:280,max_hp:280},{id:'wolf2',kind:1,x:960,y:570,hp:280,max_hp:280},{id:'boss',kind:2,x:940,y:450,hp:2400,max_hp:2400}];
const WALKABLE=[{x:200,y:505},{x:770,y:325},{x:1090,y:520},{x:600,y:790}];
export function boundedPosition(x:number,y:number){
 let inside=true;
 for(let i=0;i<WALKABLE.length;i++){const a=WALKABLE[i],b=WALKABLE[(i+1)%WALKABLE.length];if((b.x-a.x)*(y-a.y)-(b.y-a.y)*(x-a.x)<0)inside=false;}
 if(inside)return {x,y};let nearest={x:720,y:630},best=Infinity;
 for(let i=0;i<WALKABLE.length;i++){const a=WALKABLE[i],b=WALKABLE[(i+1)%WALKABLE.length],dx=b.x-a.x,dy=b.y-a.y,t=Math.max(0,Math.min(1,((x-a.x)*dx+(y-a.y)*dy)/(dx*dx+dy*dy))),point={x:a.x+t*dx,y:a.y+t*dy},dist=Math.hypot(x-point.x,y-point.y);if(dist<best){best=dist;nearest=point;}}
 return nearest;
}
