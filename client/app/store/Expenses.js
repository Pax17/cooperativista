Ext.define('Cooperativista.store.Expenses', {
    extend: 'Ext.data.Store',
    alias: 'store.expenses',
    storeId: 'Expenses',
    model: 'Cooperativista.model.Expense',
    autoLoad: true
});
