// Run against the local application started with npm start; uses disposable QA profiles.
import assert from 'node:assert/strict';
const base='http://localhost:8787/api/rpg',suffix=Date.now(),wait=ms=>new Promise(r=>setTimeout(r,ms));
async function actor(letter){const r=await fetch(base),cookie=r.headers.get('set-cookie').split(';')[0];let data=await r.json();return {async get(){const r=await fetch(base,{headers:{Cookie:cookie}});data=await r.json();return data;},async post(action,args={},ok=true){await wait(400);const r=await fetch(base,{method:'POST',headers:{Cookie:cookie,'Content-Type':'application/json'},body:JSON.stringify({action,x:data.profile.x,y:data.profile.y,...args})});const d=await r.json();assert.equal(r.ok,ok,d.error);if(r.ok)data=d;return d;},name:`QA_MAPCHAT_${letter}_${suffix}`};}
const a=await actor('A'),b=await actor('B'),c=await actor('C');
for(const u of [a,b,c])await u.post('name',{name:u.name.slice(0,22)});
await a.post('chat',{message:`world-${suffix}`});assert((await c.get()).messages.some(m=>m.body===`world-${suffix}`));
await a.post('chatChannel',{channel:'nearby'});await wait(1900);await a.post('chat',{message:`near-${suffix}`});assert((await b.get()).messages.some(m=>m.body===`near-${suffix}`));
await c.post('travel',{mapId:1});assert(!(await c.get()).messages.some(m=>m.body===`near-${suffix}`));
const team=await a.post('partyCreate',{name:'QA_MAPCHAT_TEAM'});await b.post('partyJoin',{code:team.party.code});await a.post('chatChannel',{channel:'party'});await wait(1900);await a.post('chat',{message:`private-${suffix}`});
assert((await b.get()).messages.some(m=>m.body===`private-${suffix}`));assert(!(await c.get()).messages.some(m=>m.body===`private-${suffix}`));await b.post('partyLeave');assert(!(await b.get()).messages.some(m=>m.body===`private-${suffix}`));
await c.post('chatChannel',{channel:'party'});await c.post('chat',{message:'cannot send without membership'},false);
await a.post('chatChannel',{channel:'forged'},false);
const publicMessage=(await b.get()).messages.find(m=>m.body===`world-${suffix}`);assert(Number.isFinite(publicMessage.created_at));assert.equal(publicMessage.owner,undefined);
const sects=(await a.get()).guilds.filter(g=>g.kind==='sect');assert(sects.length>=2,'Local seeded sects required');await a.post('guildJoin',{guildId:sects[0].id});await b.post('guildJoin',{guildId:sects[0].id});await c.post('guildJoin',{guildId:sects[1].id});await a.post('chatChannel',{channel:'sect'});await wait(1900);await a.post('chat',{message:`sect-${suffix}`});assert((await b.get()).messages.some(m=>m.body===`sect-${suffix}`));assert(!(await c.get()).messages.some(m=>m.body===`sect-${suffix}`));
await a.post('partyLeave');console.log('PASS: world, map-local nearby, party privacy before/after leave, sect privacy, membership validation, timestamps and no owner credentials.');
