CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT DEFAULT 0 NOT NULL,
	`name` text NOT NULL,
	`city` text NOT NULL,
	`country` text NOT NULL,
	`favorite_sport` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
