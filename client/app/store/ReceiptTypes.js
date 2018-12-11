Ext.define('Cooperativista.store.ReceiptTypes', {
    extend: 'Ext.data.Store',
    alias: 'store.receiptTypes',
    storeId: 'ReceiptTypes',
    model: 'Cooperativista.model.ReceiptType',
    autoLoad: true
});
