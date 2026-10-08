import {requestOrigin,secureRequest} from '../request-origin';
import {env} from 'cloudflare:workers';
import {gameDb} from '../game-db';
export class AdminError extends Error{constructor(message:string,readonly status=400){super(message);}}
const runtime=()=>env as unknown as Record<string,unknown>;
export const adminConfigured=()=>String(runtime().ADMIN_PASSWORD||'').length>=16&&String(runtime().ADMIN_PASSWORD||'').length<=256;
export async function digest(value:string){const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value));return Array.from(new Uint8Array(bytes),x=>x.toString(16).padStart(2,'0')).join('');}
export function sameOrigin(req:Request){const origin=req.headers.get('origin');if((origin&&origin!==requestOrigin(req))||req.headers.get('sec-fetch-site')==='cross-site')throw new AdminError('Yêu cầu khác nguồn bị từ chối.',403);}
function token(req:Request){return req.headers.get('cookie')?.match(/(?:^|;\s*)vt_admin=([a-f0-9]{64})/)?.[1];}
export async function adminSession(req:Request){if(!adminConfigured())return false;const value=token(req);if(!value)return false;return !!await gameDb().prepare('SELECT token_hash FROM rpg_admin_sessions WHERE token_hash=? AND expires_at>? AND credential_hash=?').bind(await digest(value),Date.now(),await digest(String(runtime().ADMIN_PASSWORD))).first();}
export async function requireAdmin(req:Request){if(!await adminSession(req))throw new AdminError('Cần đăng nhập quản trị.',401);}
export function adminCookie(req:Request,value:string,maxAge:number){return `vt_admin=${value}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${secureRequest(req)?'; Secure':''}`;}
export async function loginAdmin(req:Request,password:unknown){
 sameOrigin(req);if(!adminConfigured())throw new AdminError('Máy chủ chưa cấu hình mật khẩu admin đủ 16 ký tự.',503);
 const ip=req.headers.get('x-forwarded-for')?.split(',').at(-1)?.trim()||'local';const key=await digest('admin:'+ip),now=Date.now();
 const limit:any=await gameDb().prepare('INSERT INTO rpg_admin_limits(id,attempts,window_at) VALUES(?,1,?) ON CONFLICT(id) DO UPDATE SET attempts=CASE WHEN rpg_admin_limits.window_at<? THEN 1 ELSE rpg_admin_limits.attempts+1 END,window_at=CASE WHEN rpg_admin_limits.window_at<? THEN ? ELSE rpg_admin_limits.window_at END RETURNING attempts').bind(key,now,now-300000,now-300000,now).first();
 if(limit.attempts>8)throw new AdminError('Thử quá nhiều lần. Chờ 5 phút rồi đăng nhập lại.',429);
 const expected=await digest(String(runtime().ADMIN_PASSWORD));const actual=await digest(typeof password==='string'&&password.length<=256?password:'');let difference=0;for(let i=0;i<expected.length;i++)difference|=expected.charCodeAt(i)^actual.charCodeAt(i);if(difference)throw new AdminError('Mật khẩu quản trị không đúng.',401);
 const value=crypto.randomUUID().replaceAll('-','')+crypto.randomUUID().replaceAll('-','');await gameDb().batch([gameDb().prepare('DELETE FROM rpg_admin_sessions WHERE expires_at<?').bind(now),gameDb().prepare('INSERT INTO rpg_admin_sessions(token_hash,credential_hash,expires_at,created_at) VALUES(?,?,?,?)').bind(await digest(value),expected,now+28800000,now)]);return adminCookie(req,value,28800);
}
export async function logoutAdmin(req:Request){sameOrigin(req);const value=token(req);if(value)await gameDb().prepare('DELETE FROM rpg_admin_sessions WHERE token_hash=?').bind(await digest(value)).run();return adminCookie(req,'',0);}
