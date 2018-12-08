Ext.define('Cooperativista.store.Users', {
    extend: 'Ext.data.Store',
    alias: 'store.users',
    storeId: 'Users',
    model: 'Cooperativista.model.User',
    autoLoad: true
});
