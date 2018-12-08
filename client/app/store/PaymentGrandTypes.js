Ext.define('Cooperativista.store.PaymentGrandTypes', {
    extend: 'Ext.data.Store',
    alias: 'store.paymentGrandTypes',
    storeId: 'PaymentGrandTypes',
    model: 'Cooperativista.model.PaymentGrandType',
    autoLoad: true
});
