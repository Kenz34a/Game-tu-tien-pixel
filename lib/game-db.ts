import { env } from 'cloudflare:workers';
export function gameDb(){if(!env.DB)throw new Error('DATABASE_UNAVAILABLE');return env.DB;}
