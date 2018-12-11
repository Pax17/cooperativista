Ext.define('Cooperativista.store.NavigationTree', {
    extend: 'Ext.data.TreeStore',

    storeId: 'NavigationTree',

    fields: [{
        name: 'text'
    }],

    root: {
        expanded: true,
        children: [
            {
                text: 'Dashboard',
                iconCls: 'x-fas fa-desktop',
              //  rowCls: 'nav-tree-badge nav-tree-badge-new',
                viewType: 'admindashboard',
                routeId: 'dashboard', // routeId defaults to viewType
                leaf: true
            },
            {
                text: 'Movimientos',
                iconCls: 'x-fas fa-wallet',
                expanded: true,
                selectable: false,
                //routeId: 'pages-parent',
                //id: 'pages-parent',

                children: [
                    {
                        text: 'Ingresos',
                        iconCls: 'x-fas fa-file-invoice-dollar',
                        viewType: 'receipts',
                        leaf: true
                    },
                    {
                        text: 'Gastos',
                        iconCls: 'x-fas fa-cart-plus',
                        viewType: 'expenses',
                        leaf: true
                    }
                ]
            },
            {
                text: 'Altas',
                iconCls: 'x-fas fa-address-book',
                expanded: true,
                selectable: false,
                children: [
                    {
                        text: 'Asociados',
                        iconCls: 'x-fas fa-id-card',
                        viewType: 'relations',
                        leaf: true
                    },
                    {
                        text: 'Proveedores',
                        iconCls: 'x-fas fa-dolly',
                        viewType: 'suppliers',
                        leaf: true
                    }
                ]
            }/*,
            {
                text: 'FAQ',
                iconCls: 'x-fas fa-question',
                viewType: 'faq',
                leaf: true
            },
            {
                text: 'Pages',
                iconCls: 'x-fab fa-leanpub',
                expanded: false,
                selectable: false,
                //routeId: 'pages-parent',
                //id: 'pages-parent',

                children: [
                    {
                        text: 'Blank Page',
                        iconCls: 'x-fas fa-file',
                        viewType: 'pageblank',
                        leaf: true
                    },

                    {
                        text: '404 Error',
                        iconCls: 'x-fas fa-exclamation-triangle',
                        viewType: 'page404',
                        leaf: true
                    },
                    {
                        text: '500 Error',
                        iconCls: 'x-fas fa-times-circle',
                        viewType: 'page500',
                        leaf: true
                    },
                    {
                        text: 'Lock Screen',
                        iconCls: 'x-fas fa-lock',
                        viewType: 'lockscreen',
                        leaf: true
                    },

                    {
                        text: 'Login',
                        iconCls: 'x-fas fa-check',
                        viewType: 'login',
                        leaf: true
                    },
                    {
                        text: 'Register',
                        iconCls: 'x-fas fa-pen-square',
                        viewType: 'register',
                        leaf: true
                    },
                    {
                        text: 'Password Reset',
                        iconCls: 'x-fas fa-lightbulb',
                        viewType: 'passwordreset',
                        leaf: true
                    }
                ]
            },
            {
                text: 'Widgets',
                iconCls: 'x-fas fa-flask',
                viewType: 'widgets',
                leaf: true
            },
            {
                text: 'Forms',
                iconCls: 'x-fas fa-edit',
                viewType: 'forms',
                leaf: true
            },
            {
                text: 'Charts',
                iconCls: 'x-fas fa-chart-pie',
                viewType: 'charts',
                leaf: true
            }*/
        ]
    }
});
