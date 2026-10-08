CREATE TABLE `rpg_parties` (
	`id` text PRIMARY KEY NOT NULL,
	`code` text NOT NULL,
	`name` text NOT NULL,
	`leader` text NOT NULL,
	`map_id` integer NOT NULL,
	`phase` text DEFAULT 'recruiting' NOT NULL,
	`cycle` integer DEFAULT 0 NOT NULL,
	`wave` integer DEFAULT 1 NOT NULL,
	`hp` integer DEFAULT 0 NOT NULL,
	`max_hp` integer DEFAULT 0 NOT NULL,
	`base_hp` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_rpg_parties_code` ON `rpg_parties` (`code`);--> statement-breakpoint
CREATE INDEX `idx_rpg_parties_phase` ON `rpg_parties` (`phase`,`created_at`);--> statement-breakpoint
CREATE TABLE `rpg_party_members` (
	`owner` text PRIMARY KEY NOT NULL,
	`party_id` text NOT NULL,
	`name` text NOT NULL,
	`damage` integer DEFAULT 0 NOT NULL,
	`reward_cycle` integer DEFAULT 0 NOT NULL,
	`joined_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_rpg_party_members_party` ON `rpg_party_members` (`party_id`);--> statement-breakpoint
ALTER TABLE `rpg_messages` ADD `channel` text DEFAULT 'world' NOT NULL;--> statement-breakpoint
ALTER TABLE `rpg_messages` ADD `scope` text;