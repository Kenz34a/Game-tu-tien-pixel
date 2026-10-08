import {SLOTS,QUALITIES,type Currency} from './catalog';
export type ShopOffer={id:string;name:string;category:'equipment'|'supplies'|'cultivation';currency:Currency;price:number;minRealm:number;description:string;slot?:string;quality?:number;rewards?:Partial<Record<'potions'|'shieldDan'|'herb'|'ore'|'essence'|'relics',number>>};
export const SHOP_OFFERS:ShopOffer[]=[
 {id:'healing',name:'Hồi Linh Đan ×3',category:'supplies',currency:'silver',price:80,minRealm:0,description:'Dùng để hồi khí huyết và linh lực khi chiến đấu.',rewards:{potions:3}},
 {id:'shield',name:'Hộ Kiếp Đan',category:'cultivation',currency:'stone',price:120,minRealm:0,description:'Hỗ trợ đột phá và bảo vệ tu vi khi thất bại.',rewards:{shieldDan:1}},
 {id:'herbs',name:'Bó linh thảo ×20',category:'supplies',currency:'silver',price:150,minRealm:0,description:'Nguyên liệu luyện đan. Không tính là tự thu thập cho nhiệm vụ.',rewards:{herb:20}},
 {id:'ore',name:'Linh quặng ×10',category:'supplies',currency:'stone',price:80,minRealm:0,description:'Bổ sung nguyên liệu cho đan phòng.',rewards:{ore:10}},
 {id:'essence',name:'Tinh phách ×5',category:'cultivation',currency:'jade',price:10,minRealm:0,description:'Nguyên liệu luyện linh đan cao cấp.',rewards:{essence:5}},
 {id:'travel-kit',name:'Túi hành trang đạo hữu',category:'supplies',currency:'jade',price:30,minRealm:0,description:'20 Hồi Linh Đan, 5 Hộ Kiếp Đan, 40 linh thảo và 20 linh quặng.',rewards:{potions:20,shieldDan:5,herb:40,ore:20}},
 {id:'ancient-scrolls',name:'Túi cổ tịch',category:'cultivation',currency:'jade',price:60,minRealm:0,description:'5 mảnh cổ tịch để lĩnh ngộ truyền thừa và 20 tinh phách.',rewards:{relics:5,essence:20}},
 {id:'sect-supplies',name:'Vật tư tông môn',category:'supplies',currency:'merit',price:80,minRealm:0,description:'Đổi công trạng lấy 30 linh thảo và 20 linh quặng.',rewards:{herb:30,ore:20}},
 ...QUALITIES.flatMap((q,quality)=>SLOTS.flatMap(slot=>{const minRealm=quality*5,currency:Currency=quality===0?'silver':quality<4?'stone':quality<6?'jade':'divine';const common={name:q.name+' phẩm · '+slot.name,category:'equipment' as const,minRealm,description:'Trang bị theo cấp tu hành hiện tại, mua xong vào hành trang.',slot:slot.id,quality,price:0};return[{...common,id:`gear-${slot.id}-${quality}`,currency},...(currency!=='jade'?[{...common,id:`jade-gear-${slot.id}-${quality}`,currency:'jade' as const}]:[])];})),
];
export function shopPrice(offer:ShopOffer,p:{realm:number;star:number}){if(offer.slot){const base=Math.ceil((40+(p.realm*10+p.star)*8)*((offer.quality||0)+1)**2*1.25);return offer.currency==='jade'?Math.max(2,Math.ceil(base/60)):offer.currency==='divine'?Math.max(5,Math.ceil(base/20)):base;}return offer.price;}
