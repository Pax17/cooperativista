Ext.define('Cooperativista.store.ExpenseTypes', {
    extend: 'Ext.data.Store',
    alias: 'store.expenseTypes',
    storeId: 'ExpenseTypes',
    model: 'Cooperativista.model.ExpenseType',
    autoLoad: true
});
