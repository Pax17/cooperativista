BEGIN TRANSACTION;
CREATE TEMPORARY TABLE partners_backup(
  `id` INTEGER,
  `name` TEXT,
  `name_2` TEXT,
  `name_3` TEXT,
  `partner_type_id` INTEGER,
  `attribute_1` TEXT,
  `attribute_2` TEXT,
  `attribute_3` TEXT,
  `attribute_4` TEXT,
  `attribute_5` TEXT
  );
INSERT INTO partners_backup SELECT
  `id`,
  `name` ,
  `name_2` ,
  `name_3` ,
  `partner_type_id` ,
  `attribute_1` ,
  `attribute_2` ,
  `attribute_3` ,
  `attribute_4` ,
  `attribute_5`  FROM partners;
DROP TABLE partners;
CREATE TABLE partners(
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
INSERT INTO partners SELECT
  `id` ,
  `name` ,
  `name_2` ,
  `name_3` ,
  `partner_type_id` ,
  `attribute_1` ,
  `attribute_2` ,
  `attribute_3` ,
  `attribute_4` ,
  `attribute_5`,
  1
   FROM partners_backup;
DROP TABLE partners_backup;

COMMIT;