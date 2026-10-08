import {Pool,types,type PoolClient,type QueryResult} from 'pg';
import {postgresSql} from './postgres-sql';
types.setTypeParser(20,value=>{const n=Number(value);if(!Number.isSafeInteger(n))throw new Error('DATABASE_INTEGER_OUT_OF_RANGE');return n;});
types.setTypeParser(1700,Number);
let pool:Pool|undefined;
export function postgresPool(url:string){
 if(pool)return pool;let parsed:URL;try{parsed=new URL(url);}catch{throw new Error('DATABASE_URL_INVALID');}
 if(!['postgres:','postgresql:'].includes(parsed.protocol))throw new Error('DATABASE_URL_INVALID');
 const local=['localhost','127.0.0.1','[::1]'].includes(parsed.hostname);
 if(!local&&parsed.searchParams.get('sslmode')==='disable')throw new Error('DATABASE_TLS_REQUIRED');
 if(!local)for(const key of ['sslmode','sslcert','sslkey','sslrootcert'])parsed.searchParams.delete(key);
 pool=new Pool({connectionString:parsed.toString(),max:10,idleTimeoutMillis:30000,connectionTimeoutMillis:10000,...(!local?{ssl:{rejectUnauthorized:true}}:{})});
 pool.on('error',()=>console.error('PostgreSQL idle connection interrupted'));return pool;
}
function result(r:QueryResult){return{results:r.rows,success:true,meta:{changes:r.rowCount||0,last_row_id:0,duration:0,rows_read:r.rows.length,rows_written:r.rowCount||0,changed_db:r.command!=='SELECT',size_after:0}};}
class Prepared {
 constructor(readonly pool:Pool,readonly sql:string,readonly values:unknown[]=[]){ }
 bind(...values:unknown[]){return new Prepared(this.pool,this.sql,values);}
 async execute(client:Pool|PoolClient=this.pool){return client.query(postgresSql(this.sql),this.values);}
 async first(column?:string){const r=await this.execute();return column?r.rows[0]?.[column]??null:r.rows[0]??null;}
 async all(){return result(await this.execute());}
 async run(){return this.all();}
 async raw(){return (await this.execute()).rows.map(row=>Object.values(row));}
}
export function postgresDatabase(url:string):D1Database{
 const pool=postgresPool(url);
 return {prepare:(sql:string)=>new Prepared(pool,sql),async batch(statements:Prepared[]){const client=await pool.connect();try{await client.query('BEGIN');const results=[];for(const statement of statements){const r=await statement.execute(client);if(/^UPDATE rpg_profiles SET/i.test(statement.sql)&&statement.sql.includes('AND version=')&&r.rowCount!==1)throw new Error('PROFILE_VERSION_CONFLICT');results.push(result(r));}await client.query('COMMIT');return results;}catch(e){await client.query('ROLLBACK');throw e;}finally{client.release();}}} as unknown as D1Database;
}
