Ext.define('Cooperativista.store.faq.FAQ', {
    extend: 'Ext.data.Store',
    alias: 'store.faq',

    model: 'Cooperativista.model.faq.Category',

    proxy: {
        type: 'api',
        url: '~api/faq/faq'
    }
});
