Ext.define('Cooperativista.model.PaymentGrandType', {
    extend: 'Cooperativista.model.Base',

    fields: [
        { name: 'id', type: 'auto' },
        { name: 'payment_grand_type_description', type: 'auto' },
        { name: 'payment_code', type: 'auto' }

    ],
    proxy: {
        type: 'rest',
        api: {
            create: 'sqlite://payment_grand_types_add',
            read: 'sqlite://payment_grand_types_load',
            update: 'sqlite://payment_grand_types_update',
            destroy: 'sqlite://payment_grand_types_delete'
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
