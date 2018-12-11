Ext.define('Cooperativista.model.Entity', {
    extend: 'Cooperativista.model.Base',

    alias: 'model.entity',

    /**
     * SELECT  e.id, e.name, e.name_2, e.name_3, e.attribute_1, e.attribute_2, e.attribute_3, e.attribute_4, e.attribute_5, e.is_default entities e
     */
    fields: [
        {
            name: 'id'
        },
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
            name: 'attribute_1'
        },
        {
            name: 'attribute_2'
        },
        {
            name: 'attribute_3'
        },
        {
            name: 'attribute_4'
        },
        {
            name: 'attribute_5'
        },
        {
            name: 'is_default'
        }
    ],
    //pageSize: 5,
    //autoLoad: true,
    proxy: {
        type: 'rest',
        api: {
            create: 'sqlite://entities_add',
            read: 'sqlite://entities_load',
            update: 'sqlite://entities_update',
            destroy: 'sqlite://entities_delete'
        },
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }
});
