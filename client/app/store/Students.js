Ext.define('Cooperativista.store.Students', {
    extend: 'Ext.data.Store',
    alias: 'store.students',
    storeId: 'Students',
    model: 'Cooperativista.model.Student',
    autoLoad: true
});
