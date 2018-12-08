const { app } = require('electron');
const fs = require('fs');
const path = require('path');
//const config = require(path.join(__dirname, '../package.json'));
const settings = require('electron-settings');
const dbLocation = path.join(app.getPath('userData'), 'db', 'cooperativista.db');
//const extDir = (process.argv[process.argv.length - 1] === 'plain') ? 'client' : 'client_built';
//const bcrypt = require('bcryptjs');
const sqlite = require('better-sqlite3');
//const i18n = new (require('./translations/i18n'));
module.exports = {
    /**
     *
     * @type {{hashParamValue: function(*=)}}
     */
    helpers: {
        hashParamValue: (value) => {
            return bcrypt.hashSync(value, bcrypt.genSaltSync(10));
        },
        nullEmptyParamValue: (value) => {
            return (!value || value.length === 0) ? null : value;
        },
        asInt: (value) => {
            return (isNaN(value)) ? null : parseInt(value);
        },
        asDecimal: (value) => {
            return (isNaN(value)) ? null : parseFloat(value);
        }
    },

    doInsert: function (event, args, table, preProcessParam, dbs) {
        let tranasction = true;
        if (!dbs) {
            dbs = new sqlite(dbLocation, { fileMustExist: true });
            tranasction = false;
        }
        console.log('**** Insert is transaction?', tranasction)

        let fieldsArr = [],
            valuesArr = [],
            // table = 'base_users',
            fields = '',
            values = '',
            passParams = {},
            sql = () => `INSERT INTO ${table}(${fields}) VALUES (${values})`,
            select = () => `SELECT * FROM  ${table} WHERE id=last_insert_rowid()`;


        for (let param of Object.keys(args)) {
            passParams[param] = (preProcessParam !== null && typeof preProcessParam === 'object' && preProcessParam.hasOwnProperty(param)) ? this.helpers[preProcessParam[param]](args[param]) : args[param];
            passParams[param] = args[param];
            fieldsArr.push(`${param}`);
            valuesArr.push(`$${param}`)
            //  console.log(passParams, fieldsArr, valuesArr);
        }
        fields = fieldsArr.join(', ');
        values = valuesArr.join(', ');
        console.log('INSERT! to the cooperativista database.', sql());
        let stmt = dbs.prepare(sql());
        if (tranasction) {
            return {
                stmt: stmt,
                params: passParams
            };
        } else {
            let out = {}
            try {
                stmt.run(passParams);
                console.log('INSERT! to the cooperativista database.');
                let lastId = dbs.prepare(select())
                out = {
                    success: true,
                    data: lastId.get()
                }
                if (event)
                    event.returnValue = out

            } catch (err) {
                console.log('INSERTTTTT', err, passParams);
                out = {
                    success: false,
                    sql: sql(),
                    err: err,
                    args: args,
                    passParams: passParams
                }
            }
            if (event)
                event.returnValue = out
            dbs.close();
            return out;
        }
    },

    doUpdate: function (event, args, table, filterFields, preProcessParam, dbs) {
        let tranasction = true;
        if (!dbs) {
            dbs = new sqlite(dbLocation, { fileMustExist: true });
            tranasction = false;
        }
        let params = args,
            filters = [],
            filter = '',
            setters = [],
            setter = '',
            //  table = 'base_users',
            passParams = {},
            sql = () => `UPDATE ${table} SET ${setter} WHERE ${filter}`;
        //<debug>
        console.debug(args, params, table, filterFields, preProcessParam);
        //</debug>
        if (!Array.isArray(filterFields) || filterFields.length === 0) {
            if (event)
                event.returnValue = {
                    success: false,
                    sql: sql(),
                    err: 'Faltan parámetros',
                    args: args,
                    passParams: passParams
                };
            return console.error('Faltan parámetros');
        }
        for (let param of Object.keys(params)) {
            passParams[param] = (preProcessParam !== null && typeof preProcessParam === 'object' && preProcessParam.hasOwnProperty(param)) && this.helpers.hasOwnProperty(preProcessParam[param]) ? this.helpers[preProcessParam[param]](params[param]) : params[param];

            if (filterFields.includes(param)) {
                filters.push(`${param}=$${param}`)
            } else {
                setters.push(`${param}=$${param}`)
            }
        }
        console.log('------->', filters, setters, passParams)
        //return;
        filter = filters.join(' AND ');
        setter = setters.join(', ');
        console.log(sql());
        if (setters.length === 0 || filters.length === 0) {
            let err = 'No se enviaron parámetros necesarios para generar el proceso';
            if (event)
                event.returnValue = {
                    success: false,
                    sql: sql(),
                    err: err,
                    args: args,
                    passParams: passParams
                };
            return console.error(err);
        }
        console.log('UPDATING! to the cooperativista database.', 'is transaction???', tranasction);
        let stmt = dbs.prepare(sql());
        console.log('UPDATED IN TRANSACTION! to the cooperativista database.');
        if (tranasction) {
            return {
                stmt: stmt,
                params: passParams
            };
        } else {
            let out;
            try {
                stmt.run(passParams);
                console.log('UPDATED! to the cooperativista database.');
                out = {
                    success: true
                }

            } catch (err) {
                console.log('UPDATEDERRRRR', err, passParams);
                out = {
                    success: false,
                    sql: sql(),
                    err: err,
                    args: args,
                    passParams: passParams
                }
            }
            dbs.close()
            if (event)
                event.returnValue = out
            return out;
        }

    },

    doRead: function (table, colnames, filterFields, preProcessParam, result, db) {

        if (!db) {
            db = new sqlite(dbLocation, { fileMustExist: true });
        }

        let cols = Array.isArray(colnames) && colnames.length > 0 ? colnames.join(', ') : ' * ',
            filters = [], where = '',
            passParams = {};

        for (let param of Object.keys(filterFields)) {

            console.log(param, preProcessParam, typeof preProcessParam === 'object')

            passParams[param] = (preProcessParam !== null && typeof preProcessParam === 'object' && preProcessParam.hasOwnProperty(param)) && this.helpers.hasOwnProperty(preProcessParam[param]) ? this.helpers[preProcessParam[param]](filterFields[param]) : filterFields[param];
            filters.push(`${param}=$${param}`)
        }
        if (filters.length > 0) where = `WHERE ${filters.join(' AND ')}`;
        let select = `SELECT ${cols} FROM ${table} ${where}`.trim();
        console.log(select, passParams)
        let stmt = db.prepare(select, result);
        if (result === 'all') return stmt.all(passParams);
        return stmt.get(passParams);

    }
}