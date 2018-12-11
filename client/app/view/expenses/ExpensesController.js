Ext.define('Cooperativista.view.config.ExpensesController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.expenses',
    listen: {
        controller: {
            '*': {
                'storemodified': 'reloadStore'
            }
        }
    },
    getStore: function (store) {
        let instance = this.callParent(arguments);
        if (instance == null)
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
    initViewModel: function (viewModel) {
        console.log('currentEntity', viewModel.get('currentEntity'), this.getMonthRange(), viewModel);

        //  this.setPeriodData();
        let initialFilters = this.getMonthRange();
        //  this.getStore('expenses').getProxy().setExtraParam(`${viewModel.get('filterDateParam')}_start`, Ext.util.Format.date(initialFilters.startDate, 'Y-m-d H:i:s'));
        // this.getStore('expenses').getProxy().setExtraParam(`${viewModel.get('filterDateParam')}_end`, Ext.util.Format.date(initialFilters.endDate, 'Y-m-d H:i:s'));

        //<debug>
        console.log(this.getStore('expenses'));
        //</debug>

        //this.lookup('rangepicker').getValue()
        Ext.defer(function () {
            viewModel.set('initialFormData', this.lookup('addExpense').getValues());
            viewModel.set('filter_date_start', initialFilters.startDate);
            viewModel.set('filter_date_end', initialFilters.endDate);
            viewModel.notify();
            // this.setAmountData(viewModel.get('default_fee_amount'), null);
            //     this.getStore('expenses').load();
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
        this.lookup('expense_period_start').setValue(range.startDate);
        this.lookup('expense_period_end').setValue(range.endDate);
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
    saveDialog: function(){
        const {ipcRenderer} = require('electron');

        ipcRenderer.sendSync('pdf-get', {type:'receipts'});
        /*
        dialog.showSaveDialog((fileName) => {
            if (fileName === undefined){
                console.log("You didn't save the file");
                return;
            }

            // fileName is a string that contains the path and filename created in the save file dialog.
            fs.writeFile(fileName, content, (err) => {
                if(err){
                    alert("An error ocurred creating the file "+ err.message)
                }

                alert("The file has been succesfully saved");
            });
        });*/
    },
    addExpense: function () {
        let expenseValues = this.lookup('addExpense').getValues();
        expenseValues.expense_date = Ext.util.Format.date(new Date(), 'Y-m-d');
        console.log(expenseValues);
        const {ipcRenderer} = require('electron');
        let add = ipcRenderer.sendSync('add-expense', expenseValues); //update-enity-settings

        let path = require("path");
        const {dialog} = require('electron').remote;
        const nativeImage = require('electron').remote.nativeImage;
        const appPath = require('electron').remote.app.getAppPath();
        const i18n = new (require(path.resolve(appPath, './translations/i18n')));

        if (add.success) {
            this.getStore('expenses').load({
                callback: function () {
                    this.resetOnSend();
                    dialog.showMessageBox({
                        title: 'Datos guardados',
                        message: 'Se agregó el gasto',
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
    resetOnSend: function () {
        if (!this.getViewModel().get('keepFormData.checked')) this.resetForm();
    },
    resetForm: function () {
        //if (!this.getViewModel().get('keepFormData')) {
        this.lookup('addExpense').getForm().setValues(this.getViewModel().get('initialFormData'));
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
        console.debug(this.getStore('expenses'));
        //</debug>
    }

});
