import {adminCommerceView,adminCommerceAction} from '@/lib/rpg/admin-commerce';
import {AdminError} from '@/lib/rpg/admin-auth';
export const dynamic='force-dynamic';
const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
const fail=(e:unknown)=>json({error:e instanceof AdminError?e.message:'Không hoàn tất giao dịch. Kiểm tra lại trước khi thử tiếp.'},e instanceof AdminError?e.status:503);
export async function GET(req:Request){try{return json(await adminCommerceView(req));}catch(e){return fail(e);}}
export async function POST(req:Request){try{return json(await adminCommerceAction(req,await req.json()));}catch(e){return fail(e);}}
