import { gameDb } from '@/lib/game-db';
import { SKILLS,MONSTERS,maxHp,maxMp,xpNeed,boundedPosition } from '@/lib/game-rules';
export const dynamic='force-dynamic';
class RuleError extends Error {}
const json=(data:unknown,status=200,headers:Record<string,string>={})=>Response.json(data,{status,headers:{'Cache-Control':'no-store',...headers}});
async function identity(req:Request){
 const db=gameDb();let id=req.headers.get('cookie')?.match(/(?:^|;\s*)vt_session=([a-f0-9-]{36})/)?.[1];let cookie='';
 if(!id){id=crypto.randomUUID();cookie=`vt_session=${id}; Path=/; HttpOnly; SameSite=Lax; Max-Age=31536000${new URL(req.url).protocol==='https:'?'; Secure':''}`;}
 await db.prepare('INSERT OR IGNORE INTO players (id,name,last_seen) VALUES (?,?,?)').bind(id,'Thanh Vân',Date.now()).run();
 const p:any=await db.prepare('SELECT * FROM players WHERE id=?').bind(id).first();return {db,id,p,cookie};
}
async function world(db:ReturnType<typeof gameDb>,id:string){
 const now=Date.now();
 await db.batch(MONSTERS.map(m=>db.prepare('INSERT OR IGNORE INTO monsters (id,kind,x,y,hp,max_hp) VALUES (?,?,?,?,?,?)').bind(m.id,m.kind,m.x,m.y,m.hp,m.max_hp)));
 await db.prepare('UPDATE monsters SET hp=max_hp,respawn_at=0 WHERE hp=0 AND respawn_at<=?').bind(now).run();
 const [player,peers,monsters,chat]=await Promise.all([db.prepare('SELECT * FROM players WHERE id=?').bind(id).first(),db.prepare('SELECT id,name,x,y,level,hp FROM players WHERE last_seen>? AND id!=? LIMIT 40').bind(now-15000,id).all(),db.prepare('SELECT * FROM monsters').all(),db.prepare('SELECT id,name,body FROM messages ORDER BY id DESC LIMIT 30').all()]);
 const {id:secret,...safe}:any=player;return {player:safe,peers:peers.results.map((p:any)=>({...p,id:p.id.slice(-10)})),monsters:monsters.results,chat:chat.results.reverse(),time:now};
}
export async function GET(req:Request){try{const {db,id,cookie}=await identity(req);return json(await world(db,id),200,cookie?{'Set-Cookie':cookie}:{});}catch(e){console.error('Game load failed',e);return json({error:'Không thể kết nối tiên giới. Vui lòng thử lại.'},503);}}
export async function POST(req:Request){
 try{
 const origin=req.headers.get('origin');if(origin&&origin!==new URL(req.url).origin)return json({error:'Yêu cầu không hợp lệ.'},403);
 const body:any=await req.json();const {db,id,p,cookie}=await identity(req);const now=Date.now();let notice='';let hits:any[]=[];
 const elapsed=Math.max(0,Math.min(20,(now-p.last_seen)/1000));
 const old={x:p.x,y:p.y};const proposed=boundedPosition(Number.isFinite(body.x)?body.x:p.x,Number.isFinite(body.y)?body.y:p.y);const distance=Math.hypot(proposed.x-old.x,proposed.y-old.y);const limit=230*Math.max(.1,elapsed)+35;
 if(distance>limit){proposed.x=old.x+(proposed.x-old.x)*limit/distance;proposed.y=old.y+(proposed.y-old.y)*limit/distance;}
 let hp=p.hp,mp=Math.min(maxMp(p.level),p.mp+Math.floor(elapsed*7));
 if(body.action==='sync'){
 const near=await db.prepare('SELECT kind FROM monsters WHERE hp>0 AND ((x-?)*(x-?)+(y-?)*(y-?))<10000').bind(proposed.x,proposed.x,proposed.y,proposed.y).all();
 hp=Math.max(0,hp-Math.floor(elapsed*near.results.reduce((a:number,m:any)=>a+(m.kind===2?28:8),0)));
 if(proposed.x<780)hp=Math.min(maxHp(p.level),hp+Math.floor(elapsed*15));
 }
 await db.prepare('UPDATE players SET x=?,y=?,hp=?,mp=?,last_seen=? WHERE id=?').bind(proposed.x,proposed.y,hp,mp,now,id).run();
 if(body.action!=='sync'){
 const lock=await db.prepare('UPDATE players SET action_at=? WHERE id=? AND action_at<? RETURNING *').bind(now,id,now-280).first();if(!lock)return json({error:'Thao tác quá nhanh.'},429);
 if(body.action==='name'){const name=String(body.name||'').trim().slice(0,20);if(name.length<2)throw new RuleError('Tên đạo hữu cần ít nhất 2 ký tự.');await db.prepare('UPDATE players SET name=? WHERE id=?').bind(name,id).run();notice='Đạo danh đã được lưu.';}
 else if(body.action==='chat'){const message=String(body.message||'').trim().slice(0,180);const latest:any=await db.prepare('SELECT created_at FROM messages WHERE name=? ORDER BY id DESC LIMIT 1').bind(p.name).first();if(message&&(!latest||now-latest.created_at>1500)){await db.prepare('INSERT INTO messages (name,body,created_at) VALUES (?,?,?)').bind(p.name,message,now).run();await db.prepare('DELETE FROM messages WHERE id<(SELECT MAX(id)-200 FROM messages)').run();}else notice='Chờ một chút trước khi gửi tin tiếp theo.';}
 else if(body.action==='attack'){
 if(hp<=0)throw new RuleError('Hãy hồi sinh trước khi xuất chiêu.');const k=Number(body.skill);const skill=SKILLS[k];if(!skill)throw new RuleError('Chiêu thức không hợp lệ.');const cds=JSON.parse(p.cooldowns||'{}');if((cds[k]||0)>now)throw new RuleError('Chiêu thức đang hồi.');if(mp<skill.cost)throw new RuleError('Không đủ linh lực.');
 const target:any=await db.prepare('SELECT * FROM monsters WHERE id=? AND hp>0').bind(String(body.target)).first();if(!target)throw new RuleError('Chọn một yêu thú còn sống.');if(Math.hypot(proposed.x-target.x,proposed.y-target.y)>skill.range+20)throw new RuleError('Mục tiêu quá xa.');
 cds[k]=now+skill.cd;await db.prepare('UPDATE players SET mp=mp-?,cooldowns=? WHERE id=?').bind(skill.cost,JSON.stringify(cds),id).run();
 const enemies=k===0?[target]:(await db.prepare('SELECT * FROM monsters WHERE hp>0 AND ((x-?)*(x-?)+(y-?)*(y-?))<?').bind(target.x,target.x,target.y,target.y,k===3?80000:40000).all()).results;
 let xp=0,stones=0,kills=0,bosses=0;
 for(const enemy of enemies as any[]){const damage=Math.round(skill.damage*(1+(p.level-1)*.35)*(p.equipment?1.25:1));const hit:any=await db.prepare('UPDATE monsters SET hp=MAX(0,hp-?),respawn_at=CASE WHEN hp<=? THEN ? ELSE 0 END WHERE id=? AND hp>0 RETURNING hp').bind(damage,damage,now+(enemy.kind===2?90000:18000),enemy.id).first();if(hit){hits.push({id:enemy.id,damage,x:enemy.x,y:enemy.y,dead:hit.hp===0});if(hit.hp===0){xp+=enemy.kind===2?200:enemy.kind===1?45:30;stones+=enemy.kind===2?250:15;kills++;if(enemy.kind===2)bosses++;}}}
 if(kills)await db.prepare('UPDATE players SET xp=xp+?,stones=stones+?,kills=kills+?,bosses=bosses+? WHERE id=?').bind(xp,stones,kills,bosses,id).run();
 if(kills)notice=`+${xp} tu vi · +${stones} linh thạch`;
 }
 else if(body.action==='potion'){if(p.potions<=0)throw new RuleError('Đã hết hồi linh đan.');if(hp<=0)throw new RuleError('Hãy hồi sinh trước.');await db.prepare('UPDATE players SET potions=potions-1,hp=?,mp=? WHERE id=?').bind(Math.min(maxHp(p.level),hp+200),Math.min(maxMp(p.level),mp+90),id).run();notice='Hồi phục khí huyết và linh lực.';}
 else if(body.action==='buy'){if(p.stones<30)throw new RuleError('Cần 30 linh thạch.');await db.prepare('UPDATE players SET stones=stones-30,potions=potions+1 WHERE id=? AND stones>=30').bind(id).run();notice='Đã mua 1 Hồi Linh Đan.';}
 else if(body.action==='equip'){if(p.equipment)throw new RuleError('Đã trang bị Thanh Vân Kiếm.');if(p.stones<120)throw new RuleError('Cần 120 linh thạch.');await db.prepare('UPDATE players SET stones=stones-120,equipment=1 WHERE id=? AND equipment=0 AND stones>=120').bind(id).run();notice='Thanh Vân Kiếm · sát thương tăng 25%.';}
 else if(body.action==='breakthrough'){if(p.level>=5)throw new RuleError('Đã đạt Hóa Thần.');if(p.xp<xpNeed(p.level))throw new RuleError('Tu vi chưa đủ để đột phá.');await db.prepare('UPDATE players SET level=level+1,xp=xp-?,hp=?,mp=? WHERE id=? AND xp>=? AND level=?').bind(xpNeed(p.level),maxHp(p.level+1),maxMp(p.level+1),id,xpNeed(p.level),p.level).run();notice='ĐỘT PHÁ THÀNH CÔNG!';}
 else if(body.action==='cultivate'){if(proposed.x>780)throw new RuleError('Về sân môn phái để tu luyện.');const cds=JSON.parse(p.cooldowns||'{}');if((cds.cultivate||0)>now)throw new RuleError('Đợi 5 giây để tiếp tục tu luyện.');cds.cultivate=now+5000;await db.prepare('UPDATE players SET xp=xp+8,hp=?,mp=?,cooldowns=? WHERE id=?').bind(maxHp(p.level),maxMp(p.level),JSON.stringify(cds),id).run();notice='+8 tu vi · điều tức hoàn tất';}
 else if(body.action==='quest'){const ready=p.quest===0?p.kills>=5:p.quest===1?p.level>=2:p.quest===2?p.bosses>=1:false;if(!ready)throw new RuleError('Chưa hoàn thành yêu cầu nhiệm vụ.');await db.prepare('UPDATE players SET quest=quest+1,stones=stones+100,xp=xp+60,potions=potions+2 WHERE id=? AND quest=?').bind(id,p.quest).run();notice='Hoàn thành nhiệm vụ · +100 linh thạch · +60 tu vi · +2 đan';}
 else if(body.action==='revive'){if(hp>0)throw new RuleError('Đạo hữu vẫn còn khí huyết.');await db.prepare('UPDATE players SET x=720,y=630,hp=?,mp=? WHERE id=?').bind(maxHp(p.level),maxMp(p.level),id).run();notice='Đã hồi sinh tại Thanh Vân Môn.';}
 else throw new RuleError('Thao tác không hợp lệ.');
 }
 return json({...await world(db,id),notice,hits},200,cookie?{'Set-Cookie':cookie}:{});
 }catch(e){const message=e instanceof Error?e.message:'';if(message==='DATABASE_UNAVAILABLE'){console.error(e);return json({error:'Máy chủ đang tạm gián đoạn. Hãy thử lại.'},503);}if(e instanceof RuleError)return json({error:message},400);console.error('Game request failed',e);return json({error:'Máy chủ đang tạm gián đoạn. Hãy thử lại.'},503);}
}
