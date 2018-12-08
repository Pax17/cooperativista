Ext.define('Cooperativista.view.config.Options', {
    extend: 'Ext.tab.Panel',
    xtype: 'options',
    requires: [
        'Ext.grid.Panel',
        'Ext.toolbar.Paging',
        'Ext.grid.column.Date',
        'Ext.form.FieldSet',
        'Ext.form.field.ComboBox',
        'Ext.form.FieldContainer',
        'Ext.grid.column.Widget'
    ],

    controller: 'options',
    viewModel: {
        type: 'options'
    },
    cls: 'shadow',
    //margin: 6,
    ui: 'navigation',
    items: [
        {
            xtype: 'panel',
            iconCls: 'fas fa-atlas',
            title: 'Entidad',
            route: 'env',
            cls: 'quick-graph-panel',
            ui: 'light',
            reference: 'envpanel',
            // /        tabPosition: 'left',
            layout: {
                type: 'box',
                vertical: false,
                align: 'stretch'
            },
            items: [

                {
                    xtype: 'form',
                    bodyPadding: 15,
                    flex: 1,
                    ui: 'light',
                    scrollable: 'y',
                    title: 'Datos de la Entidad',
                    iconCls: 'fas fa-university',
                    defaultType: 'textfield',
                    reference: 'entityform',
                    defaults: {
                        labelWidth: 90,
                        labelAlign: 'top',
                        labelSeparator: '',
                        submitEmptyText: false,
                        anchor: '100%'
                    },
                    items: [
                        {
                            name: 'id',
                            allowBlank: false,
                            hidden: true,
                            xtype: 'numberfield'
                        },
                        {
                            xtype: 'fieldset',
                            title: 'Nombre de la Entidad',
                            layout: 'anchor',
                            defaultType: 'textfield',
                            defaults: {
                                anchor: '100%',
                                listeners: {
                                    change: 'dirtyEntity'
                                }
                            },
                            items: [
                                {
                                    emptyText: 'Entidad',
                                    name: 'name',
                                    //fieldLabel: 'Nombre de la Entidad',
                                    allowBlank: false
                                },
                                {
                                    emptyText: 'Entidad (linea 2 - opcional)',
                                    name: 'name_2'
                                },
                                {
                                    emptyText: 'Entidad (linea 3 - opcional)',
                                    name: 'name_3'
                                }
                            ]
                        },
                        {
                            xtype: 'fieldset',
                            title: 'Datos de contacto',
                            layout: 'anchor',
                            defaultType: 'textfield',
                            defaults: {
                                anchor: '100%',
                                listeners: {
                                    change: 'dirtyEntity'
                                }
                            },
                            items: [

                                {
                                    emptyText: 'Dirección',
                                    name: 'attribute_1',
                                    allowBlank: false
                                },
                                {
                                    emptyText: 'Teléfono',
                                    name: 'attribute_2'
                                },
                                {
                                    emptyText: 'Email',
                                    name: 'attribute_3'
                                },
                                {
                                    emptyText: 'Página web',
                                    name: 'attribute_4'
                                }
                            ]
                        }
                    ],
                    buttons: [
                        {
                            tooltip: 'Guardar cambios',
                            iconCls: 'x-fas fa-check',
                            ui: 'soft-green',
                            bind: {
                                disabled: '{!dirtyEntity}'
                            },
                            handler: 'saveEntity'
                        }
                    ]
                },
                {
                    xtype: 'form',
                    bodyPadding: 15,
                    flex: 1,
                    ui: 'light',
                    scrollable: 'y',
                    title: 'Datos del período',
                    iconCls: 'fas fa-calendar-check',
                    defaultType: 'textfield',
                    reference: 'periodform',
                    defaults: {
                        labelWidth: 90,
                        labelAlign: 'top',
                        labelSeparator: '',
                        submitEmptyText: false,
                        anchor: '100%'
                    },
                    items: [
                        {
                            //   labelAlign: 'left',
                            xtype: 'numberfield',
                            name: 'period_name',
                            emptyText: 'Período',
                            fieldLabel: 'Período actual',
                            bind: {value: {bindTo: '{period_name}', single: true}},
                            listeners: {
                                change: 'dirtyPeriod'
                            }
                        },
                        {
                            xtype: 'fieldcontainer',
                            fieldLabel: 'Período Contable',
                            layout: {
                                type: 'hbox',
                                align: 'stretch'
                            },
                            defaults: {
                                xtype: 'datefield',
                                flex: 1,
                                allowBlank: false,
                                listeners: {
                                    change: 'dirtyPeriod'
                                }
                            },
                            items: [
                                {
                                    emptyText: 'Desde',
                                    reference: 'period_start_field',
                                    name: 'period_start',
                                    publishes: 'value',
                                    margin: '0 4 0 0',
                                    submitFormat: 'Y-m-d',
                                    bind: {
                                        //value: '{period_start}',
                                        value: {bindTo: '{period_start}', single: true},
                                        maxValue: '{period_end}'
                                    }
                                },
                                {
                                    emptyText: 'Hasta',
                                    reference: 'period_end_field',
                                    publishes: 'value',
                                    name: 'period_end',
                                    margin: '0 0 0 4',
                                    submitFormat: 'Y-m-d',
                                    bind: {
                                        //  value: '{period_end}',
                                        value: {bindTo: '{period_end}', single: true},
                                        minValue: '{period_start}'
                                    }
                                }
                            ]
                        },
                        {
                            //   labelAlign: 'left',
                            xtype: 'numberfield',
                            name: 'default_fee_amount',
                            emptyText: 'Valor cuota por defecto',
                            fieldLabel: 'Valor cuota actual',
                            bind: {
                                value: {bindTo: '{default_fee_amount}', single: true}
                            },
                            listeners: {
                                change: 'dirtyPeriod'
                            }
                        },
                        {
                            xtype: 'combo',
                            bind: {
                                store: '{month_receipt_types_enabled}',
                                value: '{tipoIngresoDefault}'
                            },
                            fieldLabel: 'Ingreso Mensual Predeterminado',
                            emptyText: 'Tipo de ingreso predeterminado',
                            reference: 'monthly_fee_concept',
                            name: 'default_monthly_fee_concept',
                            queryMode: 'local',
                            //  displayTpl: '<tpl for=".">{name} {name_3}<tpl if="xindex < xcount">' + this.delimiter + '</tpl></tpl>',
                            valueField: 'id',
                            displayField: 'receipt_description',
                            forceSelection: true,
                            allowBlank: false,
                            listeners: {
                                change: 'dirtyPeriod'
                            }
                        }

                    ],
                    buttons: [
                        {
                            tooltip: 'Guardar cambios',
                            iconCls: 'x-fas fa-check',
                            ui: 'soft-green',
                            bind: {
                                disabled: '{!dirtyPeriod}'
                            },
                            handler: 'savePeriod'
                        }
                    ]
                }
            ]

        },
        {
            xtype: 'panel',
            ui: 'light',
            iconCls: 'fas fa-tags fa-flip-horizontal',
            title: 'Conceptos',
            route: 'concepts',
            cls: 'quick-graph-panel',
            reference: 'configpanel',
            // /        tabPosition: 'left',
            //   layout: {type: 'box', align: 'stretch', vertical: true},
            layout: {type: 'box', align: 'stretch', vertical: false},
            defaults: {
                ui: 'light',
                flex: 1,
                cls: 'shadow cell-widget-no-pad'
            },
            items: [
                {
                    xtype: 'grid',
                    //   cls: 'cell-widget-no-pad',
                    title: 'Categorías de Ingresos',
                    iconCls: 'x-fas fa-funnel-dollar',//fa-file-invoice-dollar',
                    margin: 5,
                    flex: 1,
                    bind: {
                        store: '{receipt_types}'
                    },
                    reference: 'receipt_types_grid',
                    /* tbar: [

                         {
                             iconCls: 'x-fas fa-thumbs-up isValid',
                             tooltip: 'Habilitar selección',
                             bind: {
                                 disabled: '{!receipt_types_grid.selection}'
                             },
                             handler: 'updateStatus',
                             role: 'receipt_types',
                             status: 1
                         },
                         {
                             iconCls: 'x-fas fa-thumbs-down isDisabled',
                             tooltip: 'Deshabilitar selección',
                             bind: {
                                 disabled: '{!receipt_types_grid.selection}'
                             },
                             handler: 'updateStatus',
                             role: 'receipt_types',
                             status: 0
                         }
                     ],*/
                    dockedItems: [
                        {
                            xtype: 'form',
                            layout: {
                                type: 'box',
                                vertical: false,
                                align: 'stretch',
                                pack: 'center'
                            },
                            padding: 8,
                            dock: 'top',
                            reference: 'receiptTypesForm>',
                            items: [

                                {
                                    xtype: 'container',
                                    layout: {
                                        type: 'box',
                                        vertical: true,
                                        align: 'stretch',
                                        pack: 'center'
                                    },
                                    flex: 1,
                                    items: [

                                        {
                                            xtype: 'textfield',
                                            flex: 1,
                                            //  labelWidth: 130,
                                            emptyText: 'Agregar nueva categoría de ingresos',
                                            allowBlank: false,
                                            name: 'receipt_description',
                                            //   fieldLabel: 'Agregar categoría',
                                            reference: 'add_receipt_description'
                                        },
                                        {
                                            xtype: 'combo',
                                            bind: {
                                                store: '{receipt_grand_types}'
                                            },
                                            name: 'receipt_code',
                                            allowBlank: false,
                                            forceSelection: true,
                                            displayField: 'receipt_grand_type_description',
                                            valueField: 'receipt_code',
                                            emptyText: 'Grupo'
                                        }
                                    ]
                                },
                                {
                                    xtype: 'button',
                                    formBind: true,
                                    iconCls: 'x-fas fa-arrow-down',
                                    role: 'receipt_types',
                                    action: 'add',
                                    ui: 'soft-green',
                                    handler: 'processConfig',
                                    width: 64
                                }
                            ]
                        }
                    ],
                    features: [
                        {
                            ftype: 'grouping',
                            enableGroupingMenu: false,
                            enableNoGroups: false,
                            groupHeaderTpl: '<i class="fas fa-funnel-dollar"></i> {name}'
                        }
                    ],
                    columns: [
                        {
                            dataIndex: 'id',
                            width: 40,
                            text: '#'
                        },
                        {
                            dataIndex: 'receipt_description',
                            text: 'Descripción',
                            flex: 1,
                            minWidth: 150
                        },
                        {
                            dataIndex: 'receipt_code',
                            text: 'Grupo'
                        },
                        /* {
                             dataIndex: 'status',
                             //text: 'estado',
                             width: 40,
                             xtype: 'booleancolumn',
                             trueText: '<i class="fas fa-thumbs-up isValid" data-qtip="Habilitado"></i> ',
                             falseText: '<i class="fas fa-thumbs-down isDisabled" data-qtip="Deshabilitado"></i> '
                         },*/
                        {
                            // This is our Widget column
                            xtype: 'widgetcolumn',
                            menuDisabled: true,
                            width: 32,
                            padding: 0,

                            // This is the widget definition for each cell.
                            // The Progress widget class's defaultBindProperty is 'value'
                            // so its "value" setting is taken from the ViewModel's record "capacityUsed" field
                            widget: {
                                xtype: 'button',
                                ui: 'header',
                                margin: 0,
                                bind: {
                                    //disabled: '{record.id===1}',
                                    value: '{record}',
                                    iconCls: '{record.status?"x-fas fa-thumbs-up isValid":"x-fas fa-thumbs-down isDisabled"}',
                                    tooltip: '{record.status?"Categoría de ingreso habilitado. Click para desactivar":"Categoría de ingreso deshabilitado. Click para activar"}'
                                },
                                value: 'receipt',
                                width: 32,
                                iconCls: 'x-fas fa-ban',
                                setValue: function (val) {
                                    this.value = val;
                                },
                                stopSelection: false,
                                handler: 'updateStatusBtn',
                                role: 'receipt_types'/*,
                                                handler: 'toggleUserStatus'*/
                            }
                        }
                    ]
                },
                {
                    xtype: 'grid',
                    reference: 'expense_types_grid',
                    // cls: 'cell-widget-no-pad',
                    title: 'Categorías de Gastos',
                    iconCls: 'x-fas fa-shopping-bag',
                    // flex: 1,
                    margin: 5,
                    bind: {
                        store: '{expense_types}'
                    },
                    dockedItems: [
                        {
                            xtype: 'form',
                            layout: {
                                type: 'box',
                                vertical: false,
                                align: 'stretch',
                                pack: 'center'
                            },
                            padding: 8,
                            dock: 'top',
                            reference: 'expenseTypesForm>',
                            items: [

                                {
                                    xtype: 'container',
                                    layout: {
                                        type: 'box',
                                        vertical: true,
                                        align: 'stretch',
                                        pack: 'center'
                                    },
                                    flex: 1,
                                    items: [
                                        {
                                            xtype: 'textfield',
                                            flex: 1,
                                            //  labelWidth: 130,
                                            emptyText: 'Agregar nueva categoría de gastos',
                                            allowBlank: false,
                                            name: 'expense_description',
                                            //   fieldLabel: 'Agregar categoría',
                                            reference: 'add_expense_description'
                                        },
                                        {
                                            xtype: 'combo',
                                            bind: {
                                                store: '{expense_grand_types}'
                                            },
                                            name: 'expense_code',
                                            allowBlank: false,
                                            forceSelection: true,
                                            displayField: 'expense_grand_type_description',
                                            valueField: 'expense_code',
                                            emptyText: 'Grupo'
                                        }
                                    ]
                                },
                                {
                                    xtype: 'button',
                                    formBind: true,
                                    iconCls: 'x-fas fa-arrow-down',
                                    role: 'expense_types',
                                    action: 'add',
                                    ui: 'soft-green',
                                    handler: 'processConfig',
                                    width: 64
                                }
                            ]
                        }
                    ],
                    features: [
                        {
                            ftype: 'grouping',
                            enableGroupingMenu: false,
                            enableNoGroups: false,
                            groupHeaderTpl: '<i class="fas fa-shopping-bag"></i> {name}'
                        }
                    ],
                    columns: [
                        {
                            dataIndex: 'id',
                            width: 40,
                            text: '#'
                        },
                        {
                            dataIndex: 'expense_description',
                            text: 'Descripción',
                            flex: 1,
                            minWidth: 150
                        },
                        {
                            dataIndex: 'expense_code',
                            text: 'Grupo'
                        },
                        /* {
                             dataIndex: 'expense_grand_type_description',
                             text: 'Desc. Grupo'
                         },*/
                        {
                            // This is our Widget column
                            xtype: 'widgetcolumn',
                            baseCls: 'cell-no-pad',
                            menuDisabled: true,
                            width: 32,
                            padding: 0,

                            // This is the widget definition for each cell.
                            // The Progress widget class's defaultBindProperty is 'value'
                            // so its "value" setting is taken from the ViewModel's record "capacityUsed" field
                            widget: {
                                xtype: 'button',
                                ui: 'header',
                                margin: 0,
                                bind: {
                                    //disabled: '{record.id===1}',
                                    value: '{record}',
                                    iconCls: '{record.status?"x-fas fa-thumbs-up isValid":"x-fas fa-thumbs-down isDisabled"}',
                                    tooltip: '{record.status?"Categoría de gasto habilitado. Click para desactivar":"Categoría de gasto deshabilitado. Click para activar"}'
                                },
                                width: 32,
                                iconCls: 'x-fas fa-ban',
                                setValue: function (val) {
                                    this.value = val;
                                },
                                stopSelection: false,
                                handler: 'updateStatusBtn',
                                role: 'expense_types'/*,
                                                handler: 'toggleUserStatus'*/
                            }
                        }
                    ]
                },
                {
                    xtype: 'grid',
                    title: 'Métodos de Pagos',
                    iconCls: 'x-fas fa-dollar-sign',
                    margin: 5,
                    //    flex: 1,
                    bind: {
                        store: '{payment_types}'
                    },
                    reference: 'payment_types_grid',
                    //  cls: 'cell-widget-no-pad',
                    dockedItems: [
                        {
                            xtype: 'form',
                            layout: {
                                type: 'box',
                                vertical: false,
                                align: 'stretch',
                                pack: 'center'
                            },
                            padding: 8,
                            dock: 'top',
                            reference: 'paymentTypesForm>',
                            items: [
                                {
                                    xtype: 'container',
                                    layout: {
                                        type: 'box',
                                        vertical: true,
                                        align: 'stretch',
                                        pack: 'center'
                                    },
                                    flex: 1,
                                    items: [

                                        {
                                            xtype: 'textfield',
                                            flex: 1,
                                            //  labelWidth: 130,
                                            emptyText: 'Agregar nueva categoría de métodos',
                                            allowBlank: false,
                                            name: 'payment_description',
                                            //   fieldLabel: 'Agregar categoría',
                                            reference: 'add_payment_description'
                                        },
                                        {
                                            xtype: 'combo',
                                            bind: {
                                                store: '{payment_grand_types}'
                                            },
                                            name: 'payment_code',
                                            allowBlank: false,
                                            forceSelection: true,
                                            displayField: 'payment_grand_type_description',
                                            valueField: 'payment_code',
                                            emptyText: 'Grupo'
                                        }
                                    ]
                                },
                                {
                                    xtype: 'button',
                                    formBind: true,
                                    iconCls: 'x-fas fa-arrow-down',
                                    role: 'payment_types',
                                    action: 'add',
                                    ui: 'soft-green',
                                    handler: 'processConfig',
                                    width: 64
                                }
                            ]
                        }
                    ],
                    /* rbar: [

                         {
                             iconCls: 'x-fas fa-thumbs-up isValid',
                             tooltip: 'Habilitar selección',
                             bind: {
                                 disabled: '{!payment_types_grid.selection}'
                             },
                             handler: 'updateStatus',
                             role: 'payment_types',
                             status: 1
                         },
                         {
                             iconCls: 'x-fas fa-thumbs-down isDisabled',
                             tooltip: 'Deshabilitar selección',
                             bind: {
                                 disabled: '{!payment_types_grid.selection}'
                             },
                             handler: 'updateStatus',
                             role: 'payment_types',
                             status: 0
                         }
                     ],*/
                    features: [
                        {
                            ftype: 'grouping',
                            enableGroupingMenu: false,
                            enableNoGroups: false,
                            groupHeaderTpl: '<i class="fas fa-dollar-sign"></i> {name}'
                        }
                    ],
                    columns: [
                        {
                            dataIndex: 'id',
                            width: 40,
                            text: '#'
                        },
                        {
                            dataIndex: 'payment_description',
                            text: 'Descripción',
                            flex: 1,
                            minWidth: 150
                        },
                        {
                            dataIndex: 'payment_code',
                            text: 'Grupo'
                        },
                        {
                            // This is our Widget column
                            xtype: 'widgetcolumn',
                            baseCls: 'cell-no-pad',
                            menuDisabled: true,
                            width: 32,
                            padding: 0,

                            // This is the widget definition for each cell.
                            // The Progress widget class's defaultBindProperty is 'value'
                            // so its "value" setting is taken from the ViewModel's record "capacityUsed" field
                            widget: {
                                xtype: 'button',
                                ui: 'header',
                                margin: 0,
                                bind: {
                                    //disabled: '{record.id===1}',
                                    value: '{record}',
                                    iconCls: '{record.status?"x-fas fa-thumbs-up isValid":"x-fas fa-thumbs-down isDisabled"}',
                                    tooltip: '{record.status?"Categoría de pago habilitado. Click para desactivar":"Categoría de pago deshabilitado. Click para activar"}'
                                },
                                width: 32,
                                iconCls: 'x-fas fa-ban',
                                setValue: function (val) {
                                    this.value = val;
                                },
                                stopSelection: false,
                                handler: 'updateStatusBtn',
                                role: 'payment_types'/*,
                                                handler: 'toggleUserStatus'*/
                            }
                        }
                    ]
                }
            ]
        },
        {
            layout: 'fit',
            title: 'Miembros',
            iconCls: 'fas fa-user-circle',
            items: [

                {
                    xtype: 'gridpanel',
                    //   cls: 'allRecordsCls',
                    // cls: 'user-grid',
                    reference: 'user-list',
                    cls: 'cell-widget-no-pad',
                    routeId: 'all',
                    stateful: true,
                    stateId: 'users-abm-grid',
                    bind: '{users}',
                    viewConfig: {
                        preserveScrollOnRefresh: true,
                        stripeRows: false
                    },
                    dockedItems: [
                        {
                            xtype: 'toolbar',
                            dock: 'top',
                            defaults: {
                                ui: 'header'
                            },
                            items: [
                                {
                                    tooltip: 'Agregar miembro',
                                    iconCls: 'fas fa-user-plus',
                                    text: 'Agergar',
                                    // ui: 'soft-green',
                                    // ui: 'header',
                                    handler: 'addUser'
                                }
                            ]
                        }
                    ],
                    columns: [
                        /* {
                             xtype: 'gridcolumn',
                             renderer: function (value) {
                                 return "<img src='resources/images/user-profile/0.png' alt='Profile Pic' height='40px' width='40px'>";
                             },
                             width: 60,
                             dataIndex: 'id',
                             text: '#'
                         },*/
                        {
                            xtype: 'gridcolumn',
                            cls: 'content-column',
                            dataIndex: 'name',
                            text: 'Nombre',
                            flex: 1
                        },
                        {
                            xtype: 'gridcolumn',
                            cls: 'content-column',
                            dataIndex: 'last_name',
                            text: 'Apellido',
                            flex: 1
                        },
                        {
                            xtype: 'gridcolumn',
                            cls: 'content-column',
                            dataIndex: 'alias',
                            text: 'Alias',
                            flex: 1,
                            filter: {
                                // required configs
                                type: 'string',
                                emptyText: 'Buscar usuario...'
                            }
                        },
                        {
                            xtype: 'gridcolumn',
                            cls: 'content-column',
                            dataIndex: 'role_description',
                            text: 'Rol',
                            flex: 1,
                            filter: {
                                // required configs
                                type: 'list',
                                emptyText: 'Filtrar Roles...'
                            }
                        },
                        {
                            xtype: 'gridcolumn',
                            cls: 'content-column',
                            flex: 1,
                            dataIndex: 'attribute_1',
                            text: 'Email'
                        },
                        {
                            xtype: 'gridcolumn',
                            cls: 'content-column',
                            flex: 1,
                            dataIndex: 'attribute_2',
                            text: 'Tel'
                        },
                        {
                            xtype: 'gridcolumn',
                            cls: 'content-column',
                            flex: 1,
                            dataIndex: 'attribute_3',
                            text: 'Extra'
                        },
                        {
                            xtype: 'gridcolumn',
                            cls: 'content-column',
                            flex: 1,
                            dataIndex: 'attribute_4',
                            text: 'Extra *'
                        },
                        {
                            xtype: 'gridcolumn',
                            cls: 'content-column',
                            flex: 1,
                            dataIndex: 'attribute_5',
                            text: 'Extra **'
                        },
                        {
                            // This is our Widget column
                            xtype: 'widgetcolumn',
                            cls: 'cell-no-pad',
                            menuDisabled: true,
                            width: 32,
                            padding: 0,

                            // This is the widget definition for each cell.
                            // The Progress widget class's defaultBindProperty is 'value'
                            // so its "value" setting is taken from the ViewModel's record "capacityUsed" field
                            widget: {
                                xtype: 'button',
                                ui: 'header',
                                margin: 0,
                                tooltip: 'Editar datos del usuario',
                                bind: {
                                    //  disabled: '{record.id===1}',
                                    value: '{record}'
                                },
                                width: 32,
                                iconCls: 'x-fas fa-pencil-alt isInfo',
                                setValue: function (val) {
                                    this.value = val;
                                },
                                handler: 'updateUser'
                            }
                        },
                        {
                            // This is our Widget column
                            xtype: 'widgetcolumn',
                            baseCls: 'cell-no-pad',
                            menuDisabled: true,
                            width: 32,
                            padding: 0,

                            // This is the widget definition for each cell.
                            // The Progress widget class's defaultBindProperty is 'value'
                            // so its "value" setting is taken from the ViewModel's record "capacityUsed" field
                            widget: {
                                xtype: 'button',
                                ui: 'header',
                                margin: 0,
                                bind: {
                                    disabled: '{record.id===1}',
                                    value: '{record}',
                                    iconCls: '{record.status==1?"x-fas fa-thumbs-up isValid":"x-fas fa-thumbs-down isDisabled"}',
                                    tooltip: '{record.status==1?"Usuario habilitado. Click para desactivar usuario":"Usuario deshabilitado. Click para activar usuario"}'
                                },
                                width: 32,
                                iconCls: 'x-fas fa-ban',
                                setValue: function (val) {
                                    this.value = val;
                                },
                                handler: 'toggleUserStatus'
                            }
                        }
                    ]
                },
                {
                    xtype: 'window',
                    reference: 'addRoleWin',
                    width: 350,
                    title: 'Agregar nuevo rol',
                    iconCls: 'x-far fa-address-card',
                    height: 350,
                    closeAction: 'hide',
                    layout: 'fit',
                    items: [
                        {
                            xtype: 'form',
                            scrollable: 'y',
                            reference: 'addRoleForm',
                            layout: {
                                type: 'vbox',
                                align: 'stretch'
                            },
                            cls: 'nice-form',
                            buttons: [
                                {
                                    tooltip: 'Agregar',
                                    iconCls: 'x-fas fa-check',
                                    ui: 'soft-green',
                                    formBind: true,
                                    handler: 'doAddRole'
                                }
                            ],
                            bodyPadding: 10,
                            items: [
                                {
                                    xtype: 'textfield',
                                    emptyText: 'Nombre del nuevo Rol',
                                    name: 'role_description',
                                    allowBlank: false
                                },
                                {
                                    xtype: 'grid',
                                    flex: 1,
                                    bind: {
                                        store: '{roles}'
                                    },
                                    hideHeaders: true,
                                    //  border:1,
                                    cls: 'shadow',
                                    viewConfig: {
                                        preserveScrollOnRefresh: true,
                                        stripeRows: false
                                    },
                                    columns: [
                                        {
                                            xtype: 'gridcolumn',
                                            width: 40,
                                            dataIndex: 'id',
                                            text: '#'
                                        },
                                        {
                                            xtype: 'gridcolumn',
                                            cls: 'content-column',
                                            dataIndex: 'role_description',
                                            text: 'Rol',
                                            flex: 1
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype: 'window',
                    reference: 'addUserWin',
                    width: 450,
                    title: 'Agregar miembro (usuario)',
                    iconCls: 'x-fas fa-user-plus',
                    //  height: 350,
                    closeAction: 'hide',
                    layout: 'fit',
                    items: [
                        {
                            xtype: 'form',
                            reference: 'addUserForm',
                            cls: 'nice-form',
                            scrollable: 'y',
                            bodyPadding: 10,
                            defaults: {
                                //hideLabel: true,
                                hideEmptyLabel: false,
                                submitEmptyText: false,
                                anchor: '100%'
                            },
                            defaultType: 'textfield',
                            buttons: [
                                {
                                    tooltip: 'Agregar',
                                    iconCls: 'fas fa-plus',
                                    ui: 'soft-green',
                                    formBind: true,
                                    handler: 'doAddUser'
                                }
                            ],
                            items: [
                                {
                                    name: 'entity_id',
                                    hidden: true,
                                    allowBlank: false,
                                    bind: '{currentEntity}'
                                },
                                {
                                    emptyText: 'Nombre',
                                    name: 'name',
                                    fieldLabel: 'Nombre',
                                    allowBlank: false
                                },
                                {
                                    emptyText: 'Apellido',
                                    name: 'last_name',
                                    fieldLabel: 'Apellido',
                                    allowBlank: false
                                },
                                {
                                    emptyText: 'Ingrese un nombre de usuario',
                                    name: 'alias',
                                    fieldLabel: 'Usuario',
                                    allowBlank: false
                                },
                                {
                                    xtype: 'fieldcontainer',
                                    layout: 'hbox',
                                    padding: 0,
                                    items: [
                                        {
                                            xtype: 'combobox',
                                            flex: 1,
                                            emptyText: 'Seleccione el rol',
                                            name: 'role_id',
                                            bind: {store: '{roles}'},
                                            queryMode: 'local',
                                            displayField: 'role_description',
                                            valueField: 'id',
                                            forceSelection: true,
                                            allowBlank: false,
                                            reference: 'role_combo'
                                        },
                                        {
                                            tooltip: 'Agregar rol de usuario',
                                            iconCls: 'fas fa-address-card',
                                            xtype: 'button',
                                            // ui: 'soft-cyan',
                                            //ui: 'header',
                                            handler: 'addRole'
                                        }
                                    ]
                                },
                                {
                                    emptyText: 'ex: me@somewhere.com',
                                    vtype: 'email',
                                    name: 'attribute_1',
                                    fieldLabel: 'Correo electrónico'
                                },
                                {
                                    emptyText: 'Ingrese una clave',
                                    inputType: 'password',
                                    cls: 'wizard-form-break',
                                    name: 'passcode',
                                    fieldLabel: 'Clave',
                                    allowBlank: false,
                                    minLength: 4
                                },
                                {
                                    emptyText: 'Repita la clave',
                                    inputType: 'password',
                                    submitValue: false,
                                    allowBlank: false,
                                    validator: function (value) {
                                        var password1 = this.previousSibling('[name=passcode]');
                                        return (value === password1.getValue()) ? true : 'La clave no coincide.'
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype: 'window',
                    reference: 'updateUserWin',
                    width: 450,
                    title: 'Actualizar usuario',
                    iconCls: 'x-fas fa-user-edit',
                    //  height: 350,
                    closeAction: 'hide',
                    layout: 'fit',
                    items: [
                        {
                            xtype: 'form',
                            reference: 'updateUserForm',
                            cls: 'nice-form',
                            scrollable: 'y',
                            bodyPadding: 10,
                            defaults: {
                                // hideLabel: true,
                                hideEmptyLabel: false,
                                submitEmptyText: false,
                                anchor: '100%'
                            },
                            defaultType: 'textfield',
                            buttons: [
                                {
                                    tooltip: 'Agregar',
                                    iconCls: 'fas fa-check',
                                    //   ui: 'soft-green',
                                    formBind: true,
                                    handler: 'doUpdateUser'
                                }
                            ],
                            items: [
                                {
                                    name: 'id',
                                    hidden: true,
                                    allowBlank: false
                                },
                                {
                                    emptyText: 'Nombre',
                                    name: 'name',
                                    fieldLabel: 'Nombre',
                                    allowBlank: false
                                },
                                {
                                    emptyText: 'Apellido',
                                    name: 'last_name',
                                    fieldLabel: 'Apellido',
                                    allowBlank: false
                                },
                                {
                                    emptyText: 'Ingrese un nombre de usuario',
                                    name: 'alias',
                                    fieldLabel: 'Usuario',
                                    allowBlank: false
                                },
                                {
                                    xtype: 'combobox',
                                    fieldLabel: 'Rol',
                                    emptyText: 'Seleccione el rol',
                                    name: 'role_id',
                                    bind: {store: '{roles}'},
                                    queryMode: 'local',
                                    displayField: 'role_description',
                                    valueField: 'id',
                                    forceSelection: true,
                                    allowBlank: false
                                },
                                {
                                    emptyText: 'ex: me@somewhere.com',
                                    vtype: 'email',
                                    name: 'attribute_1',
                                    fieldLabel: 'Correo electrónico'
                                },
                                {
                                    emptyText: 'Teléfono',
                                    name: 'attribute_2',
                                    fieldLabel: 'Telèfono'
                                },
                                {
                                    emptyText: 'Datos Extra',
                                    name: 'attribute_3',
                                    fieldLabel: 'Datos Extra'
                                },
                                {
                                    emptyText: 'Datos Extra',
                                    name: 'attribute_4'
                                },
                                {
                                    emptyText: 'Datos Extra',
                                    vtype: 'email',
                                    name: 'attribute_5'
                                },
                                {
                                    emptyText: 'Ingrese una nueva clave para cambiar la actual',
                                    inputType: 'password',
                                    cls: 'wizard-form-break',
                                    name: 'passcode',
                                    fieldLabel: 'Clave',
                                    allowBlank: true,
                                    reference: 'changepass',
                                    publishes: 'value',
                                    minLength: 4
                                },
                                {
                                    emptyText: 'Repita la clave ingresada',
                                    inputType: 'password',
                                    bind: {
                                        disabled: '{!changepass.value}'
                                    },
                                    submitValue: false,
                                    allowBlank: false,
                                    validator: function (value) {
                                        var password1 = this.previousSibling('[name=passcode]');
                                        return (value === password1.getValue()) ? true : 'La clave no coincide.'
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            xtype: 'options-pdf',
            reference: 'printForm'
        }
    ]
});
