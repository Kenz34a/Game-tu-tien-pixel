import {REALMS,type Currency} from './catalog';
import type {Profile} from './model';
export type DharmaDef={id:number;name:string;realm:number;color:string;description:string;quest?:string;bonus?:number;form?:'lotus'|'swords'|'moon'|'mirror'|'stars'|'guardian';};
export const DHARMAS:DharmaDef[]=[
 {id:0,name:'Thanh Liên Kiếm Tướng',realm:1,color:'#72dded',description:'Kiếm ý hóa hình. Vạn kiếm hộ thân, thanh liên dưỡng thần.'},
 {id:1,name:'Lục Tý Kim Cang',realm:4,color:'#e7bb58',description:'Sáu tay giữ pháp khí. Kim thân bất diệt, trấn áp ma chướng.'},
 {id:2,name:'Cửu Thiên Lôi Tôn',realm:9,color:'#ba92ee',description:'Lôi đình hợp nhất. Thiên kiếp hóa thành uy lực của bản thân.'},
 {id:3,name:'Thái Cổ Long Hồn',realm:15,color:'#83e8b2',description:'Long hồn thức tỉnh giữa vân hải, bảo hộ tiên thể.'},
 {id:4,name:'Niết Bàn Phượng Tướng',realm:30,color:'#f39970',description:'Thần hỏa niết bàn. Phượng hoàng dẫn đường qua luân hồi.'},
 {id:5,name:'Hồng Mông Vạn Pháp',realm:40,color:'#f1dfaa',description:'Tám tay chưởng đạo. Vạn pháp quy nhất, thiên địa cộng minh.'},

 {id:6,name:'Thanh Vân Hộ Đạo',realm:0,color:'#95d8cb',quest:'s-cloud',bonus:.03,form:'guardian',description:'Tiếng chuông tổ sư hóa thành vòng ngọc hộ thân. Bí truyền từ cơ duyên Tiếng chuông không người.'},
 {id:7,name:'Bích Liên Y Tướng',realm:0,color:'#b7e999',quest:'s-lotus',bonus:.04,form:'lotus',description:'Sen xanh giữa tro tàn, linh quang chữa lành đạo tâm. Bí truyền từ Hoa nở trong tro tàn.'},
 {id:8,name:'Phong Trúc Linh Tướng',realm:1,color:'#98d4a4',quest:'s-bamboo',bonus:.055,form:'swords',description:'Lá trúc hóa kiếm, tiếng tiêu dẫn linh phong. Bí truyền của ẩn sĩ Trúc Lâm.'},
 {id:9,name:'Bạch Lang Nguyệt Tướng',realm:2,color:'#c5d9fa',quest:'s-wolf',bonus:.065,form:'moon',description:'Nguyệt quang và lời hứa của sói trắng bao quanh người hộ đạo.'},
 {id:10,name:'Huyền Băng Kính Tướng',realm:3,color:'#a2ebed',quest:'s-frost',bonus:.075,form:'mirror',description:'Băng kính lưu giữ lời hẹn ngàn năm, phản chiếu ma chướng trong tâm.'},
 {id:11,name:'Vạn Kiếm Cổ Hồn',realm:5,color:'#c4b9ef',quest:'s-sword',bonus:.09,form:'swords',description:'Hồn kiếm vô danh hội tụ thành kiếm trận. Kế thừa lời thề hộ thế ở Cổ Kiếm Trủng.'},
 {id:12,name:'Tinh Hà Pháp Tướng',realm:10,color:'#9cbaff',quest:'s-stars',bonus:.115,form:'stars',description:'Tinh tú Lạc Tinh Hồ tỏa thành vầng thiên hà sau lưng.'},
 {id:13,name:'Đồng Tâm Hộ Pháp',realm:15,color:'#ead09b',quest:'s-team',bonus:.14,form:'guardian',description:'Minh ước đồng đạo hóa thành ba vòng pháp ấn. Mở từ cơ duyên sau cổ cảnh tổ đội.'},
 {id:14,name:'Đại Đạo Sinh Liên',realm:30,color:'#e5bdee',quest:'s-origin',bonus:.17,form:'lotus',description:'Hạt giống sáng thế nở thành đạo liên, nâng đỡ vạn sinh.'},
 {id:15,name:'Thái Âm Nguyệt Luân',realm:6,color:'#cdd5ff',bonus:.10,form:'moon',description:'Nguyệt luân xoay qua màn đêm, giữ thần thức thanh tịnh.'},
 {id:16,name:'Thiên Cơ Tinh Bàn',realm:18,color:'#94d9ec',bonus:.15,form:'stars',description:'Tinh bàn tiên giới đo thiên mệnh, những vì sao mở đường giữa vân hải.'},
 {id:17,name:'Vô Cực Đạo Kính',realm:35,color:'#ebd2ab',bonus:.18,form:'mirror',description:'Đạo kính chứa cả âm dương, vạn tượng trở về một niệm.'},
];
export function dharmaUnlocked(p:{realm:number;claimed?:string[]},d:DharmaDef){return p.realm>=d.realm&&(!d.quest||!!p.claimed?.includes(d.quest));}
export function dharmaBonus(d:DharmaDef,level:number){return (d.bonus??(d.id+1)*.025)+level*.005;}
export type ImmortalState={dharmaId:number|null;dharmaLevel:number;dharmaXp:number;materials:{herb:number;ore:number;essence:number};practice:{body:number;soul:number;intent:number};daily:{day:number;kills:number;gather:number;boss:number;quests:number;meditate:number;raid:number;claimed:string[]};chatChannel:'world'|'party'|'sect'};
export function dailyState(now=Date.now()){return{day:Math.floor(now/86400000),kills:0,gather:0,boss:0,quests:0,meditate:0,raid:0,claimed:[] as string[]};}
export function upgrade(p:Profile){p.dharmaId??=p.dharmaId===null?null:-1;p.secretsFound??=[];p.meditations??=0;p.raidCompletions??=0;p.dharmaLevel??=1;p.dharmaXp??=0;p.materials??={herb:0,ore:0,essence:0};p.practice??={body:0,soul:0,intent:0};p.daily??=dailyState();p.chatChannel??='world';if(p.daily.day!==Math.floor(Date.now()/86400000))p.daily=dailyState();return p;}
export function currentDharma(p:Pick<Profile,'realm'|'dharmaId'> & {claimed?:string[]}){if(p.dharmaId===null)return null;return p.dharmaId===-1?[...DHARMAS].filter(d=>!d.quest).sort((a,b)=>b.realm-a.realm).find(d=>dharmaUnlocked(p,d))||null:DHARMAS.find(d=>d.id===p.dharmaId&&dharmaUnlocked(p,d))||null;}
export const RECIPES=[
 {id:'heal',name:'Hồi Linh Đan',realm:0,herb:3,ore:0,essence:0,currency:'stone' as Currency,cost:20,description:'Luyện được 3 linh đan hồi khí huyết và linh lực.'},
 {id:'shield',name:'Hộ Kiếp Đan',realm:1,herb:10,ore:2,essence:2,currency:'stone' as Currency,cost:80,description:'Luyện 1 đan bảo vệ tu vi khi độ kiếp thất bại.'},
 {id:'insight',name:'Tụ Linh Đan',realm:0,herb:8,ore:3,essence:0,currency:'stone' as Currency,cost:45,description:'Dùng ngay: nhận 40% tu vi yêu cầu của tinh hiện tại.'},
 {id:'soul',name:'Dưỡng Hồn Đan',realm:1,herb:6,ore:0,essence:3,currency:'stone' as Currency,cost:60,description:'Dùng ngay: pháp thân nhận 100 điểm lĩnh ngộ.'},
 {id:'root',name:'Tẩy Tủy Tiên Đan',realm:4,herb:20,ore:8,essence:10,currency:'jade' as Currency,cost:8,description:'Linh căn tăng chắc chắn 1 phẩm, tối đa phẩm 5.'},
];
export const COMMISSIONS=[
 {id:'login',name:'Tiên lộ tương phùng',description:'Trở lại tiên giới hôm nay.',metric:'login',goal:1,stone:35,jade:0,essence:1},
 {id:'kill',name:'Trảm yêu hộ đạo',description:'Diệt 15 yêu thú trong ngày.',metric:'kills',goal:15,stone:100,jade:1,essence:3},
 {id:'gather',name:'Linh sơn hái thuốc',description:'Thu thập tài nguyên 8 lần.',metric:'gather',goal:8,stone:60,jade:1,essence:2},
 {id:'quest',name:'Nhân quả tiên duyên',description:'Hoàn thành 3 nhiệm vụ.',metric:'quests',goal:3,stone:90,jade:2,essence:2},
 {id:'meditate',name:'Tĩnh tâm vấn đạo',description:'Điều tức 3 lần ở vùng an toàn.',metric:'meditate',goal:3,stone:55,jade:0,essence:1},
 {id:'boss',name:'Phá ma chướng',description:'Hạ boss trấn thủ hoặc nhận thưởng boss thế giới.',metric:'boss',goal:1,stone:120,jade:2,essence:4},
 {id:'raid',name:'Đồng đạo phá cổ cảnh',description:'Nhận thưởng một cổ cảnh tổ đội.',metric:'raid',goal:1,stone:180,jade:3,essence:6},
];
export function commissionProgress(p:Profile,c:typeof COMMISSIONS[number]){return c.metric==='login'?1:p.daily[c.metric as 'kills']||0;}
export const PRACTICES=[{id:'body',name:'Luyện thể',description:'Mỗi tầng tăng 1,2% khí huyết.',icon:'Shield'},{id:'soul',name:'Thần thức',description:'Mỗi tầng tăng 1% linh lực và 0,2 điểm % bạo kích.',icon:'Sparkles'},{id:'intent',name:'Đạo ý',description:'Mỗi tầng tăng 1% sát thương.',icon:'Sword'}] as const;
export const realmLabel=(id:number)=>REALMS[id];
