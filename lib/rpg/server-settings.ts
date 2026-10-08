import {gameDb} from '../game-db';
import {actor} from './database';
import {AdminError,adminSession} from './admin-auth';
export type ServerSettings={maintenance:boolean;announcement:string;xpMultiplier:number};
const defaults:ServerSettings={maintenance:false,announcement:'',xpMultiplier:1};
let cache:{at:number;value:ServerSettings}|undefined;
export function clearSettingsCache(){cache=undefined;}
export async function serverSettings(){if(cache&&Date.now()-cache.at<1000)return cache.value;const row:any=await gameDb().prepare("SELECT data FROM rpg_server_settings WHERE id='main'").first();const value={...defaults,...(row?JSON.parse(row.data):{})};cache={at:Date.now(),value};return value as ServerSettings;}
export async function ensurePlayable(req:Request,chat=false){const settings=await serverSettings();if(settings.maintenance&&!await adminSession(req))throw new AdminError(settings.announcement||'Máy chủ đang bảo trì. Vui lòng quay lại sau.',503);const {id}=await actor(req);const control:any=await gameDb().prepare('SELECT banned_until,muted_until,reason FROM rpg_admin_controls WHERE owner=?').bind(id).first();if(control?.banned_until>Date.now())throw new AdminError('Nhân vật đang bị khóa: '+control.reason,403);if(chat&&control?.muted_until>Date.now())throw new AdminError('Nhân vật đang bị hạn chế trò chuyện: '+control.reason,403);return settings;}
