Ext.define('Cooperativista.store.ExpenseGrandTypes', {
    extend: 'Ext.data.Store',
    alias: 'store.expenseGrandTypes',
    storeId: 'ExpenseGrandTypes',
    model: 'Cooperativista.model.ExpenseGrandType',
    autoLoad: true
});
