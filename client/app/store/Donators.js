Ext.define('Cooperativista.store.Donators', {
    extend: 'Ext.data.Store',
    alias: 'store.donators',
    storeId: 'Donators',
    model: 'Cooperativista.model.Donator',
    autoLoad: true
});
