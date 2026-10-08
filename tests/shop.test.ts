import assert from 'node:assert/strict';
import {SHOP_OFFERS,shopPrice} from '../lib/rpg/shop';
import {SLOTS,QUALITIES} from '../lib/rpg/catalog';
assert.equal(new Set(SHOP_OFFERS.map(o=>o.id)).size,SHOP_OFFERS.length);
for(const slot of SLOTS)for(let q=0;q<QUALITIES.length;q++){const o=SHOP_OFFERS.find(o=>o.id===`gear-${slot.id}-${q}`)!;assert(o);assert.equal(o.minRealm,q*5);assert(shopPrice(o,{realm:0,star:1})>0);assert(shopPrice(o,{realm:44,star:10})>=shopPrice(o,{realm:0,star:1}));}
assert.equal(shopPrice(SHOP_OFFERS.find(o=>o.id==='jade-gear-weapon-0')!,{realm:0,star:1}),2);
for(const currency of ['silver','stone','jade','merit','divine'])assert(SHOP_OFFERS.some(o=>o.currency===currency));
console.log('PASS: unique shop catalog, all 16 slots/eight qualities, realm gates, scaling prices and all five currencies.');
