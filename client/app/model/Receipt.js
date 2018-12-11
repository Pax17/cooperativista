Ext.define('Cooperativista.model.Receipt', {
    extend: 'Cooperativista.model.Base',
    alias: 'model.receipt',

    fields: [
        { name: 'id', type: 'auto' },
        { name: 'receipt_type_id', type: 'auto' },
        { name: 'payment_type_id', type: 'auto' },
        { name: 'partner_id', type: 'auto' },
        { name: 'receipt_date', type: 'date', dateFormat: 'Y-m-d' },
        { name: 'receipt_period_start', type: 'date', dateFormat: 'Y-m-d'  },
        { name: 'receipt_period_end',  type: 'date', dateFormat: 'Y-m-d'  },
        { name: 'amount', type: 'number' },
        { name: 'currency', type: 'auto' },
        { name: 'notes', type: 'auto' },
        { name: 'entity_id', type: 'auto' },
        { name: 'base_user_id', type: 'auto' },
        { name: 'printed', type: 'date', dateFormat: 'Y-m-d' },
        { name: 'name', type: 'auto' },
        { name: 'name_2', type: 'auto' },
        { name: 'name_3', type: 'auto' },
        { name: 'attribute_1', type: 'auto' },
        { name: 'attribute_2', type: 'auto' },
        { name: 'attribute_3', type: 'auto' },
        { name: 'attribute_4', type: 'auto' },
        { name: 'attribute_5', type: 'auto' },
        { name: 'payment_description', type: 'auto' },
        { name: 'payment_code', type: 'auto' },
        { name: 'receipt_description', type: 'auto' },
        { name: 'receipt_code', type: 'auto' },
        { name: 'receipt_number', type: 'auto' },
        { name: 'type_description', type: 'auto' },
        { name: 'type_code', type: 'auto' },
        { name: 'course_id', type: 'auto' },
        { name: 'course_name', type: 'auto' },
        { name: 'course_name_2', type: 'auto' },
        { name: 'course_name_3', type: 'auto' },
        { name: 'course_attribute_1', type: 'auto' },
        { name: 'course_attribute_2', type: 'auto' },
        { name: 'course_attribute_3', type: 'auto' },
        { name: 'course_attribute_4', type: 'auto' },
        { name: 'course_attribute_5', type: 'auto' },
        { name: 'course_type_description', type: 'auto' },
        { name: 'course_type_code', type: 'auto' },
        { name: 'family_id', type: 'auto' },
        { name: 'family_name', type: 'auto' },
        { name: 'family_name_2', type: 'auto' },
        { name: 'family_name_3', type: 'auto' },
        { name: 'family_attribute_1', type: 'auto' },
        { name: 'family_attribute_2', type: 'auto' },
        { name: 'family_attribute_3', type: 'auto' },
        { name: 'family_attribute_4', type: 'auto' },
        { name: 'family_attribute_5', type: 'auto' },
        { name: 'family_type_description', type: 'auto' },
        { name: 'family_type_code', type: 'auto' }

    ],
    proxy: {
        type: 'rest',
        api: {
            create: 'sqlite://receipts_add',
            read: 'sqlite://receipts_load',
            update: 'sqlite://receipts_update',
            destroy: 'sqlite://receipts_delete'
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
