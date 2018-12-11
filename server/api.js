module.exports = () => {
    const { ipcMain, app, dialog, nativeImage } = require('electron');
    const path = require('path');
    const dbLocation = path.join(app.getPath('userData'), 'db', 'cooperativista.db');
    const sqlite = require('better-sqlite3');
   // const bcrypt = require('bcryptjs');
    const appPath = require('electron').app.getAppPath();
    const i18n = new (require(path.resolve(appPath, './translations/i18n')));
    const dbHelper = require(path.resolve(appPath, './db/helper'));
    /**
     * API para  partners
     */
    ipcMain.on('update-partner', (event, args) => {

        dbHelper.doUpdate(event, args, 'partners', ['id'], {
            'attribute_1': 'nullEmptyParamValue',
            'attribute_2': 'nullEmptyParamValue',
            'attribute_3': 'nullEmptyParamValue',
            'attribute_4': 'nullEmptyParamValue',
            'attribute_5': 'nullEmptyParamValue'
        });
    });
    ipcMain.on('update-student', (event, args) => {
        const dbs = new sqlite(dbLocation, { fileMustExist: true });
        const transUpdate = dbs.transaction(() => {

            if ('partners' in args) {

                if (Array.isArray(args.partners)) {
                    for (let partnerData of args.partners) {
                        console.log(partnerData)


                        let partner = dbHelper.doUpdate(event, partnerData, 'partners', ['id'], {
                            'attribute_1': 'nullEmptyParamValue',
                            'attribute_2': 'nullEmptyParamValue',
                            'attribute_3': 'nullEmptyParamValue',
                            'attribute_4': 'nullEmptyParamValue',
                            'attribute_5': 'nullEmptyParamValue'
                        }, dbs);
                        console.log('partner', partnerData, partner.stmt);
                        partner.stmt.run(partnerData);
                        console.log(partner);
                    }

                } else {
                    let partner = dbHelper.doUpdate(event, args.partners, 'partners', ['id'], {
                        'attribute_1': 'nullEmptyParamValue',
                        'attribute_2': 'nullEmptyParamValue',
                        'attribute_3': 'nullEmptyParamValue',
                        'attribute_4': 'nullEmptyParamValue',
                        'attribute_5': 'nullEmptyParamValue'
                    }, dbs);
                    partner.stmt.run(args.partners);
                    console.log(partner);
                }
            }
            if ('partners_relations' in args) {
                if (Array.isArray(args.partners_relations)) {
                    for (let partnersRelation of args.partners_relations) {
                        let partners_relations = dbHelper.doUpdate(event, partnersRelation, 'partners_relations', ['id'], {}, dbs);

                        console.log('partners_relations', partnersRelation, partners_relations.stmt);

                        partners_relations.stmt.run(partnersRelation);
                        console.log(partners_relations);
                    }
                } else {
                    let partners_relations = dbHelper.doInsert(event, args.partners_relations, 'partners_relations', ['id'], {}, dbs);
                    console.log('partners_relations', args.partners_relations, partners_relations.stmt);
                    partners_relations.stmt.run(args.partners_relations);
                    console.log(partners_relations);
                }
            }
            return true;
        });
        let update = transUpdate();
        console.log(update)
        if (update) {
            event.returnValue = {
                success: true
            }
        } else {

            event.returnValue = {
                success: false
            }
        }
        dbs.close();
    });
    ipcMain.on('add-partner', (event, args) => {
        const dbs = new sqlite(dbLocation, { fileMustExist: true });
        let lastIdSQL = 'SELECT last_insert_rowid() id';
        let partner = dbHelper.doInsert(event, args.partners, 'partners', {}, dbs);
        let lastPartnerIdStmt = dbs.prepare(lastIdSQL);
        //SELECT last_insert_rowid()
        const transInsert = dbs.transaction(() => {
            if (partner !== undefined) {
                console.log(partner);
                partner.stmt.run(partner.params);
                console.log(partner);
                let lastPartnerId = lastPartnerIdStmt.get();

                console.log('lastPartnerId:', lastPartnerId)

                if ('partners_relations' in args && lastPartnerId) {
                    if (Array.isArray(args.partners_relations)) {
                        for (let partnersRelation of args.partners_relations) {
                            partnersRelation.partner_id = lastPartnerId.id;
                            let partners_relations = dbHelper.doInsert(event, partnersRelation, 'partners_relations', {}, dbs);
                            console.log('partners_relations', partnersRelation, partners_relations.stmt);

                            partners_relations.stmt.run(partnersRelation);
                            console.log(partners_relations);
                        }
                    } else {
                        args.partners_relations.partner_id = lastPartnerId.id;
                        let partners_relations = dbHelper.doInsert(event, args.partners_relations, 'partners_relations', {}, dbs);
                        console.log('partners_relations', args.partners_relations, partners_relations.stmt);
                        partners_relations.stmt.run(args.partners_relations);
                        console.log(partners_relations);
                    }
                }
            }
            if (partner !== undefined) {
                return true;
            } else {
                return false;
            }
        });
        let insert = transInsert();
        console.log(insert)
        if (insert) {
            event.returnValue = {
                success: true
            }
        } else {

            event.returnValue = {
                success: false
            }
        }
    });
    //end partners
    /**
     * API para receipts
     */
    ipcMain.on('update-receipt', (event, args) => {
        dbHelper.doUpdate(event, args, 'receipts', ['id']);
    });
    ipcMain.on('add-receipt', (event, args) => {
        console.log('add-receipt ----------------------->', args)
        let params = {};
        let filters = ['entity_id', 'partner_id', 'receipt_period_start', 'receipt_period_end', 'receipt_type_id'];
        for (let param of Object.keys(args)) {
            if (filters.includes(param))
                params[param] = args[param]
        }
        console.log('FILTROS-----------------------><--', filters)
        let dup = dbHelper.doRead('receipts', ['COUNT(id) receipts'], params, null)
        console.log('REGISTROS-----------------------><--', dup)
        if (dup.receipts > 0) {
            dialog.showMessageBox({
                title: 'Datos duplicados',
                message: 'Se encontraron registros similares del mismo asociado en el mismo período, ¿Desea insertarlos igualmente?',
                icon: nativeImage.createFromPath(path.resolve(appPath, './assets/icons/png/256x256.png')),
                buttons: [i18n.__('YES'), i18n.__('NO')]
            }, (option) => {
                if (option === 0) {
                    dbHelper.doInsert(event, args, 'receipts');
                } else {
                    event.returnValue = {
                        success: false,
                        alert: false
                    }
                }
            })

        } else {
            dbHelper.doInsert(event, args, 'receipts');
        }
    });
    ipcMain.on('update-receipt_types', (event, args) => {
        dbHelper.doUpdate(event, args, 'receipt_types', ['id']);
    });
    ipcMain.on('add-receipt_types', (event, args) => {
        console.log(args)
        dbHelper.doInsert(event, args, 'receipt_types');
    });
    ipcMain.on('update-receipt_grand_types', (event, args) => {
        dbHelper.doUpdate(event, args, 'receipt_grand_types', ['id']);
    });
    ipcMain.on('add-receipt_grand_types', (event, args) => {
        console.log(args)
        dbHelper.doInsert(event, args, 'receipt_grand_types');
    });
    //ende receipts
    /**
     * API para users
     */
    ipcMain.on('update-user', (event, args) => {
        dbHelper.doUpdate(event, args, 'base_users', ['id'], {
            'passcode': 'hashParamValue',
            'attribute_1': 'nullEmptyParamValue',
            'attribute_2': 'nullEmptyParamValue',
            'attribute_3': 'nullEmptyParamValue',
            'attribute_4': 'nullEmptyParamValue',
            'attribute_5': 'nullEmptyParamValue'
        });
    });
    ipcMain.on('add-user', (event, args) => {

        dbHelper.doInsert(event, args, 'base_users', { 'passcode': 'hashParamValue' });
    });
    ipcMain.on('add-role', (event, args) => {
        dbHelper.doInsert(event, args, 'base_user_roles');
    });
    //end users
    /**
     * API Payments
     */
    ipcMain.on('update-payment_types', (event, args) => {
        dbHelper.doUpdate(event, args, 'payment_types', ['id']);
    });
    ipcMain.on('add-payment_types', (event, args) => {
        console.log(args)
        dbHelper.doInsert(event, args, 'payment_types');
    });
    ipcMain.on('update-payment_grand_types', (event, args) => {
        dbHelper.doUpdate(event, args, 'payment_grand_types', ['id']);
    });
    ipcMain.on('add-payment_grand_types', (event, args) => {
        console.log(args)
        dbHelper.doInsert(event, args, 'payment_grand_types');
    });
    //end payments
    /**
     * API Expenses
     */
    ipcMain.on('update-expense', (event, args) => {
        dbHelper.doUpdate(event, args, 'expenses', ['id']);
    });
    ipcMain.on('add-expense', (event, args) => {
        console.log('add-expense ----------------------->', args)
        dbHelper.doInsert(event, args, 'expenses');
    });
    ipcMain.on('update-expense_types', (event, args) => {
        dbHelper.doUpdate(event, args, 'expense_types', ['id']);
    });
    ipcMain.on('add-expense_types', (event, args) => {
        console.log(args)
        dbHelper.doInsert(event, args, 'expense_types');
    });
    ipcMain.on('update-expense_grand_types', (event, args) => {
        dbHelper.doUpdate(event, args, 'expense_grand_types', ['id']);
    });
    ipcMain.on('add-expense_grand_types', (event, args) => {
        console.log(args)
        dbHelper.doInsert(event, args, 'expense_grand_types');
    });
    //end payments
    /**
     * API helpers
     */
    ipcMain.on('get-helper-taxonomy', (event, args) => {
        console.log('get-helper-taxonomy-------------------->', args)
        let result = dbHelper.doRead('helper_attr', ' * ', args, null);

        console.log('get-helper-taxonomy--------------------=', result)
        event.returnValue = {
            success: true,
            data: result
        }
    });
    ipcMain.on('update-helper-taxonomy', (event, args) => {
        let preProcess = {};
        if ('taxonomy' in args && args.taxonomy === 'default_monthly_fee_concept') {
            preProcess['value'] = 'asInt'
        }
        if ('taxonomy' in args && args.taxonomy === 'default_fee_amount') {
            preProcess['value'] = 'asDecimal'
        }
        dbHelper.doUpdate(event, args, 'helper_attr', ['taxonomy'], preProcess);
    });

    ipcMain.on('receipt-counter-updater', (event, args) => {
        let last =  dbHelper.doRead('helper_attr', ['value+1 receipt_number'], { 'taxonomy': 'receipt_number' }, null)
        console.log(last)
        if (!last)
            dbHelper.doInsert(event, { 'taxonomy': 'receipt_number', 'value': 1 }, 'helper_attr');
        event.returnValue = true;
    })
}