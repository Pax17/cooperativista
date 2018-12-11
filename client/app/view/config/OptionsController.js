Ext.define('Cooperativista.view.config.OptionsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.options',
    pointSize: 0.352778, //tamaño dl punto tipogáfico
    init: function () {
        //'get-helper-taxonomy'
    },
    initViewModel: function () {
        this.loadForm();
    },
    loadForm: function () {
        const {ipcRenderer} = require('electron');
        let settings = ipcRenderer.sendSync('get-settings', 'receipt');
        let flatten = this.flattenObject(settings)
        let form = this.lookup('printForm');
        console.log(this.flattenObject(settings), settings);
        // form.getForm().setValues(flatten);
        if (this.lookup('printForm').isVisible()) {
            form.getForm().setValues(flatten);
            this.getViewModel().notify()
            let rec = this.getStore('sizes').findRecord('data', flatten['options.size'])
            this.getViewModel().set('maxPosition.x', rec.get('h') - flatten['options.margin'] - 5)
            this.getViewModel().set('maxPosition.y', rec.get('v') - flatten['options.margin'] - 5)
            this.getViewModel().notify()
        } else {
            form.on({
                boxready: function () {
                    form.getForm().setValues(flatten);
                    this.getViewModel().notify()
                    let rec = this.getStore('sizes').findRecord('data', flatten['options.size'])
                    this.getViewModel().set('maxPosition.x', rec.get('h') - flatten['options.margin'] - 5)
                    this.getViewModel().set('maxPosition.y', rec.get('v') - flatten['options.margin'] - 5)
                    this.getViewModel().notify()
                }, scope: this, single: true
            })
        }

    },
    previewLayout: function (btn) {
        let result = this.translatePrintFormValues();
        result.type = 'receipts';
        console.log(result)
        const {ipcRenderer} = require('electron');
        return ipcRenderer.sendSync('pdf-preview', result);
    },
    onPrintFormDirty: function (form, dirty) {
        console.log(form, dirty);
        let valid = form.isValid();
        this.getViewModel().set('printSettings.valid', valid);
        this.getViewModel().set('printSettings.dirty', dirty);
        this.getViewModel().notify();

    },
    forceUpdate: function (cmp, value, old) {
        let combo = this.lookup('docPageSize');
        let val = combo.getValue();
        if (!old) return;
        if (!cmp.isFormField)
            this.getViewModel().set('pageLayout', value)
        this.getViewModel().notify();
        //<debug>
        console.debug(this.getViewModel().get('pageLayout'), this.getStore('sizes').getRange());
        //</debug>
        let rec = this.getStore('sizes').findRecord('data', val)


        this.getViewModel().set('maxPosition.x', rec.get('h') - this.getViewModel().get('pageMargin') - 5)
        this.getViewModel().set('maxPosition.y', rec.get('v') - this.getViewModel().get('pageMargin') - 5)
        combo.select(rec);
        this.getViewModel().notify();
        this.lookup('printForm').isValid();
        //<debug>
        console.debug(value, old, val, this.getViewModel().getData());
        //</debug>
    },
    flattenObject: function (ob) {
        const toReturn = {};
        let toPoints = [
            'x', 'y', 'margin'
        ]
        for (const i in ob) {
            if (!ob.hasOwnProperty(i)) continue;

            if ((typeof ob[i]) === 'object') {
                const flatObject = this.flattenObject(ob[i]);
                for (const x in flatObject) {
                    if (!flatObject.hasOwnProperty(x)) continue;

                    toReturn[i + '.' + x] = flatObject[x];
                }
            } else {
                toReturn[i] = toPoints.includes(i) ? parseFloat(ob[i]) * this.pointSize : ob[i];
            }
        }
        return toReturn;
    },
    translatePrintFormValues: function (member) {
        let values = this.lookup('printForm').getValues();
        let DataObjectParser = require('dataobject-parser');
        let parser = new DataObjectParser();
        let regex = /(?:\.([^.]+))?$/;
        let toPoints = [
            'x', 'y', 'margin'
        ]
        for (const key in values) {
            let value = toPoints.includes(regex.exec(key)[1]) ? parseFloat(values[key]) / this.pointSize : values[key];
            parser.set(key, value);
        }
        let result = parser.data();
        result.type = 'receipts';
        return member && member in result ? result[member] : result;

    },
    getStore: function (store) {
        let instance = this.callParent(arguments);
        if (instance == null)
            instance = this.getViewModel().getParent().getStore(store);
        return instance;
    },
    loadEntityForm: function () {
        //console.debug(this.getViewModel().get('currentEntity'), this.getViewModel().get('entities').getRange())
        this._loadingEntity = true;
        let data = this.getViewModel().get('entities').getAt(0).getData()
        this.getViewModel().set('entityData', this.getViewModel().get('entities').getAt(0).getData())
        this.lookup('entityform').getForm().setValues(data)
        this._loadingEntity = false;
        this.getViewModel().set('dirtyEntity', false);
        this.getViewModel().notify();

    },
    dirtyEntity: function () {
        let dirty = false,
            oldEntityData = this.getViewModel().get('entityData'),
            formData = this.lookup('entityform').getValues();
        if (!this._loadingEntity)
            for (let property in formData) {
                let fixedForm = Ext.isEmpty(formData[property]) ? 0 : formData[property],
                    fixedData = Ext.isEmpty(oldEntityData[property]) ? 0 : oldEntityData[property]
                if (!isNaN(fixedData))
                    fixedData = parseFloat(fixedData)
                if (!isNaN(fixedForm))
                    fixedForm = parseFloat(fixedForm)
                //<debug>
                console.debug(property, ' form', formData[property], fixedForm, ' vm', oldEntityData[property], fixedData);
                //</debug>
                if (property !== 'id') {
                    if (fixedData !== fixedForm)
                        dirty = true
                    //<debug>
                    console.debug(dirty, fixedData !== fixedForm)
                    //</debug>
                }
            }
        this.getViewModel().set('dirtyEntity', dirty);
        this.getViewModel().notify();
    },
    loadPeriodData: function () {
        const {ipcRenderer} = require('electron');
        /**
         * Default DUE amount!
         */
        const {data: {value: default_fee_amount}} = ipcRenderer.sendSync('get-helper-taxonomy', {
            taxonomy: 'default_fee_amount',
            status: 1
        });
        /**
         * Períod Name
         */
        const {data: {value: period_name}} = ipcRenderer.sendSync('get-helper-taxonomy', {
            taxonomy: 'period_name',
            status: 1
        });
        /**
         * Períod Start
         */
        const {data: {value: period_start}} = ipcRenderer.sendSync('get-helper-taxonomy', {
            taxonomy: 'period_start',
            status: 1
        });
        /**
         * Períod End
         */
        const {data: {value: period_end}} = ipcRenderer.sendSync('get-helper-taxonomy', {
            taxonomy: 'period_end',
            status: 1
        });
        /**
         * default_monthly_fee_concept End
         */
        const {data: {value: default_monthly_fee_concept}} = ipcRenderer.sendSync('get-helper-taxonomy', {
            taxonomy: 'default_monthly_fee_concept',
            status: 1
        });
        return {
            period_name: (period_name),
            period_start: period_start,
            period_end: period_end,
            default_fee_amount: (default_fee_amount),
            default_monthly_fee_concept: parseInt(default_monthly_fee_concept)
        };
    },
    dirtyPeriod: function (field) {
        let oldPeriod = this.loadPeriodData(),
            periodData = field.getSubmitValue(),
            property = field.name,
            dirty = oldPeriod[property] !== periodData;
        //<debug>
        console.debug(property, dirty, periodData, field, oldPeriod[property]);
        //</debug>
        /*let updates = 0;
        for (let property in periodData) {
            if (oldPeriod[property] !== periodData[property]) {
                //<debug>
                console.debug(oldPeriod[property], periodData[property]);
                //</debug>
                dirty = true;
            }
        }*/
        this.getViewModel().set(`dirtyPeriodField.${property}`, dirty);
        this.getViewModel().notify();
        return oldPeriod;
    },
    savePeriod: function () {
        let oldPeriod = this.loadPeriodData(),
            periodData = this.lookup('periodform').getValues();
        const {ipcRenderer} = require('electron');
        //<debug>
        console.debug(periodData, oldPeriod);
        //</debug>
        let updates = 0;
        for (let property in periodData) {
            if (oldPeriod[property] !== periodData[property]) {
                ipcRenderer.sendSync('update-helper-taxonomy', {
                    taxonomy: property,
                    value: periodData[property],
                    status: 1
                });
                updates++;
            }
        }
        if (updates > 0) {
            this.fireEvent('periodsettingschange');
        }
    },
    saveEntity: function () {
        let dirty = false,
            oldEntityData = this.getViewModel().get('entityData'),
            formData = this.lookup('entityform').getValues();

        for (let property in formData) {
            let fixedForm = Ext.isEmpty(formData[property]) ? 0 : formData[property],
                fixedData = Ext.isEmpty(oldEntityData[property]) ? 0 : oldEntityData[property]
            if (!isNaN(fixedData))
                fixedData = parseFloat(fixedData)
            if (!isNaN(fixedForm))
                fixedForm = parseFloat(fixedForm)
            //<debug>
            console.debug(property, ' form', formData[property], fixedForm, ' vm', oldEntityData[property], fixedData);
            //</debug>
            if (property !== 'id') {
                if (fixedData !== fixedForm)
                    dirty = true
                //<debug>
                console.debug(dirty, fixedData !== fixedForm)
                //</debug>
            }
        }
        if (this.lookup('entityform').isValid() && dirty) {
            const data = {
                entityData: this.lookup('entityform').getValues()
            }
            const {ipcRenderer} = require('electron');
            let setup = ipcRenderer.sendSync('set-first-run-data', data); //update-enity-settings
            let path = require("path");
            const {dialog} = require('electron').remote;
            const nativeImage = require('electron').remote.nativeImage;
            const appPath = require('electron').remote.app.getAppPath();
            const i18n = new (require(path.resolve(appPath, './translations/i18n')));
            if (setup.success) {
                this.fireEvent('settingsupdated', data)
                this.getStore('entities').load({
                    callback: function () {
                        this.lookup('updateUserForm').reset();
                        dialog.showMessageBox({
                            title: 'Datos guardados',
                            message: 'Se actualizaron los datos de la entidad',
                            icon: nativeImage.createFromPath(path.resolve(appPath, './assets/icons/png/256x256.png')),
                            buttons: [i18n.__('OK')]
                        });
                        this.lookup('updateUserWin').hide();
                        this.loadEntityForm()
                    },
                    scope: this
                })
            } else {
                dialog.showErrorBox('Error en la configuración', 'Se generó un error al actualizar los datos');
            }
        }
    },
    //updateUser: function (grid, rowIndex, colIndex) {
    toggleUserStatus: function (btn, rowIndex, colIndex) {
        // var rec = grid.getStore().getAt(rowIndex);
        let userData = btn.getValue().getData(),
            data = {
                status: userData.status == 1 ? 0 : 1,
                id: userData.id
            };

        console.log('usuario::::', data);
        const {ipcRenderer} = require('electron');
        let setup = ipcRenderer.sendSync('update-user', data); //update-enity-settings
        const {dialog} = require('electron').remote;
        if (!setup.success) {
            dialog.showErrorBox('Error en la configuración', 'Se generó un error al actualizar los datos');
        } else {
            this.getStore('users').load({
                callback: function () {
                    let user = this.getStore('users').findRecord('id', data.id);
                    this.lookup('user-list').getSelectionModel().select(user);
                },
                scope: this
            });
        }

    },
    updateUser: function (btn, rowIndex, colIndex) {
        // var rec = grid.getStore().getAt(rowIndex);
        let rec = btn.getValue();
        this.getViewModel().set('editUser', rec.getData())
        this.lookup('updateUserWin').show(null, function () {
            //<debug>
            console.debug(this.lookup('updateUserForm'));
            //</debug>
            this.lookup('updateUserForm').getForm().setValues(rec.getData())
        }, this)

    },
    doUpdateUser: function () {
        let dirty = false,
            oldupdateUserData = this.getViewModel().get('editUser'),
            formData = this.lookup('updateUserForm').getValues();

        //<debug>
        console.log(oldupdateUserData);
        //</debug>
        for (let property in formData) {
            let fixedForm = Ext.isEmpty(formData[property]) ? 0 : formData[property],
                fixedData = Ext.isEmpty(oldupdateUserData[property]) ? 0 : oldupdateUserData[property]
            if (!isNaN(fixedData))
                fixedData = parseFloat(fixedData)
            if (!isNaN(fixedForm))
                fixedForm = parseFloat(fixedForm)
            //<debug>
            console.debug(property, ' form', formData[property], fixedForm, ' vm', oldupdateUserData[property], fixedData);
            //</debug>
            if (property !== 'id') {
                if (fixedData !== fixedForm)
                    dirty = true
                //<debug>
                console.debug(dirty, fixedData !== fixedForm)
                //</debug>
            }
        }
        //<debug>
        console.log(dirty, this.getViewModel().getStore('users'));
        console.log(this.lookup('updateUserForm').isValid())
        //</debug>
        // return;

        if (this.lookup('updateUserForm').isValid() && dirty) {
            const data = this.lookup('updateUserForm').getValues()
            if (Ext.isEmpty(data.passcode)) delete data.passcode
            //<debug>
            console.debug(data);
            //</debug>
            const {ipcRenderer} = require('electron');
            let setup = ipcRenderer.sendSync('update-user', data); //update-enity-settings
            let path = require("path");
            const {dialog} = require('electron').remote;
            const nativeImage = require('electron').remote.nativeImage;
            const appPath = require('electron').remote.app.getAppPath();
            const i18n = new (require(path.resolve(appPath, './translations/i18n')));
            if (setup.success) {
                this.getStore('users').load({
                    callback: function () {
                        this.lookup('updateUserForm').reset();
                        dialog.showMessageBox({
                            title: 'Datos guardados',
                            message: 'Se actualizaron los datos del usuario',
                            icon: nativeImage.createFromPath(path.resolve(appPath, './assets/icons/png/256x256.png')),
                            buttons: [i18n.__('OK')]
                        });
                        this.lookup('updateUserWin').hide();
                    },
                    scope: this
                })
            } else {
                dialog.showErrorBox('Error en la configuración', 'Se generó un error al actualizar los datos');
            }
        }
    },
    addRole: function (btn) {
        this.lookup('addRoleWin').show(btn)
    },
    doAddRole: function () {
        let roleData = this.lookup('addRoleForm').getForm().getValues()
        //<debug>
        console.debug(roleData);
        //</debug>
        //return;
        const {ipcRenderer} = require('electron');
        let add = ipcRenderer.sendSync('add-role', roleData); //update-enity-settings
        // let path = require("path");
        const {dialog} = require('electron').remote;
        console.log(add)
        //   const nativeImage = require('electron').remote.nativeImage;
        // const appPath = require('electron').remote.app.getAppPath();
        //  const i18n = new (require(path.resolve(appPath, './translations/i18n')));
        if (add.success) {
            this.getStore('roles').load({
                callback: function () {
                    /* dialog.showMessageBox({
                         title: 'Datos guardados',
                         message: 'Se agregó el rol de usuario',
                         icon: nativeImage.createFromPath(path.resolve(appPath, './assets/icons/png/256x256.png')),
                         buttons: [i18n.__('OK')]
                     });*/
                    if ('data' in add && 'id' in add.data)
                        this.lookup('role_combo').setValue(add.data.id)
                    this.lookup('addRoleWin').hide();
                },
                scope: this
            })
        } else {
            //<debug>
            console.debug(add);
            //</debug>
            dialog.showErrorBox('Error en la configuración', 'Se generó un error al actualizar los datos');
        }
    },
    addUser: function (btn) {
        this.lookup('addUserWin').show(btn)
    },
    doAddUser: function () {
        let userData = this.lookup('addUserForm').getForm().getValues()
        //<debug>
        console.log(userData);
        //</debug>

        const {ipcRenderer} = require('electron');
        let add = ipcRenderer.sendSync('add-user', userData); //update-enity-settings
        let path = require("path");
        const {dialog} = require('electron').remote;
        const nativeImage = require('electron').remote.nativeImage;
        const appPath = require('electron').remote.app.getAppPath();
        const i18n = new (require(path.resolve(appPath, './translations/i18n')));
        if (add.success) {
            this.getStore('users').load({
                callback: function () {
                    this.lookup('addUserForm').reset();
                    dialog.showMessageBox({
                        title: 'Datos guardados',
                        message: 'Se agregó el usuario ' + userData.alias,
                        icon: nativeImage.createFromPath(path.resolve(appPath, './assets/icons/png/256x256.png')),
                        buttons: [i18n.__('OK')]
                    });
                },
                scope: this
            })
        } else {
            //<debug>
            console.debug(add);
            //</debug>
            dialog.showErrorBox('Error en la configuración', 'Se generó un error al actualizar los datos');
        }
    },
    processConfig: function (btn) {
        let formData = btn.up('form').getForm().getValues(),
            {role, action} = btn;
        //<debug>
        console.debug(formData);
        //</debug>
        //return;
        const {ipcRenderer} = require('electron');
        let add = ipcRenderer.sendSync(`${action}-${role}`, formData);
        const {dialog} = require('electron').remote;
        console.log(add)
        if (add.success) {
            this.fireEvent('storemodified', [role]);
        } else {
            //<debug>
            console.debug(add);
            //</debug>
            dialog.showErrorBox('Error en la configuración', 'Se generó un error al actualizar los datos');
        }

    },
    doUpdateStatus: function (selection, role, status) {

        const {ipcRenderer} = require('electron');
        //const {dialog} = require('electron').remote;
        selection.map((item) => {
            console.log(item.get('status'), status);
            ipcRenderer.sendSync(`update-${role}`, {status: status, id: item.get('id')});
        });
        console.log(role);
        this.fireEvent('storemodified', [role]);
        this.lookup(`${role}_grid`).getSelectionModel().deselectAll();
    },
    updateStatus: function (btn) {
        let {role, status} = btn;
        let selection = this.lookup(`${role}_grid`).getSelection();

        this.doUpdateStatus(selection, role, status);
    },
    updateStatusBtn: function (btn) {
        let role = btn.role,
            selection = [btn.value],
            status = btn.value.get('status') == 1 ? 0 : 1;
        this.doUpdateStatus(selection, role, status)
    },
    focusNext: function (btn) {
        let cmp = btn.nextSibling('field')
        if (cmp) {
            console.log(cmp);
            cmp.focus();
            if (cmp.isXType('combo'))
                cmp.expand();
        }
    },
    updatePDFSettings: function () {
        let {options, settings} = this.translatePrintFormValues();
        const sysSettings = require('electron-settings');
        // console.log(data);
        sysSettings.set('receipt.options', options)
        sysSettings.set('receipt.settings', settings)
        this.loadForm();
    }

    // TODO - Add control logic or remove is not needed
});
