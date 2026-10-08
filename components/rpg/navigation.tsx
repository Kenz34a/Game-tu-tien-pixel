'use client';
import {createContext} from 'react';
import type {SceneTarget} from './game-canvas';
export const NavigationContext=createContext<(target:SceneTarget)=>void>(()=>{});
