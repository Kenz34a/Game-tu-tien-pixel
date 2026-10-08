CREATE TABLE rpg_admin_sessions (token_hash text PRIMARY KEY NOT NULL, credential_hash text NOT NULL, expires_at integer NOT NULL, created_at integer NOT NULL);
--> statement-breakpoint
CREATE TABLE rpg_admin_limits (id text PRIMARY KEY NOT NULL, attempts integer NOT NULL DEFAULT 0, window_at integer NOT NULL);
--> statement-breakpoint
CREATE TABLE rpg_admin_controls (owner text PRIMARY KEY NOT NULL, banned_until integer NOT NULL DEFAULT 0, muted_until integer NOT NULL DEFAULT 0, reason text NOT NULL DEFAULT '');
--> statement-breakpoint
CREATE TABLE rpg_server_settings (id text PRIMARY KEY NOT NULL, data text NOT NULL);
--> statement-breakpoint
CREATE TABLE rpg_admin_audit (id integer PRIMARY KEY AUTOINCREMENT NOT NULL, action text NOT NULL, target text, reason text NOT NULL, details text NOT NULL, created_at integer NOT NULL);
--> statement-breakpoint
CREATE INDEX idx_rpg_admin_audit_created ON rpg_admin_audit(created_at);
