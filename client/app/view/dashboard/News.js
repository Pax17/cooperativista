Ext.define('Cooperativista.view.dashboard.News', {
    extend: 'Ext.Container',
    xtype: 'news',
    bodyPadding: 15,
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
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
                    html: '<h2 class="left-aligned-div"> Novedades</h2>'
                },

                {
                    xtype: 'component',
                    style: 'padding-bottom:8px;',
                    bind: {
                        data: '{news}'
                    },
                    tpl: ['<ul class="fa-ul"><tpl for="items"><li><span class="fa-li" ><i class="fas fa-hand-spock"></i></span><a style="text-decoration: none;" data-qtip="{isoDate:this.formatDate}" class="goTo" data-href="{link}" href="#">{isoDate:this.formatDate} - {title}</a></li></tpl></ul>',
                        {
                            formatDate: function (string) {
                                let d = new Date(string)
                                //console.log(string, Ext.util.Format.date(d, 'd-m-Y'));
                                return Ext.util.Format.date(d, 'd-m-Y');
                            }
                        }],
                    listeners: {
                        element: 'el',
                        delegate: 'a.goTo',
                        click: 'handleElClick'
                    }
                }
            ]
        }

    ]
});
