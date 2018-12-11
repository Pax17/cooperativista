Ext.define('Cooperativista.model.PaymentTypeFull', {
    extend: 'Cooperativista.model.Base',

    fields: [
        { name: 'id', type: 'auto' },
        { name: 'payment_description', type: 'auto' },
        { name: 'payment_grand_type_description', type: 'auto' },
        { name: 'payment_code', type: 'auto' },
        { name: 'status', type: 'auto' }

    ],
    proxy: {
        type: 'rest',
        api: {
            create: 'sqlite://payment_types_add',
            read: 'sqlite://payment_types_full_load',
            update: 'sqlite://payment_types_update',
            destroy: 'sqlite://payment_types_delete'
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
