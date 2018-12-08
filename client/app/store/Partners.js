Ext.define('Cooperativista.store.Partners', {
    extend: 'Ext.data.Store',
    alias: 'store.partners',
    storeId: 'Partners',
    model: 'Cooperativista.model.Partner',
    autoLoad: true
});
