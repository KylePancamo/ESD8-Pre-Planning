ALTER TABLE `roles`
	CHANGE COLUMN `name` `name` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci' AFTER `id`;