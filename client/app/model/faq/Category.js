Ext.define('Cooperativista.model.faq.Category', {
    extend: 'Cooperativista.model.Base',

    fields: [
        {
            type: 'string',
            name: 'name'
        }
    ],

    hasMany: {
        name: 'questions',
        model: 'faq.Question'
    }
});
