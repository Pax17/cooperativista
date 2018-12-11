Ext.define('Cooperativista.model.ExpenseGrandType', {
    extend: 'Cooperativista.model.Base',

    fields: [
        { name: 'id', type: 'auto' },
        { name: 'expense_grand_type_description', type: 'auto' },
        { name: 'expense_code', type: 'auto' }

    ],
    proxy: {
        type: 'rest',
        api: {
            create: 'sqlite://expense_grand_types_add',
            read: 'sqlite://expense_grand_types_load',
            update: 'sqlite://expense_grand_types_update',
            destroy: 'sqlite://expense_grand_types_delete'
        },
        reader: {
            type: 'json',
            rootProperty: 'data'
        }/*,
        extraParams: {
            status: 1
        }*/

    }
});
