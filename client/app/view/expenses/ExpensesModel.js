Ext.define('Cooperativista.view.config.ExpensesModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.expenses',
    requires: [
        'Ext.data.ChainedStore',
        'Ext.data.field.Integer',
        'Ext.data.field.String',
        'Ext.data.field.Date',
        'Ext.data.field.Boolean',
        'Ext.data.reader.Json'
    ],
    data: {
        filterCourseId: null,
        tipoPeriodoDefault: 1,
        defaultFeeAmount: 100,
        displayMonth: {
            text: 'Selecionar mes',
            icon: 'fa-calendar'
        },
        filterDateParam: 'expense_date',
        filterExpenseTypeCode: null,
        filterExpenseTypeId: null,
        filterPartnerId: null
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
        expenses: {
            type: 'expenses',
            filters: [
                {
                    property: 'entity_id',
                    value: '{currentEntity}'
                },
                {
                    property: 'expense_date',
                    value: ['{filter_date_start}', '{filter_date_end}'],
                    disabled: '{filterDateParam != "expense_date"}',
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
                    property: 'expense_period_start',
                    // disableOnEmpty: true,
                    value: '{filter_date_start}',
                    disabled: '{filterDateParam != "expense_period"}',
                    operator: '>='
                },
                {
                    property: 'expense_period_end',
                    //  disableOnEmpty: true,
                    value: '{filter_date_end}',
                    disabled: '{filterDateParam != "expense_period"}',
                    operator: '<='
                },
                {
                    property: 'partner_id',
                    disableOnEmpty: true,
                    value: '{filterPartnerId}',
                    operator: '='
                },
                {
                    property: 'expense_code',
                    disableOnEmpty: true,
                    value: '{filterExpenseTypeCode}',
                    operator: '='
                },
                {
                    property: 'expense_type_id',
                    disableOnEmpty: true,
                    value: '{filterExpenseTypeId}',
                    operator: '='
                }
            ]
        },
        expense_types_enabled: {
            source: '{expense_types}',
            filters: [
                {
                    property: 'expense_code',
                    value: '{expense_code.value}',
                    operator: '='
                },
                {
                    property: 'status',
                    value: 1
                }
            ]
        },
        expense_types_filter: {
            source: '{expense_types}',
            filters: [
                {
                    property: 'status',
                    value: 1
                },
                {
                    property: 'expense_code',
                    disableOnEmpty: true,
                    value: '{filterExpenseTypeCode}',
                    operator: '='
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
        suppliersActives: {
            source: '{suppliers}',
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
        }
    }
});
