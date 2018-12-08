Ext.define('Cooperativista.view.config.SuppliersModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.config-suppliers',
    requires: [
        'Ext.data.ChainedStore',
        'Ext.data.field.Integer',
        'Ext.data.field.String',
        'Ext.data.field.Date',
        'Ext.data.field.Boolean',
        'Ext.data.reader.Json'
    ],

    data: {
    },
    stores: {
    }
});
