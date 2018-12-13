Ext.define('Cooperativista.view.main.Main', {
    extend: 'Ext.container.Viewport',

    requires: [
        'Ext.button.Segmented',
        'Ext.list.Tree'
    ],

    controller: 'main',
    viewModel: 'main',

    cls: 'app-dash-viewport',
    itemId: 'mainView',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    listeners: {
        render: 'onMainViewRender'
    },

    items: [/*
        {
            xtype: 'toolbar',
            cls: 'app-dash-dash-headerbar shadow',
            height: 44,
            itemId: 'headerBar',
            items: [
                {
                    xtype: 'component',
                    reference: 'appLogo',
                    cls: 'app-logo',
                    html: '<div class="main-logo"><i class="x-fa fa-hand-spock-o"></i> Cooperativista</div>',
                    width: 250
                },
                {
                    margin: '0 0 0 8',
                    ui: 'header',
                    iconCls: 'x-fa fa-navicon',
                    id: 'main-navigation-btn',
                    handler: 'onToggleNavigationSize'
                },
                {
                    xtype: 'component',
                    reference: 'mainTitle',
                    cls: 'app-title',
                    bind: {
                        html: '<div class="main-title">{currentEntityData.name}</div>'
                    }
                },
                '->',
                {
                    iconCls: 'x-fa fa-search',
                    ui: 'header',
                    href: '#searchresults',
                    hrefTarget: '_self',
                    tooltip: 'See latest search'
                }, 
                {
                    iconCls: 'x-fa fa-question',
                    ui: 'header',
                    href: '#faq',
                    hrefTarget: '_self',
                    tooltip: 'Help / FAQ\'s'
                },
                {
                    iconCls: 'x-fa fa-gear',
                    ui: 'header',
                    href: '#options',
                    tooltip: 'Configuraciones',
                    hrefTarget: '_self'
                },
                {
                    xtype: 'tbtext',
                    bind: {
                        text: '{currentUser.name}'
                    },
                    cls: 'top-user-name'
                }
            ]
        },*/
        {
            xtype: 'maincontainerwrap',
            id: 'main-view-detail-wrap',
            reference: 'mainContainerWrap',
            flex: 1,
            items: [
                /*  {
                      xtype: 'treelist',
                      reference: 'navigationTreeList',
                      itemId: 'navigationTreeList',
                      ui: 'navigation',
                      store: 'NavigationTree',
                      width: 250,
                      expanderFirst: false,
                      expanderOnly: false,
                      listeners: {
                          selectionchange: 'onNavigationTreeSelectionChange'
                      }
                  },*/
                {
                    xtype: 'panel',
                    width: 250,
                    reference: 'navTreePanel',
                    itemId: 'navTreePanel',
                    style: 'overflow:hidden', // Remove this Line to show Scrollbar
                    layout: 'absolute',
                    bodyCls: 'shadow',
                    dockedItems: [
                        {
                            xtype: 'toolbar',
                            cls: 'shadow',
                            padding: 0,
                            width: 250,
                            height: 50,
                            itemId: 'headerBar',
                            items: [
                                {
                                    xtype: 'component',
                                    reference: 'appLogo',
                                    cls: 'app-logo',
                                    bind:{
                                        html: '<div data-qtip="Cooperativista v{appVersion}" class="main-logo"><i class="x-fas"></i> <span class="main-title">Cooperativista</span></div>'
                                    },
                                    width: 250,
                                    listeners: {
                                        click: {
                                            element: 'el', //bind to the underlying el property on the panel
                                            fn: 'onToggleNavigationSize'
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            xtype: 'toolbar',
                            layout: {
                                type: 'vbox',
                                align: 'stretch'
                            },
                            dock: 'bottom',
                            cls: 'shadow',
                            padding: 0,
                            width: 250,
                            margin: 0,
                            items: [
                                /*{

                                    iconCls: 'x-fas fa-cog',
                                    ui: 'header',
                                    href: '#options',
                                    tooltip: 'Configuraciones',
                                    hrefTarget: '_self',
                                    text: 'Configuración'
                                },*/
                                /* {
                                     iconCls: 'x-fas fa-cog',
                                     flex: 1,
                                     ui: 'header',
                                     href: '#options',
                                     tooltip: 'Configuraciones',
                                     hrefTarget: '_self',
                                     bind: {
                                         text: '{currentUser.name}'
                                     },
                                     cls: 'top-user-name'
                                 },*/
                                {
                                    xtype: 'component',
                                    cls: 'app-user-nav',
                                    padding:0,
                                    margin: 0,
                                    bind: {html: '<div data-qtip="Configuraciones" class="user-nav"><i class="x-fas fa-user-circle"></i> <div class="user-content">{currentUser.name}<br><span class="user-content-sub">{currentUser.alias}</span></div></div>'},
                                    width: 250,
                                    listeners: {
                                        click: {
                                            element: 'el', //bind to the underlying el property on the panel
                                            fn: 'onOptionsRouteChange'
                                        }
                                    }
                                },
                                {
                                    xtype: 'component',
                                    cls: 'app-user-logout',
                                    margin: 0,
                                    bind: { html: '<div class="user-logout"><i class="x-fas fa-power-off"></i> </div>' },
                                    width: 250,
                                    listeners: {
                                        click: {
                                            element: 'el', //bind to the underlying el property on the panel
                                            fn: 'onLoginRequest'
                                        }
                                    }
                                }
                            ]
                        }
                    ],
                    items: [
                        {
                            x: 0,
                            y: 0,
                            anchor: '+17 0',
                            xtype: 'treelist',
                            reference: 'navigationTreeList',
                            itemId: 'navigationTreeList',
                            ui: 'navigation',
                            store: 'NavigationTree',
                            width: 190,
                            style: {
                                'overflow-y': 'scroll'
                            },
                            expanderFirst: false,
                            expanderOnly: false,
                            listeners: {
                                selectionchange: 'onNavigationTreeSelectionChange'
                            },

                            onToolStripClick: function (e) {
                                var item = e.getTarget('[data-recordId]'),
                                    id,
                                    height = Ext.Element.getViewportHeight() - 44;

                                //<debug>
                                //console.debug(this, this.getSize());
                                //</debug>

                                if (item) {
                                    id = item.getAttribute('data-recordId');
                                    item = this.itemMap[id];
                                    if (item) {
                                        if (item === this.activeFloater) {
                                            this.unfloatAll();
                                        } else {
                                            item.setStyle({
                                                'max-height': height + 'px',
                                                'overflow-y': 'auto'
                                            });
                                            item.addCls('tree-padding');

                                            this.floatItem(item, false);
                                        }
                                    }
                                }
                            },

                            unfloatAll: function () {
                                var me = this,
                                    floater = me.activeFloater;

                                if (floater) {
                                    floater.setFloated(false);
                                    me.activeFloater = null;
                                    floater.setStyle({
                                        'max-height': undefined,
                                        'overflow-y': 'hidden'
                                    });
                                    floater.removeCls('tree-padding');

                                    if (me.floatedByHover) {
                                        floater.element.un('mouseleave', me.checkForMouseLeave, me);
                                    } else {
                                        Ext.un('mousedown', me.checkForOutsideClick, me);
                                    }
                                }
                            },
                            onToolStripMouseOver: function (e) {
                                var item = e.getTarget('[data-recordId]'),
                                    id,
                                    height = Ext.Element.getViewportHeight() - 44;

                                if (item) {
                                    id = item.getAttribute('data-recordId');
                                    item = this.itemMap[id];
                                    if (item) {
                                        item.setStyle({
                                            'max-height': height + 'px',
                                            'overflow-y': 'auto'
                                        });
                                        item.addCls('tree-padding');
                                        this.floatItem(item, true);

                                        //<debug>
                                        //console.debug(item);
                                        //</debug>
                                    }
                                }
                            }
                        }
                    ]
                },
                {
                    xtype: 'container',
                    flex: 1,
                    //scrollable: 'y',
                    reference: 'mainCardPanel',
                    cls: 'app-dash-right-main-container',
                    itemId: 'contentPanel',
                    // style: 'background-color:#475360;',
                    layout: {
                        type: 'card',
                        anchor: '100%'
                    }
                }
            ]
        }
    ]
});
