Ext.define('Cooperativista.store.Receipts', {
    extend: 'Ext.data.Store',
    alias: 'store.receipts',
    storeId: 'Receipts',
    model: 'Cooperativista.model.Receipt',
    autoLoad: true
});
