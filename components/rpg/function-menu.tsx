'use client';
import {useEffect,useRef,useState} from 'react';
import {PaintIcon} from './paint-icon';
import {COMMISSIONS,commissionProgress} from '@/lib/rpg/immortal';
import {QUESTS} from '@/lib/rpg/catalog';
import {questProgress} from '@/lib/rpg/model';
import type {PanelName} from './panels';
import type {GameData} from './game';
const primary:Array<{id:PanelName;icon:number;name:string}>=[
 {id:'quests',icon:16,name:'Nhiệm vụ'},{id:'maps',icon:18,name:'Bản đồ'},
 {id:'events',icon:39,name:'Thiên địa'},{id:'dungeons',icon:27,name:'Phụ bản'},
 {id:'party',icon:23,name:'Đồng đạo'},{id:'guilds',icon:22,name:'Tông môn'},
 {id:'achievements',icon:19,name:'Danh hiệu'},{id:'secrets',icon:39,name:'Thiên cơ'},
 {id:'daily',icon:16,name:'Nhật khóa'},{id:'codex',icon:35,name:'Bách khoa'},
 {id:'tutorial',icon:18,name:'Chỉ dẫn'},{id:'rankings',icon:27,name:'Phong Vân'}
];
const extra:Array<{id:PanelName;icon:number;name:string}>=[
 {id:'companions',icon:37,name:'Linh sủng'},{id:'partner',icon:38,name:'Tiên duyên'},
 {id:'library',icon:35,name:'Bí tịch'},{id:'alchemy',icon:20,name:'Đan đạo'},
 {id:'market',icon:30,name:'Chợ giao dịch'},{id:'dharma',icon:39,name:'Pháp thân'},
 {id:'meridians',icon:26,name:'Động Khiếu'},{id:'practice',icon:28,name:'Đạo tâm'},
 {id:'cultivation',icon:28,name:'Cảnh giới'},{id:'character',icon:2,name:'Nhân vật'},
 {id:'inventory',icon:17,name:'Hành trang'},{id:'settings',icon:18,name:'Cài đặt'}
];
export function FunctionMenu({data,open}:{data:GameData;open:(panel:PanelName)=>void}){
 const [expanded,setExpanded]=useState(false),root=useRef<HTMLElement>(null),trigger=useRef<HTMLButtonElement>(null),first=useRef<HTMLButtonElement>(null);
 useEffect(()=>{if(!expanded)return;first.current?.focus();const click=(e:PointerEvent)=>{if(!root.current?.contains(e.target as Node))setExpanded(false);};const key=(e:KeyboardEvent)=>{if(e.key==='Escape'){e.preventDefault();setExpanded(false);trigger.current?.focus();}};document.addEventListener('pointerdown',click);document.addEventListener('keydown',key);return()=>{document.removeEventListener('pointerdown',click);document.removeEventListener('keydown',key);};},[expanded]);
 const p=data.profile,quests=QUESTS.filter(q=>p.accepted.includes(q.id)&&questProgress(p,q)>=q.count).length,daily=COMMISSIONS.filter(c=>!p.daily.claimed.includes(c.id)&&commissionProgress(p,c)>=c.goal).length;
 const badge=(id:PanelName)=>id==='quests'?quests:id==='daily'?daily:id==='events'?Number(data.events.tide)+Number(data.events.insight):0;
 const shortcuts:Partial<Record<PanelName,string>>={quests:'J',maps:'M',inventory:'B',character:'P',meridians:'K'};
 const choose=(id:PanelName)=>{setExpanded(false);open(id);};
 return <nav className="r-nav r-function-menu" aria-label="Chức năng" ref={root}><div className="r-function-primary">{primary.map(m=><button key={m.id} aria-label={m.name} title={m.name} onClick={()=>choose(m.id)}><PaintIcon index={m.icon}/><span>{m.name}</span>{shortcuts[m.id]&&<kbd>{shortcuts[m.id]}</kbd>}{badge(m.id)>0&&<b className="r-function-badge" aria-label={badge(m.id)+' thưởng có thể nhận'}>{badge(m.id)}</b>}</button>)}</div><button className="r-function-ribbon" onClick={()=>choose('party')}>{data.party?'Tổ đội · '+data.party.name:'Vấn đạo · Đồng hành'}</button><div className="r-function-footer"><button onClick={()=>choose('menu')}>Thiên thư</button><button ref={trigger} aria-expanded={expanded} aria-controls="r-more-functions" onClick={()=>setExpanded(v=>!v)}>Thêm {expanded?'▴':'▾'}</button></div>{expanded&&<div id="r-more-functions" className="r-function-extra" aria-label="Chức năng bổ sung"><div className="r-function-extra-head">Tiên lộ vạn pháp<button aria-label="Đóng chức năng bổ sung" onClick={()=>{setExpanded(false);trigger.current?.focus();}}>×</button></div><div className="r-function-extra-grid">{extra.map((m,i)=><button ref={i===0?first:undefined} key={m.id} aria-label={m.name} onClick={()=>choose(m.id)}><PaintIcon index={m.icon}/><span>{m.name}</span>{shortcuts[m.id]&&<kbd>{shortcuts[m.id]}</kbd>}</button>)}</div></div>}</nav>;
}
