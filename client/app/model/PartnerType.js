Ext.define('Cooperativista.model.PartnerType', {
    extend: 'Cooperativista.model.Base',

    alias: 'model.partnerType',

    /**SELECT  pt.id, pt.type_description, pt.type_code FROM partner_types pt  */
    fields: [
        {
            name: 'id'
        },
        {
            name: 'type_description'
        },
        {
            name: 'type_code'
        }
    ],
    proxy: {
        type: 'rest',
        api: {
            create: 'sqlite://partner_types_add',
            read: 'sqlite://partner_types_load',
            update: 'sqlite://partner_types_update',
            destroy: 'sqlite://partner_types_delete'
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
