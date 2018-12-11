BEGIN TRANSACTION;

CREATE TABLE IF NOT EXISTS `helper_attr` (
  `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  `taxonomy` TEXT NOT NULL,
  `value` TEXT NOT NULL,
  `status` integer DEFAULT 1,
  `attribute_1` TEXT,
  `attribute_2` TEXT,
  `attribute_3` TEXT,
  `attribute_4` TEXT,
  `attribute_5` TEXT
);

CREATE TABLE IF NOT EXISTS `entities` (
	`id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	`name`	TEXT NOT NULL,
	`name_2`	TEXT,
	`name_3`	TEXT,
	`attribute_1`	TEXT,
	`attribute_2`	TEXT,
	`attribute_3`	TEXT,
	`attribute_4`	TEXT,
	`attribute_5`	TEXT,
	`is_default`	INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS `base_user_roles` (
	`id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	`role_description`	TEXT NOT NULL,
	`role_unique`	INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS `base_users` (
	`id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	`alias`	TEXT NOT NULL,
	`name`	TEXT NOT NULL,
	`last_name`	TEXT NOT NULL,
	`entity_id`	INTEGER NOT NULL,
	`role_id`	INTEGER NOT NULL,
	`passcode`	TEXT,
	`status`	INTEGER NOT NULL DEFAULT 1,
	`attribute_1`	TEXT,
	`attribute_2`	TEXT,
	`attribute_3`	TEXT,
	`attribute_4`	TEXT,
	`attribute_5`	TEXT,
	FOREIGN KEY(`entity_id`) REFERENCES `entities`(`id`),
	FOREIGN KEY(`role_id`) REFERENCES `base_user_roles`(`id`)
);


CREATE TABLE IF NOT EXISTS `receipt_grand_types` (
	`id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	`receipt_code`	TEXT NOT NULL UNIQUE,
	`receipt_grand_type_description`	BLOB
);

CREATE TABLE IF NOT EXISTS `receipt_types` (
	`id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	`receipt_description`	TEXT NOT NULL,
	`receipt_code`	TEXT,
	`status`	INTEGER NOT NULL DEFAULT 1,
	FOREIGN KEY(`receipt_code`) REFERENCES `receipt_grand_types`(`receipt_code`)
);

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
	`receipt_number` TEXT,
	FOREIGN KEY(`entity_id`) REFERENCES `entities`(`id`),
	FOREIGN KEY(`receipt_type_id`) REFERENCES `receipt_types`(`id`),
	FOREIGN KEY(`base_user_id`) REFERENCES `base_users`(`id`)
);


CREATE TABLE IF NOT EXISTS `payment_grand_types` (
	`id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	`payment_code`	TEXT NOT NULL UNIQUE,
	`payment_grand_type_description`	BLOB
);

CREATE TABLE IF NOT EXISTS `payment_types` (
	`id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	`payment_description`	TEXT NOT NULL,
	`payment_code`	TEXT NOT NULL,
	`status`	INTEGER NOT NULL DEFAULT 1,
	FOREIGN KEY(`payment_code`) REFERENCES `payment_grand_types`(`payment_code`)
);

CREATE TABLE IF NOT EXISTS `partner_types` (
	`id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	`type_description`	TEXT NOT NULL,
	`type_code`	TEXT NOT NULL,
	`status`	INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS `partners` (
  `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  `name` TEXT NOT NULL,
  `name_2` TEXT,
  `name_3` TEXT,
  `partner_type_id` INTEGER NOT NULL,
  `attribute_1` TEXT,
  `attribute_2` TEXT,
  `attribute_3` TEXT,
  `attribute_4` TEXT,
  `attribute_5` TEXT,
  `entity_id` INTEGER NOT NULL,
  FOREIGN KEY(`entity_id`) REFERENCES `entities`(`id`)
);

CREATE TABLE IF NOT EXISTS `partners_relations` (
	`id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	`partner_id`	INTEGER NOT NULL,
	`parent_partner_id`	INTEGER NOT NULL,
  FOREIGN KEY(`parent_partner_id`) REFERENCES `partners`(`id`),
  FOREIGN KEY(`partner_id`) REFERENCES `partners`(`id`)
);
CREATE TABLE IF NOT EXISTS `partner_types_relations` (
	`id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	`partner_id`	INTEGER NOT NULL,
	`parent_partner_id`	INTEGER NOT NULL,
	FOREIGN KEY(`partner_id`) REFERENCES `partner_types`(`id`),
	FOREIGN KEY(`parent_partner_id`) REFERENCES `partner_types`(`id`)
);

