CREATE TABLE `rpg_boss_damage` (
	`id` text PRIMARY KEY NOT NULL,
	`boss_id` text NOT NULL,
	`cycle` integer NOT NULL,
	`owner` text NOT NULL,
	`damage` integer DEFAULT 0 NOT NULL,
	`claimed` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_rpg_boss_damage_owner` ON `rpg_boss_damage` (`owner`,`claimed`);--> statement-breakpoint
CREATE TABLE `rpg_world_bosses` (
	`id` text PRIMARY KEY NOT NULL,
	`hp` integer NOT NULL,
	`max_hp` integer NOT NULL,
	`respawn_at` integer DEFAULT 0 NOT NULL,
	`cycle` integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `rpg_guilds` (
	`id` text PRIMARY KEY NOT NULL,
	`kind` text NOT NULL,
	`name` text NOT NULL,
	`leader` text NOT NULL,
	`treasury` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_rpg_guilds_kind` ON `rpg_guilds` (`kind`);--> statement-breakpoint
CREATE TABLE `rpg_items` (
	`uid` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`data` text NOT NULL,
	`equipped_slot` text
);
--> statement-breakpoint
CREATE INDEX `idx_rpg_items_owner` ON `rpg_items` (`owner`);--> statement-breakpoint
CREATE TABLE `rpg_listings` (
	`id` text PRIMARY KEY NOT NULL,
	`item_uid` text NOT NULL,
	`owner` text NOT NULL,
	`seller_name` text NOT NULL,
	`item_data` text NOT NULL,
	`currency` text NOT NULL,
	`price` integer NOT NULL,
	`status` text DEFAULT 'open' NOT NULL,
	`buyer_id` text,
	`sold_at` integer,
	`settled` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_rpg_listings_status` ON `rpg_listings` (`status`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_rpg_listings_item` ON `rpg_listings` (`item_uid`,`status`);--> statement-breakpoint
CREATE TABLE `rpg_members` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`kind` text NOT NULL,
	`guild_id` text NOT NULL,
	`contribution` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_rpg_members_guild` ON `rpg_members` (`guild_id`);--> statement-breakpoint
CREATE TABLE `rpg_messages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`owner` text NOT NULL,
	`name` text NOT NULL,
	`map_id` integer NOT NULL,
	`body` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_rpg_messages_map` ON `rpg_messages` (`map_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `rpg_profiles` (
	`id` text PRIMARY KEY NOT NULL,
	`data` text NOT NULL,
	`version` integer DEFAULT 0 NOT NULL,
	`name` text NOT NULL,
	`power` integer DEFAULT 0 NOT NULL,
	`realm` integer DEFAULT 0 NOT NULL,
	`map_id` integer DEFAULT 0 NOT NULL,
	`last_seen` integer DEFAULT 0 NOT NULL,
	`locked_until` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_rpg_profiles_power` ON `rpg_profiles` (`power`);--> statement-breakpoint
CREATE INDEX `idx_rpg_profiles_presence` ON `rpg_profiles` (`map_id`,`last_seen`);--> statement-breakpoint
CREATE TABLE `rpg_wallets` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`currency` text NOT NULL,
	`balance` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_rpg_wallets_owner` ON `rpg_wallets` (`owner`);