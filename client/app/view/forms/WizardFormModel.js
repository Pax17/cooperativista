Ext.define('Cooperativista.view.forms.WizardFormModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.wizardform',

    data: {
        atBeginning: true,
        atEnd: false,
        migrationStatus: []
    }
});
