import {session} from '@/lib/rpg/database';
import {commerceView} from '@/lib/rpg/commerce';
import {ensurePlayable} from '@/lib/rpg/server-settings';
import {AdminError} from '@/lib/rpg/admin-auth';
export const dynamic='force-dynamic';
export async function GET(req:Request){try{await ensurePlayable(req);const s=await session(req);return Response.json(await commerceView(s),{headers:{'Cache-Control':'no-store',...(s.cookie?{'Set-Cookie':s.cookie}:{})}});}catch(e){return Response.json({error:e instanceof AdminError?e.message:'Không tải được giao dịch.'},{status:e instanceof AdminError?e.status:503});}}
