Ext.define('Cooperativista.model.Subscription', {
    extend: 'Cooperativista.model.Base',

    fields: [
        {
            type: 'int',
            name: 'id'
        },
        {
            type: 'string',
            name: 'name'
        },
        {
            type: 'string',
            name: 'subscription'
        }
    ]
});
