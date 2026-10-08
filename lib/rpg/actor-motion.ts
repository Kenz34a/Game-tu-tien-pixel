// Joint angles keep the feet grounded; cloth follows the body rather than bending it.
export function actorMotion(time:number,seed:number,moving=false,attack=false,attackAge=0){
 const still={sway:0,breath:0,cloth:0,stride:0,leftLeg:0,rightLeg:0,leftArm:0,rightArm:0,lunge:0};
 if(time===0)return still;
 const phase=seed*.071,gait=Math.sin(time/115),breath=Math.sin(time/1150+phase)*.28;
 let swing=0,lunge=0;
 if(attack){const age=Math.max(0,Math.min(1,attackAge/620));if(age<.24){swing=-age/.24*.55;lunge=-age/.24*1.1;}else if(age<.58){const t=(age-.24)/.34;swing=-.55+1.6*Math.sin(t*Math.PI/2);lunge=-1.1+4.6*Math.sin(t*Math.PI/2);}else{const t=(age-.58)/.42;swing=1.05*(1-t);lunge=3.5*(1-t);}}
 return {sway:moving?.025:0,breath:moving?Math.abs(gait)*.6:breath,cloth:moving?Math.sin(time/150-1)*.35:Math.sin(time/1300+phase)*.12,stride:moving?gait:0,leftLeg:moving?gait*.2:attack?-lunge*.025:0,rightLeg:moving?-gait*.2:attack?lunge*.035:0,leftArm:attack?-swing*.45:moving?-gait*.16:Math.sin(time/1450+phase)*.018,rightArm:attack?swing:moving?gait*.16:Math.sin(time/1450+phase+1)*.018,lunge};
}
