Ext.define('Cooperativista.model.Expense', {
    extend: 'Cooperativista.model.Base',
    alias: 'model.expense',

    fields: [
        { name: 'id', type: 'auto' },
        { name: 'expense_type_id', type: 'auto' },
        { name: 'payment_type_id', type: 'auto' },
        { name: 'partner_id', type: 'auto' },
        { name: 'expense_date', type: 'date', dateFormat: 'Y-m-d' },
        { name: 'expense_period_start', type: 'date', dateFormat: 'Y-m-d'  },
        { name: 'expense_period_end',  type: 'date', dateFormat: 'Y-m-d'  },
        { name: 'amount', type: 'number' },
        { name: 'currency', type: 'auto' },
        { name: 'notes', type: 'auto' },
        { name: 'entity_id', type: 'auto' },
        { name: 'base_user_id', type: 'auto' },
        { name: 'printed', type: 'date', dateFormat: 'Y-m-d' },
        { name: 'payment_description', type: 'auto' },
        { name: 'payment_code', type: 'auto' },
        { name: 'expense_description', type: 'auto' },
        { name: 'expense_code', type: 'auto' },
        { name: 'expense_grand_type_description', type: 'auto' },
        {
            name: 'name'
        },
        {
            name: 'name_2'
        },
        {
            name: 'name_3'
        },
        {
            name: 'supplier',
            calculate: function (data) {
                return `${data.name} ${data.name_2||''} ${data.name_3||''}`;
            }
        }

    ],
    proxy: {
        type: 'rest',
        api: {
            create: 'sqlite://expenses_add',
            read: 'sqlite://expenses_load',
            update: 'sqlite://expenses_update',
            destroy: 'sqlite://expenses_delete'
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
