/**
 * @class Cooperativista.view.forms.WizardFormController
 */
Ext.define('Cooperativista.view.forms.WizardFormController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.wizardform',

    init: function (view) {
        const tb = this.lookupReference('navigation-toolbar'),
            buttons = tb.items.items,
            ui = view.colorScheme;

        //Apply styling buttons
        if (ui) {
            buttons[1].setUI(ui);
            buttons[2].setUI(ui);
        }
    },

    onNextClick: function (button) {
        //This is where you can handle any logic prior to moving to the next card
        const panel = button.up('panel');

        panel.getViewModel().set('atBeginning', false);

        this.navigate(button, panel, 'next');
    },

    onPreviousClick: function (button) {
        const panel = button.up('panel');

        panel.getViewModel().set('atEnd', false);

        this.navigate(button, panel, 'prev');
    },

    navigate: function (button, panel, direction) {
        let layout = panel.getLayout(),
            progress = this.lookupReference('progress'),
            model = panel.getViewModel(),
            progressItems = progress.items.items,
            item, i, activeItem, activeIndex, totalItems;

        layout[direction]();

        activeItem = layout.getActiveItem();
        activeIndex = panel.items.indexOf(activeItem);
        totalItems = progressItems.length || panel.items.getCount();

        //<debug>
        console.debug('ITEMS', panel.items.getCount());
        //</debug>
        for (i = 0; i < progressItems.length; i++) {
            item = progressItems[i];

            if (activeIndex === item.step) {
                item.setPressed(true);
            }
            else {
                item.setPressed(false);
            }
        }

        activeItem.focus();

        // beginning disables previous
        if (activeIndex === 0) {
            model.set('atBeginning', true);
        }

        // wizard is 4 steps. Disable next at end.
        if (activeIndex === totalItems - 1) {
            model.set('atEnd', true);
        }
    },
    saveFirstRun: function () {

        console.log(this.lookup('usersetup').isValid(), this.lookup('entitysetup').isValid())

        let path = require("path");
        const {dialog} = require('electron').remote;
        const nativeImage = require('electron').remote.nativeImage;
        const appPath = require('electron').remote.app.getAppPath();
        const i18n = new (require(path.resolve(appPath, './translations/i18n')));
        if (this.lookup('usersetup').isValid() && this.lookup('entitysetup').isValid() && this.lookup('periodsetup').isValid()) {
            let period = [];
            let formPeriodData = this.lookup('periodsetup').getValues();
            for (const key in formPeriodData) {
                if (formPeriodData.hasOwnProperty(key)) {
                    period.push({
                        taxonomy: key,
                        value: formPeriodData[key]
                    })
                }
            }

            const data = {
                userData: this.lookup('usersetup').getValues(),
                entityData: this.lookup('entitysetup').getValues(),
                periodData: period
            }
            const {ipcRenderer} = require('electron');
            let setup = ipcRenderer.sendSync('set-first-run-data', data);
            if (setup.success) {
                this.fireEvent('settingsupdated', data)
                Ext.defer(function () {
                    this.fireEvent('periodsettingschange')
                }, 150, this);
                this.redirectTo('dashboard', true);
            } else {
                dialog.showErrorBox('Error en la configuración', 'Se generó un error al inicializar la aplicación');
            }
        } else {
            dialog.showErrorBox('Configuración incompleta', 'Hay campos obligatprios sin completar');
        }
    },
    firstSetupRun: function () {
        //get-first-run-data
        const {ipcRenderer} = require('electron');
        let firstRun = ipcRenderer.sendSync('get-first-run-data');

        console.debug('firstRun', firstRun)
        if (firstRun.user) {
            this.lookup('usersetup').getForm().setValues(firstRun.user)
        }
        if (firstRun.entity) {
            this.lookup('entitysetup').getForm().setValues(firstRun.entity)
        }
    },
    firstMigrationRun: function () {

    },
    startMigration: function (btn) {
        this._migrating = true;
        //<debug>
        console.debug(this);
        //</debug>
        const panel = btn.up('panel');
        let layout = panel.getLayout();
        let data = this.lookup('migrationsetup').getValues();
        let me = this;
        const viewModel = this.getViewModel();
        layout.next();
        btn.disable();
        //<debug>
        console.debug(data);
        //</debug>
        viewModel.set('atBeginning', true);
        viewModel.set('atEnd', true);
        // return;
        let status = [];
        viewModel.set('migrationStatus', status);
        const path = require("path");
        const {ipcRenderer} = require('electron');
        const {dialog, app, nativeImage} = require('electron').remote;
        const appPath = app.getAppPath();
        const i18n = new (require(path.resolve(appPath, './translations/i18n')));
        const migrationPanel = this.lookup('migrationStatusPanel');

        ipcRenderer.on('migration-status', (event, message) => {
            console.log(message);
            status.push(message);
            migrationPanel.setData(status);
        })//'end-db-migration'


        ipcRenderer.on('end-db-migration', (event, setup) => {
            if (setup.success) {
                Ext.defer(function () {
                    dialog.showMessageBox({
                        type: 'info',
                        title: 'Período finalizado',
                        buttons: ['Continuar'],
                        message: 'Tareas finalizadas. Se reiniciará la aplicación',
                        detail: 'Se finalizó el período en curso y se migraron los datos a una base de datos solo lectura. Recuerde configurar el nuevo período.'
                    }, function () {
                        delete this._migrating;
                        Ext.defer(function () {
                            app.relaunch();
                            app.exit(0);
                        }, 600, this)
                    });
                }, 200, this)
            } else {
                dialog.showErrorBox('Error en la configuración', 'Se generó un error al inicializar la aplicación');
                delete this._migrating;
                layout.prev();
            }
        })//'end-db-migration'
        Ext.defer(function () {
            ipcRenderer.send('start-db-migration', data);
        }, 100, this)


    },
    cancelMigration: function () {
        if (!this._migrating)
            Ext.util.History.back()
    }
});
