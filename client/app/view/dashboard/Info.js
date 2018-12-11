Ext.define('Cooperativista.view.dashboard.Info', {
    extend: 'Ext.Panel',
    xtype: 'info',

    requires: [
        /* 'Ext.chart.series.Pie',
         'Ext.chart.series.sprite.PieSlice',
         'Ext.chart.interactions.Rotate'*/
    ],
    ui: 'light',
    cls: 'service-type shadow quick-graph-panel',
    iconCls: 'fas fa-school',
    // minHeight: 320,
    bodyPadding: 5,
    title: 'Title',
    bind: {
        title: '{currentEntityData.name}'
    },
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    tools: [

        {
            type: 'gear',
            // flex: 1,
            role: 'options',
            tooltip: 'Configurar entorno',
            callback: 'goTo',
            /* ui: 'header',
             //    iconAlign: 'right',
             textAlign: 'left',
             // margin: '40px 0 0 0',
             iconCls: 'fas fa-cog'*/
        }/* ,
        {
            type: 'save',
            // flex: 1,
            role: 'migration',
            callback: 'goTo',
            tooltip: 'Finalizar período'
        }*/
    ],
    bbar: [
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
    ],
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
                }
            ]
        }


        /*,
        {
            xtype: 'progressbar',
            cls: 'bottom-indent service-finance',
            height: 4,
            minHeight: 4,
            value: 0.2
        },
        {
            xtype: 'component',
            data: {
                name: 'Research',
                value: '68%'
            },
            tpl: '<div class="left-aligned-div">{name}</div><div class="right-aligned-div"></div>'
        },
        {
            xtype: 'progressbar',
            cls: 'bottom-indent service-research',
            height: 4,
            minHeight: 4,
            value: 0.68
        },
        {
            xtype: 'component',
            data: {
                name: 'Marketing',
                value: '12%'
            },
            tpl: '<div class="left-aligned-div">{name}</div><div class="right-aligned-div"></div>'
        },
        {
            xtype: 'progressbar',
            cls: 'bottom-indent service-marketing',
            height: 4,
            value: 0.12
        },
        {
            xtype: 'component',
            html: '<div class="services-text">' +
                'The year 2015 saw a significant change in the job market ' +
                'for the industry. With increasing goverment expenditure on research & development, jobs in ' +
                'the research sector rose to 68% from 47% in the previous financial year. Share of jobs in ' +
                'the finance sector remained more or less constant while that in marketing sector dropped to ' +
                '12%. The reduction in marketing jobs is attributed to increasing use of online advertising ' +
                'in recent years, which is largely automated.' +
                '</div>' +
                '<div class="services-legend">' +
                '<span><div class="legend-finance"></div>Finance</span>' +
                '<span><div class="legend-research"></div>Research</span>' +
                '<span><div class="legend-marketing"></div>Marketing</span>' +
                '<div>'
        }*/
        /*  {
              xtype: 'container',
              width: 140,
              defaults: {
                  height:126,
                  insetPadding: '7.5 7.5 7.5 7.5',
                  background: 'rgba(255, 255, 255, 1)',
                  colors: [
                      '#6aa5dc',
                      '#fdbf00',
                      '#ee929d'
                  ],
                  bind: '{servicePerformance}',
                  series: [
                      {
                          type: 'pie',
                          label: {
                              field: 'xField',
                              display: 'rotate',
                              contrast: true,
                              font: '12px Arial'
                          },
                          useDarkerStrokeColor: false,
                          xField: 'yvalue',
                          donut: 50,
                          padding:0
                      }
                  ],
                  interactions: [
                      {
                          type: 'rotate'
                      }
                  ]
              },
              items: [
                  {
                      xtype: 'polar'
                  },
                  {
                      xtype: 'polar'
                  }
              ]
          },*/
    ]
});
