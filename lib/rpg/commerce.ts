import {db,GameError,type Session} from './database';
import type {ActionResult} from './actions';
export const TOPUP_PACKS=[{id:'jade100',amount:10000,jade:100},{id:'jade550',amount:50000,jade:550},{id:'jade1200',amount:100000,jade:1200}];
export type CommerceConfig={manualEnabled:boolean;bankName:string;bankAccount:string;bankHolder:string;instructions:string};
export async function commerceConfig():Promise<CommerceConfig>{const r:any=await db().prepare("SELECT data FROM rpg_commerce_config WHERE id='main'").first();return r?JSON.parse(r.data):{manualEnabled:false,bankName:'',bankAccount:'',bankHolder:'',instructions:''};}
export function validCode(code:unknown){const value=String(code||'').trim().toUpperCase();if(!/^[A-Z0-9_-]{4,40}$/.test(value))throw new GameError('Giftcode gồm 4–40 chữ, số, dấu gạch ngang hoặc gạch dưới.');return value;}
export async function commerceAction(s:Session,body:any,out:ActionResult){
 if(body.action==='redeemCode'){
  const code=validCode(body.code),now=Date.now();const gift:any=await db().prepare('SELECT * FROM rpg_giftcodes WHERE code=? AND active=1 AND expires_at>? AND uses_remaining>0').bind(code,now).first();if(!gift)throw new GameError('Giftcode không tồn tại, đã hết hạn hoặc hết lượt.');if(await db().prepare('SELECT code FROM rpg_gift_claims WHERE code=? AND owner=?').bind(code,s.id).first())throw new GameError('Nhân vật đã nhận giftcode này.');
  const r=JSON.parse(gift.rewards);for(const key of ['silver','stone','jade','merit','divine'] as const)s.profile.coins[key]+=r[key]||0;s.profile.potions+=r.potions||0;s.profile.shieldDan+=r.shieldDan||0;s.profile.materials.herb+=r.herb||0;s.profile.materials.ore+=r.ore||0;s.profile.materials.essence+=r.essence||0;
  out.statements.push(db().prepare('INSERT INTO rpg_gift_claims(code,owner,gate,created_at) VALUES(?,?,(SELECT CASE WHEN active=1 AND expires_at>? AND uses_remaining>0 THEN 1 ELSE 0 END FROM rpg_giftcodes WHERE code=?),?)').bind(code,s.id,now,code,now),db().prepare('UPDATE rpg_giftcodes SET uses_remaining=uses_remaining-1 WHERE code=?').bind(code));out.notice='Đã nhận quà giftcode '+code+'.';return true;
 }
 if(body.action==='topupCreate'){
  const pack=TOPUP_PACKS.find(p=>p.id===body.packId);if(!pack)throw new GameError('Gói nạp không hợp lệ.');if(!['manual','payos'].includes(body.method))throw new GameError('Phương thức không hợp lệ.');const config=await commerceConfig();if(body.method==='manual'&&!config.manualEnabled)throw new GameError('Máy chủ chưa mở chuyển khoản thủ công.');
  if(body.method==='payos'){const {payosConfigured}=await import('./payos');if(!payosConfigured())throw new GameError('Máy chủ chưa cấu hình payOS.');}
  const existing=await db().prepare("SELECT id FROM rpg_payment_orders WHERE owner=? AND pack_id=? AND method=? AND status='pending'").bind(s.id,pack.id,body.method).first();if(existing){out.notice='Đã có yêu cầu đang chờ cho gói này. Xem danh sách bên dưới để tiếp tục.';return true;}
  const pending:any=await db().prepare("SELECT COUNT(*) AS count FROM rpg_payment_orders WHERE owner=? AND status='pending'").bind(s.id).first();if(pending.count>=5)throw new GameError('Tối đa 5 yêu cầu chưa xử lý.');
  const id=crypto.randomUUID(),orderCode=Date.now()*1000+crypto.getRandomValues(new Uint32Array(1))[0]%1000;out.statements.push(db().prepare('INSERT INTO rpg_payment_orders(id,owner,order_code,pack_id,amount,jade,method,created_at) VALUES(?,?,?,?,?,?,?,?)').bind(id,s.id,orderCode,pack.id,pack.amount,pack.jade,body.method,Date.now()));out.notice='Đã tạo yêu cầu '+orderCode+'. Chưa cộng Tiên ngọc cho đến khi thanh toán được xác nhận.';return true;
 }
 return false;
}
// The decision token and CHECK constraint make approval+credit a single transaction
// on both D1 and PostgreSQL, including concurrent webhook/admin retries.
export async function creditOrder(id:string,method:'manual'|'payos',receipt:string,note:string){
 const order:any=await db().prepare('SELECT * FROM rpg_payment_orders WHERE id=?').bind(id).first();if(!order||order.method!==method)throw new GameError('Yêu cầu nạp không hợp lệ.');if(await db().prepare('SELECT order_id FROM rpg_payment_credits WHERE order_id=?').bind(id).first())return{notice:'Giao dịch đã được cộng trước đó.'};if(order.status!=='pending')throw new GameError('Yêu cầu đã bị từ chối.');
 const now=Date.now(),token=crypto.randomUUID();try{await db().batch([
 db().prepare("UPDATE rpg_payment_orders SET status='approved',decision_token=?,resolved_at=?,review_note=? WHERE id=? AND status='pending'").bind(token,now,note,id),
 db().prepare("INSERT INTO rpg_payment_credits(order_id,receipt,owner,amount,gate,created_at) VALUES(?,?,?,?,(SELECT CASE WHEN status='approved' AND decision_token=? THEN 1 ELSE 0 END FROM rpg_payment_orders WHERE id=?),?)").bind(id,receipt,order.owner,order.jade,token,id,now),
 db().prepare("UPDATE rpg_wallets SET balance=balance+? WHERE owner=? AND currency='jade'").bind(order.jade,order.owner),
 db().prepare('INSERT INTO rpg_admin_audit(action,target,reason,details,created_at) VALUES(?,?,?,?,?)').bind(method==='payos'?'payosCredit':'topupApprove',order.owner,note,JSON.stringify({orderId:id,receipt,vnd:order.amount,jade:order.jade}),now),
 ]);}catch(e){if(await db().prepare('SELECT order_id FROM rpg_payment_credits WHERE order_id=?').bind(id).first())return{notice:'Giao dịch đã được cộng trước đó.'};if(await db().prepare('SELECT order_id FROM rpg_payment_credits WHERE receipt=?').bind(receipt).first())throw new GameError('Mã giao dịch ngân hàng đã được dùng cho yêu cầu khác.');const state:any=await db().prepare('SELECT status FROM rpg_payment_orders WHERE id=?').bind(id).first();if(state?.status==='rejected')throw new GameError('Yêu cầu đã bị từ chối.');throw e;}
 return{notice:'Đã xác nhận và cộng '+order.jade+' Tiên ngọc.'};
}
export async function commerceView(s:Session){const [orders,claims,history]=await Promise.all([db().prepare('SELECT id,order_code,pack_id,amount,jade,method,status,created_at,resolved_at,review_note FROM rpg_payment_orders WHERE owner=? ORDER BY created_at DESC LIMIT 30').bind(s.id).all(),db().prepare('SELECT code,created_at FROM rpg_gift_claims WHERE owner=? ORDER BY created_at DESC LIMIT 30').bind(s.id).all(),db().prepare("SELECT id,seller_name,item_data,currency,price,sold_at,status,CASE WHEN owner=? THEN 'sell' ELSE 'buy' END AS direction FROM rpg_listings WHERE owner=? OR buyer_id=? ORDER BY created_at DESC LIMIT 60").bind(s.id,s.id,s.id).all()]);const {payosConfigured}=await import('./payos');return{config:await commerceConfig(),payosEnabled:payosConfigured(),packs:TOPUP_PACKS,orders:orders.results,claims:claims.results,history:history.results.map((r:any)=>({...r,item:JSON.parse(r.item_data),item_data:undefined}))};}
