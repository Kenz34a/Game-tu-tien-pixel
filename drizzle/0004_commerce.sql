CREATE TABLE rpg_giftcodes (
 code TEXT PRIMARY KEY, rewards TEXT NOT NULL, uses_remaining INTEGER NOT NULL CHECK(uses_remaining>=0),
 max_uses INTEGER NOT NULL, expires_at INTEGER NOT NULL, active INTEGER NOT NULL DEFAULT 1,
 created_at INTEGER NOT NULL
);
CREATE TABLE rpg_gift_claims (
 code TEXT NOT NULL, owner TEXT NOT NULL, gate INTEGER NOT NULL CHECK(gate=1), created_at INTEGER NOT NULL,
 PRIMARY KEY(code,owner)
);
CREATE TABLE rpg_commerce_config (id TEXT PRIMARY KEY, data TEXT NOT NULL);
CREATE TABLE rpg_payment_orders (
 id TEXT PRIMARY KEY, owner TEXT NOT NULL, order_code INTEGER NOT NULL UNIQUE,
 pack_id TEXT NOT NULL, amount INTEGER NOT NULL CHECK(amount>0), jade INTEGER NOT NULL CHECK(jade>0),
 method TEXT NOT NULL CHECK(method IN ('manual','payos')),
 status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','approved','rejected')),
 decision_token TEXT, checkout_url TEXT, payment_link_id TEXT, created_at INTEGER NOT NULL, resolved_at INTEGER,
 review_note TEXT NOT NULL DEFAULT ''
);
CREATE INDEX idx_payment_orders_owner ON rpg_payment_orders(owner,created_at);
CREATE TABLE rpg_payment_credits (
 order_id TEXT PRIMARY KEY, receipt TEXT NOT NULL UNIQUE, owner TEXT NOT NULL, amount INTEGER NOT NULL,
 gate INTEGER NOT NULL CHECK(gate=1), created_at INTEGER NOT NULL
);
