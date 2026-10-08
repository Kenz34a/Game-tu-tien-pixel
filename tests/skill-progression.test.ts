import assert from 'node:assert/strict';
import {skillUnlocked,skillLevel,skillPoints,skillCanUpgrade,skillDamageBonus} from '../lib/rpg/skill-progression';
const novice={realm:0,star:1};assert.deepEqual([0,1,2,3].map(id=>skillUnlocked(novice,id)),[true,false,false,false]);assert.equal(skillPoints(novice),0);assert.equal(skillCanUpgrade(novice,0),false);
assert.equal(skillUnlocked({realm:0,star:4},1),false);assert.equal(skillUnlocked({realm:0,star:5},1),true);assert.equal(skillUnlocked({realm:0,star:10},2),false);assert.equal(skillUnlocked({realm:1,star:1},2),true);assert.equal(skillUnlocked({realm:2,star:10},3),false);assert.equal(skillUnlocked({realm:3,star:1},3),true);
const trained={realm:1,star:1,skillLevels:[2,3,1,1]};assert.equal(skillPoints(trained),9);assert.equal(skillLevel(trained,3),0);assert.equal(skillDamageBonus(trained,1),1.24);assert.equal(skillCanUpgrade({...trained,skillLevels:[5,5,5,5]},0),false);assert.equal(skillUnlocked(novice,99),false);
console.log('PASS: novice locks, level/realm thresholds, earned/spent skill points, capped upgrades and combat multiplier.');
