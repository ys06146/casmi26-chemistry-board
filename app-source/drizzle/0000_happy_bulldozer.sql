CREATE TABLE `chemistry_posts` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`author` text NOT NULL,
	`category` text NOT NULL,
	`case_id` text DEFAULT '' NOT NULL,
	`title` text NOT NULL,
	`observed` text NOT NULL,
	`question` text NOT NULL,
	`hypothesis` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'open' NOT NULL,
	`created_at` integer NOT NULL,
	`deleted_at` integer
);
--> statement-breakpoint
CREATE INDEX `chemistry_posts_created_idx` ON `chemistry_posts` (`created_at`);--> statement-breakpoint
CREATE INDEX `chemistry_posts_owner_idx` ON `chemistry_posts` (`owner_id`);--> statement-breakpoint
CREATE TABLE `chemistry_replies` (
	`id` text PRIMARY KEY NOT NULL,
	`post_id` text NOT NULL,
	`owner_id` text NOT NULL,
	`author` text NOT NULL,
	`body` text NOT NULL,
	`created_at` integer NOT NULL,
	`deleted_at` integer,
	FOREIGN KEY (`post_id`) REFERENCES `chemistry_posts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `chemistry_replies_post_idx` ON `chemistry_replies` (`post_id`);--> statement-breakpoint
CREATE INDEX `chemistry_replies_owner_idx` ON `chemistry_replies` (`owner_id`);