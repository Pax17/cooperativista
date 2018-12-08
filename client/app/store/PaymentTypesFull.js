Ext.define('Cooperativista.store.PaymentTypesFull', {
    extend: 'Ext.data.Store',
    alias: 'store.paymentTypesFull',
    storeId: 'PaymentTypesFull',
    model: 'Cooperativista.model.PaymentTypeFull',
    autoLoad: true
});
