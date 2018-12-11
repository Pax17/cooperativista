Ext.define('Cooperativista.view.receipts.ReceiptsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.receipts-receipts',
    listen: {
        controller: {
            '*': {
                'storemodified': 'reloadStore',
                'defaultamountchange': 'setAmountData'
            }
        }
    },
    init: function () {
        //<debug>
        console.debug('ReceiptsController INIT');
        //</debug>
        let me = this;

        //receipt-counter-updater
        const { ipcRenderer } = require('electron');
        ipcRenderer.on('pdf-done', () => {
            me.reloadStore(['receipts'])
        })
        // let add = ipcRenderer.sendSync('receipt-counter-updater', null);
    },
    getStore: function (store) {
        let instance = this.callParent(arguments);
        if (!instance)
            instance = this.getViewModel().getParent().getStore(store);
        return instance;
    },
    reloadStore: function (stores) {
        console.log('storemodified', stores);
        if (stores.length > 0) {
            for (const store of stores) {

                let ds = this.getStore(store)
                console.log('storemodified', ds);
                if (ds) {
                    ds = ds.type === "chained" ? ds.source : ds;
                    //<debug>
                    console.debug(ds);
                    //</debug>
                    if (ds) ds.load();
                }
            }
        }
    },
    /**
     * Si cambia el valor por defecto de la cuota actualizamos el formulario cheuqeando si el valor mostrado es el mismo del viejovalor por defecto.
     * Esto lo hacemos para no borrar un valor modificado manualmente.
     */
    setAmountData: function (default_fee_amount, default_old_due_amount) {
        const viewModel = this.getViewModel();
        const currentAmount = this.lookup('amount').getValue()
        if (!currentAmount || parseFloat(default_old_due_amount) === parseFloat(currentAmount))
            this.lookup('amount').setValue(parseFloat(default_fee_amount));
        viewModel.notify();

    },
    initViewModel: function (viewModel) {
        //<debug>
        console.debug('ReceiptsController VM', viewModel);
        console.log('currentEntity', viewModel.get('currentEntity'), this.getMonthRange(), viewModel);
        //</debug>

        //  this.setPeriodData();
        let initialFilters = this.getMonthRange();
        //  this.getStore('receipts').getProxy().setExtraParam(`${viewModel.get('filterDateParam')}_start`, Ext.util.Format.date(initialFilters.startDate, 'Y-m-d H:i:s'));
        // this.getStore('receipts').getProxy().setExtraParam(`${viewModel.get('filterDateParam')}_end`, Ext.util.Format.date(initialFilters.endDate, 'Y-m-d H:i:s'));

        //<debug>
        console.log(this.getStore('receipts'));
        //</debug>

        //this.lookup('rangepicker').getValue()
        Ext.defer(function () {

            viewModel.set('initialFormData', this.lookup('addReceipt').getValues());
            viewModel.set('filter_date_start', initialFilters.startDate);
            viewModel.set('filter_date_end', initialFilters.endDate);
            viewModel.notify();
            // this.setAmountData(viewModel.get('default_fee_amount'), null);
            //     this.getStore('receipts').load();
        }, 150, this);
    },
    getMonthRange: function (fromDate) {
        let date = fromDate || new Date;
        return {
            startDate: new Date(date.getFullYear(), date.getMonth(), 1),
            endDate: new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59)
        };
    },
    firstDayOfMonthFromDate: function (fromDate) {
        let date = fromDate || new Date;
        return new Date(date.getFullYear(), date.getMonth(), 1);
    },
    lastDayOfMonthFromDate: function (fromDate) {
        let date = fromDate || new Date;
        return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);
    },
    onSelectMonth: function (cmp) {
        console.log(cmp.getValue())
        let val = cmp.getValue();
        //Ext.Msg.alert('Selected', cmp.getValue());
        let range = this.getMonthRange(new Date(val[1], val[0], 1));
        console.log(cmp);
        this.getViewModel().set('displayMonth',
            {
                text: Ext.Date.monthNames[val[0]] + ' ' + val[1],
                icon: 'fa-calendar-check'
            }
        );
        this.lookup('receipt_period_start').setValue(range.startDate);
        this.lookup('receipt_period_end').setValue(range.endDate);
        this.getViewModel().notify();
        this.lookup('selectMonth').hideMenu();

        console.log(range);
    },
    resetDisplayMonth: function (cmp, nVal) {
        console.log(arguments)
        if (nVal === 2) {
            this.getViewModel().set('displayMonth',
                {
                    text: 'Selecionar mes',
                    icon: 'fa-calendar'
                }
            );
        }
    },
    addReceipt: function () {
        let receiptValues = this.lookup('addReceipt').getValues();
        receiptValues.receipt_date = Ext.util.Format.date(new Date(), 'Y-m-d');
        console.log(receiptValues);
        const { ipcRenderer } = require('electron');
        let add = ipcRenderer.sendSync('add-receipt', receiptValues); //update-enity-settings

        let path = require("path");
        const { dialog } = require('electron').remote;
        const nativeImage = require('electron').remote.nativeImage;
        const appPath = require('electron').remote.app.getAppPath();
        const i18n = new (require(path.resolve(appPath, './translations/i18n')));

        if (add.success) {
            this.getStore('receipts').load({
                callback: function () {
                    this.resetOnSend();
                    dialog.showMessageBox({
                        title: 'Datos guardados',
                        message: 'Se agregó el pago',
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
            if (!('message' in add || add.message !== false))
                dialog.showErrorBox('Error en la configuración', 'Se generó un error al actualizar los datos');
        }


    },
    resetOnSend: function () {
        if (!this.getViewModel().get('keepFormData.checked')) this.resetForm();
    },
    resetForm: function () {
        //if (!this.getViewModel().get('keepFormData')) {
        this.lookup('addReceipt').getForm().setValues(this.getViewModel().get('initialFormData'));
        this.lookup('tipoIngreso').setValue(this.getViewModel().get('tipoIngresoDefault'));
        this.lookup('tipoPeriodo').setValue(this.getViewModel().get('tipoPeriodoDefault'));
        this.getViewModel().set('displayMonth',
            {
                text: 'Selecionar mes',
                icon: 'fa-calendar'
            }
        );
        this.getViewModel().notify();
        // }
    },
    goToForm: function () {
        this.getView().getLayout().setActiveItem(0);
    },
    goToList: function () {
        this.getView().getLayout().setActiveItem(1);
    },
    onRangeChange: function (cmp, nVal, oVal) {
        const viewModel = this.getViewModel();
        console.log(nVal, oVal);
        viewModel.set('filter_date_start', nVal.startDateObj);
        viewModel.set('filter_date_end', nVal.endDateObj);
        viewModel.notify();
        //<debug>
        console.debug(this.getStore('receipts'));
        //</debug>
    },
    generateReceipts: function () {
        let rawData = this.lookup('receiptsgrid').getSelection();
        if (rawData.length === 0) rawData = this.lookup('receiptsgrid').getStore().getRange();
        const data = {};
        const groupByFamily = true; //@todo: implmntar en UI

        for (const receipt of rawData) {
            if (groupByFamily) {
                let famKey = `family_${receipt.get('family_id')}`;
                if (!data.hasOwnProperty(famKey)) data[famKey] = [];
                data[famKey].push(receipt.getData());
            } else {
                let key = `receipt_${receipt.get('id')}`;
                data[key] = [receipt.getData()];
            }
        }
        //<debug>
        console.debug(rawData, data);
        //</debug>

        const { ipcRenderer } = require('electron');

        ipcRenderer.send('pdf-get', { type: 'receipts', data: data });
    },
    onSelectReceipts: function (grid, selected) {
        console.log(selected)
        this.getViewModel().set('hasSelection', selected.length > 0)
        this.getViewModel().notify()
    }

});
