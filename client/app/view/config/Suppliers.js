
Ext.define('Cooperativista.view.config.Suppliers',{
    extend: 'Ext.panel.Panel',
    xtype: 'suppliers',
    requires: [
        'Cooperativista.view.config.SuppliersController',
        'Cooperativista.view.config.SuppliersModel'
    ],

    controller: 'config-suppliers',
    viewModel: {
        type: 'config-suppliers'
    },
    items:[
        {

            xtype: 'gridpanel',
         //   cls: 'user-grid',
            reference: 'suppliers-grid',
            cls: 'cell-widget-no-pad',
            stateful: true,
            stateId: 'suppliers-abm-grid',
            bind: {
                store: '{suppliers}'
            },
            emptyText: '<i class="fas fa-user-plus"></i> Agregue aquí entidades o personas como proveedores de insumos y servicios',
            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'top',
                    //padding: 0,
                    defaults: {
                        //margin: 0,
                        ui: 'header'
                    },
                    items: [
                        //   '->',
                        {
                            tooltip: 'Proveedores',
                            //   text: 'Agregar',
                            //ui: 'soft-green',
                            //type: 'plus',
                            iconCls: 'fas fa-user-plus',
                            handler: 'addSupplier'
                        }
                    ]
                }
            ],
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
                    dataIndex: 'name',
                    text: 'Nombre',
                    flex: 1
                },
                {
                    xtype: 'gridcolumn',
                    cls: 'content-column',
                    dataIndex: 'name_2',
                    text: 'Nombre 2',
                    flex: 1
                },
                {
                    xtype: 'gridcolumn',
                    cls: 'content-column',
                    dataIndex: 'name_3',
                    text: 'Nombre 3',
                    flex: 1
                },
                {
                    xtype: 'gridcolumn',
                    cls: 'content-column',
                    dataIndex: 'attribute_1',
                    text: 'Extra 1',
                    flex: 1
                },
                {
                    xtype: 'gridcolumn',
                    cls: 'content-column',
                    dataIndex: 'attribute_2',
                    text: 'Extra 2',
                    flex: 1
                },
                {
                    xtype: 'gridcolumn',
                    cls: 'content-column',
                    dataIndex: 'attribute_3',
                    text: 'Extra 3',
                    flex: 1
                },
                {
                    xtype: 'gridcolumn',
                    cls: 'content-column',
                    dataIndex: 'attribute_4',
                    text: 'Extra 4',
                    flex: 1
                },
                {
                    xtype: 'datecolumn',
                    cls: 'content-column',
                    dataIndex: 'attribute_5',
                    text: 'Inactivo',
                    format:'d-m-Y'
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
                            iconCls: '{!record.has_attribute_5?"x-fas fa-thumbs-up isValid":"x-fas fa-thumbs-down isDisabled"}',
                            tooltip: '{!record.has_attribute_5?"Proveedor habilitado. Click para desactivar":"Proveedor deshabilitado. Click para activar"}'
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
            xtype: 'window',
            reference: 'addSupplierWin',
            width: 350,
            title: 'Agregar Proveedor',
            iconCls: 'x-fas fa-luggage-cart',
            minHeight: 350,
            closeAction: 'hide',
            layout: 'fit',
            items: [
                {
                    xtype: 'form',
                    cls: 'nice-form',
                    scrollable: 'y',
                    reference: 'addSupplierForm',
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    buttons: [
                        {
                            tooltip: 'Agregar',
                            iconCls: 'x-fas fa-check',
                            ui: 'soft-green',
                            formBind: true,
                            handler: 'doAddSupplier'
                        }
                    ],
                    bodyPadding: 10,
                    items: [
                        {
                            xtype: 'fieldcontainer',
                            fieldLabel: 'Nombre (entidad o persona)',
                            layout: 'anchor',
                            labelAlign: 'top',
                            flex: 1,
                            defaults: {
                                xtype: 'textfield',
                                anchor: '100%',
                                emptyText: 'Nombre'
                            },
                            items: [
                                {
                                    xtype: 'textfield',
                                    emptyText: 'Nombre',
                                    name: 'name',
                                    allowBlank: false
                                },
                                {
                                    xtype: 'textfield',
                                    emptyText: 'Nombre 2 (opcional)',
                                    name: 'name_2'
                                },
                                {
                                    xtype: 'textfield',
                                    emptyText: 'Nombre 3 (opcional)',
                                    name: 'name_3'
                                }
                            ]
                        },
                        {
                            xtype: 'numberfield',
                            hidden: true,
                            name: 'partner_type_id',
                            value: 5,
                            allowBlank: false
                        },
                        {
                            xtype: 'numberfield',
                            hidden: true,
                            name: 'entity_id',
                            bind: '{currentEntity}',
                            allowBlank: false
                        },
                        {
                            xtype: 'fieldcontainer',
                            fieldLabel: 'Datos Extra (opcionales)',
                            layout: 'anchor',
                            labelAlign: 'top',
                            flex: 1,
                            defaults: {
                                xtype: 'textfield',
                                anchor: '100%',
                                emptyText: 'Datos Extra'
                            },
                            items: [

                                {
                                    // emptyText: 'Extra *',
                                    name: 'attribute_1'
                                },
                                {
                                    //emptyText: 'Extra **',
                                    name: 'attribute_2'
                                },
                                {
                                    // emptyText: 'Extra ***',
                                    name: 'attribute_3'
                                },
                                {
                                    // emptyText: 'Extra ****',
                                    name: 'attribute_4'
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
});
