import {Pool} from 'pg';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
export async function migratePostgres(){
 const url=process.env.DATABASE_URL;if(!url)throw new Error('Set DATABASE_URL securely before PostgreSQL migration.');
 let parsed;try{parsed=new URL(url);}catch{throw new Error('DATABASE_URL is invalid.');}
 const local=['localhost','127.0.0.1','[::1]'].includes(parsed.hostname);
 if(!local&&parsed.searchParams.get('sslmode')==='disable')throw new Error('PostgreSQL TLS is required.');
 if(!local)for(const key of ['sslmode','sslcert','sslkey','sslrootcert'])parsed.searchParams.delete(key);
 const pool=new Pool({connectionString:parsed.toString(),...(!local?{ssl:{rejectUnauthorized:true}}:{})});const client=await pool.connect();
 try{await client.query('BEGIN');await client.query("SELECT pg_advisory_xact_lock(83041724)");await client.query('CREATE TABLE IF NOT EXISTS rpg_schema_migrations (id text PRIMARY KEY, applied_at bigint NOT NULL)');const done=await client.query("SELECT id FROM rpg_schema_migrations WHERE id='0000_schema'");if(!done.rowCount){await client.query(readFileSync(new URL('../postgres/0000_schema.sql',import.meta.url),'utf8'));await client.query("INSERT INTO rpg_schema_migrations VALUES ('0000_schema',$1)",[Date.now()]);}await client.query('COMMIT');console.log('PostgreSQL schema ready.');}catch(e){await client.query('ROLLBACK');throw new Error('PostgreSQL migration failed; schema was rolled back.',{cause:e});}finally{client.release();await pool.end();}
}
if(process.argv[1]===fileURLToPath(import.meta.url))await migratePostgres();
