import {paymentWebhook,payosConfigured} from '@/lib/rpg/payos';
import {GameError} from '@/lib/rpg/database';
export const dynamic='force-dynamic';
export async function POST(req:Request){if(!payosConfigured())return Response.json({error:'Thanh toán tự động chưa mở.'},{status:503});try{return Response.json(await paymentWebhook(await req.json()));}catch(e){return Response.json({error:e instanceof GameError?e.message:'Xử lý thanh toán chưa hoàn tất; gửi lại webhook.'},{status:e instanceof GameError?400:503});}}
