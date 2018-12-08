Ext.define('Cooperativista.store.Courses', {
    extend: 'Ext.data.Store',
    alias: 'store.courses',
    storeId: 'Courses',
    model: 'Cooperativista.model.Course',
    autoLoad: true
});
