Ext.define('Cooperativista.view.config.OptionsModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.options',

    requires: [
        'Ext.data.ChainedStore',
        'Ext.data.field.Integer',
        'Ext.data.field.String',
        'Ext.data.field.Date',
        'Ext.data.field.Boolean',
        'Ext.data.reader.Json'
    ],
    data: {
        dirtyEntity: false,
        pageLayout: 'portrait',
        fonts: [4, 6, 7, 8, 9, 10, 10.5, 11, 12, 13, 15, 16, 18, 20, 21, 22, 24, 26, 28],
        dirtyPeriodField: {},
        printSettings: {
            dirty: false,
            valid: true
        }

    },
    formulas: {
        dirtyPeriod: {
            bind: {
                bindTo: '{dirtyPeriodField}',
                deep: true
            },
            get: function (dirtyPeriod) {
                let dirty = false;

                for (let property in dirtyPeriod) {
                    if (dirtyPeriod[property] === true) {
                        dirty = true;
                    }
                }
                //<debug>
                console.debug(dirty, dirtyPeriod);
                //</debug>
                return dirty;
            }
        },
        tipoIngresoDefault: {
            bind: '{default_monthly_fee_concept}',
            get: function (val) {
                console.log('default_monthly_fee_concept', val)
                return val;
            }

        }
    },
    stores: {
        entities: {
            type: 'entities',
            remoteFilter: false,
            filters: [
                {
                    property: 'id',
                    value: '{currentEntity}'
                }
            ],
            listeners: {
                load: 'loadEntityForm'
            }
        },
        month_receipt_types_enabled: {
            source: '{receipt_types}',
            filters: [
                {
                    property: 'status',
                    value: 1
                },
                {
                    property: 'receipt_code',
                    value: 'M1'
                }
            ]
        },
        sizes: {
            fields: ['name', 'data'],
            data: [
                {
                    name: 'A4',
                    data: 'A4',
                    h: 210,
                    v: 297,
                    type: 'portrait'
                },
                {
                    name: 'A4',
                    data: 'A4',
                    h: 297,
                    v: 210,
                    type: 'landscape'
                },
                {
                    name: 'A5',
                    data: 'A5',
                    h: 148,
                    v: 210,
                    type: 'portrait'
                },
                {
                    name: 'A5',
                    data: 'A5',
                    h: 210,
                    v: 148,
                    type: 'landscape'
                },
                {
                    name: 'A6',
                    data: 'A6',
                    h: 105,
                    v: 148,
                    type: 'portrait'
                },
                {
                    name: 'A6',
                    data: 'A6',
                    h: 148,
                    v: 105,
                    type: 'landscape'
                },
                {
                    name: 'Carta',
                    data: 'LETTER',
                    h: 216,
                    v: 279,
                    type: 'portrait'
                },
                {
                    name: 'Carta',
                    data: 'LETTER',
                    h: 279,
                    v: 216,
                    type: 'landscape'
                },
                {
                    name: 'Legal',
                    data: 'LEGAL',
                    h: 216,
                    v: 356,
                    type: 'portrait'
                },
                {
                    name: 'Legal',
                    data: 'LEGAL',
                    h: 356,
                    v: 216,
                    type: 'landscape'
                }
            ],
            filters: [
                {
                    property: 'type',
                    value: '{pageLayout}'
                }
            ]
        },
        aligns: {
            fields: ['name', 'data'],
            data: [
                {
                    name: 'Izquierda',
                    data: 'left'
                },
                {
                    name: 'Derecha',
                    data: 'right'
                },
                {
                    name: 'Centrar',
                    data: 'center'
                },
                {
                    name: 'Justificar',
                    data: 'justify'
                }
            ]
        }
    }
});
