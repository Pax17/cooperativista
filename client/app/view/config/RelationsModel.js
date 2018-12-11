Ext.define('Cooperativista.view.config.RelationsModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.relations',

    requires: [
        'Cooperativista.store.Partners',
        'Cooperativista.store.Students',
        'Cooperativista.store.Courses',
        'Cooperativista.store.Donators',
        'Ext.data.ChainedStore',
        'Ext.data.field.Integer',
        'Ext.data.field.String',
        'Ext.data.field.Date',
        'Ext.data.field.Boolean',
        'Ext.data.reader.Json'
    ],
    data: {
        idCurso: undefined,
        groupByTypeId: 1,
        studentsSelected: 0,
        studentsCanPromote: false,
        studentsPromoteFrom: 0,
        userAction: {update: false}
    },
    stores: {
        coursesForPromotion: {
            source: '{courses}',
            filters: [
                {
                    property: 'name',
                    value: '{studentsPromoteFrom}',
                    disableOnEmpty: true,
                    operator: '>='
                }
            ]
        },
        studentsStore: {
            source: '{studentsStoreOrigin}',
            sorters: ['studentCourse'],
            groupField: 'studentCourse',
            filters: [
                {
                    property: 'entity_id',
                    value: '{currentEntity}'
                },
                {
                    property: 'has_attribute_5',
                    value: '{!hideGraduates.checked}',
                    disabled: '{!hideGraduates.checked}',
                    filterFn: function (rec) {
                        //<debug>
                        console.debug('Filtramos o no?', this, this.getDisabled());
                        //</debug>
                        if (this.getValue()) return true;
                        //<debug>
                        console.debug(this.getValue(), rec.get('has_attribute_5'), rec.get('attribute_5'), rec.get('attribute_5') >= Ext.Date.clearTime(new Date));
                        //</debug>
                        if (rec.get('has_attribute_5')) {
                            return rec.get('attribute_5') >= Ext.Date.clearTime(new Date);
                        } else {
                            return true;
                        }
                        //return !rec.get('has_attribute_5') || rec.get('attribute_5') >= Ext.Data.clearTime(new Date);
                    }
                }
            ],
            listeners: {
                filterchange: 'restoreView'
            }
        },
        families: {
            source: '{partners}',
            filters: [
                {
                    property: 'partner_type_id',
                    value: 3
                },
                {
                    property: 'entity_id',
                    value: '{currentEntity}'
                }
            ]
        },
        suppliers: {
            source: '{partners}',
            filters: [
                {
                    property: 'partner_type_id',
                    value: 5
                },
                {
                    property: 'entity_id',
                    value: '{currentEntity}'
                }
            ]
        }
    }
});
