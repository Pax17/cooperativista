Ext.define('Cooperativista.view.config.Print', {
    extend: 'Ext.form.Panel',
    xtype: 'options-pdf',
    requires: [
        'Ext.form.FieldSet',
        'Ext.form.field.ComboBox',
        'Ext.form.FieldContainer',
        'Ext.button.Segmented'
    ],

    title: 'Configurar Impresión',
    layout: {
        type: 'box',
        vertical: true,
        align: 'stretch'
    },
    listeners: {
        dirtychange: 'onPrintFormDirty',
        validitychange: 'onPrintFormDirty'
    },
    trackResetOnLoad: true,
    scrollable: 'y',
    cls: 'min-trigger',
    iconCls: 'fas fa-print',
    bodyPadding: 15,
    bbar: [
        {
            iconCls: 'far fa-eye',
            scale: 'large',
            tooltip: 'Previsualizar Impresión',
            // ui: 'gray',
            handler: 'previewLayout',
            formBind: true
        },
        '->',
        {
            iconCls: 'fas fa-times',
            scale: 'large',
            tooltip: 'Cancelar',
            // ui: 'gray',
            handler: 'loadForm',
            bind: {
                disabled: '{!printSettings.dirty}'
            }
        },
        {
            iconCls: 'fas fa-check',
            scale: 'large',
            // ui: 'soft-green',
            tooltip: 'Guardar cambios en las preferencias de Impresión',
            handler: 'updatePDFSettings',
            //formBind: true
            bind: {
                disabled: '{!printSettings.valid || !printSettings.dirty}'
            }
        }
    ],
    items: [
        {
            xtype: 'component',
            html: '<div style="font-size:1.2em;"><i class="fas fa-check-circle"></i> Seleccionar y ubicar los campos posibles para la impresión de los recibos</div>'
        },
        {
            xtype: 'component',
            html: '<div><ul class="fa-ul"><li><span class="fa-li" ><i class="fas fa-ruler"></i></span> Las distancias de las coordenadas "x" "y" están expresadas en milílmetros.</li><li> <span class="fa-li"><i class="fas fa-thumbtack"></i></span>Los valores correspondientes a "x" se toman desde el margen exterior izquierdo de la hoja, y los de "y" desde el margen superior de la hoja</li></ul></div>'
        },
        {
            xtype: 'panel',
            ui: 'light',
            defaults: {
                //margin: 1,
                cls: 'shadow'
            },
            margin: 3,
            cls: 'shadow',
            padding: 0,
            layout: {
                type: 'box',
                vertical: true,
                align: 'stretch'
            },
            //defaults: {padding: 10},
            items: [
                {
                    xtype: 'toolbar',
                    items: [
                        {
                            xtype: 'tbtext',
                            html: 'Hoja '
                        },
                        {
                            xtype: 'button',
                            iconCls: 'x-fas fa-file',
                            tooltip: 'Tamaño del papel',
                            bind: {
                                disabled: '{!entity_data.checked}'
                            },
                            handler: 'focusNext',
                            style: 'margin-right: 0!important;'
                        },
                        {
                            xtype: 'combo',
                            reference: 'docPageSize',
                            bind: {
                                store: '{sizes}',
                                //value: '{pageSize}'
                            },
                            valueFiled: 'data',
                            allowBlank: false,
                            displayField: 'name',
                            forceSelection: true,
                            emptyText: 'Tamaño del papel',
                            width: 60,
                            style: 'margin-left: 0!important;text-align:right;',
                            grow: true,
                            growMax: 140,
                            name: 'options.size',
                            listeners: {
                                change: 'forceUpdate'
                            }
                        },
                        {
                            xtype: 'segmentedbutton',
                            reference: 'current_layout',
                            publishes: 'value',
                            bind: {
                                value: '{pageLayout}'
                            },
                            items: [
                                {
                                    iconCls: 'x-fas fa-arrows-alt-v',
                                    value: 'portrait',
                                    tooltip: 'Hoja vertical'
                                },
                                {
                                    iconCls: 'x-fas fa-arrows-alt-h',
                                    value: 'landscape',
                                    tooltip: 'Hoja horizontal'
                                }
                            ],
                            listeners: {
                                change: 'forceUpdate'
                            }
                        },
                        {
                            xtype: 'textfield',
                            hidden: true,
                            name: 'options.layout',
                            bind: {
                                value: '{pageLayout}'
                            }
                        },
                        {
                            xtype: 'tbtext',
                            bind: {
                                html: '{docPageSize.selection.h} x {docPageSize.selection.v} mm'
                            }
                        },
                        {
                            xtype: 'button',
                            iconCls: 'x-fas fa-expand',
                            tooltip: 'Margen de la hoja',
                            bind: {
                                disabled: '{!entity_data.checked}'
                            },
                            handler: 'focusNext',
                            style: 'margin-right: 0!important;'
                        },
                        {
                            style: 'margin-left: 0!important;text-align:right;',
                            xtype: 'numberfield',
                            minValue: 1,
                            allowBlank: false,
                            allowDecimals: false,
                            hideTrigger: true,
                            bind: {
                                value: '{pageMargin}'
                            },
                            width: 40,
                            name: 'options.margin'
                        }
//arrows-alt-v
                    ]

                },
                {
                    xtype: 'toolbar',
                    items: [

                        {
                            xtype: 'checkbox',
                            inputValue: true,
                            uncheckedValue: false,
                            reference: 'receipt_date',
                            boxLabel: 'Fecha de impresión',
                            // checked: true,
                            bind: {
                                //value: '{receiptDate.enabled}'
                            },
                            name: 'settings.receipt_date.enabled',
                            width: 250
                        },
                        {
                            xtype: 'button',
                            iconCls: 'x-fas fa-ruler-horizontal',
                            tooltip: 'Posición horizontal (x)',
                            bind: {
                                disabled: '{!receipt_date.checked}'
                            },
                            handler: 'focusNext',
                            style: 'margin-right: 0!important;'
                        },
                        {
                            xtype: 'numberfield',
                            emptyText: 'x',
                            name: 'settings.receipt_date.x',
                            bind: {
                                //value: '{receiptDate.x}',
                                maxValue: '{maxPosition.h}',
                                minValue: '{pageMargin}',
                                disabled: '{!receipt_date.checked}'
                            },
                            style: 'margin-left: 0!important;text-align:right;',
                            allowBlank: false,
                            allowDecimals: false,
                            hideTrigger: true,
                            typeAhead: true,
                            width: 40
                        },
                        {
                            xtype: 'button',
                            iconCls: 'x-fas fa-ruler-vertical',
                            tooltip: 'Posición vertical (y)',
                            bind: {
                                disabled: '{!receipt_date.checked}'
                            },
                            handler: 'focusNext',
                            style: 'margin-right: 0!important;'
                        },
                        {
                            xtype: 'numberfield',
                            allowBlank: false,
                            allowDecimals: false,
                            emptyText: 'y',
                            name: 'settings.receipt_date.y',
                            bind: {
                                maxValue: '{maxPosition.y}',
                                minValue: '{pageMargin}',
                                disabled: '{!receipt_date.checked}'
                            },
                            style: 'margin-left: 0!important;text-align:right;',
                            hideTrigger: true,
                            typeAhead: true,
                            width: 40
                        },
                        {
                            xtype: 'button',
                            iconCls: 'x-fas fa-text-height',
                            tooltip: 'Tamaño de la fuente',
                            bind: {
                                disabled: '{!receipt_date.checked}'
                            },
                            handler: 'focusNext',
                            style: 'margin-right: 0!important;'
                        },
                        {
                            xtype: 'combo',
                            forceSelection: true,
                            allowBlank: false,
                            name: 'settings.receipt_date.size',
                            bind: {
                                //value: '{receiptDate.size}',
                                store: '{fonts}',
                                disabled: '{!receipt_date.checked}'
                            },
                            style: 'margin-left: 0!important;',
                            grow: true,
                            growMax: 80,
                            minWidth: 45
                        },
                        {
                            xtype: 'segmentedbutton',
                            name: 'align',
                            bind: {
                                value: '{receipt_date_align}',
                                disabled: '{!receipt_date.checked}'
                            },
                            items: [
                                {
                                    iconCls: 'x-fas fa-align-left',
                                    value: 'left',
                                    tooltip: 'Alinear a la izquierda'
                                },
                                {
                                    iconCls: 'x-fas fa-align-center',
                                    value: 'center',
                                    tooltip: 'Alinear en el centro'
                                },
                                {
                                    iconCls: 'x-fas fa-align-justify',
                                    value: 'justify',
                                    tooltip: 'Alinear justificando'
                                },
                                {
                                    iconCls: 'x-fas fa-align-right',
                                    value: 'right',
                                    tooltip: 'Alinear a la derecha'
                                }
                            ]
                        },
                        {
                            xtype: 'textfield',
                            hidden: true,
                            name: 'settings.receipt_date.align',
                            bind: {
                                value: '{receipt_date_align}'
                            }
                        }
                    ]
                },
                {
                    xtype: 'toolbar',
                    items: [

                        {
                            xtype: 'checkbox',
                            inputValue: true,
                            uncheckedValue: false,
                            reference: 'receipt_number',
                            boxLabel: 'Número de recibo',
                            // checked: true,
                            bind: {
                                //value: '{receiptNumber.enabled}'
                            },
                            name: 'settings.receipt_number.enabled',
                            width: 250
                        },
                        {
                            xtype: 'button',
                            iconCls: 'x-fas fa-ruler-horizontal',
                            tooltip: 'Posición horizontal (x)',
                            bind: {
                                disabled: '{!receipt_number.checked}'
                            },
                            handler: 'focusNext',
                            style: 'margin-right: 0!important;'
                        },
                        {
                            xtype: 'numberfield',
                            emptyText: 'x',
                            name: 'settings.receipt_number.x',
                            bind: {
                                //value: '{receiptNumber.x}',
                                maxValue: '{maxPosition.x}',
                                minValue: '{pageMargin}',
                                disabled: '{!receipt_number.checked}'
                            },
                            style: 'margin-left: 0!important;text-align:right;',
                            allowBlank: false,
                            allowDecimals: false,
                            hideTrigger: true,
                            typeAhead: true,
                            width: 40
                        },
                        {
                            xtype: 'button',
                            iconCls: 'x-fas fa-ruler-vertical',
                            tooltip: 'Posición vertical (y)',
                            bind: {
                                disabled: '{!receipt_number.checked}'
                            },
                            handler: 'focusNext',
                            style: 'margin-right: 0!important;'
                        },
                        {
                            xtype: 'numberfield',
                            allowBlank: false,
                            allowDecimals: false,
                            emptyText: 'y',
                            name: 'settings.receipt_number.y',
                            bind: {
                                maxValue: '{maxPosition.y}',
                                minValue: '{pageMargin}',
                                disabled: '{!receipt_number.checked}'
                            },
                            style: 'margin-left: 0!important;text-align:right;',
                            hideTrigger: true,
                            typeAhead: true,
                            width: 40
                        },
                        {
                            xtype: 'button',
                            iconCls: 'x-fas fa-text-height',
                            tooltip: 'Tamaño de la fuente',
                            bind: {
                                disabled: '{!receipt_number.checked}'
                            },
                            handler: 'focusNext',
                            style: 'margin-right: 0!important;'
                        },
                        {
                            xtype: 'combo',
                            forceSelection: true,
                            allowBlank: false,
                            name: 'settings.receipt_number.size',
                            bind: {
                                //value: '{receiptNumber.size}',
                                store: '{fonts}',
                                disabled: '{!receipt_number.checked}'
                            },
                            style: 'margin-left: 0!important;',
                            grow: true,
                            growMax: 80,
                            minWidth: 45
                        },
                        {
                            xtype: 'segmentedbutton',
                            name: 'align',
                            bind: {
                                value: '{receipt_number_align}',
                                disabled: '{!receipt_number.checked}'
                            },
                            items: [
                                {
                                    iconCls: 'x-fas fa-align-left',
                                    value: 'left',
                                    tooltip: 'Alinear a la izquierda'
                                },
                                {
                                    iconCls: 'x-fas fa-align-center',
                                    value: 'center',
                                    tooltip: 'Alinear en el centro'
                                },
                                {
                                    iconCls: 'x-fas fa-align-justify',
                                    value: 'justify',
                                    tooltip: 'Alinear justificando'
                                },
                                {
                                    iconCls: 'x-fas fa-align-right',
                                    value: 'right',
                                    tooltip: 'Alinear a la derecha'
                                }
                            ]
                        },
                        {
                            xtype: 'textfield',
                            hidden: true,
                            name: 'settings.receipt_number.align',
                            bind: {
                                value: '{receipt_number_align}'
                            }
                        },
                        {
                            xtype: 'button',
                            iconCls: 'x-fas fa-tag',
                            tooltip: 'Leyenda',
                            bind: {
                                disabled: '{!receipt_number.checked}'
                            },
                            handler: 'focusNext',
                            style: 'margin-right: 0!important;'
                        },
                        {
                            xtype: 'textfield',
                            emptyText: 'Leyenda',
                            name: 'settings.receipt_number.legend',
                            bind: {
                                //value: '{receiptNumber.legend}',
                                disabled: '{!receipt_number.checked}'
                            },
                            style: 'margin-left: 0!important;text-align:right;',
                            width: 100
                        }
                    ]
                },
                {
                    xtype: 'toolbar',
                    items: [

                        {
                            xtype: 'checkbox',
                            inputValue: true,
                            uncheckedValue: false,
                            reference: 'entity_data',
                            boxLabel: 'Nombre de la entidad',
                            // checked: true,
                            bind: {
                                //value: '{entityTitle.enabled}'
                            },
                            name: 'settings.title.enabled',
                            width: 250
                        },
                        {
                            xtype: 'button',
                            iconCls: 'x-fas fa-ruler-horizontal',
                            tooltip: 'Posición horizontal (x)',
                            bind: {
                                disabled: '{!entity_data.checked}'
                            },
                            handler: 'focusNext',
                            style: 'margin-right: 0!important;'
                        },
                        {
                            xtype: 'numberfield',
                            emptyText: 'x',
                            name: 'settings.title.x',
                            bind: {
                                maxValue: '{maxPosition.x}',
                                minValue: '{pageMargin}',
                                disabled: '{!entity_data.checked}'
                            },
                            style: 'margin-left: 0!important;text-align:right;',
                            allowBlank: false,
                            allowDecimals: false,
                            hideTrigger: true,
                            typeAhead: true,
                            width: 40
                        },
                        {
                            xtype: 'button',
                            iconCls: 'x-fas fa-ruler-vertical',
                            tooltip: 'Posición vertical (y)',
                            bind: {
                                disabled: '{!entity_data.checked}'
                            },
                            handler: 'focusNext',
                            style: 'margin-right: 0!important;'
                        },
                        {
                            xtype: 'numberfield',
                            allowBlank: false,
                            allowDecimals: false,
                            emptyText: 'y',
                            name: 'settings.title.y',
                            bind: {
                                maxValue: '{maxPosition.y}',
                                minValue: '{pageMargin}',
                                disabled: '{!entity_data.checked}'
                            },
                            style: 'margin-left: 0!important;text-align:right;',
                            hideTrigger: true,
                            typeAhead: true,
                            width: 40
                        },
                        {
                            xtype: 'button',
                            iconCls: 'x-fas fa-text-height',
                            tooltip: 'Tamaño de la fuente (principal)',
                            bind: {
                                disabled: '{!entity_data.checked}'
                            },
                            handler: 'focusNext',
                            style: 'margin-right: 0!important;'
                        },
                        {
                            xtype: 'combo',
                            forceSelection: true,
                            allowBlank: false,
                            name: 'settings.title.size',
                            bind: {
                                //value: '{entityTitle.size}',
                                store: '{fonts}',
                                disabled: '{!entity_data.checked}'
                            },
                            style: 'margin-left: 0!important;',
                            grow: true,
                            growMax: 80,
                            minWidth: 45
                        },
                        {
                            xtype: 'button',
                            iconCls: 'x-fas fa-text-height',
                            tooltip: 'Tamaño de la fuente (lineas secundarias)',
                            bind: {
                                disabled: '{!entity_data.checked}'
                            },
                            handler: 'focusNext',
                            style: 'margin-right: 0!important;'
                        },
                        {
                            xtype: 'combo',
                            forceSelection: true,
                            allowBlank: false,
                            name: 'settings.title.size_2',
                            bind: {
                                //value: '{entityTitle.size_2}',
                                store: '{fonts}',
                                disabled: '{!entity_data.checked}'
                            },
                            style: 'margin-left: 0!important;',
                            grow: true,
                            growMax: 80,
                            minWidth: 45
                        },
                        {
                            xtype: 'segmentedbutton',
                            name: 'align',
                            bind: {
                                value: '{title_align}',
                                disabled: '{!entity_data.checked}'
                            },
                            items: [
                                {
                                    iconCls: 'x-fas fa-align-left',
                                    value: 'left',
                                    tooltip: 'Alinear a la izquierda'
                                },
                                {
                                    iconCls: 'x-fas fa-align-center',
                                    value: 'center',
                                    tooltip: 'Alinear en el centro'
                                },
                                {
                                    iconCls: 'x-fas fa-align-justify',
                                    value: 'justify',
                                    tooltip: 'Alinear justificando'
                                },
                                {
                                    iconCls: 'x-fas fa-align-right',
                                    value: 'right',
                                    tooltip: 'Alinear a la derecha'
                                }
                            ]
                        },
                        {
                            xtype: 'textfield',
                            hidden: true,
                            name: 'settings.title.align',
                            bind: {
                                value: '{title_align}'
                            }
                        }
                    ]
                },
                {
                    xtype: 'toolbar',
                    items: [

                        {
                            xtype: 'checkbox',
                            inputValue: true,
                            uncheckedValue: false,
                            reference: 'entity_address',
                            boxLabel: 'Dirección de la entidad',
                            name: 'settings.address.enabled',
                            // checked: true,
                            bind: {
                                //value: '{entityAddress.enabled}'
                            },
                            width: 250
                        },
                        {
                            xtype: 'button',
                            iconCls: 'x-fas fa-ruler-horizontal',
                            tooltip: 'Posición horizontal (x)',
                            bind: {
                                disabled: '{!entity_address.checked}'
                            },
                            handler: 'focusNext',
                            style: 'margin-right: 0!important;'
                        },
                        {
                            xtype: 'numberfield',
                            allowBlank: false,
                            allowDecimals: false,
                            emptyText: 'x',
                            name: 'settings.address.x',
                            bind: {
                                maxValue: '{maxPosition.x}',
                                minValue: '{pageMargin}',
                                disabled: '{!entity_address.checked}'
                            },
                            style: 'margin-left: 0!important;text-align:right;',
                            hideTrigger: true,
                            typeAhead: true,
                            width: 40
                        },
                        {
                            xtype: 'button',
                            iconCls: 'x-fas fa-ruler-vertical',
                            tooltip: 'Posición vertical (y)',
                            bind: {
                                disabled: '{!entity_address.checked}'
                            },
                            handler: 'focusNext',
                            style: 'margin-right: 0!important;'
                        },
                        {
                            xtype: 'numberfield',
                            allowBlank: false,
                            allowDecimals: false,
                            emptyText: 'y',
                            name: 'settings.address.y',
                            bind: {
                                maxValue: '{maxPosition.y}',
                                minValue: '{pageMargin}',
                                disabled: '{!entity_address.checked}'
                            },
                            style: 'margin-left: 0!important;text-align:right;',
                            hideTrigger: true,
                            typeAhead: true,
                            width: 40
                        },
                        {
                            xtype: 'button',
                            iconCls: 'x-fas fa-text-height',
                            tooltip: 'Tamaño de la fuente',
                            bind: {
                                disabled: '{!entity_address.checked}'
                            },
                            handler: 'focusNext',
                            style: 'margin-right: 0!important;'
                        },
                        {
                            xtype: 'combo',
                            forceSelection: true,
                            allowBlank: false,
                            name: 'settings.address.size',
                            bind: {
                                //value: '{entityAddress.size}',
                                store: '{fonts}',
                                disabled: '{!entity_address.checked}'
                            },
                            style: 'margin-left: 0!important;',
                            grow: true,
                            growMax: 80,
                            minWidth: 45
                        },
                        {
                            xtype: 'segmentedbutton',
                            bind: {
                                value: '{entity_address_align}',
                                disabled: '{!entity_address.checked}'
                            },
                            items: [
                                {
                                    iconCls: 'x-fas fa-align-left',
                                    value: 'left',
                                    tooltip: 'Alinear a la izquierda'
                                },
                                {
                                    iconCls: 'x-fas fa-align-center',
                                    value: 'center',
                                    tooltip: 'Alinear en el centro'
                                },
                                {
                                    iconCls: 'x-fas fa-align-justify',
                                    value: 'justify',
                                    tooltip: 'Alinear justificando'
                                },
                                {
                                    iconCls: 'x-fas fa-align-right',
                                    value: 'right',
                                    tooltip: 'Alinear a la derecha'
                                }
                            ]
                        },
                        {
                            xtype: 'textfield',
                            hidden: true,
                            name: 'settings.address.align',
                            bind: {
                                value: '{entity_address_align}'
                            }
                        }
                    ]
                },
                {
                    xtype: 'toolbar',
                    items: [
                        {
                            xtype: 'tbtext',
                            html: 'Inicio de líneas con detalles de Pago',
                            width: 250
                        },

                        {
                            xtype: 'checkbox',
                            inputValue: true,
                            uncheckedValue: false,
                            reference: 'line_data',
                            boxLabel: 'Nombre de la entidad',
                            // checked: true,
                            bind: {
                                //value: '{receiptLines.enabled}'
                            },
                            name: 'settings.lines.enabled',
                            hidden: true,
                            width: 250
                        },
                        {
                            xtype: 'button',
                            iconCls: 'x-fas fa-ruler-horizontal',
                            tooltip: 'Posición horizontal (x)',
                            handler: 'focusNext',
                            style: 'margin-right: 0!important;'
                        },
                        {
                            xtype: 'numberfield',
                            emptyText: 'x',
                            name: 'settings.lines.x',
                            bind: {
                                maxValue: '{maxPosition.x}',
                                minValue: '{pageMargin}'
                            },
                            style: 'margin-left: 0!important;text-align:right;',
                            allowBlank: false,
                            allowDecimals: false,
                            hideTrigger: true,
                            typeAhead: true,
                            width: 40
                        },
                        {
                            xtype: 'button',
                            iconCls: 'x-fas fa-ruler-vertical',
                            tooltip: 'Posición vertical (y)',
                            handler: 'focusNext',
                            style: 'margin-right: 0!important;'
                        },
                        {
                            xtype: 'numberfield',
                            allowBlank: false,
                            allowDecimals: false,
                            emptyText: 'y',
                            name: 'settings.lines.y',
                            bind: {
                                maxValue: '{maxPosition.y}',
                                minValue: '{pageMargin}'
                            },
                            style: 'margin-left: 0!important;text-align:right;',
                            hideTrigger: true,
                            typeAhead: true,
                            width: 40
                        },
                        {
                            xtype: 'button',
                            iconCls: 'x-fas fa-text-height',
                            tooltip: 'Tamaño de la fuente predeterminado',
                            bind: {
                                disabled: '{!entity_data.checked}'
                            },
                            handler: 'focusNext',
                            style: 'margin-right: 0!important;'
                        },
                        {
                            xtype: 'combo',
                            forceSelection: true,
                            allowBlank: false,
                            name: 'settings.lines.size',
                            bind: {
                                //value: '{receiptLines.size}',
                                store: '{fonts}'
                            },
                            style: 'margin-left: 0!important;',
                            grow: true,
                            growMax: 80,
                            minWidth: 45
                        }
//arrows-alt-v
                    ]

                },
                {
                    xtype: 'toolbar',
                    items: [

                        {
                            xtype: 'checkbox',
                            inputValue: true,
                            uncheckedValue: false,
                            reference: 'show_headers',
                            boxLabel: 'Mostrar cabeceras',
                            name: 'settings.lines.showHeaders',
                            // checked: true,
                            bind: {
                                //value: '{receiptLines.showHeaders}'
                            }
                        },
                        {
                            xtype: 'checkbox',
                            inputValue: true,
                            uncheckedValue: false,
                            reference: 'line_headers',
                            name: 'settings.lines.lineHeader',
                            boxLabel: 'Separador cabeceras',
                            // checked: true,
                            bind: {
                                disabled: '{!show_headers.checked}',
                                //value: '{receiptLines.lineHeader}'
                            }
                        },
                        {
                            xtype: 'checkbox',
                            inputValue: true,
                            uncheckedValue: false,
                            reference: 'line_rows',
                            name: 'settings.lines.lineRows',
                            boxLabel: 'Separador entre líneas',
                            // checked: true,
                            bind: {
                                //value: '{receiptLines.lineRows}'
                            }
                        },
                        {
                            xtype: 'checkbox',
                            inputValue: true,
                            uncheckedValue: false,
                            reference: 'line_summary',
                            name: 'settings.lines.total.enabled',
                            boxLabel: 'Mostrar totales',
                            // checked: true,
                            bind: {
                                //value: '{receiptLines.total.enabled}'
                            }
                        },
                        {
                            xtype: 'button',
                            iconCls: 'x-fas fa-heading',
                            tooltip: 'Total',
                            bind: {
                                disabled: '{!line_summary.checked}'
                            },
                            handler: 'focusNext',
                            style: 'margin-right: 0!important;'
                        },
                        {
                            xtype: 'textfield',
                            emptyText: 'Leyenda',
                            name: 'settings.lines.total.legend',
                            bind: {
                                //value: '{receiptLines.total.legend}',
                                disabled: '{!line_summary.checked}'
                            },
                            style: 'margin-left: 0!important;text-align:right;',
                            width: 100
                        }
                    ]
                },
                {
                    xtype: 'toolbar',
                    items: [

                        {
                            xtype: 'checkbox',
                            inputValue: true,
                            uncheckedValue: false,
                            reference: 'receipt_line_date',
                            boxLabel: 'Fecha de Pago',
                            name: 'settings.lines.payment_date.enabled',
                            // checked: true,
                            bind: {
                                //value: '{receiptLines.payment_date.enabled}'
                            },
                            width: 250
                        },
                        {
                            xtype: 'button',
                            iconCls: 'x-fas fa-ruler-horizontal',
                            tooltip: 'Posición horizontal (x)',
                            bind: {
                                disabled: '{!receipt_line_date.checked}'
                            },
                            handler: 'focusNext',
                            style: 'margin-right: 0!important;'
                        },
                        {
                            xtype: 'numberfield',
                            emptyText: 'x',
                            name: 'settings.lines.payment_date.x',
                            bind: {
                                maxValue: '{maxPosition.x}',
                                minValue: '{pageMargin}',
                                disabled: '{!receipt_line_date.checked}'
                            },
                            style: 'margin-left: 0!important;text-align:right;',
                            allowBlank: false,
                            allowDecimals: false,
                            hideTrigger: true,
                            typeAhead: true,
                            width: 40
                        },
                        {
                            xtype: 'button',
                            iconCls: 'x-fas fa-text-height',
                            tooltip: 'Tamaño de la fuente',
                            bind: {
                                disabled: '{!receipt_line_date.checked}'
                            },
                            handler: 'focusNext',
                            style: 'margin-right: 0!important;'
                        },
                        {
                            xtype: 'combo',
                            forceSelection: true,
                            allowBlank: false,
                            name: 'settings.lines.payment_date.size',
                            bind: {
                                //value: '{receiptLines.payment_date.size}',
                                store: '{fonts}',
                                disabled: '{!receipt_line_date.checked}'
                            },
                            style: 'margin-left: 0!important;',
                            grow: true,
                            growMax: 80,
                            minWidth: 45
                        },
                        {
                            xtype: 'segmentedbutton',
                            name: 'align',
                            bind: {
                                value: '{payment_date_align}',
                                disabled: '{!receipt_line_date.checked}'
                            },
                            items: [
                                {
                                    iconCls: 'x-fas fa-align-left',
                                    value: 'left',
                                    tooltip: 'Alinear a la izquierda'
                                },
                                {
                                    iconCls: 'x-fas fa-align-center',
                                    value: 'center',
                                    tooltip: 'Alinear en el centro'
                                },
                                {
                                    iconCls: 'x-fas fa-align-justify',
                                    value: 'justify',
                                    tooltip: 'Alinear justificando'
                                },
                                {
                                    iconCls: 'x-fas fa-align-right',
                                    value: 'right',
                                    tooltip: 'Alinear a la derecha'
                                }
                            ]
                        },
                        {
                            xtype: 'textfield',
                            hidden: true,
                            name: 'settings.lines.payment_date.align',
                            bind: {
                                value: '{payment_date_align}'
                            }
                        },
                        {
                            xtype: 'button',
                            iconCls: 'x-fas fa-heading',
                            tooltip: 'Cabecera',
                            bind: {
                                disabled: '{!receipt_line_date.checked||!show_headers.checked}'
                            },
                            handler: 'focusNext',
                            style: 'margin-right: 0!important;'
                        },
                        {
                            xtype: 'textfield',
                            emptyText: 'Leyenda',
                            name: 'settings.lines.payment_date.legend',
                            bind: {
                                //value: '{receiptLines.payment_date.legend}',
                                disabled: '{!receipt_line_date.checked||!show_headers.checked}'
                            },
                            style: 'margin-left: 0!important;text-align:right;',
                            width: 100
                        }
                    ]
                },
                {
                    xtype: 'toolbar',
                    items: [

                        {
                            xtype: 'checkbox',
                            inputValue: true,
                            uncheckedValue: false,
                            reference: 'receipt_line_partner',
                            name: 'settings.lines.partner.enabled',
                            boxLabel: 'Asociado',
                            // checked: true,
                            bind: {
                                //value: '{receiptLines.partner.enabled}'
                            },
                            width: 250
                        },
                        {
                            xtype: 'button',
                            iconCls: 'x-fas fa-ruler-horizontal',
                            tooltip: 'Posición horizontal (x)',
                            bind: {
                                disabled: '{!receipt_line_partner.checked}'
                            },
                            handler: 'focusNext',
                            style: 'margin-right: 0!important;'
                        },
                        {
                            xtype: 'numberfield',
                            emptyText: 'x',
                            name: 'settings.lines.partner.x',
                            bind: {
                                maxValue: '{maxPosition.x}',
                                minValue: '{pageMargin}',
                                disabled: '{!receipt_line_partner.checked}'
                            },
                            style: 'margin-left: 0!important;text-align:right;',
                            allowBlank: false,
                            allowDecimals: false,
                            hideTrigger: true,
                            typeAhead: true,
                            width: 40
                        },
                        {
                            xtype: 'button',
                            iconCls: 'x-fas fa-text-height',
                            tooltip: 'Tamaño de la fuente',
                            bind: {
                                disabled: '{!receipt_line_partner.checked}'
                            },
                            handler: 'focusNext',
                            style: 'margin-right: 0!important;'
                        },
                        {
                            xtype: 'combo',
                            forceSelection: true,
                            allowBlank: false,
                            name: 'settings.lines.partner.size',
                            bind: {
                                //value: '{receiptLines.partner.size}',
                                store: '{fonts}',
                                disabled: '{!receipt_line_partner.checked}'
                            },
                            style: 'margin-left: 0!important;',
                            grow: true,
                            growMax: 80,
                            minWidth: 45
                        },
                        {
                            xtype: 'segmentedbutton',
                            name: 'align',
                            bind: {
                                value: '{partner_align}',
                                disabled: '{!receipt_line_partner.checked}'
                            },
                            items: [
                                {
                                    iconCls: 'x-fas fa-align-left',
                                    value: 'left',
                                    tooltip: 'Alinear a la izquierda'
                                },
                                {
                                    iconCls: 'x-fas fa-align-center',
                                    value: 'center',
                                    tooltip: 'Alinear en el centro'
                                },
                                {
                                    iconCls: 'x-fas fa-align-justify',
                                    value: 'justify',
                                    tooltip: 'Alinear justificando'
                                },
                                {
                                    iconCls: 'x-fas fa-align-right',
                                    value: 'right',
                                    tooltip: 'Alinear a la derecha'
                                }
                            ]
                        },
                        {
                            xtype: 'textfield',
                            hidden: true,
                            name: 'settings.lines.partner.align',
                            bind: {
                                value: '{partner_align}'
                            }
                        },
                        {
                            xtype: 'button',
                            iconCls: 'x-fas fa-heading',
                            tooltip: 'Cabecera',
                            bind: {
                                disabled: '{!receipt_line_partner.checked||!show_headers.checked}'
                            },
                            handler: 'focusNext',
                            style: 'margin-right: 0!important;'
                        },
                        {
                            xtype: 'textfield',
                            emptyText: 'Leyenda',
                            name: 'settings.lines.partner.legend',
                            bind: {
                                //value: '{receiptLines.partner.legend}',
                                disabled: '{!receipt_line_partner.checked||!show_headers.checked}'
                            },
                            style: 'margin-left: 0!important;text-align:right;',
                            width: 100
                        },
                        {
                            xtype: 'checkbox',
                            inputValue: true,
                            uncheckedValue: false,
                            boxLabel: 'Mostrar Curso',
                            name: 'settings.lines.course.enabled',
                            // checked: true,
                            bind: {
                                //value: '{receiptLines.course.enabled}',
                                disabled: '{!receipt_line_partner.checked}'
                            }
                        }
                    ]
                },
                {
                    xtype: 'toolbar',
                    items: [

                        {
                            xtype: 'checkbox',
                            inputValue: true,
                            uncheckedValue: false,
                            reference: 'receipt_line_concept',
                            boxLabel: 'Concepto',
                            name: 'settings.lines.concept.enabled',
                            // checked: true,
                            bind: {
                                //value: '{receiptLines.concept.enabled}'
                            },
                            width: 250
                        },
                        {
                            xtype: 'button',
                            iconCls: 'x-fas fa-ruler-horizontal',
                            tooltip: 'Posición horizontal (x)',
                            bind: {
                                disabled: '{!receipt_line_concept.checked}'
                            },
                            handler: 'focusNext',
                            style: 'margin-right: 0!important;'
                        },
                        {
                            xtype: 'numberfield',
                            emptyText: 'x',
                            name: 'settings.lines.concept.x',
                            bind: {
                                maxValue: '{maxPosition.x}',
                                minValue: '{pageMargin}',
                                disabled: '{!receipt_line_concept.checked}'
                            },
                            style: 'margin-left: 0!important;text-align:right;',
                            allowBlank: false,
                            allowDecimals: false,
                            hideTrigger: true,
                            typeAhead: true,
                            width: 40
                        },
                        {
                            xtype: 'button',
                            iconCls: 'x-fas fa-text-height',
                            tooltip: 'Tamaño de la fuente',
                            bind: {
                                disabled: '{!receipt_line_concept.checked}'
                            },
                            handler: 'focusNext',
                            style: 'margin-right: 0!important;'
                        },
                        {
                            xtype: 'combo',
                            forceSelection: true,
                            allowBlank: false,
                            name: 'settings.lines.concept.size',
                            bind: {
                                //value: '{receiptLines.concept.size}',
                                store: '{fonts}',
                                disabled: '{!receipt_line_concept.checked}'
                            },
                            style: 'margin-left: 0!important;',
                            grow: true,
                            growMax: 80,
                            minWidth: 45
                        },
                        {
                            xtype: 'segmentedbutton',
                            name: 'align',
                            bind: {
                                value: '{concept_align}',
                                disabled: '{!receipt_line_concept.checked}'
                            },
                            items: [
                                {
                                    iconCls: 'x-fas fa-align-left',
                                    value: 'left',
                                    tooltip: 'Alinear a la izquierda'
                                },
                                {
                                    iconCls: 'x-fas fa-align-center',
                                    value: 'center',
                                    tooltip: 'Alinear en el centro'
                                },
                                {
                                    iconCls: 'x-fas fa-align-justify',
                                    value: 'justify',
                                    tooltip: 'Alinear justificando'
                                },
                                {
                                    iconCls: 'x-fas fa-align-right',
                                    value: 'right',
                                    tooltip: 'Alinear a la derecha'
                                }
                            ]
                        },
                        {
                            xtype: 'textfield',
                            hidden: true,
                            name: 'settings.lines.concept.align',
                            bind: {
                                value: '{concept_align}'
                            }
                        },
                        {
                            xtype: 'button',
                            iconCls: 'x-fas fa-heading',
                            tooltip: 'Cabecera',
                            bind: {
                                disabled: '{!receipt_line_concept.checked||!show_headers.checked}'
                            },
                            handler: 'focusNext',
                            style: 'margin-right: 0!important;'
                        },
                        {
                            xtype: 'textfield',
                            emptyText: 'Leyenda',
                            name: 'settings.lines.concept.legend',
                            bind: {
                                //value: '{receiptLines.concept.legend}',
                                disabled: '{!receipt_line_concept.checked||!show_headers.checked}'
                            },
                            style: 'margin-left: 0!important;text-align:right;',
                            width: 100
                        }
                    ]
                },
                {
                    xtype: 'toolbar',
                    items: [

                        {
                            xtype: 'checkbox',
                            inputValue: true,
                            uncheckedValue: false,
                            reference: 'receipt_line_amount',
                            boxLabel: 'Monto',
                            name: 'settings.lines.amount.enabled',
                            // checked: true,
                            bind: {
                                //value: '{receiptLines.amount.enabled}'
                            },
                            width: 250
                        },
                        {
                            xtype: 'button',
                            iconCls: 'x-fas fa-ruler-horizontal',
                            tooltip: 'Posición horizontal (x)',
                            bind: {
                                disabled: '{!receipt_line_amount.checked}'
                            },
                            handler: 'focusNext',
                            style: 'margin-right: 0!important;'
                        },
                        {
                            xtype: 'numberfield',
                            emptyText: 'x',
                            name: 'settings.lines.amount.x',
                            bind: {
                                maxValue: '{maxPosition.x}',
                                minValue: '{pageMargin}',
                                disabled: '{!receipt_line_amount.checked}'
                            },
                            style: 'margin-left: 0!important;text-align:right;',
                            allowBlank: false,
                            allowDecimals: false,
                            hideTrigger: true,
                            width: 40
                        },
                        {
                            xtype: 'button',
                            iconCls: 'x-fas fa-text-height',
                            tooltip: 'Tamaño de la fuente',
                            bind: {
                                disabled: '{!receipt_line_amount.checked}'
                            },
                            handler: 'focusNext',
                            style: 'margin-right: 0!important;'
                        },
                        {
                            xtype: 'combo',
                            forceSelection: true,
                            allowBlank: false,
                            name: 'settings.lines.amount.size',
                            bind: {
                                //value: '{receiptLines.amount.size}',
                                store: '{fonts}',
                                disabled: '{!receipt_line_amount.checked}'
                            },
                            style: 'margin-left: 0!important;',
                            grow: true,
                            growMax: 80,
                            minWidth: 45
                        },
                        {
                            xtype: 'segmentedbutton',
                            name: 'align',
                            bind: {
                                value: '{amount_align}',
                                disabled: '{!receipt_line_amount.checked}'
                            },
                            items: [
                                {
                                    iconCls: 'x-fas fa-align-left',
                                    value: 'left',
                                    tooltip: 'Alinear a la izquierda'
                                },
                                {
                                    iconCls: 'x-fas fa-align-center',
                                    value: 'center',
                                    tooltip: 'Alinear en el centro'
                                },
                                {
                                    iconCls: 'x-fas fa-align-justify',
                                    value: 'justify',
                                    tooltip: 'Alinear justificando'
                                },
                                {
                                    iconCls: 'x-fas fa-align-right',
                                    value: 'right',
                                    tooltip: 'Alinear a la derecha'
                                }
                            ]
                        },
                        {
                            xtype: 'textfield',
                            hidden: true,
                            name: 'settings.lines.amount.align',
                            bind: {
                                value: '{amount_align}'
                            }
                        },
                        {
                            xtype: 'button',
                            iconCls: 'x-fas fa-heading',
                            tooltip: 'Cabecera',
                            bind: {
                                disabled: '{!receipt_line_amount.checked||!show_headers.checked}'
                            },
                            handler: 'focusNext',
                            style: 'margin-right: 0!important;'
                        },
                        {
                            xtype: 'textfield',
                            emptyText: 'Leyenda',
                            name: 'settings.lines.amount.legend',
                            bind: {
                                //value: '{receiptLines.amount.legend}',
                                disabled: '{!receipt_line_amount.checked||!show_headers.checked}'
                            },
                            style: 'margin-left: 0!important;text-align:right;',
                            width: 100
                        }
                    ]
                }
            ],
        }
    ]
});