import assert from 'node:assert/strict';
import {newProfile,resourceNodes,questProgress,stats} from '../lib/rpg/model';
import {upgrade,DHARMAS,dharmaUnlocked,currentDharma,dharmaBonus} from '../lib/rpg/immortal';
import {SECRETS,secretProgress,secretKnown} from '../lib/rpg/secrets';
import {QUESTS} from '../lib/rpg/catalog';
assert.equal(SECRETS.length,12);assert.equal(DHARMAS.length,18);
assert.equal(new Set(QUESTS.map(q=>q.id)).size,QUESTS.length);
const p=newProfile();assert.equal(p.secretsFound.length,0);
for(const s of SECRETS){assert(QUESTS.some(q=>q.id===s.id&&q.type==='secret'));assert(resourceNodes(s.map).some(n=>n.id===100+SECRETS.indexOf(s)&&n.type==='secret'));}
const cloud=SECRETS[0],d=DHARMAS[6];assert.equal(secretProgress(p,cloud),0);assert.equal(dharmaUnlocked(p,d),false);
p.meditations=3;assert.equal(secretProgress(p,cloud),3);assert.equal(secretKnown(p,cloud.id),false);
p.secretsFound.push(cloud.id);assert.equal(questProgress(p,QUESTS.find(q=>q.id===cloud.id)!),1);assert.equal(dharmaUnlocked(p,d),false,'Discovering alone does not grant reward');
p.claimed.push(cloud.id);assert.equal(dharmaUnlocked(p,d),true);p.dharmaId=6;assert.equal(currentDharma(p)?.id,6);assert(Number.isFinite(stats(p).power));
assert(Math.abs(dharmaBonus(d,1)-.035)<1e-9);
p.realm=44;p.dharmaId=-1;assert.equal(currentDharma(p)?.id,5,'Auto-evolution retains strongest realm unlock and stable legacy IDs');
for(let id=0;id<6;id++){p.dharmaId=id;assert.equal(currentDharma(p)?.id,id);}
p.dharmaId=8;assert.equal(currentDharma(p),null,'High realm cannot bypass secret requirement');
p.claimed.push('s-bamboo');assert.equal(currentDharma(p)?.id,8);
p.dharmaId=null;assert.equal(currentDharma(p),null);
const legacy=newProfile();delete (legacy as any).secretsFound;delete (legacy as any).meditations;delete (legacy as any).raidCompletions;upgrade(legacy);assert.deepEqual(legacy.secretsFound,[]);assert.equal(legacy.raidCompletions,0);
p.gathered['1:herb']=8;assert.equal(secretProgress(p,SECRETS[3]),8);assert.equal(secretProgress(p,SECRETS[1]),0,'Gathering is scoped to the required map');
p.killCounts={'m3-0':5,'m3-1':7,'m30-1':100};assert.equal(secretProgress(p,SECRETS[5]),12,'Kill counts do not mix different maps');
p.raidCompletions=1;assert.equal(secretProgress(p,SECRETS[10]),1);
console.log('Expansion regression: 12 distinct secrets, 18 dharmas, legacy upgrade, quest reward gating, realm gating, stable auto-evolution, map-scoped objectives and durable raid completion passed.');
