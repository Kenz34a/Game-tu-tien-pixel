import {requestOrigin,secureRequest} from '@/lib/request-origin';
import { gameDb } from '@/lib/game-db';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const url = new URL(requestOrigin(request));
  const origin = request.headers.get('origin');
  if (origin && origin !== requestOrigin(request)) return Response.json({error:'Yêu cầu không hợp lệ.'}, {status:403});
  const form = await request.formData();
  const code = String(form.get('code') || '').trim().toLowerCase();
  if (!/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/.test(code)) {
    return Response.redirect(new URL('/restore?error=1', url), 303);
  }
  const profile = await gameDb().prepare('SELECT id FROM rpg_profiles WHERE id=?').bind(code).first();
  if (!profile) return Response.redirect(new URL('/restore?error=1', url), 303);
  return new Response(null, {status:303, headers:{
    'Location':'/', 'Cache-Control':'no-store',
    'Set-Cookie':`vt_session=${code}; Path=/; HttpOnly; SameSite=Lax; Max-Age=31536000${secureRequest(request)?'; Secure':''}`,
  }});
}
