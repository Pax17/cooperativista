Ext.define('Cooperativista.view.forms.SetupForm', {
    extend: 'Ext.panel.Panel',
    xtype: 'setupform',
    requires: ['Cooperativista.view.forms.WizardFormModel'],

    bodyPadding: 15,

    minHeight: 340,

    layout: 'card',

    viewModel: {
        type: 'wizardform'
    },

    controller: 'wizardform',
    listeners: {boxready: 'firstSetupRun'},
    //onBoxReady: 'firstSetupRun',

    defaults: {
        /*
         * Seek out the first enabled, focusable, empty textfield when the form is focused
         */
        defaultFocus: 'textfield:not([value]):focusable:not([disabled])',

        defaultButton: 'nextbutton'
    },

    items: [
        {
            xtype: 'form',
            defaultType: 'textfield',
            reference: 'usersetup',
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
                    hidden: true
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
                    fieldLabel: 'Apellido'
                },
                {
                    emptyText: 'Ingrese un nombre de usuario',
                    name: 'alias',
                    fieldLabel: 'Usuario',
                    allowBlank: false
                },
                {
                    emptyText: 'ej: me@somewhere.com',
                    vtype: 'email',
                    name: 'attribute_1',
                    fieldLabel: 'Correo electrónico'
                },
                {
                    emptyText: 'Ingrese una clave',
                    inputType: 'password',
                    cls: 'wizard-form-break',
                    name: 'passcode',
                    fieldLabel: 'Defina una clave para el ingreso al sistema',
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
        },
        {
            xtype: 'form',
            defaultType: 'textfield',
            reference: 'entitysetup',
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
                    hidden: true
                },
                {
                    emptyText: 'Entidad',
                    name: 'name',
                    fieldLabel: 'Nombre de la Entidad',
                    allowBlank: false
                },
                {
                    emptyText: 'Entidad (linea 2 - opcional)',
                    name: 'name_2'
                },
                {
                    emptyText: 'Entidad (linea 3 - opcional)',
                    name: 'name_3'
                },
                {
                    emptyText: 'Dirección',
                    name: 'attribute_1',
                    fieldLabel: 'Dirección',
                    allowBlank: false
                },
                {
                    emptyText: 'Teléfono',
                    name: 'attribute_2',
                    fieldLabel: 'Teléfono'
                }
            ]
        },
        {
            xtype: 'form',
            scrollable: 'y',
            defaultType: 'textfield',
            reference: 'periodsetup',
            defaults: {
                labelWidth: 90,
                labelAlign: 'top',
                labelSeparator: '',
                submitEmptyText: false,
                anchor: '100%',
                allowBlank: false
            },
            items: [
                {
                    //   labelAlign: 'left',
                    xtype: 'numberfield',
                    name: 'period_name',
                    emptyText: 'Año',
                    fieldLabel: 'Período actual (año)',
                    bind: {value: {bindTo: '{period_name}', single: true}}
                },
                {
                    xtype: 'fieldcontainer',
                    fieldLabel: 'Rango de actividad del período contable',
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    defaults: {
                        xtype: 'datefield',
                        flex: 1,
                        labelAlign: 'left',
                        allowBlank: false
                    },
                    items: [
                        {
                            // fieldLabel: 'Desde',
                            emptyText: 'Fecha de Inicio',
                            reference: 'period_start_field',
                            name: 'period_start',
                            publishes: 'value',
                            margin: '0 4 0 0',
                            submitFormat: 'Y-m-d',
                            bind: {
                                //value: '{period_start}',
                                value: {bindTo: '{period_start}', single: true},
                                maxValue: '{period_end_field.value}'
                            }
                        },
                        {
                            //  fieldLabel: 'Hasta',
                            emptyText: 'Fecha de finalización',
                            reference: 'period_end_field',
                            publishes: 'value',
                            name: 'period_end',
                            margin: '0 0 0 4',
                            submitFormat: 'Y-m-d',
                            bind: {
                                //  value: '{period_end}',
                                value: {bindTo: '{period_end}', single: true},
                                minValue: '{period_start_field.value}'
                            }
                        }
                    ]
                },
                {
                    //   labelAlign: 'left',
                    xtype: 'numberfield',
                    name: 'default_fee_amount',
                    emptyText: 'Valor cuota por defecto',
                    fieldLabel: 'Valor cuota mensual',
                    bind: {
                        value: {bindTo: '{default_fee_amount}', single: true}
                    }
                }

            ]
        }
        /*  {
              xtype: 'form',
              reference: 'backup',
              defaultType: 'textfield',
              defaults: {
                  labelWidth: 90,
                  labelAlign: 'top',
                  labelSeparator: '',
                  submitEmptyText: false,
                  anchor: '100%'
              },
              items:[
                  {
                      emptyText : 'Phone number'
                  },
                  {
                      emptyText : 'Address'
                  },
                  {
                      emptyText : 'City'
                  },
                  {
                      emptyText : 'Postal Code / Zip Code'
                  }
              ]
          },*/
    ],

    initComponent: function () {

        this.tbar = {
            reference: 'progress',
            defaultButtonUI: 'wizard-' + this.colorScheme,
            cls: 'wizardprogressbar',
            defaults: {
                disabled: true,
                iconAlign: 'top'
            },
            layout: {
                pack: 'center'
            },
            items: [
                {
                    step: 0,
                    iconCls: 'fas fa-user-graduate',
                    pressed: true,
                    enableToggle: true,
                    text: 'Cuenta'
                },
                {
                    step: 1,
                    iconCls: 'fas fa-school',
                    enableToggle: true,
                    text: 'Entidad'
                },
                {
                    step: 2,
                    iconCls: 'fas fa-calendar-alt',
                    enableToggle: true,
                    text: 'Período'
                }/*,
                {
                    step: 3,
                    iconCls: 'fas fa-heart',
                    enableToggle: true,
                    text: 'Finish'
                }*/
            ]
        };

        this.bbar = {
            reference: 'navigation-toolbar',
            padding: 8,
            items: [
                '->',
                {
                    text: 'Anterior',
                    ui: this.colorScheme,
                    formBind: true,
                    bind: {
                        disabled: '{atBeginning}'
                    },
                    listeners: {
                        click: 'onPreviousClick'
                    }
                },
                {
                    text: 'Siguiente',
                    ui: this.colorScheme,
                    formBind: true,
                    reference: 'nextbutton',
                    bind: {
                        disabled: '{atEnd}'
                    },
                    listeners: {
                        click: 'onNextClick'
                    }
                },
                {
                    text: 'Guardar',
                    ui: this.colorScheme,
                    formBind: true,
                    reference: 'savebutton',
                    bind: {
                        visible: '{atEnd}'
                    },
                    listeners: {
                        click: 'saveFirstRun'
                    }
                }
            ]
        };

        this.callParent();
    }
});
