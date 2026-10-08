// One rig is shared by every class and NPC, including portraits.
export function actorMotion(time:number,seed:number,moving=false,attack=false){
 if(time===0)return {sway:0,breath:0,cloth:0,stride:0};
 const phase=seed*.071;
 return {sway:Math.sin(time/650+phase)*(attack?.012:.035),breath:Math.sin(time/470+phase)*(moving?.45:1.5),cloth:Math.sin(time/380+phase)*(moving?1.9:1.35),stride:moving?Math.sin(time/95)*1.5:0};
}
