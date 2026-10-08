CREATE TABLE `messages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`body` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_messages_created` ON `messages` (`created_at`);--> statement-breakpoint
CREATE TABLE `monsters` (
	`id` text PRIMARY KEY NOT NULL,
	`kind` integer NOT NULL,
	`x` real NOT NULL,
	`y` real NOT NULL,
	`hp` integer NOT NULL,
	`max_hp` integer NOT NULL,
	`respawn_at` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `players` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`x` real DEFAULT 720 NOT NULL,
	`y` real DEFAULT 630 NOT NULL,
	`level` integer DEFAULT 1 NOT NULL,
	`xp` integer DEFAULT 0 NOT NULL,
	`hp` integer DEFAULT 360 NOT NULL,
	`mp` integer DEFAULT 180 NOT NULL,
	`stones` integer DEFAULT 100 NOT NULL,
	`potions` integer DEFAULT 5 NOT NULL,
	`kills` integer DEFAULT 0 NOT NULL,
	`bosses` integer DEFAULT 0 NOT NULL,
	`quest` integer DEFAULT 0 NOT NULL,
	`equipment` integer DEFAULT 0 NOT NULL,
	`last_seen` integer DEFAULT 0 NOT NULL,
	`action_at` integer DEFAULT 0 NOT NULL,
	`cooldowns` text DEFAULT '{}' NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_players_seen` ON `players` (`last_seen`);