import {env} from 'cloudflare:workers';
// Render terminates TLS before forwarding to Node. Use its trusted service URL,
// never an arbitrary Forwarded header, for cookie and same-origin checks.
export function requestOrigin(req:Request){const configured=(env as unknown as Record<string,unknown>).RENDER_EXTERNAL_URL;return configured?new URL(String(configured)).origin:new URL(req.url).origin;}
export function secureRequest(req:Request){return requestOrigin(req).startsWith('https:');}
