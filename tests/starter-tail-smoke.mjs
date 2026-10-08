// Local D1 fixtures exercise the three new server-controlled story steps.
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url)),base=process.env.RPG_TEST_URL||'http://localhost:8787',name='QA_TAIL_'+Date.now().toString(36);
let cookie='';
async function request(action,args={},ok=true){if(action)await new Promise(r=>setTimeout(r,400));const r=await fetch(base+'/api/rpg',{method:action?'POST':'GET',headers:{...(cookie?{cookie}:{}),...(action?{'content-type':'application/json'}:{})},...(action?{body:JSON.stringify({action,...args})}:{})});cookie=r.headers.get('set-cookie')?.split(';')[0]||cookie;const d=await r.json();assert.equal(r.ok,ok,d.error);return d;}
await request();await request('name',{name});await request('accept',{questId:'story-seal'},false);await request('resource',{nodeId:3},false);
const claimed=JSON.stringify(['q0-8','q0-6','q0-12','q0-0','q0-10']);
const sql=`UPDATE rpg_profiles SET data=json_set(data,'$.claimed',json('${claimed}'),'$.accepted',json('["story-seal"]'),'$.trackedQuestId','story-seal','$.storyRituals',json('[]')),version=version+1 WHERE name='${name}';`;
execFileSync(process.execPath,['--import','./scripts/sites-env.mjs','./node_modules/wrangler/bin/wrangler.js','d1','execute','DB','--local','--config','wrangler.jsonc','--persist-to','.wrangler/state','--command',sql],{cwd:root,stdio:'pipe',env:process.env});
let d=await request(),potions=d.profile.potions;
d=await request('resource',{nodeId:3,x:680,y:600});assert(d.profile.storyRituals.includes('0:seal'));assert.equal(d.effect.type,'ritual');
await request('resource',{nodeId:3},false);
d=await request('claimQuest',{questId:'story-seal'});assert.equal(d.profile.potions,potions+2);assert(d.profile.accepted.includes('story-bamboo'));assert.equal(d.profile.trackedQuestId,'story-bamboo');
await request('claimQuest',{questId:'story-seal'},false);await request('claimQuest',{questId:'story-bamboo'},false);
d=await request('travel',{mapId:1});assert.equal(d.profile.mapId,1);d=await request('claimQuest',{questId:'story-bamboo'});assert(d.profile.accepted.includes('story-message'));assert.equal(d.profile.trackedQuestId,'story-message');
await request('claimQuest',{questId:'story-message'},false);d=await request('talk',{npcId:2});const attack=d.stats.attack;
d=await request('claimQuest',{questId:'story-message'});assert(d.profile.books.includes(0));assert(d.stats.attack>attack);assert.equal(d.profile.trackedQuestId,null);assert.equal(d.profile.claimed.length,8);
await request('claimQuest',{questId:'story-message'},false);d=await request();assert.equal(d.profile.books.filter(id=>id===0).length,1);
console.log('PASS: ritual prerequisites, durable activation, single potion reward, sequential travel/NPC objectives, tracker handoff, permanent tome stats and duplicate reward rejection.');
