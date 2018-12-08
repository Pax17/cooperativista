Ext.define('Cooperativista.view.forms.MigrationSetup', {
    extend: 'Cooperativista.view.forms.LockingWindow',
    xtype: 'migrationsetup',

    requires: [
        'Cooperativista.view.forms.MigrationForm'
    ],
   // reference: 'migrationsetup',

    title: 'Finalización de Período',
    defaultFocus: 'migrationform', // Focus the Auth Form to force field focus as well

    items: [
        {
            xtype: 'migrationform',
            cls: 'shadow',
            colorScheme: 'blue',
            width: 700,
            minHeight: 400
        }
    ],

    initComponent: function () {
        // this.addCls('user-login-register-container');
        this.callParent(arguments);
    }
});
