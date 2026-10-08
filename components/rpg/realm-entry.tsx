'use client';
import {useState} from 'react';
import {ActorPreview} from './actor-preview';
import {nameSeed} from '@/lib/rpg/pixels';
import type {GameData} from './game';
export function RealmEntry({data,busy,enter}:{data:GameData;busy:boolean;enter:(name:string)=>Promise<void>}){
 const [name,setName]=useState(data.profile.name);
 return <main className="r-entry"><div className="r-entry-mist"/><section className="r-entry-card r-panel"><span className="r-eyebrow">MỘT NIỆM NHẬP ĐẠO · VẠN DẶM TIÊN LỘ</span><h1>VÂN THIÊN KÝ</h1><p className="r-entry-poem">Mây qua cổ kiếm, gió gọi thanh sơn.<br/>Giữa phàm trần, ai giữ được một lòng?</p><ActorPreview size={180} spec={{seed:nameSeed(name),classId:data.profile.classId,root:data.profile.root}}/><form onSubmit={e=>{e.preventDefault();void enter(name);}}><label htmlFor="cultivator-name">Đạo danh</label><input id="cultivator-name" value={name} onChange={e=>setName(e.target.value)} minLength={2} maxLength={22} required autoComplete="nickname"/><button className="r-btn gold" disabled={busy||name.trim().length<2}>{busy?'Đang mở tiên môn…':'Bước vào tiên môn'}</button></form><a href="/restore">Khôi phục nhân vật bằng mã riêng</a><small>Nhân vật được lưu theo phiên trình duyệt này.</small></section><aside className="r-entry-story"><span>CHƯƠNG I</span><h2>Phong ấn Thanh Vân</h2><p>Một mảnh ngọc vỡ. Một lời thề ngàn năm.<br/>Bắt đầu với trưởng lão và vườn linh thảo,<br/>trước khi rút kiếm bảo vệ sơn môn.</p></aside></main>;
}
