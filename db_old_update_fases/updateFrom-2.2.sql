BEGIN TRANSACTION;


INSERT INTO `helper_attr`(`taxonomy`,`value` ) VALUES ('default_monthly_fee_concept', '1');
UPDATE `helper_attr` SET `taxonomy` = 'default_fee_amount' WHERE  `taxonomy` = 'default_due_amount';

COMMIT;
