import type {Profile} from './model';
export const MERIDIANS=[
 {id:'qihai',name:'Khí Hải',subtitle:'Đan điền',color:'#dfc573',x:27,y:67,description:'Tụ khí ở đan điền, dưỡng linh lực để xuất chiêu.',effect:'Mỗi khiếu: +8 linh lực.'},
 {id:'vessels',name:'Kinh Mạch',subtitle:'Chu thiên',color:'#80d3df',x:76,y:30,description:'Linh khí lưu chuyển toàn thân, bước đi nhẹ như gió.',effect:'Mỗi khiếu: +1,5 tốc độ di chuyển.'},
 {id:'limbs',name:'Tứ Chi',subtitle:'Kiếm cốt',color:'#eaa16e',x:77,y:52,description:'Kiếm ý thấm vào gân cốt, tăng lực xuất chiêu.',effect:'Mỗi khiếu: +2 công kích.'},
 {id:'organs',name:'Ngũ Tạng',subtitle:'Sinh cơ',color:'#e39098',x:25,y:43,description:'Dưỡng ngũ tạng, bảo vệ sinh cơ giữa phong ba.',effect:'Mỗi khiếu: +12 khí huyết.'},
 {id:'mind',name:'Thần Đình',subtitle:'Minh tâm',color:'#b9a1ea',x:26,y:20,description:'Thần thức thanh minh, nhận ra sơ hở trong ma chướng.',effect:'Mỗi khiếu: +0,2 điểm % bạo kích.'},
 {id:'gate',name:'Mệnh Môn',subtitle:'Hộ thể',color:'#dce9a4',x:77,y:74,description:'Khí huyết hợp nhất ở mệnh môn, hộ thể bền bỉ.',effect:'Mỗi khiếu: +2 phòng ngự.'},
] as const;
export type MeridianId=typeof MERIDIANS[number]['id'];
export type MeridianRoute='none'|'sword'|'guardian'|'spirit';
export const MERIDIAN_ROUTES=[{id:'sword',name:'Kiếm Ý Chu Thiên',effect:'Công kích +3%'},{id:'guardian',name:'Kim Thân Chu Thiên',effect:'Khí huyết +3%'},{id:'spirit',name:'Tụ Linh Chu Thiên',effect:'Linh lực +3%'}] as const;
export function totalMeridians(p:Pick<Profile,'meridians'>){return MERIDIANS.reduce((n,m)=>n+(p.meridians?.[m.id]||0),0);}
export function meridianCost(level:number){return{xp:24+level*12,stone:10+level*5,essence:level>=6?1+Math.floor(level/6):0,rank:2+level*20};}
export function meridianBlocker(p:Profile,id:string){const m=MERIDIANS.find(m=>m.id===id);if(!m)return 'Kinh mạch không tồn tại.';const level=p.meridians[m.id]||0,cost=meridianCost(level);if(level>=18)return 'Nhánh này đã đủ 18 khiếu.';if(p.hp<=0)return 'Hãy hồi sinh trước khi khai khiếu.';if(p.realm*10+p.star<cost.rank)return 'Cần bậc tu hành '+cost.rank+' để cảm nhận khiếu tiếp theo.';if(p.meridianXp<cost.xp)return 'Chưa đủ kinh nghiệm động khiếu. Điều tức, làm nhiệm vụ hoặc trảm yêu.';if(p.coins.stone<cost.stone||p.materials.essence<cost.essence)return 'Chưa đủ linh thạch hoặc tinh phách.';return '';}
export function advanceMeridian(p:Profile,id:string){const error=meridianBlocker(p,id);if(error)return{ok:false,error};const key=id as MeridianId,cost=meridianCost(p.meridians[key]);p.meridianXp-=cost.xp;p.coins.stone-=cost.stone;p.materials.essence-=cost.essence;p.meridians[key]++;return{ok:true,error:''};}
export function meridianBonuses(p:Pick<Profile,'meridians'|'meridianRoute'>){const m=p.meridians;return{attack:(m?.limbs||0)*2,hp:(m?.organs||0)*12,mp:(m?.qihai||0)*8,defense:(m?.gate||0)*2,crit:(m?.mind||0)*.2,speed:(m?.vessels||0)*1.5,attackMult:p.meridianRoute==='sword'&&totalMeridians(p)>=24?1.03:1,hpMult:p.meridianRoute==='guardian'&&totalMeridians(p)>=24?1.03:1,mpMult:p.meridianRoute==='spirit'&&totalMeridians(p)>=24?1.03:1};}
