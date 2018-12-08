Ext.define('Cooperativista.model.User', {
    extend: 'Cooperativista.model.Base',

    alias: 'model.user',

    /**
     * SELECT bu.id, bu.alias, bu.name, bu.last_name, bu.entity_id, bu.role_id, bu.status, bu.attribute_1, bu.attribute_2, bu.attribute_3, bu.attribute_4, bu.attribute_5, bur.role_description, e.name as entidad FROM base_users bu INNER JOIN base_user_roles bur on bur.id = bu.role_id INNER JOIN entities e on bu.entity_id = e.id WHERE bu.status = 1 AND e.id = 1 = ?
     */
    fields: [
        {
            name: 'name'
        },
        {
            name: 'role',
            mapping: 'role_description'
        },
        {
            name: 'alias'
        },
        {
            name: 'last_name'
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
            name: 'entidad'
        },
        {
            name: 'staus'
        },
        {
            name: 'role_id'
        },
        {
            name: 'entity_id'
        }
    ],
    //pageSize: 5,
    //autoLoad: true,
    proxy: {
        type: 'restcoop',
        noCache: false,
        api: {
            create: 'sqlite://users_add',
            read: 'sqlite://users_load',
            update: 'sqlite://users_update',
            destroy: 'sqlite://users_delete'
        },
        reader: {
            type: 'json',
            rootProperty: 'data'
        }

    }
});
