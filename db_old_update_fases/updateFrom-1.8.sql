BEGIN TRANSACTION;
CREATE TEMPORARY TABLE `receipts_temp` (
	`id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	`receipt_type_id`	INTEGER NOT NULL,
	`payment_type_id`	INTEGER NOT NULL,
	`partner_id`	INTEGER NOT NULL,
	`receipt_date`	TEXT NOT NULL,
	`receipt_period_start`	TEXT,
	`receipt_period_end`	TEXT,
	`amount`	NUMERIC NOT NULL DEFAULT 0,
	`currency`	TEXT NOT NULL DEFAULT 'ARS',
	`notes`	TEXT,
	`entity_id`	INTEGER NOT NULL,
	`base_user_id`	INTEGER NOT NULL,
	`printed`	TEXT
);

INSERT INTO receipts_temp SELECT
	id,
	receipt_type_id,
	payment_type_id,
	partner_id,
	receipt_date,
	receipt_period_start,
	receipt_period_end,
	amount,
	currency,
	notes,
	entity_id,
	base_user_id,
	printed
FROM
	receipts;

DROP TABLE receipts;

DROP TABLE receipt_types;
CREATE TABLE IF NOT EXISTS `receipt_grand_types` (
	`id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	`receipt_code`	TEXT NOT NULL UNIQUE,
	`receipt_grand_type_description`	BLOB
);
INSERT INTO `receipt_grand_types` VALUES (1,'M1','Mensuales');
INSERT INTO `receipt_grand_types` VALUES (2,'A1','Anuales');
INSERT INTO `receipt_grand_types` VALUES (3,'E1','Eventuales');

CREATE TABLE IF NOT EXISTS `receipt_types` (
	`id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	`receipt_description`	TEXT NOT NULL,
	`receipt_code`	TEXT,
	`status`	INTEGER NOT NULL DEFAULT 1,
	FOREIGN KEY(`receipt_code`) REFERENCES `receipt_grand_types`(`receipt_code`)
);
INSERT INTO `receipt_types` VALUES (1,'Cuota','M1',1);
INSERT INTO `receipt_types` VALUES (2,'Donación','E1',1);
INSERT INTO `receipt_types` VALUES (3,'Evento','E1',1);
INSERT INTO `receipt_types` VALUES (4,'Rifa','E1',1);
INSERT INTO `receipt_types` VALUES (5,'Subsidio','A1',1);




CREATE TABLE IF NOT EXISTS `receipts` (
	`id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	`receipt_type_id`	INTEGER NOT NULL,
	`payment_type_id`	INTEGER NOT NULL,
	`partner_id`	INTEGER NOT NULL,
	`receipt_date`	TEXT NOT NULL,
	`receipt_period_start`	TEXT,
	`receipt_period_end`	TEXT,
	`amount`	NUMERIC NOT NULL DEFAULT 0,
	`currency`	TEXT NOT NULL DEFAULT 'ARS',
	`notes`	TEXT,
	`entity_id`	INTEGER NOT NULL,
	`base_user_id`	INTEGER NOT NULL,
	`printed`	TEXT,
	FOREIGN KEY(`entity_id`) REFERENCES `entities`(`id`),
	FOREIGN KEY(`receipt_type_id`) REFERENCES `receipt_types`(`id`),
	FOREIGN KEY(`base_user_id`) REFERENCES `base_users`(`id`)
)
;
INSERT INTO receipts  SELECT
	id,
	receipt_type_id,
	payment_type_id,
	partner_id,
	receipt_date,
	receipt_period_start,
	receipt_period_end,
	amount,
	currency,
	notes,
	entity_id,
	base_user_id,
	printed
FROM
	receipts_temp;

COMMIT;
