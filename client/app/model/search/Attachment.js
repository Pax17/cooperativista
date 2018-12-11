Ext.define('Cooperativista.model.search.Attachment', {
    extend: 'Cooperativista.model.Base',

    fields: [
        {
            type: 'int',
            name: 'id'
        },
        {
            type: 'string',
            name: 'url'
        },
        {
            type: 'string',
            name: 'title'
        }
    ]
});
