'use client';
import {useEffect,useRef} from 'react';
import {drawField} from '@/lib/rpg/field-art';
import {worldSize} from '@/lib/rpg/map-layout';
export function MapBackdrop({mapId,world,arena}:{mapId:number;world:number;arena:boolean}){
 const ref=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{const canvas=ref.current,c=canvas?.getContext('2d');if(!canvas||!c)return;let disposed=false;const image=new Image(),size=worldSize(arena);canvas.width=1152;canvas.height=768;const draw=()=>{if(disposed)return;c.setTransform(canvas.width/size.width,0,0,canvas.height/size.height,0,0);if(arena)c.drawImage(image,0,0,size.width,size.height);else drawField(c,image,mapId,{left:0,top:0,right:size.width,bottom:size.height});};image.onload=draw;image.src=`/rpg/${arena?'courtyard':['lower','immortal','divine'][world]}.webp`;return()=>{disposed=true;};},[mapId,world,arena]);
 return <canvas ref={ref} className="r-map-backdrop" aria-hidden="true"/>;
}
