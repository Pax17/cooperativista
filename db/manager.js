const {app} = require('electron');
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
     * Cerrar período contable:
     * A cerrar el período contable (Anual) se mueve la base de datos "cooperativista.db" => "cooperativista-${año}.db" y se
     * recrea la base de datos mediante el script cooperativista.sql.
     * Después de crear la nueva base para el nuevo período es necesario migrar el padrón de datos.
     * 1) Usuarios: tablas entities -> base_user_roles -> base_users (en ese orden)
     *              - Preguntar al usuario si se migran usuarios desactivados (si existen)
     * 2) Partners (asociados):
     *              - Orden de tablas: partner_types -> partner_types_relations -> partners -> partner_relations
     *              - En este caso hay que ver la forma de "promover" de nivel a los asociados del tipo "alumno" y "egresar"
     *              a los que estén en el último año. Opción de hacerlo automático o manual.
     * 3) Tipos de Ingreso, Gastos, Pagos, etc...
     *              - receipts_grand_types -> receipts_types
     *              - expense_grand_types -> expense_types
     *              - payments_grand_types -> payments_types
     *
     */
    /**
     *
     */
    copyDbToHistory: function () {
        const db = new sqlite(dbLocation);
        const stmt = db.prepare('SELECT value FROM helper_attr WHERE taxonomy = ?');
        const year = stmt.get('period_name');
        const date = new Date;
        db.close();
        let file = `cooperativista-${year.value}-${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}${date.getHours().toString().padStart(2, '0')}${date.getMinutes().toString().padStart(2, '0')}${date.getSeconds().toString().padStart(2, '0')}.db`;
        let dest = path.join(app.getPath('userData'), 'db', file);
        console.log('Destino-------------->', file);
        if (fs.existsSync(dbLocation)) {
            fs.copyFileSync(dbLocation, dest);
            console.log('Copiando a -------------->', file);
            fs.unlinkSync(dbLocation);
            console.log('UNLINK??? -------------->', dbLocation, fs.existsSync(dbLocation));
            return dest;
        } else {
            throw "No existe la base de datos a copiar";
        }
    },
    restoreDbFromBkp: function (bkp) {
        if (fs.existsSync(dbLocation)) fs.unlinkSync(dbLocation);
        fs.copyFileSync(bkp, dbLocation);
    },

    recreateDb: function () {
        console.log('Existe ??? -------------->', dbLocation, fs.existsSync(dbLocation));
        let db = new sqlite(dbLocation);
        console.log('Existe ??? -------------->', path.join(__dirname, 'cooperativista.sql'));
        const migration = fs.readFileSync(path.join(__dirname, 'cooperativista.sql'), 'utf8');
        db.exec(migration);
        return db;
    },

    /**
     *
     * @param {string} table
     * @param {string} where
     * @param {sqlite} dbSrc
     * @param {sqlite} dbDest
     */
    migrateTableData: function (table, where, dbSrc, dbDest) {
        const sqlInfo = dbSrc.pragma(`table_info('${table}');`);
        let colnames = [];
        let pk = null;
        for (const col of sqlInfo) {
            colnames.push(col.name);
            if (parseInt(col.pk) === 1)
                pk = col.name;
        }
        where = where || '';
        let select = `SELECT ${colnames.join(', ')} FROM ${table} ${where}`.trim();
        let insert = `INSERT INTO ${table} (${colnames.join(', ')}) VALUES (@${colnames.join(', @')})`;
        //const update = () => `UPDATE ${table} SET ${setter} WHERE ${filter}`;
        //`UPDATE ${table} SET ${setter} WHERE ${filter}`;
        console.log('READ FROM ---------------> ', select);
        console.log('INSERT TO ---------------> ', insert);

        const read = dbSrc.prepare(select);
        const data = read.all();
        if (table === 'helper_attr') {
            let date = new Date();
            for (let datum of data) {
                if (datum.taxonomy === 'period_name') datum.value = date.getFullYear();
                if (datum.taxonomy === 'period_start') datum.value = `${date.getFullYear()}-01-01`;
                if (datum.taxonomy === 'period_end') datum.value = `${date.getFullYear()}-12-31`;
            }

            console.log('INSERT TO helper_attr---------------> ', data);
        }
        const push = dbDest.prepare(insert);
        const me = this;
        const doTheJob = dbDest.transaction((rows) => {
            if (rows.length > 0)
                for (const row of rows) {
                    console.log(`PUSH IN ${table}`, row);
                    push.run(row);
                }
        });
        doTheJob(data);

        //cerrar las conexiones a db desde la función que llama  a esta
    },
    /**
     *
     * @param args
     * @param mainWindow BrowserWindow
     * @returns {*}
     */
    startMigraion: function (args, mainWindow) {

        let whereUsers;
        let year;
        if ('excludeInactiveUsers' in args) {
            whereUsers = ' WHERE status = 1';
        }
        let paso = 1;
        let steps = 17;
        console.log(this);
        mainWindow.webContents.send('migration-status', {
            message: 'Iniciando backup de datos...',
            step: paso++,
            total: steps,
            ended: false
        });
        let srcDb = this.copyDbToHistory();
        const dbSrc = new sqlite(srcDb);
        mainWindow.webContents.send('migration-status', {
            message: 'Recreando base de datos...',
            step: paso++,
            total: steps,
            ended: false
        });
        const dbDest = this.recreateDb();// new sqlite(dbLocation);
        //iniciar pasos de migración
        const migration = dbDest.transaction(() => {
            try {
                mainWindow.webContents.send('migration-status', {
                    message: 'Migrando datos de entorno...',
                    step: paso++,
                    total: steps,
                    ended: false
                });
                this.migrateTableData('helper_attr', '', dbSrc, dbDest);
                //attr
                // migrateTableData('helper_attr', '', dbSrc, dbDest); no, dejamos que se creee con los nuevos valores por defecto
                //entidad
                mainWindow.webContents.send('migration-status', {
                    message: 'Migrando datos de la entidad...',
                    step: paso++,
                    total: steps,
                    ended: false
                });
                this.migrateTableData('entities', '', dbSrc, dbDest);
                //roles
                mainWindow.webContents.send('migration-status', {
                    message: 'Migrando datos de usuarios...',
                    step: paso++,
                    total: steps,
                    ended: false
                });
                this.migrateTableData('base_user_roles', '', dbSrc, dbDest);
                //usuarios
                mainWindow.webContents.send('migration-status', {
                    message: 'Migrando datos de usuarios...',
                    step: paso++,
                    total: steps,
                    ended: false
                });
                this.migrateTableData('base_users', whereUsers, dbSrc, dbDest);
                //asociados tipos
                mainWindow.webContents.send('migration-status', {
                    message: 'Migrando datos de asociados...',
                    step: paso++,
                    total: steps,
                    ended: false
                });
                this.migrateTableData('partner_types', '', dbSrc, dbDest);
                //asociados tipos de relacion
                mainWindow.webContents.send('migration-status', {
                    message: 'Migrando datos de asociados...',
                    step: paso++,
                    total: steps,
                    ended: false
                });
                this.migrateTableData('partner_types_relations', '', dbSrc, dbDest);
                // solo alumnos sin egresar!
                let wherePartners = ` WHERE IFNULL(attribute_5,'') = CASE WHEN partner_type_id=2 THEN '' ELSE IFNULL(attribute_5,'') END`
                //asociados
                mainWindow.webContents.send('migration-status', {
                    message: 'Migrando datos de asociados...',
                    step: paso++,
                    total: steps,
                    ended: false
                });
                this.migrateTableData('partners', wherePartners, dbSrc, dbDest);
                mainWindow.webContents.send('migration-status', {
                    message: 'Migrando datos de asociados...',
                    step: paso++,
                    total: steps,
                    ended: false
                });
                this.migrateTableData('partners_relations', '', dbSrc, dbDest);
                //receipts!
                mainWindow.webContents.send('migration-status', {
                    message: 'Migrando datos de recibos...',
                    step: paso++,
                    total: steps,
                    ended: false
                });
                this.migrateTableData('receipt_grand_types', '', dbSrc, dbDest);
                mainWindow.webContents.send('migration-status', {
                    message: 'Migrando datos de recibos...',
                    step: paso++,
                    total: steps,
                    ended: false
                });
                this.migrateTableData('receipt_types', '', dbSrc, dbDest);
                //receipts!
                mainWindow.webContents.send('migration-status', {
                    message: 'Migrando datos de gastos...',
                    step: paso++,
                    total: steps,
                    ended: false
                });
                this.migrateTableData('expense_grand_types', '', dbSrc, dbDest);
                mainWindow.webContents.send('migration-status', {
                    message: 'Migrando datos de gastos...',
                    step: paso++,
                    total: steps,
                    ended: false
                });
                this.migrateTableData('expense_types', '', dbSrc, dbDest);
                //receipts!
                mainWindow.webContents.send('migration-status', {
                    message: 'Migrando datos de entorno...',
                    step: paso++,
                    total: steps,
                    ended: false
                });
                this.migrateTableData('payment_grand_types', '', dbSrc, dbDest);
                mainWindow.webContents.send('migration-status', {
                    message: 'Migrando datos de entorno...',
                    step: paso++,
                    total: steps,
                    ended: false
                });
                this.migrateTableData('payment_types', '', dbSrc, dbDest);

                //todo: necesitamos xtraer y hcer updtes a valores configurados, ej en helper_attr default_fee_amount y default_monthly_fee_concept
                //SELECT value FROM helper_attr WHERE taxonomy = 'default_fee_amount'
                //SELECT value FROM helper_attr WHERE taxonomy = 'default_monthly_fee_concept'

                console.log('FINALIZAMOS MIGRACIÓN')
                mainWindow.webContents.send('migration-status', {
                    message: 'Finalizado',
                    step: paso++,
                    total: steps,
                    ended: true
                });
                return true;
            } catch (err) {
                console.log(err);
                this.restoreDbFromBkp(srcDb)
                return err;
            }
        });
        return migration();
    },
    doUpdate: function (args, table, filterFields, preProcessParam, dbs) {
        let tranasction = true;
        if (!dbs) {
            dbs = new sqlite(dbLocation, {fileMustExist: true});
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
            return console.error('Faltan parámetros');
        }
        for (let param of Object.keys(params)) {
            passParams[param] = (preProcessParam !== null && typeof preProcessParam === 'object' && preProcessParam.hasOwnProperty(param)) && helpers.hasOwnProperty(preProcessParam[param]) ? helpers[preProcessParam[param]](params[param]) : params[param];

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
            try {
                stmt.run(passParams);
                console.log('UPDATED! to the cooperativista database.');
                dbs.close();
                return true;

            } catch (err) {
                console.error('UPDATEDERRRRR', err, passParams);
                dbs.close();
                return false;
            }

        }

    }


    //desde el renderer iniciams migraciones
    /*
        ipcMain.on('start-db-migration', (event, arg) => {
        });*/
}