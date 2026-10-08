import {db,type Session} from './database';
export async function leaderboard(s:Session){
 const rankExpr="realm DESC,CAST(json_extract(data,'$.star') AS INTEGER) DESC,CAST(json_extract(data,'$.xp') AS INTEGER) DESC,id ASC";
 const [cultivation,powerRank,cultivationRank]=await Promise.all([
  db().prepare(`SELECT id,name,power,realm,data FROM rpg_profiles ORDER BY ${rankExpr} LIMIT 100`).all<any>(),
  db().prepare('SELECT COUNT(*)+1 AS rank FROM rpg_profiles WHERE power>(SELECT power FROM rpg_profiles WHERE id=?) OR (power=(SELECT power FROM rpg_profiles WHERE id=?) AND id<?)').bind(s.id,s.id,s.id).first<any>(),
  db().prepare(`WITH entries AS (SELECT id,realm,CAST(json_extract(data,'$.star') AS INTEGER) AS star,CAST(json_extract(data,'$.xp') AS INTEGER) AS xp FROM rpg_profiles),me AS (SELECT * FROM entries WHERE id=?) SELECT COUNT(*)+1 AS rank FROM entries,me WHERE entries.realm>me.realm OR (entries.realm=me.realm AND entries.star>me.star) OR (entries.realm=me.realm AND entries.star=me.star AND entries.xp>me.xp) OR (entries.realm=me.realm AND entries.star=me.star AND entries.xp=me.xp AND entries.id<me.id)`).bind(s.id).first<any>(),
 ]);
 return {cultivationRankings:cultivation.results.map((r,i)=>({rank:i+1,name:r.name,power:r.power,realm:r.realm,star:JSON.parse(r.data).star,xp:JSON.parse(r.data).xp||0,me:r.id===s.id})),personalRanks:{power:powerRank?.rank||1,cultivation:cultivationRank?.rank||1},rankingsUpdatedAt:Date.now()};
}
