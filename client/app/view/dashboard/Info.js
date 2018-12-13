Ext.define('Cooperativista.view.dashboard.Info', {
    extend: 'Ext.Container',
    xtype: 'info',

    requires: [
        /* 'Ext.chart.series.Pie',
         'Ext.chart.series.sprite.PieSlice',
         'Ext.chart.interactions.Rotate'*/
    ],
    ui: 'light',
    cls: 'quick-graph-panel',
    iconCls: 'fas fa-school',
    // minHeight: 320,
    bodyPadding: 15,
    title: 'Title',
    /*bind: {
        title: '{currentEntityData.name}'
    },*/
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    /* tools: [

         {
             type: 'gear',
             // flex: 1,
             role: 'options',
             tooltip: 'Configurar entorno',
             callback: 'goTo'
         }
     ],*/
    /*  bbar: [
          '->',
          {
              xtype: 'button',
              text: 'Finalizar período',
              role: 'migration',
              handler: 'goTo',
              //   padding: '0 2px 0 10px',
            //  ui: 'header',
              iconCls: 'fas fa-calendar-times'
          }
      ],*/
    items: [
        {
            xtype: 'container',
            padding: 20,
            flex: 1,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [

                {
                    xtype: 'component',
                    bind: {
                        data: {
                            name: '{currentEntityData.name}'
                        }
                    },
                    tpl: '<h2 class="left-aligned-div"> {name}</h2>'
                },

                {
                    xtype: 'component',
                    style: 'padding-bottom:8px;',
                    bind: {
                        data: {
                            name_2: '{currentEntityData.name_2}',
                            name_3: '{currentEntityData.name_3}'
                        },
                        visible: '{currentEntityData.name_2 || currentEntityData.name_3}'
                    },
                    tpl: '<div class="left-aligned-div">{name_2}</div><div class="right-aligned-div">{name_3}</div>'
                },
                {
                    xtype: 'component',
                    style: 'padding-bottom:8px;',
                    bind: {
                        data: {
                            period_name: '{period_name}',
                            period_start: '{period_start}',
                            period_end: '{period_end}'
                        }
                    },
                    tpl: ['<div class="left-aligned-div">Período {period_name}</div><div class="right-aligned-div">({period_start:this.formatDate} - {period_end:this.formatDate})</div>',
                        {
                            formatDate: function (value) {
                                return Ext.util.Format.date(value, 'd-m-Y');
                            }
                        }
                    ]
                },
                {
                    xtype: 'component',
                    bind: {
                        html: '<div class="left-aligned-div">Cuota social: </div><div class="right-aligned-div">${default_fee_amount}</div>'
                    }
                },
                {
                    xtype: 'container',
                    padding: '10px 0',
                    layout: {
                        type: 'box',
                        align: 'stretch',
                        vertical: false
                    },
                    items: [
                        {
                            xtype: 'component',
                            flex: 1
                        },
                        {
                            xtype: 'button',
                            text: 'Finalizar período',
                            role: 'migration',
                            handler: 'goTo',
                            //   padding: '0 2px 0 10px',
                            ui: 'default-toolbar',
                            iconCls: 'fas fa-calendar-times'
                        }
                    ]
                }
            ]
        }

    ]
});
