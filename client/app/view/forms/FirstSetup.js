Ext.define('Cooperativista.view.forms.FirstSetup', {
    extend: 'Cooperativista.view.forms.LockingWindow',
    xtype: 'firstsetup',

    requires: [
        'Cooperativista.view.forms.SetupForm'
    ],

    title: 'Configuración Inicial',
    defaultFocus: 'setupform', // Focus the Auth Form to force field focus as well

    items: [
        {
            xtype: 'setupform',
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
