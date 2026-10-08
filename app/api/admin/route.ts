import {adminView,adminAction} from '@/lib/rpg/admin';
import {AdminError} from '@/lib/rpg/admin-auth';
export const dynamic='force-dynamic';
const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
function failure(e:unknown){if(e instanceof AdminError)return json({error:e.message},e.status);console.error('Admin operation unavailable');return json({error:'Thao tác chưa hoàn tất. Kiểm tra kết nối máy chủ.'},503);}
export async function GET(req:Request){try{return json(await adminView(req));}catch(e){return failure(e);}}
export async function POST(req:Request){try{return json(await adminAction(req,await req.json()));}catch(e){return failure(e);}}
