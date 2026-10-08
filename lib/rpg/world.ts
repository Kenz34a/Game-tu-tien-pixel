import {serverSettings} from './server-settings';
import {worldBossPosition} from './map-layout';
import {leaderboard,rankingHolders} from './leaderboard';
import {db,initBosses,type Session} from './database';
import {MAPS,NPCS,WORLD_BOSSES,QUESTS,CATALOG_COUNTS} from './catalog';
import {stats,enemiesFor,questProgress,availableTitles,resourceNodes,successChance,nextXp,tideActive,insightActive} from './model';
import {partyView} from './parties';
export async function world(s:Session,extra:Record<string,unknown>={},lite=false){
 await initBosses();const holders=await rankingHolders();s.profile.rankingTitles=holders.get(s.id)||[];const p=s.profile,now=Date.now(),empty=()=>Promise.resolve({results:[] as any[]});
 const [peers,messages,bosses,listings,rankings,guilds,membership,listed,rewards,team,online]=await Promise.all([
 db().prepare('SELECT id,name,map_id,realm,data FROM rpg_profiles WHERE map_id=? AND last_seen>? AND id!=? LIMIT 60').bind(p.mapId,now-25000,s.id).all<any>(),
 db().prepare("SELECT id,name,body,map_id,channel,created_at FROM rpg_messages WHERE channel IN ('world','system') OR (channel='nearby' AND map_id=?) OR (channel='party' AND scope=(SELECT party_id FROM rpg_party_members WHERE owner=?)) OR (channel='sect' AND scope=(SELECT guild_id FROM rpg_members WHERE owner=? AND kind='sect')) ORDER BY id DESC LIMIT 80").bind(p.mapId,s.id,s.id).all<any>(),
 db().prepare('SELECT * FROM rpg_world_bosses').all<any>(),
 lite?empty():db().prepare("SELECT id,owner,seller_name,item_data,currency,price FROM rpg_listings WHERE status='open' ORDER BY created_at DESC LIMIT 80").all<any>(),
 lite?empty():db().prepare('SELECT id,name,power,realm,data FROM rpg_profiles ORDER BY power DESC,id ASC LIMIT 100').all<any>(),
 lite?empty():db().prepare('SELECT g.id,g.kind,g.name,g.treasury,COUNT(m.id) as members FROM rpg_guilds g LEFT JOIN rpg_members m ON m.guild_id=g.id GROUP BY g.id ORDER BY g.created_at LIMIT 60').all<any>(),
 lite?empty():db().prepare('SELECT m.guild_id,m.kind,m.contribution,g.name,g.treasury FROM rpg_members m JOIN rpg_guilds g ON m.guild_id=g.id WHERE m.owner=?').bind(s.id).all<any>(),
 lite?empty():db().prepare("SELECT item_uid FROM rpg_listings WHERE owner=? AND status='open'").bind(s.id).all<any>(),
 lite?empty():db().prepare('SELECT d.id,d.boss_id,d.damage,d.cycle FROM rpg_boss_damage d JOIN rpg_world_bosses b ON b.id=d.boss_id WHERE d.owner=? AND d.claimed=0 AND (b.hp=0 OR b.cycle>d.cycle)').bind(s.id).all<any>(),
 partyView(s,!lite),db().prepare('SELECT COUNT(*) as count FROM rpg_profiles WHERE last_seen>?').bind(now-25000).first<any>(),
 ]);
 const boards=lite?{}:await leaderboard(s);
 const viewPeers=peers.results.map(row=>{const pp=JSON.parse(row.data);return{id:row.id.slice(-8),name:row.name,x:pp.x,y:pp.y,classId:pp.classId,race:pp.race,root:pp.root,realm:pp.realm,star:pp.star,mountId:pp.mountId,titleId:pp.titleId?.startsWith('rank-')&&!holders.get(row.id)?.includes(pp.titleId)?null:pp.titleId,dharmaId:pp.dharmaId===undefined?-1:pp.dharmaId,dharmaLevel:pp.dharmaLevel||1,claimed:(pp.claimed||[]).filter((id:string)=>id.startsWith('s-'))};});
 const worldBosses=bosses.results.map(b=>({...WORLD_BOSSES.find(x=>x.id===b.id),hp:b.hp,respawnAt:b.respawn_at,cycle:b.cycle,...worldBossPosition(WORLD_BOSSES.find(x=>x.id===b.id)!.map),boss:true,worldBoss:true}));
 return{server:await serverSettings(),profile:p,stats:stats(p),map:MAPS[p.mapId],npcs:NPCS.filter(n=>n.map===p.mapId),enemies:enemiesFor(p,now),worldBosses,peers:viewPeers,messages:messages.results.reverse(),online:online?.count||1,...team,
 ...(!lite?{market:listings.results.map(l=>({id:l.id,mine:l.owner===s.id,seller:l.seller_name,item:JSON.parse(l.item_data),currency:l.currency,price:l.price})),rankings:rankings.results.map((r,i)=>({rank:i+1,name:r.name,power:r.power,realm:r.realm,star:JSON.parse(r.data).star,me:r.id===s.id})),guilds:guilds.results,membership:membership.results,listed:listed.results.map(r=>r.item_uid),bossRewards:rewards.results.map(r=>({bossId:r.boss_id,damage:r.damage,cycle:r.cycle})),titles:availableTitles(p),questProgress:Object.fromEntries(QUESTS.filter(q=>p.accepted.includes(q.id)).map(q=>[q.id,questProgress(p,q)]))}:{}),
 ...boards,resources:resourceNodes(p.mapId),chance:Math.min(.99,successChance(p)+Math.min(.16,(p.cooldowns.pity||0)*.02)),nextXp:nextXp(p),events:{tide:tideActive(now),insight:insightActive(now)},counts:CATALOG_COUNTS,time:now,...extra};
}
