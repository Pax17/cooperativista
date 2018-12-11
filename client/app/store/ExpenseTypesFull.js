Ext.define('Cooperativista.store.ExpenseTypesFull', {
    extend: 'Ext.data.Store',
    alias: 'store.expenseTypesFull',
    storeId: 'ExpenseTypesFull',
    model: 'Cooperativista.model.ExpenseTypeFull',
    autoLoad: true
});
