import assert from 'node:assert/strict';
import {MAPS,ENEMIES,STORY_IDS,WORLD_BOSSES} from '../lib/rpg/catalog';
import {FIELD_SIZE,monsterCamps,safeVillage,worldBossPosition} from '../lib/rpg/map-layout';
import {newProfile,enemiesFor,safePosition} from '../lib/rpg/model';
for(const map of MAPS){
 const camps=monsterCamps(map.id),enemies=ENEMIES.filter(e=>e.map===map.id);
 assert.equal(camps.length,7);assert.equal(enemies.length,35);assert.equal(new Set(enemies.map(e=>e.id)).size,35);
 for(const camp of camps){assert.equal(enemies.filter(e=>e.campId===camp.id).length,5);for(const other of camps)if(camp!==other)assert(Math.hypot(camp.x-other.x,camp.y-other.y)>600);}
 for(const e of enemies){assert.deepEqual(safePosition(e.x,e.y),{x:e.x,y:e.y});assert(!safeVillage(e));if(e.spawnOf)assert(enemies.some(base=>base.id===e.spawnOf&&!base.spawnOf));}
 assert.equal(enemies.filter(e=>e.boss).length,1);
}
assert.equal(FIELD_SIZE.width*FIELD_SIZE.height,9*1536*1024);
assert.deepEqual(safePosition(99999,-99999),{x:4488,y:180});assert.deepEqual(safePosition(99999,-99999,true),{x:1230,y:350});
assert(safeVillage(newProfile()));assert(!safeVillage({x:620,y:2000}));assert(!safeVillage({...newProfile(),dungeon:{}}));
const p=newProfile();assert.equal(enemiesFor(p).length,0);p.claimed=STORY_IDS.slice(0,3);assert.equal(enemiesFor(p).length,3);p.claimed.push(STORY_IDS[3]);assert.equal(enemiesFor(p).length,4);p.claimed.push(STORY_IDS[4]);assert.equal(enemiesFor(p).length,35);
const extra=enemiesFor(p).find(e=>e.spawnOf)!;p.encounters[extra.id]={hp:0,respawnAt:20000};assert.equal(enemiesFor(p,10000).find(e=>e.id===extra.id)!.hp,0);assert(enemiesFor(p,21000).find(e=>e.id===extra.id)!.hp>0);assert(enemiesFor(p,10000).find(e=>e.id===extra.spawnOf)!.hp>0,'Deaths are independent');
p.dungeon={mapId:0,wave:1,kills:0,enteredAt:0};assert.equal(enemiesFor(p).length,14);for(const e of enemiesFor(p))assert.deepEqual(safePosition(e.x,e.y,true),{x:e.x,y:e.y});
for(const boss of WORLD_BOSSES){const xy=worldBossPosition(boss.map);assert.deepEqual(safePosition(xy.x,xy.y),xy);assert(xy.x>3500&&xy.y>2000);}
console.log('PASS: all 54 regions, 7 separated camps, 35 unique spawns, stable quest species, bounds, safe village, story gates, independent respawns and compact dungeon compatibility.');
