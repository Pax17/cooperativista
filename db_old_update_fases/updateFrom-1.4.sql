BEGIN TRANSACTION;
CREATE TEMPORARY TABLE receipt_types_backup(
  `id` INTEGER,
  `receipt_description` TEXT,
  `receipt_code` TEXT,
  `status` INTEGER
  );
INSERT INTO receipt_types_backup SELECT
  `id` ,
  `receipt_description`,
  `receipt_code`,
  `status`
  FROM receipt_types;
DROP TABLE receipt_types;
CREATE TABLE `receipt_types` ( `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, `receipt_description` TEXT NOT NULL, `receipt_code` TEXT NOT NULL, `status` INTEGER NOT NULL DEFAULT 1 );
INSERT INTO receipt_types SELECT
  `id` ,
  `receipt_description`,
  `receipt_code`,
  `status`
   FROM receipt_types_backup;
DROP TABLE receipt_types_backup;
COMMIT;
