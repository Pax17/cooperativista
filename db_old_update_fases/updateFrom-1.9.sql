BEGIN TRANSACTION;
DROP TABLE payment_types;
CREATE TABLE IF NOT EXISTS `payment_grand_types` (
	`id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	`payment_code`	TEXT NOT NULL UNIQUE,
	`payment_grand_type_description`	BLOB
);
INSERT INTO `payment_grand_types` VALUES (1,'E1','Efectivo');
INSERT INTO `payment_grand_types` VALUES (2,'CH1','Cheques');
INSERT INTO `payment_grand_types` VALUES (3,'T1','Transferencias');
INSERT INTO `payment_grand_types` VALUES (4,'D1','Depósitos');
INSERT INTO `payment_grand_types` VALUES (5,'I1','Pagos x Internet');

CREATE TABLE IF NOT EXISTS `payment_types` (
	`id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	`payment_description`	TEXT NOT NULL,
	`payment_code`	TEXT NOT NULL,
	`status`	INTEGER NOT NULL DEFAULT 1,
	FOREIGN KEY(`payment_code`) REFERENCES `payment_grand_types`(`payment_code`)
);
INSERT INTO `payment_types` VALUES (1,'Efectivo','E1',1);
INSERT INTO `payment_types` VALUES (2,'Cheque a Depositar','CH1',1);
INSERT INTO `payment_types` VALUES (3,'Transferencia Bancaria','T1',1);
INSERT INTO `payment_types` VALUES (4,'Cheque Otros','CH1',1);
COMMIT;
