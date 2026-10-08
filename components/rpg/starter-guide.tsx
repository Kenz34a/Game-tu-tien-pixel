'use client';
import {useContext,useState} from 'react';
import {npcPosition,NPCS} from '@/lib/rpg/catalog';
import {NavigationContext} from './navigation';
import {PreferencesContext} from './preferences';
export function StarterGuide({openJournal}:{openJournal:()=>void}){
 const navigate=useContext(NavigationContext),{preferences,update}=useContext(PreferencesContext),[closed,setClosed]=useState(false);
 if(closed)return null;
 return <aside className="r-starter-guide r-panel" aria-label="Khởi đầu tân thủ"><button className="r-starter-close" aria-label="Ẩn lời dẫn tân thủ" onClick={()=>setClosed(true)}>×</button><span className="r-eyebrow">TÂN THÔN · MỘT NIỆM NHẬP ĐẠO</span><h2>Tiên lộ bắt đầu từ đây</h2><p>Mảnh ngọc trong tay khẽ sáng. Trưởng lão đang chờ bạn bên Tụ Linh Đài.</p><div className="r-actions"><button className="r-btn gold" onClick={()=>navigate({kind:'npc',id:0,...npcPosition(NPCS[0])})}>Gặp trưởng lão →</button><button className="r-link" onClick={openJournal}>8 bước chính tuyến</button></div>{!preferences.motion&&<button className="r-link" onClick={()=>update({motion:true})}>Chuyển động đang tắt · Bật animation</button>}</aside>;
}
