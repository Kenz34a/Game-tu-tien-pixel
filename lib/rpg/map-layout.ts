// Shared world coordinates: the server, camera and maps use the same geometry.
export const FIELD_SIZE={width:4608,height:3072};
export const ARENA_SIZE={width:1536,height:1024};
export const CAMP_NAMES=['Đông Sơn','Trúc Khê','Vọng Nguyệt','Cổ Thụ','Huyền Nham','Lạc Vân','Trấn Ma'];
const centers=[[1120,620],[1720,1320],[2470,650],[2670,2050],[3650,1050],[1330,2370],[3850,2470]];
export function monsterCamps(mapId:number){return centers.map(([x,y],id)=>({id,name:CAMP_NAMES[(id+mapId)%7],x,y,boss:id===6}));}
export function campForIndex(index:number){return index<3?0:index===13?6:Math.floor((index-1)/2);}
export function enemyPosition(mapId:number,index:number,slot?:number){const camp=monsterCamps(mapId)[campForIndex(index)],seat=slot??(index<3?index:index===13?0:(index-1)%2);const offsets=[[-70,0],[65,-45],[15,80],[-100,105],[105,85]];return{x:camp.x+offsets[seat][0],y:camp.y+offsets[seat][1],campId:camp.id};}
export function arenaEnemyPosition(index:number){return{x:index===13?1060:810+index%4*100,y:index===13?710:400+Math.floor(index/4)*100};}
export function worldSize(arena=false){return arena?ARENA_SIZE:FIELD_SIZE;}
export function safeVillage(p:{x:number;y:number;dungeon?:unknown}){return !p.dungeon&&p.x<850&&p.y>=350&&p.y<=950;}
export function worldBossPosition(mapId:number){const camp=monsterCamps(mapId)[6];return{x:camp.x+210,y:camp.y-170};}
