import { env } from 'cloudflare:workers';
import {postgresDatabase} from './postgres-db';
let postgres:D1Database|undefined;
export function gameDb(){const runtime=env as unknown as Record<string,unknown>;if(runtime.DATABASE_URL)return postgres??=postgresDatabase(String(runtime.DATABASE_URL));if(!env.DB)throw new Error('DATABASE_UNAVAILABLE');return env.DB;}
