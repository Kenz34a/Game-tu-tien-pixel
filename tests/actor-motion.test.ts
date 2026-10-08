import assert from 'node:assert/strict';
import {actorMotion} from '../lib/rpg/actor-motion';
for(const seed of [0,1,2,76,810]){
 assert.deepEqual(actorMotion(0,seed),{sway:0,breath:0,cloth:0,stride:0,leftLeg:0,rightLeg:0,leftArm:0,rightArm:0,lunge:0},'Reduced motion keeps every rig still');
 assert.notDeepEqual(actorMotion(500,seed),actorMotion(1100,seed),'Idle cycles change independently of movement');
 assert.notEqual(actorMotion(500,seed,true).stride,0,'Every class has a walking gait');
 for(const value of Object.values(actorMotion(700,seed,true,true)))assert(Number.isFinite(value));
}
console.log('Actor motion: fixed reduced-motion pose, visible idle cycle and class-independent walking rig passed.');

const gait=actorMotion(200,0,true);assert.equal(gait.leftLeg,-gait.rightLeg);assert.equal(gait.leftArm,-gait.rightArm);assert.equal(actorMotion(500,0).sway,0,'Idle never rotates the whole portrait');assert(Math.abs(actorMotion(500,0).breath)<.3,'Subtle chest breathing');const windup=actorMotion(1000,0,false,true,100),impact=actorMotion(1000,0,false,true,330),recover=actorMotion(1000,0,false,true,615);assert(windup.rightArm<0&&windup.lunge<0);assert(impact.rightArm>0&&impact.lunge>0);assert(Math.abs(recover.rightArm)<.03&&Math.abs(recover.lunge)<.1);console.log('PASS: opposite leg/arm gait, planted idle, windup, strike and recovery.');
