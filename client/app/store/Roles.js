Ext.define('Cooperativista.store.Roles', {
    extend: 'Ext.data.Store',
    alias: 'store.roles',
    storeId: 'Roles',
    model: 'Cooperativista.model.Rol',
    autoLoad: true
});
