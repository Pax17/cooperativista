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
INSERT INTO `helper_attr`(`taxonomy`,`value` ) VALUES ('period_name', strftime('%Y', 'now'));
INSERT INTO `helper_attr`(`taxonomy`,`value` ) VALUES ('period_start', date('now', 'start of year'));
INSERT INTO `helper_attr`(`taxonomy`,`value` ) VALUES ('period_end', date('now', 'start of year', '+12 month', '-1 day'));
INSERT INTO `helper_attr`(`taxonomy`,`value` ) VALUES ('default_due_amount', '150');

COMMIT;
