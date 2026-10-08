import {actor,GameError} from '@/lib/rpg/database';
import {sameOrigin,AdminError} from '@/lib/rpg/admin-auth';
import {ensurePlayable} from '@/lib/rpg/server-settings';
import {checkout} from '@/lib/rpg/payos';
export const dynamic='force-dynamic';
export async function POST(req:Request){try{sameOrigin(req);await ensurePlayable(req);const {id}=await actor(req);const body:any=await req.json();return Response.json(await checkout(req,id,String(body.orderId||'')),{headers:{'Cache-Control':'no-store'}});}catch(e){return Response.json({error:e instanceof GameError||e instanceof AdminError?e.message:'payOS chưa tạo được liên kết. Thử lại sau hoặc liên hệ admin.'},{status:e instanceof AdminError?e.status:e instanceof GameError?400:503});}}
