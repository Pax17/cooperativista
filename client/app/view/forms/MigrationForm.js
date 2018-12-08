Ext.define('Cooperativista.view.forms.MigrationForm', {
    extend: 'Ext.panel.Panel',
    xtype: 'migrationform',
    requires: ['Cooperativista.view.forms.WizardFormModel'],

    bodyPadding: 15,

    minHeight: 340,

    layout: 'card',

    viewModel: {
        type: 'wizardform'
    },

    controller: 'wizardform',
    listeners: {boxready: 'firstMigrationRun'},
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
            reference: 'migrationsetup',
            defaults: {
                labelWidth: 90,
                labelAlign: 'top',
                labelSeparator: '',
                submitEmptyText: false,
                anchor: '100%'
            },
            items: [
                {
                    xtype: 'checkbox',
                    name: 'excludeInactiveUsers',
                    checked: true,
                    boxLabel: 'Al generar el nuevo período excluir miembros inactivos'
                }
            ]
        },
        {
            xtype: 'panel',
            defaultType: 'textfield',
            reference: 'confirmmigration',
            //layout: 'fit',
            scrollable: 'y',
            items: [
                {
                    xtype: 'component',
                    style: 'padding-bottom:8px;',
                    html: '<div class="faq-left-sidebar">' +
                    '<h3>Se iniciará la finalización del período. </h3> Los pasos a seguir son los siguientes:' +
                    '<ul class="faq-tips-list">' +
                    '<li class="pointone">Backup de datos</li>' +
                    '<li class="pointtwo">Migración de usuarios y alumnos</li>' +
                    '<li class="pointthree">Migración de datos del entorno</li>' +
                    '</ul>' + '<div>' +
                    'Recuerde que al finalizar esta migración debe actualizar el estado de los alumnos ya que estos pasarán en el mismo estado que se encuentran ahora. Solo se excluirán aquellos que ya están egresados.' +
                    '</div>' +
                    '</div>'
                }
            ]
        },
        {
            xtype: 'panel',
            scrollable: 'y',
            defaultType: 'textfield',
            reference: 'statusmigration',
            layout: 'fit',
            scrollable: 'y',
            items: [
                {
                    xtype: 'component',
                    style: 'padding-bottom:8px;',
                    reference: 'migrationStatusPanel',
                    tpl: ['<ul class="fa-ul"><tpl for="."><li><span class="fa-li" >{ended:this.status}</span> Paso {step} de {total}: {message}</li></tpl></ul>',
                        {
                            formatDate: function (value) {
                                return Ext.util.Format.date(value, 'd-m-Y');
                            },
                            status: function (status) {
                                let icon = status ? 'fas fa-check isValid' : 'fas fa-stopwatch isWarning';
                                return `<i class="${icon}"></i> `;
                            }
                        }
                    ]
                }

            ]
        }
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
                    iconCls: 'fas fa-clipboard-list',
                    pressed: true,
                    enableToggle: true,
                    text: 'Opciones'
                },
                {
                    step: 1,
                    iconCls: 'fas fa-hdd',
                    enableToggle: true,
                    text: 'Migración'
                }/*,
                {
                    step: 2,
                    iconCls: 'fas fa-calendar-alt',
                    enableToggle: true,
                    text: 'Período'
                },
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
                        visible: '{!atBeginning}'
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
                        visible: '{!atEnd}'
                    },
                    listeners: {
                        click: 'onNextClick'
                    }
                },
                {
                    text: 'Cancelar',
                    ui: this.colorScheme,
                    formBind: true,
                    reference: 'cancelbutton',
                    listeners: {
                        click: 'cancelMigration'
                    }
                },
                {
                    text: 'Iniciar',
                    ui: 'soft-red',
                    formBind: true,
                    reference: 'savebutton',
                    bind: {
                        visible: '{atEnd}'
                    },
                    listeners: {
                        click: 'startMigration'
                    }
                }
            ]
        };

        this.callParent();
    }
});
