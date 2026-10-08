import {REALMS,type Currency} from './catalog';
import type {Profile} from './model';
export const DHARMAS=[
 {id:0,name:'Thanh Liên Kiếm Tướng',realm:1,color:'#72dded',description:'Kiếm ý hóa hình. Vạn kiếm hộ thân, thanh liên dưỡng thần.'},
 {id:1,name:'Lục Tý Kim Cang',realm:4,color:'#e7bb58',description:'Sáu tay giữ pháp khí. Kim thân bất diệt, trấn áp ma chướng.'},
 {id:2,name:'Cửu Thiên Lôi Tôn',realm:9,color:'#ba92ee',description:'Lôi đình hợp nhất. Thiên kiếp hóa thành uy lực của bản thân.'},
 {id:3,name:'Thái Cổ Long Hồn',realm:15,color:'#83e8b2',description:'Long hồn thức tỉnh giữa vân hải, bảo hộ tiên thể.'},
 {id:4,name:'Niết Bàn Phượng Tướng',realm:30,color:'#f39970',description:'Thần hỏa niết bàn. Phượng hoàng dẫn đường qua luân hồi.'},
 {id:5,name:'Hồng Mông Vạn Pháp',realm:40,color:'#f1dfaa',description:'Tám tay chưởng đạo. Vạn pháp quy nhất, thiên địa cộng minh.'},
];
export type ImmortalState={dharmaId:number|null;dharmaLevel:number;dharmaXp:number;materials:{herb:number;ore:number;essence:number};practice:{body:number;soul:number;intent:number};daily:{day:number;kills:number;gather:number;boss:number;quests:number;meditate:number;raid:number;claimed:string[]};chatChannel:'world'|'party'|'sect'};
export function dailyState(now=Date.now()){return{day:Math.floor(now/86400000),kills:0,gather:0,boss:0,quests:0,meditate:0,raid:0,claimed:[] as string[]};}
export function upgrade(p:Profile){p.dharmaId??=p.dharmaId===null?null:-1;p.dharmaLevel??=1;p.dharmaXp??=0;p.materials??={herb:0,ore:0,essence:0};p.practice??={body:0,soul:0,intent:0};p.daily??=dailyState();p.chatChannel??='world';if(p.daily.day!==Math.floor(Date.now()/86400000))p.daily=dailyState();return p;}
export function currentDharma(p:Pick<Profile,'realm'|'dharmaId'>){if(p.dharmaId===null)return null;return p.dharmaId===-1?[...DHARMAS].reverse().find(d=>p.realm>=d.realm)||null:DHARMAS.find(d=>d.id===p.dharmaId&&p.realm>=d.realm)||null;}
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
