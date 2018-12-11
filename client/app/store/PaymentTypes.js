Ext.define('Cooperativista.store.PaymentTypes', {
    extend: 'Ext.data.Store',
    alias: 'store.paymentTypes',
    storeId: 'PaymentsTypes',
    model: 'Cooperativista.model.PaymentType',
    autoLoad: true
});
