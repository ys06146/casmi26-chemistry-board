CREATE TABLE `dashboard_activity` (
	`id` text PRIMARY KEY NOT NULL,
	`kind` text NOT NULL,
	`entity_id` text NOT NULL,
	`actor_id` text,
	`actor_alias` text NOT NULL,
	`summary` text NOT NULL,
	`before_data` text NOT NULL,
	`after_data` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`actor_id`) REFERENCES `dashboard_members`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `dashboard_activity_time_idx` ON `dashboard_activity` (`created_at`);--> statement-breakpoint
CREATE TABLE `dashboard_items` (
	`id` text PRIMARY KEY NOT NULL,
	`kind` text NOT NULL,
	`data` text NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	`updated_at` integer NOT NULL,
	`updated_by` text,
	`mutation_id` text NOT NULL,
	FOREIGN KEY (`updated_by`) REFERENCES `dashboard_members`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `dashboard_item_kind_idx` ON `dashboard_items` (`kind`);--> statement-breakpoint
CREATE TABLE `dashboard_members` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`alias` text NOT NULL,
	`focus` text DEFAULT 'Chemistry' NOT NULL,
	`role` text DEFAULT 'member' NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `dashboard_member_user_idx` ON `dashboard_members` (`user_id`);