Ext.define('Cooperativista.view.config.Relations', {
    extend: 'Ext.tab.Panel',
    xtype: 'relations',
    requires: [
        'Ext.grid.Panel',
        'Ext.grid.filters.Filters',
        'Ext.grid.column.Date',
        'Ext.grid.feature.Grouping',
        'Ext.selection.CheckboxModel',
        'Ext.form.RadioGroup',
        'Ext.layout.container.Border'
    ],

    controller: 'relations',
    viewModel: {
        type: 'relations'
    },
    listeners: {
        tabchange: 'closeWins'
    },
    cls: 'shadow extended_tools',
    activeTab: 0,
    ui: 'navigation',
    items: [
        {
            xtype: 'grid',
            cls: 'cell-widget-no-pad',
            title: 'Alumnos',
            routeId: 'student',
            reference: 'student-grid',
            stateful: true,
            stateId: 'students-abm-grid',
            iconCls: 'x-fas fa-user-friends',
            bind: {
                store: '{studentsStore}'
            },
            rowViewModel: {},
            features: [{ftype: 'grouping'}],
            plugins: {
                ptype: 'gridfilters',
                menuFilterText: 'Filtrar',
                id: 'student-filters'
            },
            selModel: {
                selType: 'checkboxmodel'
            },
            listeners: {
                selectionchange: 'onStudentsSelChange'
            },
            emptyText: '<i class="fas fa-user-plus"></i> Debe agregar alumnos para comenzar a usar el sistema',
            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'top',
                    items: [
                        // '->',
                        {
                            tooltip: 'Agregar alumno',
                            //   text: 'Agregar',
                            //type: 'plus',
                            iconCls: 'fas fa-user-plus',
                            handler: 'addStudent',
                            action: 'add',
                            ui: 'header'
                        },
                        '->',
                        {
                            xtype: 'checkbox',
                            boxLabel: 'Ocultar egresados',
                            // checked: true,
                            name: 'graduates',
                            reference: 'hideGraduates'
                        },
                        {
                            tooltip: 'Cambiar el curso de los alumnos seleccionados',
                            text: 'Asignar curso',
                            //type: 'plus',
                            iconCls: 'fas fa-link',
                            handler: 'promoteStudens',
                            ui: 'header',
                            bind: {
                                disabled: '{!studentsCanPromote}'
                            }

                        },
                        {
                            tooltip: 'Egresar alumno del establecimiento',
                            text: 'Egresar',
                            //type: 'plus',
                            iconCls: 'fas fa-sign-out-alt',
                            handler: 'graduateStudents',
                            ui: 'header',
                            // action: 'update',
                            bind: {
                                disabled: '{studentsSelected==0}'
                            }
                        }
                    ]
                }
            ],
            columns: [
                {
                    //  xtype: 'gridcolumn',
                    width: 40,
                    dataIndex: 'id',
                    text: '#',
                    hideable: false,
                    menuDisabled: true
                },
                {
                    // This is our Widget column
                    xtype: 'widgetcolumn',
                    //cls: 'cell-no-pad',
                    menuDisabled: true,
                    width: 32,
                    padding: 0,
                    align: 'center',
                    widget: {
                        xtype: 'component',
                        margin: 0,
                        padding: 5,
                        //  defaultBindProperty : 'data',
                        bind: {
                            data: {attribute_5: '{record.attribute_5}'}
                        },
                        tpl: ['<i class="fas fa-{attribute_5:this.iconize}" data-qtip="{attribute_5:this.doTooltip}"></i>',
                            {
                                doTooltip: function (date) {
                                    //<debug>
                                    console.debug('doTooltip', date);
                                    //</debug>
                                    if (date && date instanceof Date) {
                                        let string = date < new Date() ? 'Egresado desde' : 'A egresar el';
                                        let diff = Ext.Date.diff(new Date, date, Ext.Date.DAY)
                                        console.debug('doTooltipdoTooltipdoTooltipdoTooltipdoTooltip', diff);
                                        if (diff <= 0) {
                                            string = 'Egresado desde';
                                        }
                                        if (diff <= 30 && diff > 0) {
                                            string = 'A egresar el';
                                        }
                                        if (diff > 30) {

                                            string = 'Alumno activo - Egresa el';
                                        }
                                        return `${string} ${Ext.util.Format.date(date, 'd-m-Y')}`;
                                    } else {
                                        return 'Alumno activo';
                                    }
                                },
                                iconize: function (attribute_5) {
                                    //<debug>
                                    console.debug('iconize', attribute_5);
                                    //</debug>
                                    if (attribute_5) {
                                        let icon = 'book-reader';
                                        let color = 'isInfo';
                                        let diff = Ext.Date.diff(new Date, attribute_5, Ext.Date.DAY)
                                        console.debug(diff);
                                        if (diff <= 0) {
                                            color = 'isDisabled';
                                            icon = 'user-graduate';
                                        }
                                        if (diff <= 30 && diff > 0) {
                                            color = 'isWarning';
                                            icon = 'graduation-cap';
                                        }
                                        if (diff <= 90 && diff > 30) {
                                            icon = 'graduation-cap';
                                        }
                                        return `${icon} ${color}`;
                                    }

                                    return "book-reader isInfo";
                                }
                            }]
                    }
                },
                {
                    //  xtype: 'gridcolumn',
                    //  cls: 'content-column',
                    dataIndex: 'studentOrderedName',
                    align: 'left',
                    text: 'Alumno',
                    flex: 1
                },
                /*{
                    xtype: 'gridcolumn',
                    cls: 'content-column',
                    dataIndex: 'parent_p_name',
                    text: 'Grado',
                    width: 70,
                    filter: {
                        // required configs
                        type: 'list',
                        emptyText: 'Filtrar Grado...'
                    }
                },*/
                {
                    // xtype: 'gridcolumn',
                    //  cls: 'content-column',
                    dataIndex: 'studentCourse',
                    text: 'Curso',
                    width: 70,
                    filter: {
                        // required configs
                        type: 'list',
                        emptyText: 'Filtrar Curso...'
                    }
                }, /*
                {
                    xtype: 'datecolumn',
                    cls: 'content-column',
                    width: 120,
                    dataIndex: 'has_attribute_5',
                    text: 'Egresó',
                    filter: {
                        type: 'boolean',
                        value: false,
                        yesText: 'Sí',
                        noText: 'No'
                    }
                },*/

                {
                    // This is our Widget column
                    xtype: 'widgetcolumn',
                    cls: 'cell-no-pad',
                    menuDisabled: true,
                    width: 32,
                    padding: 0,
                    widget: {
                        xtype: 'button',
                        ui: 'header',
                        margin: 0,
                        tooltip: 'Editar datos del alumno',
                        bind: {
                            //record: '{record.id}',
                            value: '{record}'
                        },
                        width: 32,
                        iconCls: 'x-fas fa-pencil-alt isInfo',
                        setValue: function (val) {
                            this.value = val;
                        },
                        // setRecord: Ext.emptyFn,
                        handler: 'addStudent',
                        action: 'update'
                    }
                }
            ]
        },

        {
            xtype: 'gridpanel',
           // cls: 'user-grid',
            iconCls: 'x-fas fa-user-tie',
            title: 'Otros',
            reference: 'donators-grid',
            routeId: 'donators',
            stateful: true,
            stateId: 'donators-abm-grid',
            bind: {
                store: '{donators}'
            },
            emptyText: '<i class="fas fa-user-plus"></i> Agregue aquí entidades o personas aportantes eventuales',
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
                            tooltip: 'Otros (donantes, aportantes, etc...)',
                            //   text: 'Agregar',
                            //ui: 'soft-green',
                            //type: 'plus',
                            iconCls: 'fas fa-user-plus',
                            handler: 'addDonator'
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
            reference: 'addStudentWin',
            width: 400,
            title: 'Agregar nuevo alumno',
            iconCls: 'x-fas fa-user-graduate',
            minHeight: 350,
            closeAction: 'hide',
            modal: true,
            layout: 'fit',
            bind: {
                title: '{userAction=="add"?"Agregar nuevo alumno":"Editar alumno"}'
            },
            items: [
                {
                    xtype: 'form',
                    scrollable: 'y',
                    cls: 'nice-form',
                    reference: 'addStudentForm',
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    buttons: [
                        /* {
                             iconCls: 'fas fa-clipboard-check',
                             ui: 'blue',
                             handler: 'checkValid'
                         },*/
                        {
                            tooltip: 'Agregar',
                            iconCls: 'x-fas fa-check',
                            ui: 'soft-green',
                            formBind: true,
                            bind: {
                                visible: '{userAction=="add"}'
                            },
                            handler: 'doAddStudent'
                        },
                        {
                            tooltip: 'Guardar cambios',
                            bind: {
                                visible: '{userAction=="update"}'
                            },
                            iconCls: 'x-fas fa-check',
                            ui: 'soft-cyan',
                            formBind: true,
                            handler: 'doEditStudent'

                        }
                    ],
                    bodyPadding: 10,
                    items: [
                        {
                            xtype: 'numberfield',
                            hidden: true,
                            name: 'id',
                            //value: 2,
                            bind: {
                                disabled: '{userAction!="update"}'
                            },
                            allowBlank: false
                        },
                        {
                            xtype: 'numberfield',
                            hidden: true,
                            name: 'course_relation_id',
                            //value: 2,
                            bind: {
                                disabled: '{userAction!="update"}'
                            },
                            allowBlank: false
                        },
                        {
                            xtype: 'numberfield',
                            hidden: true,
                            name: 'family_relation_id',
                            //value: 2,
                            bind: {
                                disabled: '{userAction!="update"}'
                            },
                            allowBlank: false
                        },
                        {
                            xtype: 'fieldcontainer',
                            fieldLabel: 'Nombre',
                            layout: {
                                type: 'box',
                                align: 'stretch'
                            },
                            items: [
                                {
                                    xtype: 'textfield',
                                    flex: 1,
                                    emptyText: 'Nombre',
                                    name: 'name',
                                    allowBlank: false
                                },
                                {
                                    xtype: 'textfield',
                                    flex: 1,
                                    emptyText: '2° Nombre',
                                    name: 'name_2'
                                }

                            ]
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: 'Apellido',
                            emptyText: 'Apellido',
                            name: 'name_3',
                            allowBlank: false
                        },
                        {
                            xtype: 'numberfield',
                            hidden: true,
                            name: 'partner_type_id',
                            value: 2,
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
                            fieldLabel: 'Curso',
                            layout: 'hbox',
                            padding: 0,
                            items: [
                                {
                                    xtype: 'combobox',
                                    emptyText: 'Curso',
                                    reference: 'course_selector',
                                    flex: 1,
                                    name: 'course_partner_id',
                                    bind: {store: '{courses}'},
                                    queryMode: 'local',
                                    displayTpl: '<tpl for=".">{name}° {name_2}<tpl if="xindex < xcount">' + this.delimiter + '</tpl></tpl>',
                                    valueField: 'id',
                                    displayField: 'name',
                                    forceSelection: true,
                                    allowBlank: false,
                                    listConfig: {
                                        getInnerTpl: function () {
                                            return '{name}° {name_2}'
                                        }

                                    }
                                },
                                {
                                    tooltip: 'Agregar Curso',
                                    iconCls: 'fas fa-chalkboard-teacher',
                                    xtype: 'button',
                                    // ui: 'soft-cyan',
                                    //ui: 'header',
                                    handler: 'addCourse'
                                }
                            ]
                        },
                        {
                            xtype: 'fieldcontainer',
                            layout: 'hbox',
                            padding: 0,
                            fieldLabel: 'Familia',
                            items: [
                                {
                                    xtype: 'combobox',
                                    emptyText: 'Familia',
                                    name: 'family_partner_id',
                                    flex: 1,
                                    bind: {store: '{families}'},
                                    reference: 'family_selector',
                                    queryMode: 'local',
                                    displayTpl: '<tpl for=".">{name} ({name_2} - {name_3})<tpl if="xindex < xcount">' + this.delimiter + '</tpl></tpl>',
                                    valueField: 'id',
                                    displayField: 'name',
                                    forceSelection: true,
                                    allowBlank: false,
                                    listConfig: {
                                        getInnerTpl: function () {
                                            return '<div style="padding: 8px;border-bottom: 1px silver solid;"><em style="display: block; font-size: 16px; font-style: normal; font-weight: lighter;">{name}</em> {name_2} - {name_3} <br> <i class="fas fa-envelope-square"></i> {attribute_2} <i class="fas fa-phone-square"></i> {attribute_1} </div>'
                                        }

                                    }
                                },
                                {
                                    tooltip: 'Agregar familia',
                                    iconCls: 'fas fa-users',
                                    xtype: 'button',
                                    // ui: 'soft-cyan',
                                    //ui: 'header',
                                    handler: 'addFamily'
                                }
                            ]
                        },
                        {
                            xtype: 'fieldcontainer',
                            fieldLabel: 'Datos Extra (opcionales)',
                            layout: 'anchor',
                            fieldLabel: 'Datos Extra',
                            labelAlign: 'top',
                            flex: 1,
                            defaults: {
                                xtype: 'textfield',
                                anchor: '100%',
                                emptyText: 'Datos Extra',
                                hideEmptyLabel: false
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
                                }/*,
                                {
                                    //emptyText: 'Extra *****',
                                    name: 'attribute_5'
                                }*/
                            ]
                        }
                    ]
                },
                {
                    xtype: 'window',
                    reference: 'addFamilyWin',
                    width: 350,
                    title: 'Agregar nueva familia',
                    iconCls: 'x-fas fa-users',
                    minHeight: 350,
                    closeAction: 'hide',
                    layout: 'fit',
                    items: [
                        {
                            xtype: 'form',
                            scrollable: 'y',
                            reference: 'addFamilyForm',
                            cls: 'nice-form',
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
                                    handler: 'doAddFamily'
                                }
                            ],
                            bodyPadding: 10,
                            items: [
                                {
                                    xtype: 'textfield',
                                    emptyText: 'Familia',
                                    name: 'name',
                                    allowBlank: false
                                },
                                {
                                    xtype: 'textfield',
                                    emptyText: 'Responsable 1',
                                    name: 'name_2',
                                    allowBlank: false
                                },
                                {
                                    xtype: 'textfield',
                                    emptyText: 'Responsable 2',
                                    name: 'name_3',
                                    allowBlank: false
                                },
                                {
                                    xtype: 'numberfield',
                                    hidden: true,
                                    name: 'partner_type_id',
                                    value: 3,
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
                                    xtype: 'textfield',
                                    emptyText: 'Teléfono',
                                    name: 'attribute_1'
                                },
                                {
                                    xtype: 'textfield',
                                    vtype: 'email',
                                    emptyText: 'Correo electrónico',
                                    name: 'attribute_2'
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
                                            // emptyText: 'Extra ***',
                                            name: 'attribute_3'
                                        },
                                        {
                                            // emptyText: 'Extra ****',
                                            name: 'attribute_4'
                                        },
                                        {
                                            //emptyText: 'Extra *****',
                                            // vtype: 'email',
                                            name: 'attribute_5'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            xtype: 'window',
            reference: 'addDonatorWin',
            width: 350,
            title: 'Agregar Otros (Entidades que aportan ingresos)',
            iconCls: 'x-fas fa-donate',
            minHeight: 350,
            closeAction: 'hide',
            layout: 'fit',
            items: [
                {
                    xtype: 'form',
                    cls: 'nice-form',
                    scrollable: 'y',
                    reference: 'addDonatorForm',
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
                            handler: 'doAddDonator'
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
                            value: 4,
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
        },
        {
            xtype: 'window',
            reference: 'promoteStudentWin',
            width: 400,
            title: 'Cambiar curso de alumnos seleccionados',
            iconCls: 'x-fas fa-user-graduate',
            minHeight: 350,
            closeAction: 'hide',
            modal: true,
            layout: 'fit',
            items: [
                {
                    xtype: 'form',
                    scrollable: 'y',
                    cls: 'nice-form',
                    reference: 'promoteStudentForm',
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
                            handler: 'doPromoteStudents'
                        }
                    ],
                    bodyPadding: 10,
                    items: [
                        {
                            xtype: 'fieldcontainer',
                            fieldLabel: 'Curso',
                            layout: 'hbox',
                            padding: 0,
                            items: [
                                {
                                    xtype: 'combobox',
                                    emptyText: 'Curso',
                                    reference: 'new_course_selector',
                                    flex: 1,
                                    name: 'course_partner_id',
                                    bind: {store: '{coursesForPromotion}'},
                                    queryMode: 'local',
                                    displayTpl: '<tpl for=".">{name}° {name_2}<tpl if="xindex < xcount">' + this.delimiter + '</tpl></tpl>',
                                    valueField: 'id',
                                    displayField: 'name',
                                    forceSelection: true,
                                    allowBlank: false,
                                    listConfig: {
                                        getInnerTpl: function () {
                                            return '{name}° {name_2}'
                                        }

                                    }
                                },
                                {
                                    tooltip: 'Asignar nuevo curso',
                                    iconCls: 'fas fa-chalkboard-teacher',
                                    xtype: 'button',
                                    // ui: 'soft-cyan',
                                    //ui: 'header',
                                    handler: 'addCourse'
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            xtype: 'window',
            reference: 'graduateStudentWin',
            width: 400,
            title: 'Egresar alumnos seleccionados',
            iconCls: 'x-fas fa-user-graduate',
            minHeight: 150,
            closeAction: 'hide',
            modal: true,
            layout: 'fit',
            items: [
                {
                    xtype: 'form',
                    scrollable: 'y',
                    cls: 'nice-form',
                    reference: 'graduateStudentForm',
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    buttons: [
                        {
                            tooltip: 'Egresar',
                            iconCls: 'x-fas fa-check',
                            ui: 'soft-green',
                            formBind: true,
                            handler: 'doGraduateStudents'
                        }
                    ],
                    bodyPadding: 10,
                    items: [
                        {
                            xtype: 'datefield',
                            emptyText: 'Fecha de egreso',
                            reference: 'student_graduation_date',
                            name: 'student_graduation_date',
                            allowBlank: false,
                            submitFormat: 'Y-m-d'

                        }
                    ]
                }
            ]
        },
        {
            xtype: 'window',
            reference: 'addCourseWin',
            width: 350,
            title: 'Agregar nuevo curso',
            iconCls: 'x-fas fa-chalkboard-teacher',
            minHeight: 350,
            closeAction: 'hide',
            layout: 'fit',
            items: [
                {
                    xtype: 'form',
                    scrollable: 'y',
                    reference: 'addCourseForm',
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
                            handler: 'doAddCourse'
                        }
                    ],
                    bodyPadding: 10,
                    items: [
                        {
                            xtype: 'numberfield',
                            emptyText: 'Nivel',
                            name: 'name',
                            minValue: 1,
                            allowBlank: false,
                            decimalPrecision: 0
                        },
                        {
                            xtype: 'textfield',
                            emptyText: 'Curso',
                            name: 'name_2',
                            allowBlank: false
                        },
                        {
                            xtype: 'numberfield',
                            hidden: true,
                            name: 'partner_type_id',
                            value: 1,
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
                                },
                                {
                                    //emptyText: 'Extra *****',
                                    //// vtype: 'email',
                                    name: 'attribute_5'
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
});
