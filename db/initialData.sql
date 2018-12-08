BEGIN TRANSACTION;

INSERT INTO `helper_attr`(`taxonomy`,`value` ) VALUES ('period_name', strftime('%Y', 'now'));
INSERT INTO `helper_attr`(`taxonomy`,`value` ) VALUES ('period_start', date('now', 'start of year'));
INSERT INTO `helper_attr`(`taxonomy`,`value` ) VALUES ('period_end', date('now', 'start of year', '+12 month', '-1 day'));
INSERT INTO `helper_attr`(`taxonomy`,`value` ) VALUES ('default_fee_amount', '10');
INSERT INTO `helper_attr`(`taxonomy`,`value` ) VALUES ('default_monthly_fee_concept', '1');

INSERT INTO `entities` VALUES (1,'Cooperadora',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1);

INSERT INTO `base_user_roles` VALUES (1,'Administradores',0);

INSERT INTO `base_users` VALUES (1,'admin','Administrador','',1,1,NULL,1,NULL,NULL,NULL,NULL,NULL);

INSERT INTO `receipt_grand_types` VALUES (1,'M1','Mensuales');
INSERT INTO `receipt_grand_types` VALUES (2,'A1','Anuales');
INSERT INTO `receipt_grand_types` VALUES (3,'E1','Eventuales');

INSERT INTO `receipt_types` VALUES (1,'Cuota','M1',1);
INSERT INTO `receipt_types` VALUES (2,'Donación','E1',1);
INSERT INTO `receipt_types` VALUES (3,'Evento','E1',1);
INSERT INTO `receipt_types` VALUES (4,'Rifa','E1',1);
INSERT INTO `receipt_types` VALUES (5,'Subsidio','A1',1);

INSERT INTO `payment_grand_types` VALUES (1,'E1','Efectivo');
INSERT INTO `payment_grand_types` VALUES (2,'CH1','Cheques');
INSERT INTO `payment_grand_types` VALUES (3,'T1','Transferencias');
INSERT INTO `payment_grand_types` VALUES (4,'D1','Depósitos');
INSERT INTO `payment_grand_types` VALUES (5,'I1','Pagos x Internet');

INSERT INTO `payment_types` VALUES (1,'Efectivo','E1',1);
INSERT INTO `payment_types` VALUES (2,'Cheque a Depositar','CH1',1);
INSERT INTO `payment_types` VALUES (3,'Transferencia Bancaria','T1',1);
INSERT INTO `payment_types` VALUES (4,'Cheque Otros','CH1',1);

INSERT INTO `partner_types` VALUES (1,'Cursos','C1',1);
INSERT INTO `partner_types` VALUES (2,'Alumnos','A1',1);
INSERT INTO `partner_types` VALUES (3,'Familias','F1',1);
INSERT INTO `partner_types` VALUES (4,'Donantes','D1',1);
INSERT INTO `partner_types` VALUES (5,'Proveedores','P1',1);

INSERT INTO `partner_types_relations` VALUES (1,2,1);
INSERT INTO `partner_types_relations` VALUES (2,2,3);

INSERT INTO `expense_grand_types` VALUES (1,'SA1','Servicios Alimentarios');
INSERT INTO `expense_grand_types` VALUES (2,'GA1','Gastos Alumno');
INSERT INTO `expense_grand_types` VALUES (3,'GE1','Gastos para la Escuela');
INSERT INTO `expense_grand_types` VALUES (4,'GP1','Gastos Propios');

INSERT INTO `expense_types` VALUES (2,'Comestibles','SA1',1);
INSERT INTO `expense_types` VALUES (3,'Art. limpieza','SA1',1);
INSERT INTO `expense_types` VALUES (4,'Combustibles','SA1',1);
INSERT INTO `expense_types` VALUES (5,'Gastos Serv. Alimentario','SA1',1);
INSERT INTO `expense_types` VALUES (6,'Ropa y calzado','GA1',1);
INSERT INTO `expense_types` VALUES (7,'Libros y útiles','GA1',1);
INSERT INTO `expense_types` VALUES (8,'Excursiones','GA1',1);
INSERT INTO `expense_types` VALUES (9,'Emergencias Sanitarias','GA1',1);
INSERT INTO `expense_types` VALUES (10,'Premios, Medallas, etc','GA1',1);
INSERT INTO `expense_types` VALUES (11,'Material didáctico','GE1',1);
INSERT INTO `expense_types` VALUES (12,'Mantenimiento y mejoras de edificio por Subsidio','GE1',1);
INSERT INTO `expense_types` VALUES (13,'Artículos de limpieza','GE1',1);
INSERT INTO `expense_types` VALUES (14,'Mantenimiento y Obras con fondos propios','GE1',1);
INSERT INTO `expense_types` VALUES (15,'Combustible y calefacción','GE1',1);
INSERT INTO `expense_types` VALUES (16,'Librería','GE1',1);
INSERT INTO `expense_types` VALUES (17,'Mobiliario','GE1',1);
INSERT INTO `expense_types` VALUES (18,'Organización de rifas','GP1',1);
INSERT INTO `expense_types` VALUES (19,'Organización de Festivales','GP1',1);

COMMIT;