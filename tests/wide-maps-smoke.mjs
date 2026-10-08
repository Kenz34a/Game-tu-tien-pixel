// This test only seeds its uniquely named profile in local D1.
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url)),base=process.env.RPG_TEST_URL||'http://localhost:8787',name='QA_CAMPS_'+Date.now().toString(36);
let cookie='';
async function request(action,args={},ok=true){if(action)await new Promise(r=>setTimeout(r,400));const r=await fetch(base+'/api/rpg',{method:action?'POST':'GET',headers:{...(cookie?{cookie}:{}),...(action?{'content-type':'application/json'}:{})},...(action?{body:JSON.stringify({action,...args})}:{})});cookie=r.headers.get('set-cookie')?.split(';')[0]||cookie;const d=await r.json();assert.equal(r.ok,ok,d.error);return d;}
function seed(fields){const pairs=Object.entries(fields).map(([key,value])=>`'$.${key}',${typeof value==='number'?value:`json('${JSON.stringify(value)}')`}`).join(',');execFileSync(process.execPath,['--import','./scripts/sites-env.mjs','./node_modules/wrangler/bin/wrangler.js','d1','execute','DB','--local','--config','wrangler.jsonc','--persist-to','.wrangler/state','--command',`UPDATE rpg_profiles SET data=json_set(data,${pairs}),version=version+1 WHERE name='${name}';`],{cwd:root,stdio:'pipe',env:process.env});}
let d=await request();assert.equal(d.enemies.length,0);await request('name',{name});
seed({claimed:['q0-8','q0-6','q0-12','q0-0','q0-10'],x:1720,y:1320,realm:44,hp:20000,mp:20000});d=await request();assert.equal(d.enemies.length,35);assert.equal(new Set(d.enemies.map(e=>e.campId)).size,7);
const extra=d.enemies.find(e=>e.campId===1&&e.spawnOf);d=await request('attack',{target:extra.id,skill:0});assert(d.hits.some(h=>h.id===extra.id&&h.dead));assert.equal(d.profile.killCounts[extra.spawnOf],1);assert.equal(d.enemies.find(e=>e.id===extra.id).hp,0);assert(d.enemies.find(e=>e.id===extra.spawnOf).hp>0,'An extra spawn does not kill its species template');
await request('attack',{target:'m0-13',skill:1},false);
seed({x:3850,y:2470,cooldowns:{},hp:20000});d=await request('sync');assert(d.profile.x>3500&&d.profile.y>2000,'The server accepts positions in distant camps');await request('cultivate',{},false);
d=await request('attack',{target:'m0-13',skill:0});assert(d.hits.some(h=>h.id==='m0-13'));
d=await request('sync',{x:999999,y:999999});assert(d.profile.x<=4488&&d.profile.y<=2952);assert(Math.hypot(d.profile.x-3850,d.profile.y-2470)<650,'Large maps retain movement speed validation');
d=await request('dungeonEnter');assert(d.profile.dungeon);assert.equal(d.profile.x,700);assert.equal(d.enemies.length,14);assert(d.enemies.every(e=>e.x<1230&&e.y<820));d=await request('dungeonLeave');assert.equal(d.enemies.length,35);assert.equal(d.profile.x,620);
console.log('PASS: novice safety, 7 camps/35 spawns, real extra-spawn combat and species quest credit, independent death, far-camp reachability, attack range, movement validation and dungeon entry/exit.');
