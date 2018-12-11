Ext.define('Cooperativista.model.ReceiptGrandType', {
    extend: 'Cooperativista.model.Base',

    fields: [
        { name: 'id', type: 'int' },
        { name: 'receipt_grand_type_description', type: 'string' },
        { name: 'receipt_code', type: 'string' }

    ],
    proxy: {
        type: 'rest',
        api: {
            create: 'sqlite://receipt_grand_types_add',
            read: 'sqlite://receipt_grand_types_load',
            update: 'sqlite://receipt_grand_types_update',
            destroy: 'sqlite://receipt_grand_types_delete'
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
