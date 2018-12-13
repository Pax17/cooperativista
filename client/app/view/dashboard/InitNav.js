Ext.define('Cooperativista.view.dashboard.InitNav', {
    extend: 'Ext.Container',
    xtype: 'initnav',
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
                    html: '<h2 class="left-aligned-div"> Accesos</h2>'
                },

                {
                    xtype: 'component',
                    style: 'padding-bottom:8px;',
                    bind: {
                        data: '{nav}'
                    },
                    tpl: ['<ul class="fa-ul"><tpl for="."><li><span class="fa-li" ><i class="{icon}"></i></span><a style="text-decoration: none;" data-qtip="{tip}" class="goTo" data-role="{role}" href="#">{title}</a></li></tpl></ul>'],
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
