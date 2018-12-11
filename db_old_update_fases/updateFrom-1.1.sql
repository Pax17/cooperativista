BEGIN TRANSACTION;
CREATE TEMPORARY TABLE partners_relations_backup(
  `id` INTEGER,
  `partner_id` INTEGER,
  `parent_partner_id` INTEGER
  );
INSERT INTO partners_relations_backup SELECT
  `id`,
  `partner_id`,
  `parent_partner_id`
  FROM partners_relations;
DROP TABLE partners_relations;
CREATE TABLE "partners_relations" (
  `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  `partner_id` INTEGER NOT NULL,
  `parent_partner_id` INTEGER NOT NULL,
  FOREIGN KEY(`parent_partner_id`) REFERENCES `partners`(`id`),
  FOREIGN KEY(`partner_id`) REFERENCES `partners`(`id`)
  );
INSERT INTO partners_relations SELECT
  `id`,
  `partner_id`,
  `parent_partner_id`
   FROM partners_relations_backup;
DROP TABLE partners_relations_backup;
COMMIT;