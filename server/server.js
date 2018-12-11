//https://www.npmjs.com/package/excel4node PARA EXPORTAR A EXCEl

module.exports = () => {
    const electron = require('electron')
    const {Router, MiniRouter} = require('electron-routes');
    //const express = require('express');
    const fs = require('fs');
    const app = require('electron').app
    const path = require('path')
    const config = JSON.parse(fs.readFileSync(path.join(app.getAppPath(), 'package.json'), 'utf8'));
    //  const sqlite3 = require('sqlite3');
    const sqlite = require('better-sqlite3');
    const dbLocation = path.join(electron.app.getPath('userData'), 'db', 'cooperativista.db');
    const url = require('url');
    // define custom mrf:// protocol
    const web = new Router('mrf');
    const rest = new Router('sqlite');
    // const sRest = new MiniRouter();
    let where = '';
    const reader = require('feed-reader');
    const apis = [
        {
            api: 'entities',
            type: 'load',
            sql: () => `SELECT e.id,  e.name, e.name_2, e.name_3,  e.attribute_1, e.attribute_2, e.attribute_3, e.attribute_4, e.attribute_5, e.is_default FROM entities e ${where}`,
            params: [
                {
                    name: 'isDefault',
                    operator: '=',
                    field: 'e.isDefault'
                },

                {
                    name: 'defaultEntity',
                    operator: '=',
                    field: 'e.id'
                }
            ]
        },
        {
            api: 'users',
            type: 'load',
            removeNoCache: true,
            sql: () => `SELECT bu.id, bu.alias, bu.name, bu.last_name, bu.entity_id, bu.role_id, bu.status, bu.attribute_1, bu.attribute_2, bu.attribute_3, bu.attribute_4, bu.attribute_5, bur.role_description, e.name as entidad FROM base_users bu INNER JOIN base_user_roles bur on bur.id = bu.role_id INNER JOIN entities e on bu.entity_id = e.id ${where}`,
            params: [
                {
                    name: 'status',
                    operator: '=',
                    field: 'bu.status'
                }
            ]
        },
        {

            api: 'partner_types',
            type: 'load',
            sql: () => `SELECT pt.id, pt.type_description, pt.type_code FROM partner_types pt`
        },
        {

            api: 'roles',
            type: 'load',
            sql: () => `SELECT bur.id, bur.role_description, bur.role_unique FROM  base_user_roles bur`
        },
        {

            api: 'partners',
            type: 'load',
            sql: () => `SELECT p.id, p.name, p.name_2, p.name_3, p.attribute_1, p.attribute_2, p.attribute_3, p.attribute_4, p.attribute_5, p.partner_type_id, p.entity_id, pt.type_description, pt.type_code
FROM partners p 
INNER JOIN partner_types pt on p.partner_type_id = pt.id  ${where}`,
            params: [
                {
                    name: 'entity_id',
                    operator: '=',
                    field: 'p.entity_id'
                }
            ]
        },
        {

            api: 'students',
            type: 'load',
            sql: () => `SELECT
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
FROM
	students ${where}`,
            params: [
                {
                    name: 'entity_id',
                    operator: '=',
                    field: 'entity_id'
                }
            ]
        },
        {

            api: 'courses',
            type: 'load',
            sql: () => `SELECT
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
	type_code
FROM
	courses ${where}`,
            params: [
                {
                    name: 'entity_id',
                    operator: '=',
                    field: 'entity_id'
                }
            ]
        },
        {

            api: 'donators',
            type: 'load',
            sql: () => `SELECT
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
	type_code
FROM
	donators ${where}`,
            params: [
                {
                    name: 'entity_id',
                    operator: '=',
                    field: 'entity_id'
                }
            ]
        },
        {

            api: 'suppliers',
            type: 'load',
            sql: () => `SELECT
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
	type_code
FROM
	suppliers ${where}`,
            params: [
                {
                    name: 'entity_id',
                    operator: '=',
                    field: 'entity_id'
                }
            ]
        },
        {

            api: 'receipts',
            type: 'load',
            sql: () => `SELECT
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
	name,
	name_2,
	name_3,
	attribute_1,
	attribute_2,
	attribute_3,
	attribute_4,
	attribute_5,
	type_description,
	type_code,
    payment_description,
    payment_code,
    receipt_description,
    receipt_code,
    receipt_number,
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
FROM
	receipts_all ${where}`,
            params: [
                {
                    name: 'entity_id',
                    operator: '=',
                    field: 'entity_id'
                },
                {
                    name: 'receipt_date_start',
                    operator: '>=',
                    field: 'receipt_date'
                },
                {
                    name: 'receipt_date_end',
                    operator: '<=',
                    field: 'receipt_date'
                },
                {
                    name: 'receipt_period_start',
                    operator: '>=',
                    field: 'receipt_period_start'
                },
                {
                    name: 'receipt_period_end',
                    operator: '<=',
                    field: 'receipt_period_end'
                }
                /*
	receipt_date,
	receipt_period_start,
	receipt_period_end,*/
            ]
        },
        {

            api: 'receipt_types',
            type: 'load',
            sql: () => `SELECT rt.id, rt.receipt_description, rt.receipt_code, rt.status FROM receipt_types rt`
        },
        {

            api: 'receipt_types_full',
            type: 'load',
            sql: () => `SELECT rt.id, rt.receipt_description, rt.receipt_code, pgt.receipt_grand_type_description, rt.status FROM receipt_types rt INNER JOIN receipt_grand_types pgt ON rt.receipt_code=pgt.receipt_code `
        },
        {

            api: 'receipt_grand_types',
            type: 'load',
            sql: () => `SELECT rgt.id, rgt.receipt_grand_type_description, rgt.receipt_code FROM receipt_grand_types rgt`
        },
        {

            api: 'payment_types',
            type: 'load',
            sql: () => `SELECT pt.id, pt.payment_description, pt.payment_code, pt.status FROM payment_types pt`
        },
        {

            api: 'payment_grand_types',
            type: 'load',
            sql: () => `SELECT pgt.id, pgt.payment_grand_type_description, pgt.payment_code FROM payment_grand_types pgt`
        },
        {

            api: 'payment_types_full',
            type: 'load',
            sql: () => `SELECT pt.id, pt.payment_description, pt.payment_code, pgt.payment_grand_type_description, pt.status FROM payment_types pt INNER JOIN payment_grand_types pgt ON pt.payment_code=pgt.payment_code `
        },
        {
            api: 'expenses',
            type: 'load',
            sql: () => `SELECT
	e.id,
	e.expense_type_id,
	e.payment_type_id,
	e.partner_id,
	e.expense_date,
	e.expense_period_start,
	e.expense_period_end,
	e.amount,
	e.currency,
	e.notes,
	e.entity_id,
	e.base_user_id,
	e.printed,
	pt.payment_description,
	pt.payment_code,
	et.expense_description,
	et.expense_code,
	egt.expense_grand_type_description,
	p.name,
	p.name_2,
	p.name_3
FROM
	expenses e
	INNER JOIN partners p ON e.partner_id = p.id
	INNER JOIN expense_types et ON e.expense_type_id = et.id
	INNER JOIN expense_grand_types egt ON et.expense_code= egt.expense_code
	INNER JOIN payment_types pt ON e.payment_type_id = pt.id  ${where}`,
            params: [
                {
                    name: 'entity_id',
                    operator: '=',
                    field: 'entity_id'
                },
                {
                    name: 'expense_date_start',
                    operator: '>=',
                    field: 'expense_date'
                },
                {
                    name: 'expense_date_end',
                    operator: '<=',
                    field: 'expense_date'
                },
                {
                    name: 'expense_period_start',
                    operator: '>=',
                    field: 'expense_period_start'
                },
                {
                    name: 'expense_period_end',
                    operator: '<=',
                    field: 'expense_period_end'
                }
                /*
	receipt_date,
	receipt_period_start,
	receipt_period_end,*/
            ]
        },
        {

            api: 'expense_types',
            type: 'load',
            sql: () => `SELECT et.id, et.expense_description, et.expense_code, et.status FROM expense_types et`
        },
        {

            api: 'expense_types_full',
            type: 'load',
            sql: () => `SELECT et.id, et.expense_description, et.expense_code, egt.expense_grand_type_description, et.status FROM expense_types et INNER JOIN expense_grand_types egt ON et.expense_code=egt.expense_code `
        },
        {

            api: 'expense_grand_types',
            type: 'load',
            sql: () => `SELECT egt.id, egt.expense_grand_type_description, egt.expense_code FROM expense_grand_types egt`
        }
    ]

    console.log('SERVER API INIT', url);
    for (let i = 0; i < apis.length; i++) {
        let api = apis[i], apiDef,
            params = [],
            baseParams = ['_dc=:_dc', 'page=:page', 'start=:start', 'limit=:limit'],
            baseParamsNoCached = ['page=:page', 'start=:start', 'limit=:limit'];

        /*  if ('params' in api && api.params.length > 0) {
              for (let j = 0; j < api.params.length; j++) {
                  let param = api.params[j];
                  params.push(`${param.name}=:${param.name}`)
              }
          }*/
        //por el mometno no agregamos los parámetros ya que hay que ver la forma de que coincida el orden con los enviados en cada reuqest del proxy de sencha
        apiDef = api.api + '_load/?' + (('removeNoCache' in api && api.removeNoCache === true) ? baseParamsNoCached : baseParams).join('&');
        //console.debug('\n\nINICIO API:', apiDef, '\n\n');
        //console.debug('PRE Parámetros!', apiDef, '|<-\n\n');
        try {
            if (api.type === 'load') {
                rest.get(apiDef, (req, res) => {
                    where = ''
                    let wheres = [], values = [], sql,
                        uriParams = req.url.substring(req.url.indexOf('?'));
                    if (uriParams.length < req.url.length) {
                        uriParams = uriParams.split('&')
                        if ('params' in api && api.params.length > 0)
                            for (let uriParam of uriParams) {
                                let paramParts = uriParam.split('=')
                                for (let param of api.params) {
                                    if (param.name === paramParts[0]) {
                                        let value = {}
                                        wheres.push(`${param.field}${param.operator}$${param.name}`);
                                        values.push(value[param.name] = paramParts[1]);
                                    }
                                }
                            }
                        if (wheres.length > 0) {
                            where = `WHERE ${wheres.join(' AND ')}`
                        }
                    } else {
                        uriParams = []
                    }
                    sql = api.sql();
                    //console.log('where', where, '\n\n');
                    //console.log('sql', sql, '\n\n');
                    const db = new sqlite(dbLocation, {fileMustExist: true});
                    let stmt = db.prepare(sql);
                    let rows = stmt.all(values);
                    const start = req.params.start < rows.length ? req.params.start : 0;
                    const end = req.params.limit * req.params.page;
                    const limit = end > rows.length ? rows.length : end;
                    const subset = rows.slice(start, end);
                    res.json({
                        success: true,
                        data: rows,
                        total: rows.length,
                        message: sql
                    });
                    db.close();
                });
            }
        } catch (err) {
            //<debug>
            console.log(err);
            //</debug>

            res.json({
                success: false,
                error: err,
                total: 0,
                sql: sql
            });
        }
    }

    //<debug>
    console.log('server rest action', rest);
    //</debug>

    rest.post('users_add', (req, res, next) => {
        //<debug>
        // console.log('server rest action', '\narg1\n', req, '\narg2\n', res);
        console.log('\nREQ\n', req.params, '\nAPI\n');
        //</debug>
        if (req.uploadData.lenght > 0) {
            console.log('\n\n\nserver restDATA', req, req.uploadData[0].json(), '\n\n\n\n\n')
        }
        res.json({success: true})
    })

    web.get('pax17-rss', (req, res) => {
        let feedUrl = "https://pax17.github.io/cooperativista/feed.xml";
        reader.parse(feedUrl).then((feed) => {
            console.log(feed);
            res.json({
                data: feed,
                success: true
            })
                .catch((err) => {
                    res.json({
                        error: err,
                        success: false
                    });
                    console.error(err);
                });

        }).catch((err) => {
            res.json({
                error: err,
                success: false
            });
            console.error(err);
        }).finally(() => {
            console.log('Everything done');
        });
    });

}