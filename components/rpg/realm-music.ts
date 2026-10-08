'use client';
import {useEffect} from 'react';

// Original pentatonic score: soft plucked notes over a slow, rising drone.
export function useRealmMusic(enabled:boolean,volume=35){
 useEffect(()=>{
  if(!enabled)return;
  const context=new AudioContext(),master=context.createGain();master.gain.value=.12*volume/35;master.connect(context.destination);
  const notes=[62,69,74,76,74,69,67,69,62,67,69,74,79,76,74,69];let beat=0;
  const tone=(midi:number,duration:number,volume:number,type:OscillatorType)=>{
   const osc=context.createOscillator(),gain=context.createGain(),now=context.currentTime;
   osc.type=type;osc.frequency.value=440*2**((midi-69)/12);gain.gain.setValueAtTime(0,now);gain.gain.linearRampToValueAtTime(volume,now+.04);gain.gain.exponentialRampToValueAtTime(.0001,now+duration);
   osc.connect(gain);gain.connect(master);osc.start(now);osc.stop(now+duration+.1);osc.onended=()=>{osc.disconnect();gain.disconnect();};
  };
  const play=()=>{if(document.hidden)return;tone(notes[beat%notes.length],2.4,.35,'sine');if(beat%8===0){const root=beat%16===0?38:43;tone(root,7,.2,'triangle');tone(root+7,7,.12,'sine');}beat++;};
  void context.resume().then(play).catch(()=>{});const timer=setInterval(play,900);
  const visibility=()=>{if(document.hidden)void context.suspend();else void context.resume().catch(()=>{});};document.addEventListener('visibilitychange',visibility);
  return()=>{clearInterval(timer);document.removeEventListener('visibilitychange',visibility);void context.close();};
 },[enabled,volume]);
}
