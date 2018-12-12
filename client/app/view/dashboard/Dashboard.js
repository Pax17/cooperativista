Ext.define('Cooperativista.view.dashboard.Dashboard', {
    extend: 'Ext.container.Container',
    xtype: 'admindashboard',

    requires: [
        'Ext.ux.layout.ResponsiveColumn'
    ],

    controller: 'dashboard',
    viewModel: {
        type: 'dashboard'
    },

    layout: 'responsivecolumn',
    scrollable: 'y',

    listeners: {
        hide: 'onHideView'
    },

    items: [
        {
            xtype: 'info',
            userCls: 'big-50 small-100'
        },
        {
            xtype: 'news',
            userCls: 'big-50 small-100'
        },
        {
            xtype: 'initnav',
            userCls: 'big-50 small-100'
        }
    ]
});
