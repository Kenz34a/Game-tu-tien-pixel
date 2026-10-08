import {npcPosition,type NpcDef,type QuestDef} from '@/lib/rpg/catalog';
import type {GameData} from './game';
import type {SceneTarget} from './game-canvas';
// Resolve only targets actually present in the current world snapshot.
export function questDestination(data:GameData,q:QuestDef):SceneTarget|null{
 if(q.map!==data.profile.mapId||data.profile.dungeon)return null;
 if(q.type==='talk'){const n=data.npcs.find((n:NpcDef)=>n.id===Number(q.target));return n?{kind:'npc',id:n.id,...npcPosition(n)}:null;}
 if(q.type==='gather'||q.type==='discover'){const n=data.resources.find((n:{id:number;type:string;x:number;y:number})=>n.type===(q.type==='discover'?'hidden':q.target.split(':')[1]));return n?{kind:'resource',id:n.id,x:n.x,y:n.y}:null;}
 if(q.type==='kill'||q.type==='boss'){const e=data.enemies.filter((e:{id:string;hp:number;boss:boolean})=>e.hp>0&&(q.type==='boss'?e.boss:e.id===q.target)).sort((a:{x:number;y:number},b:{x:number;y:number})=>Math.hypot(a.x-data.profile.x,a.y-data.profile.y)-Math.hypot(b.x-data.profile.x,b.y-data.profile.y))[0];return e?{kind:'enemy',id:e.id,x:e.x,y:e.y}:null;}
 return null;
}
