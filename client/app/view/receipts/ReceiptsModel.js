Ext.define('Cooperativista.view.receipts.ReceiptsModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.receipts-receipts',
    data: {
        filterCourseId: null,
        tipoPeriodoDefault: 1,
        defaultFeeAmount: 100,
        displayMonth: {
            text: 'Selecionar mes',
            icon: 'fa-calendar'
        },
        filterDateParam: 'receipt_date',
        filterCourseId: null,
        filterFamilyId: null,
        filterPartnerId: null,
        hasSelection: false
    },
    formulas: {
        tipoIngresoDefault: {
            bind: '{default_monthly_fee_concept}',
            get: function (val) {
                console.log('default_monthly_fee_concept', val)
                return val;
            }

        },
        tipoIngresoSelected: {
            bind: '{tipoIngreso.value}',
            get: function (val) {
                return val;
            }
        },
        filter_partner_id: {
            bind: {
                student: '{filter_student_partner_id.value}',
                donator: '{filter_donator_partner_id.value}'
            },
            get: function (data) {
                let id = data.student || data.donator || null;
                console.debug(id);
                return id;
            }
        }
    },
    stores: {
        //autoLoad: false,
        receipts: {
            type: 'receipts',
            groupField: 'family_name',
            filters: [
                {
                    property: 'entity_id',
                    value: '{currentEntity}'
                },
                {
                    property: 'receipt_date',
                    value: ['{filter_date_start}', '{filter_date_end}'],
                    disabled: '{filterDateParam != "receipt_date"}',
                    filterFn: function (item) {
                        //<debug>
                        //  console.debug(this, this.getProperty(), item.get(this.getProperty()), this.getValue());
                        //</debug>
                        let filterVal = this.getValue(),
                            itemVal = item.get(this.getProperty());

                        if (this.getValue().length === 0) {
                            return this.disabled;
                        }
                        //<debug>
                        console.debug(itemVal.getTime(), filterVal[0].getTime(), filterVal[1].getTime(), itemVal >= filterVal[0] && itemVal <= filterVal[1]);
                        //</debug>
                        return itemVal.getTime() >= filterVal[0].getTime() && itemVal.getTime() <= filterVal[1].getTime();
                    }
                },
                {
                    property: 'receipt_period_start',
                    // disableOnEmpty: true,
                    value: '{filter_date_start}',
                    disabled: '{filterDateParam != "receipt_period"}',
                    operator: '>='
                },
                {
                    property: 'receipt_period_end',
                    //  disableOnEmpty: true,
                    value: '{filter_date_end}',
                    disabled: '{filterDateParam != "receipt_period"}',
                    operator: '<='
                },
                {
                    property: 'partner_id',
                    disableOnEmpty: true,
                    value: '{filterPartnerId}',
                    operator: '='
                },
                {
                    property: 'course_id',
                    disableOnEmpty: true,
                    value: '{filterCourseId}',
                    operator: '='
                },
                {
                    property: 'family_id',
                    disableOnEmpty: true,
                    value: '{filterFamilyId}',
                    operator: '='
                },
                {
                    property: 'printed',
                    disabled: '{!printPending.checked}',
                    value: null,
                    operator: '='
                }
            ]
        },

        receipt_types_enabled: {
            source: '{receipt_types}',
            filters: [
                {
                    property: 'status',
                    value: 1
                },
                {
                    property: 'receipt_code',
                    value: 'M1',
                    disabled: '{tipoIngreso.value!=1}'
                }
            ]
        },
        payment_types_enabled: {
            source: '{payment_types}',
            filters: [
                {
                    property: 'status',
                    value: 1
                }
            ]
        },
        studentsStore: {
            source: '{studentsStoreOrigin}',
            groupField: 'studentCourse',
            filters: [
                {
                    property: 'entity_id',
                    value: '{currentEntity}'
                },
                {
                    property: 'has_attribute_5',
                    value: true,
                    filterFn: function (rec) {
                        if (rec.get('has_attribute_5')) {
                            return rec.get('attribute_5') >= Ext.Date.clearTime(new Date);
                        } else {
                            return true;
                        }
                        //return !rec.get('has_attribute_5') || rec.get('attribute_5') >= Ext.Data.clearTime(new Date);
                    }
                }
            ]
        },
        studentsAll: {
            source: '{studentsStoreOrigin}',
            filters: [
                {
                    property: 'entity_id',
                    value: '{currentEntity}'
                },
                {
                    property: 'course_id',
                    value: '{filterCourseId}',
                    disableOnEmpty: true
                }
            ]
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
        }
    }
});
