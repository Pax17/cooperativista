Ext.define('Cooperativista.view.config.SuppliersController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.config-suppliers',
    getStore: function (store) {
        let instance = this.callParent(arguments);
        if (instance == null)
            instance = this.getViewModel().getParent().getStore(store);
        return instance;
    },
    addSupplier: function () {
        //  this.lookup('addSupplierWin').renderTo = this.lookup('Suppliers-grid').getEl();
        this.lookup('addSupplierWin').show(this.lookup('Suppliers-grid'));
    },
    doAddSupplier: function () {
        let SupplierData = this.lookup('addSupplierForm').getForm().getValues();
        SupplierData.entity_id = this.getViewModel().get('currentEntity');
        let isDuplicated = this.getStore('suppliers').findBy(function (rec) {
            return rec.get('name') === SupplierData.name && rec.get('name_2') === SupplierData.name_2 && rec.get('name_3') === SupplierData.name_3;
        }, this);

        let path = require("path");
        const { dialog } = require('electron').remote;
        const nativeImage = require('electron').remote.nativeImage;
        const appPath = require('electron').remote.app.getAppPath();
        const i18n = new (require(path.resolve(appPath, './translations/i18n')));

        if (isDuplicated > -1) {
            dialog.showErrorBox('Registro duplicado', 'Ya existe un ítem con los datos especificados');
            return;
        }
        const { ipcRenderer } = require('electron');
        let add = ipcRenderer.sendSync('add-partner', { partners: SupplierData }); //update-enity-settings
        if (add.success) {
            this.fireEvent('storemodified', ['suppliers', 'partners']);
            this.getStore('partners').load({
                callback: function () {
                    this.lookup('addSupplierForm').reset();
                    this.lookup('addSupplierForm').getForm().setValues({ entity_id: this.getViewModel().get('currentEntity') })
                    let notif = new Notification('Datos guardados', {
                        body: 'Se agregó la entidad ' + SupplierData.name + ' ' + SupplierData.name_2 + ' ' + SupplierData.name_3
                    });
                    Ext.toast(notif.body);

                    dialog.showMessageBox({
                        title: 'Datos guardados',
                        message: 'Se agregó la entidad ' + SupplierData.name + ' ' + SupplierData.name_2 + ' ' + SupplierData.name_3,
                        icon: nativeImage.createFromPath(path.resolve(appPath, './assets/icons/png/256x256.png')),
                        buttons: [i18n.__('OK')]
                    });

                    this.getStore('suppliers').load();
                    this.lookup('addSupplierWin').close();
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
    updateStatusBtn: function (btn) {
        const { ipcRenderer } = require('electron');
        let status = btn.value.get('has_attribute_5') == 1 ? null : Ext.util.Format.date(new Date, 'Y-m-d');
        ipcRenderer.sendSync('update-partner', { attribute_5: status, id: btn.value.get('id') });
        this.fireEvent('storemodified', ['suppliers']);
    }

});
