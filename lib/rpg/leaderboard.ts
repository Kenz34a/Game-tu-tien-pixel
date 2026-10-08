import {db,type Session} from './database';
import {RANKING_BOARDS,rankingTitleId} from './ranking-defs';
let cached:{time:number;holders:Map<string,string[]>}|undefined;
export async function rankingHolders(force=false){
 if(!force&&cached&&Date.now()-cached.time<10000)return cached.holders;
 const rows=await Promise.all(RANKING_BOARDS.map(b=>db().prepare(`SELECT id FROM rpg_profiles WHERE ${b.eligible} ORDER BY ${b.order},id ASC LIMIT 3`).all<{id:string}>()));
 const holders=new Map<string,string[]>();rows.forEach((result,i)=>result.results.forEach((r,j)=>holders.set(r.id,[...(holders.get(r.id)||[]),rankingTitleId(RANKING_BOARDS[i].id,j+1)])));
 cached={time:Date.now(),holders};return holders;
}
export async function leaderboard(s:Session){
 const boards=await Promise.all(RANKING_BOARDS.map(b=>db().prepare(`WITH ranked AS (SELECT id,name,realm,data,${b.value} AS score,ROW_NUMBER() OVER(ORDER BY ${b.order},id ASC) AS position FROM rpg_profiles WHERE ${b.eligible}) SELECT * FROM ranked WHERE position<=100 OR id=? ORDER BY position`).bind(s.id).all<any>()));
 const rankingsByBoard:Record<string,any[]>={},personalRanks:Record<string,number|null>={};
 boards.forEach((result,i)=>{const id=RANKING_BOARDS[i].id;personalRanks[id]=result.results.find(r=>r.id===s.id)?.position??null;rankingsByBoard[id]=result.results.filter(r=>r.position<=100).map(r=>({rank:r.position,name:r.name,realm:r.realm,star:JSON.parse(r.data).star,score:r.score,me:r.id===s.id}));});
 return{rankingsByBoard,personalRanks,rankingsUpdatedAt:Date.now()};
}
