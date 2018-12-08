Ext.define('Cooperativista.view.receipts.Receipts', {
    extend: 'Ext.tab.Panel',

    xtype: 'receipts',
    requires: [
        'Ext.ux.button.DateRangePicker',
        'Cooperativista.view.receipts.ReceiptsController',
        'Cooperativista.view.receipts.ReceiptsModel'
    ],

    controller: 'receipts-receipts',
    viewModel: {
        type: 'receipts-receipts'
    },
    deferredRender: true,
    ui: 'navigation',
    cls: 'shadow',
    items: [
        {
            title: 'Ingreso de Pagos',
            iconCls: 'x-fas fa-file-invoice',
            xtype: 'form',
            scrollable: 'y',
            cls: 'nice-form',
            //  title: 'Datos de la Entidad',
            defaultType: 'textfield',
            reference: 'addReceipt',
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
                    handler: 'addReceipt'
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
                            xtype: 'radiogroup',
                            fieldLabel: 'Tipo de ingreso',
                            // Arrange radio buttons into two columns, distributed vertically
                            columns: 2,
                            vertical: true,
                            reference: 'tipoIngreso',
                            publishes: 'value',
                            simpleValue: true,
                            /*bind: {
                                value: {bindTo: '{tipoIngresoDefault}', single: true}
                            },*/
                            submitValue: false,
                            value: 1,
                            defaults: {
                                submitValue: false
                            },
                            items: [
                                { boxLabel: 'Cuota', name: 'tipoIngreso', inputValue: 1 },
                                { boxLabel: 'Otros aportes', name: 'tipoIngreso', inputValue: 0 }
                            ]
                        },
                        {
                            xtype: 'combo',
                            bind: {
                                store: '{receipt_types_enabled}',
                                //readOnly: '{tipoIngreso.value==1}',
                                value: '{tipoIngreso.value==1?tipoIngresoDefault:0}'
                            },
                            emptyText: 'Tipo de ingreso',
                            flex: 1,
                            reference: 'receipt_type_id',
                            name: 'receipt_type_id',
                            queryMode: 'local',
                            //  displayTpl: '<tpl for=".">{name} {name_3}<tpl if="xindex < xcount">' + this.delimiter + '</tpl></tpl>',
                            valueField: 'id',
                            displayField: 'receipt_description',
                            forceSelection: true,
                            allowBlank: false/*,
                            listConfig: {
                                getInnerTpl: function () {
                                    return '{name} {name_3}'
                                }

                            }*/
                        },
                        {
                            xtype: 'radiogroup',
                            fieldLabel: 'Tipo de período',
                            reference: 'tipoPeriodo',
                            publishes: 'value',
                            simpleValue: true,
                            columns: 2,
                            vertical: true,
                            submitValue: false,
                            defaults: {
                                submitValue: false
                            },
                            bind: {
                                value: { bindTo: '{tipoPeriodoDefault}', single: true }
                            },
                            items: [
                                { boxLabel: 'Mensual', name: 'tipoPeriodo', inputValue: 1 },
                                { boxLabel: 'Otro', name: 'tipoPeriodo', inputValue: 2 }
                            ],
                            listeners: {
                                change: 'resetDisplayMonth'
                            }
                        },
                        {
                            xtype: 'button',
                            //    ui: 'header',
                            textAlign: 'left',
                            reference: 'selectMonth',
                            flex: 1,
                            text: 'Seleccione el mes',
                            bind: {
                                text: '{displayMonth.text}',
                                iconCls: 'fas {displayMonth.icon}',
                                visible: '{tipoPeriodo.value==1}'
                            },
                            menu: [
                                {
                                    xtype: 'monthpicker',
                                    value: new Date(),
                                    listeners: {
                                        okclick: 'onSelectMonth',
                                        monthdblclick: 'onSelectMonth',
                                        yeardblclick: 'onSelectMonth',
                                        cancelclick: function () {
                                            this.setValue(new Date());
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            xtype: 'fieldcontainer',
                            fieldLabel: 'Período',
                            bind: {
                                visible: '{tipoPeriodo.value==2}'
                            },
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
                                    reference: 'receipt_period_start',
                                    name: 'receipt_period_start',
                                    publishes: 'value',
                                    margin: '0 4 0 0',
                                    submitFormat: 'Y-m-d',
                                    bind: {
                                        maxValue: '{receipt_period_end.value}'
                                    }
                                },
                                {
                                    emptyText: 'Hasta',
                                    reference: 'receipt_period_end',
                                    publishes: 'value',
                                    name: 'receipt_period_end',
                                    margin: '0 0 0 4',
                                    submitFormat: 'Y-m-d',
                                    bind: {
                                        minValue: '{receipt_period_start.value}'
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
                                store: '{donators}',
                                visible: '{tipoIngreso.value==0}',
                                disabled: '{tipoIngreso.value!=0}'
                            },
                            fieldLabel: 'Aportante',
                            anyMatch: true,
                            emptyText: 'Buscar entidad',
                            flex: 1,
                            name: 'partner_id',
                            queryMode: 'local',
                            displayTpl: '<tpl for=".">{name} {name_3}<tpl if="xindex < xcount">' + this.delimiter + '</tpl></tpl>',
                            valueField: 'id',
                            displayField: 'donatorSearch',
                            forceSelection: true,
                            allowBlank: false/*,
                            listConfig: {
                                getInnerTpl: function () {
                                    return '{name} {name_3}'
                                }

                            }*/
                        },
                        {
                            xtype: 'combo',
                            bind: {
                                store: '{studentsStore}',
                                visible: '{tipoIngreso.value==1}',
                                disabled: '{tipoIngreso.value!=1}'
                            },
                            fieldLabel: 'Alumno',
                            anyMatch: true,
                            emptyText: 'Buscar Alumno',
                            flex: 1,
                            name: 'partner_id',
                            queryMode: 'local',
                            //  displayTpl: '<tpl for=".">{name} {name_3}<tpl if="xindex < xcount">' + this.delimiter + '</tpl></tpl>',
                            valueField: 'id',
                            displayField: 'studentSearch',
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
                            bind: {
                                value: { bindTo: '{default_fee_amount}', single: true }
                            },
                            emptyText: 'Ingrese el monto de la cuota'
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
            title: 'Pagos generados',
            iconCls: 'x-fas fa-swatchbook',
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
                            boxLabel: 'Pagos sin imprimir',
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
                                boundStartField: 'filter_receipt_period_start',
                                boundEndField: 'filter_receipt_period_end'*/
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
                                store: '{donators}',
                                value: '{filterPartnerId}'
                            },
                            anyMatch: true,
                            emptyText: 'Buscar x entidad',
                            reference: 'filter_donator_partner_id',
                            // flex: 1,
                            name: 'partner_id',
                            queryMode: 'local',
                            displayTpl: '<tpl for=".">{name} {name_3}<tpl if="xindex < xcount">' + this.delimiter + '</tpl></tpl>',
                            valueField: 'id',
                            displayField: 'donatorSearch',
                            forceSelection: true,
                            publishes: 'value'
                        },
                        {
                            xtype: 'combo',
                            bind: {
                                store: '{studentsAll}',
                                value: '{filterPartnerId}'
                            },
                            anyMatch: true,
                            emptyText: 'Buscar x Alumno',
                            reference: 'filter_student_partner_id',
                            //flex: 1,
                            name: 'partner_id',
                            queryMode: 'local',
                            //  displayTpl: '<tpl for=".">{name} {name_3}<tpl if="xindex < xcount">' + this.delimiter + '</tpl></tpl>',
                            valueField: 'id',
                            displayField: 'studentSearch',
                            forceSelection: true,
                            publishes: 'value'
                        },
                        {
                            xtype: 'combobox',
                            emptyText: 'Buscar x Curso',
                            // flex: 1,
                            name: 'course_partner_id',
                            reference: 'filter_course_partner_id',
                            bind: {
                                store: '{courses}',
                                value: '{filterCourseId}'
                            },
                            queryMode: 'local',
                            displayTpl: '<tpl for=".">{name}° {name_2}<tpl if="xindex < xcount">' + this.delimiter + '</tpl></tpl>',
                            valueField: 'id',
                            displayField: 'name',
                            forceSelection: true,
                            publishes: 'value',
                            // allowBlank: false,
                            listConfig: {
                                getInnerTpl: function () {
                                    return '{name}° {name_2}'
                                }

                            }
                        },
                        {
                            xtype: 'combobox',
                            emptyText: 'Buscar x Familia',
                            name: 'family_partner_id',
                            reference: 'filter_family_partner_id',
                            //flex: 1,
                            bind: {
                                store: '{families}',
                                value: '{filterFamilyId}'
                            },
                            queryMode: 'local',
                            displayTpl: '<tpl for=".">{name} ({name_2} - {name_3})<tpl if="xindex < xcount">' + this.delimiter + '</tpl></tpl>',
                            valueField: 'id',
                            displayField: 'name',
                            forceSelection: true,
                            publishes: 'value',
                            //allowBlank: false,
                            listConfig: {
                                getInnerTpl: function () {
                                    return '<div style="padding: 8px;border-bottom: 1px silver solid;"><em style="display: block; font-size: 16px; font-style: normal; font-weight: lighter;">{name}</em> {name_2} - {name_3} <br> <i class="fas fa-envelope-square"></i> {attribute_2} <i class="fas fa-phone-square"></i> {attribute_1} </div>'
                                }

                            }
                        }
                    ]

                },
                {

                    xtype: 'grid',
                    region: 'center',
                    emptyText: 'No se encontraron registros con los filtros seleccionados',
                    ui: 'light',
                    //  cls: 'user-grid',
                    title: 'Pagos generados',
                    stateful: true,
                    stateId: 'receipts-input-grid',
                    bind: {
                        store: '{receipts}'
                    },
                    selModel: {
                        type: 'checkboxmodel'
                    },
                    reference: 'receiptsgrid',
                    listeners: {
                        selectionchange: 'onSelectReceipts'
                    },
                    dockedItems: [
                        {
                            xtype: 'toolbar',
                            dock: 'top',
                            items: [
                                {
                                    iconCls: 'x-fas fa-print',
                                    tooltip: 'Generar impresión de recibos',
                                    handler: 'generateReceipts',
                                    bind: {
                                        disabled: '{!hasSelection}'
                                    }
                                }
                            ]
                        }
                    ],
                    columns: [
                        {
                            dataIndex: 'id',
                            xtype: 'gridcolumn',
                            // cls: 'content-column',
                            text: '#',
                            width: 40
                        },
                        {
                            text: 'Nombre',
                            columns: [
                                {
                                    dataIndex: 'name',
                                    xtype: 'gridcolumn',
                                    // cls: 'content-column',
                                    text: 'Nombre 1'
                                },
                                {
                                    dataIndex: 'name_2',
                                    xtype: 'gridcolumn',
                                    // cls: 'content-column',
                                    text: 'Nombre 2'
                                },
                                {
                                    dataIndex: 'name_3',
                                    xtype: 'gridcolumn',
                                    // cls: 'content-column',
                                    text: 'Nombre 3'
                                }
                            ]
                        },
                        /* {
                             dataIndex: 'receipt_type_id',
                             xtype: 'gridcolumn',
                             // cls: 'content-column',
                             text: ''
                         },
                         {
                             dataIndex: 'payment_type_id',
                             xtype: 'gridcolumn',
                             // cls: 'content-column',
                             text: ''
                         },
                         {
                             dataIndex: 'partner_id',
                             xtype: 'gridcolumn',
                             // cls: 'content-column',
                             text: ''
                         },*/
                        {
                            text: 'Período del pago',
                            columns: [
                                {
                                    dataIndex: 'receipt_period_start',
                                    xtype: 'datecolumn',
                                    format: 'd-m-Y',
                                    // cls: 'content-column',
                                    text: 'Desde'
                                },
                                {
                                    dataIndex: 'receipt_period_end',
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
                        /*{
                            dataIndex: 'entity_id',
                            xtype: 'gridcolumn',
                            // cls: 'content-column',
                            text: ''
                        },
                        {
                            dataIndex: 'base_user_id',
                            xtype: 'gridcolumn',
                            // cls: 'content-column',
                            text: ''
                        },*/
                        {
                            dataIndex: 'printed',
                            xtype: 'datecolumn',
                            format: 'd-m-Y',
                            text: 'Fecha de impresión'
                        },
                        {
                            dataIndex: 'receipt_date',
                            xtype: 'datecolumn',
                            format: 'd-m-Y',
                            // cls: 'content-column',
                            text: 'Fecha de emisión'
                        },
                        /* {
                             dataIndex: 'attribute_1',
                             xtype: 'gridcolumn',
                             // cls: 'content-column',
                             text: ''
                         },
                         {
                             dataIndex: 'attribute_2',
                             xtype: 'gridcolumn',
                             // cls: 'content-column',
                             text: ''
                         },
                         {
                             dataIndex: 'attribute_3',
                             xtype: 'gridcolumn',
                             // cls: 'content-column',
                             text: ''
                         },
                         {
                             dataIndex: 'attribute_4',
                             xtype: 'gridcolumn',
                             // cls: 'content-column',
                             text: ''
                         },
                         {
                             dataIndex: 'attribute_5',
                             xtype: 'gridcolumn',
                             // cls: 'content-column',
                             text: ''
                         },*/
                        {
                            dataIndex: 'payment_description',
                            xtype: 'gridcolumn',
                            // cls: 'content-column',
                            text: 'Método de pago'
                        },
                        /*{
                            dataIndex: 'payment_code',
                            xtype: 'gridcolumn',
                            // cls: 'content-column',
                            text: ''
                        },*/
                        {
                            dataIndex: 'receipt_description',
                            xtype: 'gridcolumn',
                            // cls: 'content-column',
                            text: 'Tipo de recibo'
                        },
                        /*  {
                              dataIndex: 'receipt_code',
                              xtype: 'gridcolumn',
                              // cls: 'content-column',
                              text: ''
                          },*/
                        {
                            dataIndex: 'type_description',
                            xtype: 'gridcolumn',
                            // cls: 'content-column',
                            text: 'Tipo de asociado'
                        },
                        /* {
                             dataIndex: 'type_code',
                             xtype: 'gridcolumn',
                             // cls: 'content-column',
                             text: ''
                         },
                         {
                             dataIndex: 'course_id',
                             xtype: 'gridcolumn',
                             // cls: 'content-column',
                             text: ''
                         },*/
                        {
                            text: 'Curso',
                            columns: [
                                {
                                    dataIndex: 'course_name',
                                    xtype: 'gridcolumn',
                                    // cls: 'content-column',
                                    text: 'Nivel'
                                },
                                {
                                    dataIndex: 'course_name_2',
                                    xtype: 'gridcolumn',
                                    // cls: 'content-column',
                                    text: 'División'
                                }
                            ]
                        },
                        /* {
                             dataIndex: 'course_name_3',
                             xtype: 'gridcolumn',
                             // cls: 'content-column',
                             text: ''
                         },
                         {
                             dataIndex: 'course_attribute_1',
                             xtype: 'gridcolumn',
                             // cls: 'content-column',
                             text: ''
                         },
                         {
                             dataIndex: 'course_attribute_2',
                             xtype: 'gridcolumn',
                             // cls: 'content-column',
                             text: ''
                         },
                         {
                             dataIndex: 'course_attribute_3',
                             xtype: 'gridcolumn',
                             // cls: 'content-column',
                             text: ''
                         },
                         {
                             dataIndex: 'course_attribute_4',
                             xtype: 'gridcolumn',
                             // cls: 'content-column',
                             text: ''
                         },
                         {
                             dataIndex: 'course_attribute_5',
                             xtype: 'gridcolumn',
                             // cls: 'content-column',
                             text: ''
                         },
                         {
                             dataIndex: 'course_type_description',
                             xtype: 'gridcolumn',
                             // cls: 'content-column',
                             text: ''
                         },
                         {
                             dataIndex: 'course_type_code',
                             xtype: 'gridcolumn',
                             // cls: 'content-column',
                             text: ''
                         },
                         {
                             dataIndex: 'family_id',
                             xtype: 'gridcolumn',
                             // cls: 'content-column',
                             text: ''
                         },*/
                        {
                            text: 'Familia',
                            columns: [
                                {
                                    dataIndex: 'family_name',
                                    xtype: 'gridcolumn',
                                    // cls: 'content-column',
                                    text: 'Apellido'
                                },
                                {
                                    dataIndex: 'family_name_2',
                                    xtype: 'gridcolumn',
                                    // cls: 'content-column',
                                    text: 'Responsable 1'
                                },
                                {
                                    dataIndex: 'family_name_3',
                                    xtype: 'gridcolumn',
                                    // cls: 'content-column',
                                    text: 'Responsable 2'
                                }
                            ]
                        }//,
                        /* {
                             dataIndex: 'family_attribute_1',
                             xtype: 'gridcolumn',
                             // cls: 'content-column',
                             text: ''
                         },
                         {
                             dataIndex: 'family_attribute_2',
                             xtype: 'gridcolumn',
                             // cls: 'content-column',
                             text: ''
                         },
                         {
                             dataIndex: 'family_attribute_3',
                             xtype: 'gridcolumn',
                             // cls: 'content-column',
                             text: ''
                         },
                         {
                             dataIndex: 'family_attribute_4',
                             xtype: 'gridcolumn',
                             // cls: 'content-column',
                             text: ''
                         },
                         {
                             dataIndex: 'family_attribute_5',
                             xtype: 'gridcolumn',
                             // cls: 'content-column',
                             text: ''
                         },
                         {
                             dataIndex: 'family_type_description',
                             xtype: 'gridcolumn',
                             // cls: 'content-column',
                             text: ''
                         },
                         {
                             dataIndex: 'family_type_code',
                             xtype: 'gridcolumn',
                             // cls: 'content-column',
                             text: ''
                         }*/
                    ]
                }
            ]
        }
    ]
});
