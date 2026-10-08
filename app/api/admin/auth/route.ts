import {adminConfigured,adminSession,loginAdmin,logoutAdmin,AdminError} from '@/lib/rpg/admin-auth';
export const dynamic='force-dynamic';
const json=(data:unknown,status=200,cookie='')=>Response.json(data,{status,headers:{'Cache-Control':'no-store',...(cookie?{'Set-Cookie':cookie}:{})}});
export async function GET(req:Request){return json({configured:adminConfigured(),authenticated:await adminSession(req)});}
export async function POST(req:Request){try{const body:any=await req.json();const cookie=await loginAdmin(req,body?.password);return json({authenticated:true},200,cookie);}catch(e){if(e instanceof AdminError)return json({error:e.message},e.status);console.error('Admin login unavailable');return json({error:'Đăng nhập quản trị đang gián đoạn.'},503);}}
export async function DELETE(req:Request){try{return json({authenticated:false},200,await logoutAdmin(req));}catch(e){return json({error:e instanceof AdminError?e.message:'Không đăng xuất được.'},e instanceof AdminError?e.status:503);}}
