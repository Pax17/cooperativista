Ext.define('Cooperativista.model.ReceiptTypeFull', {
    extend: 'Cooperativista.model.Base',

    fields: [
        { name: 'id', type: 'auto' },
        { name: 'receipt_description', type: 'auto' },
        { name: 'receipt_grand_type_description', type: 'auto' },
        { name: 'receipt_code', type: 'auto' },
        { name: 'status', type: 'auto' }

    ],
    proxy: {
        type: 'rest',
        api: {
            create: 'sqlite://receipt_types_add',
            read: 'sqlite://receipt_types_full_load',
            update: 'sqlite://receipt_types_update',
            destroy: 'sqlite://receipt_types_delete'
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
