Ext.define('Cooperativista.model.Rol', {
    extend: 'Cooperativista.model.Base',

    alias: 'model.rol',

    /**
     * SELECT bur.id, bur.role_description, bur.role_unique FROM  base_user_roles bur
     */
    fields: [
        {
            name: 'id'
        },
        {
            name: 'role_description'
        },
        {
            name: 'role_unique'
        }
    ],
    //pageSize: 5,
    //autoLoad: true,
    proxy: {
        type: 'rest',
        api: {
            create: 'sqlite://roles_add',
            read: 'sqlite://roles_load',
            update: 'sqlite://roles_update',
            destroy: 'sqlite://roles_delete'
        },
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }
});