CREATE TABLE IF NOT EXISTS `expense_grand_types` (
	`id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	`expense_code`	TEXT NOT NULL UNIQUE,
	`expense_grand_type_description`	BLOB
);

CREATE TABLE IF NOT EXISTS `expense_types` (
	`id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	`expense_description`	TEXT NOT NULL,
	`expense_code`	TEXT NOT NULL,
	`status`	INTEGER NOT NULL DEFAULT 1,
	FOREIGN KEY(`expense_code`) REFERENCES `expense_grand_types`(`expense_code`)
);

CREATE TABLE IF NOT EXISTS `expenses` (
	`id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	`expense_type_id`	INTEGER NOT NULL,
	`payment_type_id`	INTEGER NOT NULL,
	`partner_id`	INTEGER NOT NULL,
	`expense_date`	TEXT NOT NULL,
	`expense_period_start`	TEXT,
	`expense_period_end`	TEXT,
	`amount`	NUMERIC NOT NULL DEFAULT 0,
	`currency`	TEXT NOT NULL DEFAULT 'ARS',
	`notes`	TEXT,
	`entity_id`	INTEGER NOT NULL,
	`base_user_id`	INTEGER NOT NULL,
	`printed`	TEXT,
	FOREIGN KEY(`entity_id`) REFERENCES `entities`(`id`),
	FOREIGN KEY(`base_user_id`) REFERENCES `base_users`(`id`),
	FOREIGN KEY(`expense_type_id`) REFERENCES `expense_types`(`id`)
);

CREATE UNIQUE INDEX IF NOT EXISTS `unique_partner_types_relations` ON `partner_types_relations` (
	`partner_id`,
	`parent_partner_id`
);
CREATE UNIQUE INDEX IF NOT EXISTS `unique_partner_relation` ON `partners_relations` (
	`partner_id`,
	`parent_partner_id`
);

CREATE VIEW courses(id, name, name_2, name_3, attribute_1, attribute_2, attribute_3, attribute_4, attribute_5, partner_type_id, entity_id, type_description, type_code) AS SELECT p.id, p.name, p.name_2, p.name_3, p.attribute_1, p.attribute_2, p.attribute_3, p.attribute_4, p.attribute_5, p.partner_type_id, p.entity_id, pt.type_description, pt.type_code FROM partners p INNER JOIN partner_types pt on p.partner_type_id = pt.id WHERE p.partner_type_id = 1;

CREATE VIEW donators(id, name, name_2, name_3, attribute_1, attribute_2, attribute_3, attribute_4, attribute_5, partner_type_id, entity_id, type_description, type_code) AS SELECT p.id, p.name, p.name_2, p.name_3, p.attribute_1, p.attribute_2, p.attribute_3, p.attribute_4, p.attribute_5, p.partner_type_id, p.entity_id, pt.type_description, pt.type_code FROM partners p INNER JOIN partner_types pt on p.partner_type_id = pt.id WHERE p.partner_type_id = 4;
CREATE VIEW students (
	id,
	name,
	name_2,
	name_3,
	attribute_1,
	attribute_2,
	attribute_3,
	attribute_4,
	attribute_5,
	partner_type_id,
	entity_id,
	type_description,
	type_code,
	course_relation_id,
	course_id,
	course_name,
	course_name_2,
	course_name_3,
	course_attribute_1,
	course_attribute_2,
	course_attribute_3,
	course_attribute_4,
	course_attribute_5,
	course_type_description,
	course_type_code,
	family_relation_id,
	family_id,
	family_name,
	family_name_2,
	family_name_3,
	family_attribute_1,
	family_attribute_2,
	family_attribute_3,
	family_attribute_4,
	family_attribute_5,
	family_type_description,
	family_type_code
) AS SELECT
p.id,
p.name,
p.name_2,
p.name_3,
p.attribute_1,
p.attribute_2,
p.attribute_3,
p.attribute_4,
p.attribute_5,
p.partner_type_id,
p.entity_id,
pt.type_description,
pt.type_code,
courses.id course_relation_id,
courses.course_id,
courses.name course_name,
courses.name_2 course_name_2,
courses.name_3 course_name_3,
courses.attribute_1 course_attribute_1,
courses.attribute_2 course_attribute_2,
courses.attribute_3 course_attribute_3,
courses.attribute_4 course_attribute_4,
courses.attribute_5 course_attribute_5,
courses.type_description course_type_description,
courses.type_code course_type_code,
families.id family_relation_id,
families.family_id,
families.name family_name,
families.name_2 family_name_2,
families.name_3 family_name_3,
families.attribute_1 family_attribute_1,
families.attribute_2 family_attribute_2,
families.attribute_3 family_attribute_3,
families.attribute_4 family_attribute_4,
families.attribute_5 family_attribute_5,
families.type_description family_type_description,
families.type_code family_type_code
FROM
	partners p
	INNER JOIN partner_types pt ON p.partner_type_id = pt.id
	LEFT JOIN (
	SELECT
		prc.id,
		pc.id course_id,
		pc.name,
		pc.name_2,
		pc.name_3,
		pc.attribute_1,
		pc.attribute_2,
		pc.attribute_3,
		pc.attribute_4,
		pc.attribute_5,
		pc.partner_type_id,
		pc.entity_id,
		ptc.type_description,
		ptc.type_code,
		prc.partner_id
	FROM
		partners pc
		INNER JOIN partner_types ptc ON pc.partner_type_id = ptc.id
		INNER JOIN partners_relations prc ON pc.id = prc.parent_partner_id
	WHERE
		pc.partner_type_id = 1
	) courses ON p.id = courses.partner_id
	AND p.entity_id = courses.entity_id
	LEFT JOIN (
	SELECT
		prf.id,
		pf.id family_id,
		pf.name,
		pf.name_2,
		pf.name_3,
		pf.attribute_1,
		pf.attribute_2,
		pf.attribute_3,
		pf.attribute_4,
		pf.attribute_5,
		pf.partner_type_id,
		pf.entity_id,
		ptf.type_description,
		ptf.type_code,
		prf.partner_id
	FROM
		partners pf
		INNER JOIN partner_types ptf ON pf.partner_type_id = ptf.id
		INNER JOIN partners_relations prf ON pf.id = prf.parent_partner_id
	WHERE
		pf.partner_type_id = 3
	) families ON p.id = families.partner_id
	AND p.entity_id = families.entity_id
WHERE
	p.partner_type_id = 2;

CREATE VIEW suppliers(id, name, name_2, name_3, attribute_1, attribute_2, attribute_3, attribute_4, attribute_5, partner_type_id, entity_id, type_description, type_code) AS SELECT p.id, p.name, p.name_2, p.name_3, p.attribute_1, p.attribute_2, p.attribute_3, p.attribute_4, p.attribute_5, p.partner_type_id, p.entity_id, pt.type_description, pt.type_code FROM partners p INNER JOIN partner_types pt on p.partner_type_id = pt.id WHERE p.partner_type_id = 5;

CREATE VIEW receipts_all (
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
    printed,
	receipt_number,
    name,
    name_2,
    name_3,
    attribute_1,
    attribute_3,
    attribute_4,
    attribute_5,
    attribute_2,
    type_description,
    type_code,
    payment_description,
    payment_code,
    receipt_description,
    receipt_code,
    course_id,
    course_name,
    course_name_2,
    course_name_3,
    course_attribute_1,
    course_attribute_2,
    course_attribute_3,
    course_attribute_4,
    course_attribute_5,
    course_type_description,
    course_type_code,
    family_id,
    family_name,
    family_name_2,
    family_name_3,
    family_attribute_1,
    family_attribute_2,
    family_attribute_3,
    family_attribute_4,
    family_attribute_5,
    family_type_description,
    family_type_code
)
AS
     SELECT r.id, 
           r.receipt_type_id,
           r.payment_type_id,
           r.partner_id,
           r.receipt_date,
           r.receipt_period_start,
           r.receipt_period_end,
           r.amount,
           r.currency,
           r.notes,
           r.entity_id,
           r.base_user_id,
           r.printed,
		   r.receipt_number,
           IFNULL(s.name, d.name) AS name,
           IFNULL(s.name_2, d.name_2) AS name_2,
           IFNULL(s.name_3, d.name_3) AS name_3,
           IFNULL(s.attribute_1, d.attribute_1) AS attribute_1,
           IFNULL(s.attribute_2, d.attribute_2) AS attribute_2,
           IFNULL(s.attribute_1, d.attribute_3) AS attribute_3,
           IFNULL(s.attribute_4, d.attribute_4) AS attribute_4,
           IFNULL(s.attribute_5, d.attribute_5) AS attribute_5,
           IFNULL(s.type_description, d.type_description) AS type_description,
           IFNULL(s.type_code, d.type_code) AS type_code,
           pt.payment_description,
           pt.payment_code,
           rt.receipt_description,
           rt.receipt_code,
           s.course_id,
           s.course_name,
           s.course_name_2,
           s.course_name_3,
           s.course_attribute_1,
           s.course_attribute_2,
           s.course_attribute_3,
           s.course_attribute_4,
           s.course_attribute_5,
           s.course_type_description,
           s.course_type_code,
           s.family_id,
           s.family_name,
           s.family_name_2,
           s.family_name_3,
           s.family_attribute_1,
           s.family_attribute_2,
           s.family_attribute_3,
           s.family_attribute_4,
           s.family_attribute_5,
           s.family_type_description,
           s.family_type_code
      FROM receipts r
           INNER JOIN receipt_types rt ON r.receipt_type_id = rt.id
           INNER JOIN payment_types pt ON r.payment_type_id = pt.id
           LEFT JOIN students s ON s.id = r.partner_id AND s.entity_id = r.entity_id
           LEFT JOIN donators d ON d.id = r.partner_id;

COMMIT;
