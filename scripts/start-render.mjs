import {spawn} from 'node:child_process';
import path from 'node:path';
import {mkdirSync} from 'node:fs';
import {projectRoot} from './sites-env.mjs';
const port=Number(process.env.PORT||8787);
if(!Number.isInteger(port)||port<1||port>65535)throw new Error('PORT must be a valid TCP port');
const state=process.env.RPG_STATE_DIR||path.join(projectRoot,'.wrangler/state');mkdirSync(state,{recursive:true});
const cli=path.join(projectRoot,'node_modules/wrangler/bin/wrangler.js');let child;
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>child?.kill(signal));
function run(args){return new Promise((resolve,reject)=>{child=spawn(process.execPath,['--import',path.join(projectRoot,'scripts/sites-env.mjs'),cli,...args],{cwd:projectRoot,env:process.env,stdio:'inherit'});child.on('error',reject);child.on('exit',(code,signal)=>code===0?resolve():reject(new Error(`Wrangler exited: ${code??signal}`)));});}
await run(['d1','migrations','apply','DB','--local','--config','wrangler.jsonc','--persist-to',state]);
await run(['dev','--config','dist/server/wrangler.json','--local','--persist-to',state,'--ip','0.0.0.0','--port',String(port),'--inspector-port','0']);
