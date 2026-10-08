import {spawn} from 'node:child_process';
import {migratePostgres} from './migrate-postgres.mjs';
if(!process.env.DATABASE_URL)throw new Error('Configure DATABASE_URL in Render environment settings.');
if(!process.env.ADMIN_PASSWORD||(process.env.ADMIN_PASSWORD.length<16||process.env.ADMIN_PASSWORD.length>256))throw new Error('Configure ADMIN_PASSWORD with at least 16 characters.');
await migratePostgres();
const child=spawn(process.execPath,['./node_modules/vinext/dist/cli.js','start','--hostname','0.0.0.0','--port',process.env.PORT||'8787'],{stdio:'inherit',env:{...process.env,RPG_RUNTIME:'node'}});
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>child.kill(signal));child.on('exit',code=>process.exit(code??1));
