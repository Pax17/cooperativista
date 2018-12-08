BEGIN TRANSACTION;
CREATE TEMPORARY TABLE payment_types_backup(
  `id` INTEGER,
  `payment_description` TEXT,
  `payment_code` TEXT,
  `status` INTEGER
  );
INSERT INTO payment_types_backup SELECT
  `id` ,
  `payment_description`,
  `payment_code`,
  `status`
  FROM payment_types;
DROP TABLE payment_types;
CREATE TABLE `payment_types` ( `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, `payment_description` TEXT NOT NULL, `payment_code` TEXT NOT NULL, `status` INTEGER NOT NULL DEFAULT 1 );
INSERT INTO payment_types SELECT
  `id` ,
  `payment_description`,
  `payment_code`,
  `status`
   FROM payment_types_backup;
DROP TABLE payment_types_backup;
COMMIT;