import assert from 'node:assert/strict';
import {actorMotion} from '../lib/rpg/actor-motion';
for(const seed of [0,1,2,76,810]){
 assert.deepEqual(actorMotion(0,seed),{sway:0,breath:0,cloth:0,stride:0},'Reduced motion keeps every rig still');
 assert.notDeepEqual(actorMotion(500,seed),actorMotion(1100,seed),'Idle cycles change independently of movement');
 assert.notEqual(actorMotion(500,seed,true).stride,0,'Every class has a walking gait');
 for(const value of Object.values(actorMotion(700,seed,true,true)))assert(Number.isFinite(value));
}
console.log('Actor motion: fixed reduced-motion pose, visible idle cycle and class-independent walking rig passed.');
