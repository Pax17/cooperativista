Ext.define('Cooperativista.store.Suppliers', {
    extend: 'Ext.data.Store',
    alias: 'store.suppliers',
    storeId: 'Suppliers',
    model: 'Cooperativista.model.Supplier',
    autoLoad: true
});
