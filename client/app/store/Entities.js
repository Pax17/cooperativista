Ext.define('Cooperativista.store.Entities', {
    extend: 'Ext.data.Store',
    alias: 'store.entities',
    storeId: 'Entities',
    model: 'Cooperativista.model.Entity',
    autoLoad: true
});
