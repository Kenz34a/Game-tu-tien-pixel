'use client';
import {useContext,useEffect,useRef} from 'react';
import {drawTitleBanner} from '@/lib/rpg/title-art';
import type {TitleDef} from '@/lib/rpg/titles';
import {PreferencesContext} from './preferences';
export function TitleRibbon({title}:{title:TitleDef}){
 const ref=useRef<HTMLCanvasElement>(null),motion=useContext(PreferencesContext).preferences.motion;
 useEffect(()=>{const c=ref.current?.getContext('2d');if(!c)return;let frame=0;const draw=(t:number)=>{c.clearRect(0,0,320,80);drawTitleBanner(c,160,42,motion?t:0,title);if(motion)frame=requestAnimationFrame(draw);};draw(0);return()=>cancelAnimationFrame(frame);},[title.id,motion]);
 return <canvas ref={ref} width={320} height={80} className="r-title-ribbon-art" role="img" aria-label={title.name}>{title.name}</canvas>;
}
