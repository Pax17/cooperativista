Ext.define('Cooperativista.view.config.Expenses', {
    extend: 'Ext.tab.Panel',
    xtype: 'expenses',
    requires: [
        'Cooperativista.view.config.ExpensesController',
        'Cooperativista.view.config.ExpensesModel'
    ],

    controller: 'expenses',
    viewModel: {
        type: 'expenses'
    },
    deferredRender: true,
    ui: 'navigation',
    cls: 'shadow',
    items: [
        {
            title: 'Ingreso de Gastos',
            iconCls: 'x-fas fa-credit-card',
            xtype: 'form',
            scrollable: 'y',
            cls: 'nice-form',
            //  title: 'Datos de la Entidad',
            defaultType: 'textfield',
            reference: 'addExpense',
            plugins: 'responsive',
            responsiveConfig: {
                'width >= 1000': {
                    layout: {
                        type: 'box',
                        align: 'stretch',
                        vertical: false
                    }
                },

                'width < 1000': {
                    layout: {
                        type: 'box',
                        align: 'stretch',
                        vertical: true
                    }
                }
            },
            buttons: [
                {
                    //formBind: true,
                    iconCls: 'x-fas fa-times',
                    handler: 'resetForm'
                },
                {
                    formBind: true,
                    iconCls: 'x-fas fa-check',
                    handler: 'addExpense'
                },
                {
                    //formBind: true,
                    iconCls: 'x-fas fa-save',
                    handler: 'saveDialog'
                }
            ],
            items: [
                {
                    xtype: 'container',
                    layout: 'anchor',
                    padding: 15,

                    flex: 2,
                    minWidth: 370,
                    defaults: {
                        labelWidth: 90,
                        labelAlign: 'top',
                        labelSeparator: '',
                        submitEmptyText: false,
                        anchor: '100%'
                    },
                    items: [
                        {
                            xtype: 'combo',
                            bind: {
                                store: '{expense_grand_types}'
                            },
                            anyMatch: true,
                            emptyText: 'Grupo de gastos',
                            reference: 'expense_code',
                            // flex: 1,
                            name: 'expense_code',
                            queryMode: 'local',
                            submitValue: false,
                            // displayTpl: '<tpl for=".">{name} {name_2} {name_3}<tpl if="xindex < xcount">' + this.delimiter + '</tpl></tpl>',
                            valueField: 'expense_code',
                            displayField: 'expense_grand_type_description',
                            forceSelection: true,
                            publishes: 'value'
                        },
                        {
                            xtype: 'combo',
                            bind: {
                                store: '{expense_types_enabled}',
                                visible:'{expense_code.value}'
                            },
                            emptyText: 'Tipo de ingreso',
                            flex: 1,
                            reference: 'expense_type_id',
                            name: 'expense_type_id',
                            queryMode: 'local',
                            //  displayTpl: '<tpl for=".">{name} {name_3}<tpl if="xindex < xcount">' + this.delimiter + '</tpl></tpl>',
                            valueField: 'id',
                            displayField: 'expense_description',
                            forceSelection: true,
                            allowBlank: false
                        },
                        {
                            xtype: 'fieldcontainer',
                            fieldLabel: 'Período',
                            layout: {
                                type: 'hbox',
                                align: 'stretch'
                            },
                            defaults: {
                                xtype: 'datefield',
                                flex: 1,
                                submitFormat: '',
                                allowBlank: false
                            },
                            items: [
                                {
                                    emptyText: 'Desde',
                                    reference: 'expense_period_start',
                                    name: 'expense_period_start',
                                    publishes: 'value',
                                    margin: '0 4 0 0',
                                    submitFormat: 'Y-m-d',
                                    bind: {
                                        maxValue: '{expense_period_end.value}'
                                    }
                                },
                                {
                                    emptyText: 'Hasta',
                                    reference: 'expense_period_end',
                                    publishes: 'value',
                                    name: 'expense_period_end',
                                    margin: '0 0 0 4',
                                    submitFormat: 'Y-m-d',
                                    bind: {
                                        minValue: '{expense_period_start.value}'
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype: 'container',
                    layout: 'anchor',
                    flex: 4,
                    padding: 15,
                    defaults: {
                        labelWidth: 90,
                        labelAlign: 'top',
                        labelSeparator: '',
                        submitEmptyText: false,
                        anchor: '100%'
                    },
                    items: [
                        {
                            xtype: 'combo',
                            bind: {
                                store: '{suppliersActives}'
                            },
                            fieldLabel: 'Proveedor',
                            anyMatch: true,
                            emptyText: 'Buscar Proveedor',
                            flex: 1,
                            name: 'partner_id',
                            queryMode: 'local',
                            //  displayTpl: '<tpl for=".">{name} {name_3}<tpl if="xindex < xcount">' + this.delimiter + '</tpl></tpl>',
                            valueField: 'id',
                            displayField: 'supplierSearch',
                            forceSelection: true,
                            allowBlank: false/*,
                            listConfig: {
                                getInnerTpl: function () {
                                    return '{name} {name_3}'
                                }

                            }*/
                        },
                        {
                            xtype: 'numberfield',
                            fieldLabel: 'Monto',
                            name: 'amount',
                            minValue: 0,
                            reference: 'amount',
                            allowBlank: false,
                            emptyText: 'Ingrese el monto dl Gasto'
                        },
                        {
                            xtype: 'combo',
                            bind: {
                                store: '{payment_types_enabled}'
                            },
                            fieldLabel: 'Método de pago',
                            anyMatch: true,
                            emptyText: 'Tipo de pago',
                            value: 1,
                            flex: 1,
                            name: 'payment_type_id',
                            queryMode: 'local',
                            //  displayTpl: '<tpl for=".">{name} {name_3}<tpl if="xindex < xcount">' + this.delimiter + '</tpl></tpl>',
                            valueField: 'id',
                            displayField: 'payment_description',
                            forceSelection: true,
                            allowBlank: false/*,
                            listConfig: {
                                getInnerTpl: function () {
                                    return '{name} {name_3}'
                                }

                            }*/
                        },
                        {
                            xtype: 'textarea',
                            name: 'notes',
                            fieldLabel: 'Observaciones',
                            emptyText: '(Opcional)'

                        },
                        {
                            xtype: 'checkbox',
                            submitValue: false,
                            reference: 'keepFormData',
                            boxLabel: 'Mantener datos del formulario al guardar'
                        },
                        {
                            xtype: 'numberfield',
                            hidden: true,
                            bind: '{currentEntity}',
                            name: 'entity_id'
                        },
                        {
                            xtype: 'numberfield',
                            hidden: true,
                            bind: '{currentUser.id}',
                            name: 'base_user_id'
                        }
                    ]

                }
            ]
        },
        {
            title: 'Gastos generados',
            iconCls: 'x-fas fa-receipt',
            xtype: 'panel',
            layout: 'border',
            items: [
                {
                    xtype: 'form',
                    title: 'Busqueda',
                    ui: 'light',
                    iconCls: 'x-fas fa-search',
                    //   margin: '1px 2px 0 0  ',
                    region: 'west',
                    width: 280,
                    // cls: 'shadow-right',
                    split: true,
                    //border: 1,
                    collapsible: true,
                    layout: {
                        type: 'box',
                        vertical: true,
                        align: 'stretch'
                    },
                    bodyPadding: 15,
                    defaults: {
                        margin: '3 0'
                    },
                    items: [
                        {
                            xtype: 'checkbox',
                            boxLabel: 'Gastos sin imprimir',
                            checked: true,
                            name: 'printed',
                            reference: 'printPending'
                        },
                        {
                            xtype: 'daterangepicker',
                            referene: 'rangepicker',
                            drpDefaults: {
                                // selectedStart: '1974-02-26',
                                //  selectedEnd: '2014-02-26',
                                dateFormat: 'd-m-Y',
                                showButtonTip: true,
                                showTimePickers: true,
                                timeFormat: 'h:i:s',
                                timeIncrement: 30,
                                //   timePickerFromValue: '5:55:55 PM',
                                //  timePickerToValue: '4:44:44 pm',
                                presetPeriodsThisWeekText: 'Esta semana',
                                presetPeriodsLastWeekText: 'Semana anterior',
                                presetPeriodsThisMonthText: 'Este mes',
                                presetPeriodsLastMonthText: 'Mes anterior',
                                presetPeriodsThisYearText: 'Este año',
                                mainBtnTextPrefix: 'Período: ',
                                showTimePickers: false,
                                //timePickersEditable: true,
                                //timePickersQueryDelay: 500,
                                //timePickersWidth: 120,
                                mainBtnIconCls: 'x-fas fa-calendar-alt',
                                mainBtnTextColor: '#ffef00',
                                presetPeriodsBtnText: 'Períodos definidos',
                                presetPeriodsBtnIconCls: 'x-fas fa-calendar-check',
                                confirmBtnText: 'Confirmar',
                                confirmBtnIconCls: 'x-fas fa-check',
                                bindDateFields: false/*,
                                boundStartField: 'filter_expense_period_start',
                                boundEndField: 'filter_expense_period_end'*/
                            },
                            listeners: {
                                rangechange: 'onRangeChange' //rangepicked:
                            }
                            /*,
                            listeners:
                                {
                                    menuhide: function(btn)
                                    {
                                        btn.up('panel').down('displayfield[xRole=info]').setValue
                                        (
                                            '<b>Period contains</b><br>' + btn.getPickerValue().periodDetailsPrecise.diffAsText + '<br>OR<br>' +
                                            btn.getPickerValue().periodDetails.yearsCount + ' years ' + btn.getPickerValue().periodDetails.monthsCount + ' months ' +
                                            btn.getPickerValue().periodDetails.weeksCount + ' weeks ' + btn.getPickerValue().periodDetails.daysCount + ' days ' +
                                            btn.getPickerValue().periodDetails.hoursCount + ' hours ' + btn.getPickerValue().periodDetails.minutesCount + ' minutes ' +
                                            btn.getPickerValue().periodDetails.secondsCount + ' seconds ' + btn.getPickerValue().periodDetails.millisecondsCount + ' milliseconds'
                                        );
                                    }
                                }*/
                        },
                        {
                            xtype: 'combo',
                            bind: {
                                store: '{suppliers}',
                                value: '{filterPartnerId}'
                            },
                            anyMatch: true,
                            emptyText: 'Buscar x Proveedor',
                            reference: 'filter_donator_partner_id',
                            // flex: 1,
                            name: 'partner_id',
                            queryMode: 'local',
                            // displayTpl: '<tpl for=".">{name} {name_2} {name_3}<tpl if="xindex < xcount">' + this.delimiter + '</tpl></tpl>',
                            valueField: 'id',
                            displayField: 'supplierSearch',
                            forceSelection: true,
                            publishes: 'value'
                        },
                        {
                            xtype: 'combo',
                            bind: {
                                store: '{expense_grand_types}',
                                value: '{filterExpenseTypeCode}'
                            },
                            anyMatch: true,
                            emptyText: 'Buscar x Grupo de gastos',
                            reference: 'filter_expense_code',
                            // flex: 1,
                            name: 'expense_code',
                            queryMode: 'local',
                            // displayTpl: '<tpl for=".">{name} {name_2} {name_3}<tpl if="xindex < xcount">' + this.delimiter + '</tpl></tpl>',
                            valueField: 'expense_code',
                            displayField: 'expense_grand_type_description',
                            forceSelection: true,
                            publishes: 'value'
                        },
                        {
                            xtype: 'combo',
                            bind: {
                                store: '{expense_types_filter}',
                                value: '{filterExpenseTypeId}'
                            },
                            anyMatch: true,
                            emptyText: 'Buscar x tipo de gastos',
                            reference: 'filter_expense_type',
                            // flex: 1,
                            name: 'expense_type',
                            queryMode: 'local',
                            // displayTpl: '<tpl for=".">{name} {name_2} {name_3}<tpl if="xindex < xcount">' + this.delimiter + '</tpl></tpl>',
                            valueField: 'id',
                            displayField: 'expense_description',
                            forceSelection: true,
                            publishes: 'value'
                        }
                    ]

                },
                {

                    xtype: 'grid',
                    region: 'center',
                    emptyText: 'No se encontraron registros con los filtros seleccionados',
                    ui: 'light',
                    //  cls: 'user-grid',
                    title: 'Gastos generados',
                    stateful: true,
                    stateId: 'expenses-input-grid',
                    bind: {
                        store: '{expenses}'
                    },
                    columns: [
                        {
                            dataIndex: 'id',
                            xtype: 'gridcolumn',
                            // cls: 'content-column',
                            text: '#',
                            width: 40
                        },
                        {
                            dataIndex: 'supplier',
                            xtype: 'gridcolumn',
                            // cls: 'content-column',
                            text: 'Proveedor'
                        },
                        {
                            text: 'Período del pago',
                            columns: [
                                {
                                    dataIndex: 'expense_period_start',
                                    xtype: 'datecolumn',
                                    format: 'd-m-Y',
                                    // cls: 'content-column',
                                    text: 'Desde'
                                },
                                {
                                    dataIndex: 'expense_period_end',
                                    format: 'd-m-Y',
                                    xtype: 'datecolumn',
                                    // cls: 'content-column',
                                    text: 'Hasta'
                                }
                            ]
                        },
                        {
                            dataIndex: 'amount',
                            xtype: 'numbercolumn',
                            format: '0,000.##',
                            // cls: 'content-column',
                            text: 'Monto'
                        },
                        {
                            dataIndex: 'currency',
                            xtype: 'gridcolumn',
                            // cls: 'content-column',
                            text: 'Moneda'
                        },
                        {
                            dataIndex: 'notes',
                            xtype: 'gridcolumn',
                            // cls: 'content-column',
                            text: 'Observaciones'
                        },
                        {
                            dataIndex: 'printed',
                            xtype: 'datecolumn',
                            format: 'd-m-Y',
                            text: 'Fecha de impresión'
                        },
                        {
                            dataIndex: 'expense_date',
                            xtype: 'datecolumn',
                            format: 'd-m-Y',
                            // cls: 'content-column',
                            text: 'Fecha de emisión'
                        },
                        {
                            dataIndex: 'payment_description',
                            xtype: 'gridcolumn',
                            // cls: 'content-column',
                            text: 'Método de pago'
                        },
                        {
                            dataIndex: 'expense_description',
                            xtype: 'gridcolumn',
                            // cls: 'content-column',
                            text: 'Tipo de gasto'
                        },
                        {
                            dataIndex: 'expense_grand_type_description',
                            xtype: 'gridcolumn',
                            // cls: 'content-column',
                            text: 'Grupo de gastos'
                        }
                    ]
                }
            ]
        }
    ]
});

