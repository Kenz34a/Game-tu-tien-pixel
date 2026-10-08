import assert from 'node:assert/strict';
import {STORY_IDS,QUESTS,questUnlocked,NPCS,npcPosition} from '../lib/rpg/catalog';
import {newProfile,enemiesFor,questProgress,resourceNodes} from '../lib/rpg/model';
const p=newProfile();
assert.equal(enemiesFor(p).length,0,'New cultivators begin in a peaceful map');
for(let i=0;i<STORY_IDS.length;i++){
 const q=QUESTS.find(q=>q.id===STORY_IDS[i])!;
 assert.equal(questUnlocked(p.claimed,q),i===0,'Later chapters require their predecessor');
 assert.equal(q.hidden,false,'Story chapters can always be found in the journal');
}
p.claimed=STORY_IDS.slice(0,3);
assert.deepEqual(enemiesFor(p).map(e=>e.index),[0,1,2]);
p.claimed.push(STORY_IDS[3]);
assert.equal(enemiesFor(p).filter(e=>e.boss).length,1);
p.claimed.push(STORY_IDS[4]);assert.equal(enemiesFor(p).length,14);
p.claimed=[];p.dungeon={mapId:0,wave:1,kills:0,enteredAt:Date.now()};assert.equal(enemiesFor(p).length,14,'Dungeon combat remains available');
p.dungeon=null;p.mapId=1;assert.equal(enemiesFor(p).length,14,'Other maps retain their enemies');
p.gathered['0:herb']=3;assert.equal(questProgress(p,QUESTS.find(q=>q.id===STORY_IDS[1])!),3);
assert.notDeepEqual(npcPosition(NPCS[0]),npcPosition(NPCS[1]));
assert.equal(resourceNodes(0)[0].label,'Thanh Tâm Thảo');
console.log('Opening story: peaceful spawn, chapter prerequisites, enemy unlocks, legacy maps, dungeon, gathering and NPC positions passed.');
