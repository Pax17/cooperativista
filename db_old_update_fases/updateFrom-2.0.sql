BEGIN TRANSACTION;
DROP VIEW students;

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

           COMMIT;
