export const SKILL_GATES=[{level:1,realm:0},{level:5,realm:0},{level:11,realm:1},{level:31,realm:3}];
type Cultivator={realm:number;star:number;skillLevels?:number[]};
export function cultivationLevel(p:Cultivator){return p.realm*10+p.star;}
export function skillUnlocked(p:Cultivator,id:number){const gate=SKILL_GATES[id];return !!gate&&cultivationLevel(p)>=gate.level&&p.realm>=gate.realm;}
export function skillLevel(p:Cultivator,id:number){return skillUnlocked(p,id)?Math.max(1,Math.min(5,Math.floor(p.skillLevels?.[id]||1))):0;}
export function skillPoints(p:Cultivator){const spent=(p.skillLevels||[]).slice(0,4).reduce((sum,n)=>sum+Math.max(0,Math.min(5,n||1)-1),0);return Math.max(0,cultivationLevel(p)-1+p.realm*2-spent);}
export function skillCanUpgrade(p:Cultivator,id:number){return skillUnlocked(p,id)&&skillLevel(p,id)<5&&skillPoints(p)>0;}
export function skillDamageBonus(p:Cultivator,id:number){return 1+Math.max(0,skillLevel(p,id)-1)*.12;}
