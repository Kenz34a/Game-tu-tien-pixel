// Requires a dedicated PostgreSQL test database and `npm run build:render`.
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {randomBytes} from 'node:crypto';
import {Pool} from 'pg';
import {migratePostgres} from '../scripts/migrate-postgres.mjs';
const base='http://127.0.0.1:8791',password=randomBytes(32).toString('hex'),name='QA_ADMIN_'+Date.now().toString(36);
await migratePostgres();await migratePostgres();
const pool=new Pool({connectionString:process.env.DATABASE_URL});let log='';
const server=spawn(process.execPath,['./node_modules/vinext/dist/cli.js','start','--hostname','127.0.0.1','--port','8791'],{env:{...process.env,RPG_RUNTIME:'node',ADMIN_PASSWORD:password},stdio:['ignore','pipe','pipe']});server.stdout.on('data',x=>log+=x);server.stderr.on('data',x=>log+=x);
async function request(path,method='GET',body,cookie='',status=200,origin){const r=await fetch(base+path,{method,headers:{...(cookie?{cookie}:{}),...(body?{'content-type':'application/json'}:{}),...(origin?{origin}:{})},...(body?{body:JSON.stringify(body)}:{})});const d=await r.json();assert.equal(r.status,status,d.error||JSON.stringify(d));return{d,cookie:r.headers.get('set-cookie')?.split(';')[0]||cookie,header:r.headers.get('set-cookie')};}
try{
 let ready=false;for(let i=0;i<50;i++){try{const r=await fetch(base+'/api/health');if(r.ok){ready=true;break;}}catch{}await new Promise(r=>setTimeout(r,300));}assert(ready,'Node server did not become healthy. '+log.slice(-2000));
 const initial=await request('/api/rpg');const userCookie=initial.cookie;let last=0;
 async function player(action,args={},status=200){const wait=400-(Date.now()-last);if(wait>0)await new Promise(r=>setTimeout(r,wait));last=Date.now();return (await request('/api/rpg','POST',{action,...args},userCookie,status)).d;}
 await player('attack',{target:'m0-0',skill:1},400);await player('skillUpgrade',{skill:0},400);await player('skillUpgrade',{skill:3},400);
 await player('name',{name});await request('/api/admin','GET',undefined,userCookie,401);await request('/api/admin','GET',undefined,'vt_admin='+'a'.repeat(64),401);
 await request('/api/admin/auth','POST',{password},'',403,'https://evil.example');await request('/api/admin/auth','POST',{password:'wrong'},'',401);
 const login=await request('/api/admin/auth','POST',{password});let adminCookie=login.cookie;assert(login.header.includes('HttpOnly')&&login.header.includes('SameSite=Strict'));assert(!JSON.stringify(login.d).includes(password));
 const dashboard=(await request('/api/admin?search='+name,'GET',undefined,adminCookie)).d;assert.equal(dashboard.players.length,1);const id=dashboard.players[0].id;
 const admin=async(action,args={},status=200)=>(await request('/api/admin','POST',{action,playerId:id,reason:'Regression test',...args},adminCookie,status)).d;
 await request('/api/admin','POST',{action:'edit',playerId:id,reason:'Unauthorized',patch:{realm:44}},userCookie,401);
 await admin('edit',{patch:{realm:2,star:3,xp:100,coins:{stone:1000},potions:12,classId:'spell',mapId:1,books:[0],petId:1,mountId:2}});let d=(await request('/api/rpg','GET',undefined,userCookie)).d;assert.equal(d.profile.realm,2);assert.equal(d.profile.coins.stone,1000);assert.equal(d.profile.mapId,1);assert.equal(d.profile.books[0],0);assert.equal(d.profile.petId,1);
 await admin('edit',{patch:{coins:{stone:-1}}},400);await admin('edit',{patch:{realm:0,mapId:53}},400);await admin('edit',{patch:{role:'admin'}},400);d=(await request('/api/rpg','GET',undefined,userCookie)).d;assert.equal(d.profile.realm,2);assert.equal(d.profile.coins.stone,1000);
 await pool.query('UPDATE rpg_profiles SET locked_until=$1 WHERE id=$2',[Date.now()+5000,id]);await admin('edit',{patch:{xp:200}},409);await pool.query('UPDATE rpg_profiles SET locked_until=0 WHERE id=$1',[id]);
 await player('skillUpgrade',{skill:1});d=(await request('/api/rpg','GET',undefined,userCookie)).d;assert.equal(d.profile.skillLevels[1],2);await player('skillUpgrade',{skill:3},400);
 const items=d.profile.inventory.length;await admin('grantItem',{slot:'weapon',quality:7,rank:40});d=(await request('/api/rpg','GET',undefined,userCookie)).d;assert.equal(d.profile.inventory.length,items+1);assert(d.profile.inventory.some(i=>i.quality===7&&i.rank===40));await admin('heal');d=(await request('/api/rpg','GET',undefined,userCookie)).d;assert.equal(d.profile.hp,d.stats.hp);
 await admin('settings',{settings:{maintenance:false,announcement:'Thiên chủ mở tiên vận',xpMultiplier:2}});const xp=d.profile.xp;d=await player('cultivate');assert.equal(d.profile.xp-xp,2*Number(d.notice.match(/\+(\d+) tu vi/)[1]));assert.equal(d.server.announcement,'Thiên chủ mở tiên vận');
 await admin('mute',{hours:1});await player('chat',{message:'Muted test'},403);await player('sync');await admin('unmute');await player('chat',{message:'Admin smoke test'});
 await admin('ban',{hours:1});await request('/api/rpg','GET',undefined,userCookie,403);await request('/api/game','GET',undefined,userCookie,403);await player('sync',{},403);await admin('unban');await request('/api/rpg','GET',undefined,userCookie);
 await admin('settings',{settings:{maintenance:true,announcement:'Bảo trì thử nghiệm',xpMultiplier:1}});await new Promise(r=>setTimeout(r,1100));await request('/api/rpg','GET',undefined,userCookie,503);await request('/api/rpg','GET',undefined,adminCookie+'; '+userCookie);await request('/api/health');await admin('settings',{settings:{maintenance:false,announcement:'',xpMultiplier:1}});
 const logs=(await request('/api/admin','GET',undefined,adminCookie)).d.logs;assert(logs.some(l=>l.action==='grantItem'&&l.target===id));assert(logs.some(l=>l.action==='edit'&&JSON.parse(l.details).after.coins.stone===1000));assert(!logs.some(l=>l.reason==='Unauthorized'));
 const sessions=await pool.query('SELECT token_hash FROM rpg_admin_sessions');assert(sessions.rows.every(r=>!adminCookie.includes(r.token_hash)),'Only token digests are stored');

 if(process.env.ADMIN_BROWSER_TEST){const {chromium}=await import(process.env.ADMIN_BROWSER_TEST);const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});try{const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(base+'/admin');await page.getByLabel('Mật khẩu admin').fill(password);await page.getByRole('button',{name:'Vào Thiên Chủ Điện',exact:true}).click();await page.getByRole('button',{name:'Máy chủ',exact:true}).click();await page.getByLabel('Hệ số tu vi').waitFor();await page.screenshot({path:'/workspace/artifacts/admin-thien-chu.png',fullPage:true});await page.setViewportSize({width:390,height:844});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Admin mobile layout overflow');assert.deepEqual(errors,[]);console.log('PASS: browser admin login, settings dashboard, mobile layout and no page errors.');}finally{await browser.close();}}
 await request('/api/admin/auth','DELETE',undefined,adminCookie);await request('/api/admin','GET',undefined,adminCookie,401);
 console.log('PASS: real PostgreSQL migrations/startup, all eight leaderboards, admin isolation, CSRF, hashed sessions/logout, atomic validated character edits, locks, items, healing, XP settings, announcements, bans, chat restrictions, maintenance and audit trail.');
}finally{if(server.exitCode===null){server.kill('SIGTERM');await new Promise(resolve=>server.once('exit',resolve));}await pool.end();}
