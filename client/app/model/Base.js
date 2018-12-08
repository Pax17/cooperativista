Ext.define('Cooperativista.model.Base', {
    extend: 'Ext.data.Model',
    requires:['Cooperativista.model.proxy.Rest'],
    schema: {
        namespace: 'Cooperativista.model'
    }
});
