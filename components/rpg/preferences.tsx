'use client';
import {createContext,useContext,useEffect,useState} from 'react';
export type Preferences={uiScale:number;textScale:number;safeInset:number;volume:number;motion:boolean;showNames:boolean;showDamage:boolean;};
export const DEFAULT_PREFERENCES:Preferences={uiScale:100,textScale:100,safeInset:0,volume:35,motion:true,showNames:true,showDamage:true};
const KEY='van-thien-preferences-v1';
function normalize(value:Partial<Preferences>):Preferences{
 const bound=(v:unknown,min:number,max:number,fallback:number)=>typeof v==='number'&&Number.isFinite(v)?Math.min(max,Math.max(min,v)):fallback;
 return {uiScale:bound(value.uiScale,80,120,100),textScale:bound(value.textScale,90,130,100),safeInset:bound(value.safeInset,0,24,0),volume:bound(value.volume,0,100,35),motion:typeof value.motion==='boolean'?value.motion:true,showNames:typeof value.showNames==='boolean'?value.showNames:true,showDamage:typeof value.showDamage==='boolean'?value.showDamage:true};
}
export function usePreferences(){
 const [preferences,setPreferences]=useState(DEFAULT_PREFERENCES),[loaded,setLoaded]=useState(false);
 useEffect(()=>{try{const saved=localStorage.getItem(KEY);if(saved)setPreferences(normalize(JSON.parse(saved)));else if(matchMedia('(prefers-reduced-motion: reduce)').matches)setPreferences(p=>({...p,motion:false}));}catch{}setLoaded(true);},[]);
 useEffect(()=>{if(loaded)try{localStorage.setItem(KEY,JSON.stringify(preferences));}catch{}},[loaded,preferences]);
 return {preferences,update:(patch:Partial<Preferences>)=>setPreferences(p=>normalize({...p,...patch})),reset:()=>setPreferences(DEFAULT_PREFERENCES)};
}
export const PreferencesContext=createContext<{preferences:Preferences;update:(patch:Partial<Preferences>)=>void;reset:()=>void}>({preferences:DEFAULT_PREFERENCES,update:()=>{},reset:()=>{}});
export function SettingsPanel(){
 const {preferences:p,update,reset}=useContext(PreferencesContext),[tab,setTab]=useState('interface');
 const slider=(key:'uiScale'|'textScale'|'safeInset'|'volume',label:string,note:string,min:number,max:number)=><label className="r-settings-row"><span><strong>{label}</strong><small>{note}</small></span><input type="range" aria-label={label} min={min} max={max} value={p[key]} onChange={e=>update({[key]:Number(e.target.value)})}/><output>{p[key]}{key==='safeInset'?' px':'%'}</output></label>;
 const toggle=(key:'motion'|'showNames'|'showDamage',label:string,note:string)=><label className="r-settings-row"><span><strong>{label}</strong><small>{note}</small></span><input type="checkbox" checked={p[key]} onChange={e=>update({[key]:e.target.checked})}/></label>;
 return <><nav className="r-settings-tabs">{[['interface','Giao diện'],['audio','Âm thanh'],['access','Tiếp cận'],['keys','Phím tắt']].map(([id,label])=><button className={'r-btn '+(tab===id?'gold':'')} key={id} onClick={()=>setTab(id)}>{label}</button>)}</nav>{tab==='interface'&&<>{slider('uiScale','Tỉ lệ giao diện','Điều chỉnh kích thước các bảng trên màn hình.',80,120)}{slider('textScale','Cỡ chữ','Tăng cỡ chữ nội dung trong thiên thư.',90,130)}{slider('safeInset','Viền an toàn','Đẩy bảng giao diện vào trong mép màn hình.',0,24)}{toggle('showNames','Tên NPC và yêu thú','Ẩn bớt tên để quan sát linh địa rõ hơn.')}</>}{tab==='audio'&&<>{slider('volume','Âm lượng nhạc','Bật nhạc bằng nút loa trên màn hình game.',0,100)}<p className="r-note">Nhạc tự tạm dừng khi chuyển sang tab khác.</p></>}{tab==='access'&&<>{toggle('motion','Chuyển động môi trường','Tắt đung đưa, pháp tướng và hiệu ứng chuyển động khi cần giảm kích thích thị giác.')}{toggle('showDamage','Số sát thương','Hiển thị số sát thương nổi trong chiến đấu.')}</>}{tab==='keys'&&<div className="r-key-guide">{[['WASD / Mũi tên','Di chuyển'],['Bấm NPC / dấu tích','Tự đi tới và tương tác'],['1–4','Xuất chiêu'],['5','Thức tỉnh pháp thân'],['Q','Bật / tắt tự chiến'],['R','Dùng linh đan'],['B / M','Hành trang / Bản đồ'],['Esc','Đóng thiên thư']].map(([key,note])=><p key={key}><kbd>{key}</kbd><span>{note}</span></p>)}</div>}<footer className="r-settings-footer"><span>Tự lưu trên trình duyệt này.</span><button className="r-btn" onClick={reset}>Đặt lại mặc định</button></footer></>;
}
