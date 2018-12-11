Ext.define('Cooperativista.store.PartnerTypes', {
    extend: 'Ext.data.Store',
    alias: 'store.partnerTypes',
    storeId: 'PartnersTypes',
    model: 'Cooperativista.model.PartnerType',
    autoLoad: true
});
