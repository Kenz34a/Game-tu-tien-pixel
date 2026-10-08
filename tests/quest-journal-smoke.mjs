import assert from 'node:assert/strict';
const base=process.env.RPG_TEST_URL||'http://localhost:8787';
let cookie='';
async function request(body){if(body)await new Promise(r=>setTimeout(r,300));const response=await fetch(base+'/api/rpg',{method:body?'POST':'GET',headers:{...(cookie?{cookie}:{}),...(body?{'content-type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{})});cookie=response.headers.get('set-cookie')?.split(';')[0]||cookie;return {status:response.status,data:await response.json()};}
await request();
await request({action:'name',name:'QA_JOURNAL_SMOKE'});
let r=await request({action:'trackQuest',questId:'q0-8'});assert(r.status>=400,'Unaccepted quest must not be tracked');
r=await request({action:'accept',questId:'q0-8'});assert.equal(r.status,200);
r=await request({action:'trackQuest',questId:'q0-8'});assert.equal(r.data.profile.trackedQuestId,'q0-8');
r=await request();assert.equal(r.data.profile.trackedQuestId,'q0-8','Tracking must persist across requests');
r=await request({action:'trackQuest',questId:'unknown'});assert(r.status>=400);
r=await request({action:'claimQuest',questId:'q0-8'});assert(r.status>=400,'Tracking cannot bypass quest requirements');
r=await request({action:'trackQuest',questId:null});assert.equal(r.data.profile.trackedQuestId,null);
await request({action:'trackQuest',questId:'q0-8'});
r=await request({action:'abandon',questId:'q0-8'});assert.equal(r.data.profile.trackedQuestId,null);assert(!r.data.profile.accepted.includes('q0-8'));
console.log('PASS: accepted-only tracking, persistence, invalid target rejection, reward prerequisites, untracking and abandonment cleanup.');
