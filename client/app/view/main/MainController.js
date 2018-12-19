Ext.define('Cooperativista.view.main.MainController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.main',

    listen: {
        controller: {
            '#': {
                unmatchedroute: 'onRouteChange'
            },
            '*': {
                'storemodified': 'reloadStore',
                periodsettingschange: 'setPeriodData',
                settingsupdated: 'updateAppSettings'
            }
        }
    },

    routes: {
        ':node': 'onRouteChange'
    },
    specialRoutes: {
        options: 'options',
        firstsetup: 'firstsetup',
        migration: 'migrationsetup',
        login: 'login'
    },
    init: function () {
        const app = require('electron').remote.app
        console.debug(app.getPath('userData'), 'Desde Main!');

        const { ipcRenderer } = require('electron');

        ipcRenderer.on('redirect-request', (event, data) => {
            //<debug>
            console.log(event, data);
            //</debug>
            let existsLockingWindow = Ext.ComponentQuery.query('lockingwindow').length + Ext.ComponentQuery.query('lockingform').length;
            //<debug>
            console.log(event, data, existsLockingWindow);
            //</debug>
            if ('token' in data && existsLockingWindow === 0) {
                this.redirectTo(data.token);
            }
        });


        //Ext.getBody().setStyle('background-color', '#f6f6f6');
        Ext.getBody().removeCls('launching');
        //<debug>
        console.debug('MainController INIT');
        //</debug>

        if (!this._initializedApp) {
            this._relayRedirect = true;
        }
    },
    initViewModel: function (viewModel) {
        //this.redirectTo('dashboard');
        this.updateAppSettings();
        //<debug>
        console.debug('MainController VM', viewModel);
        //</debug>
        viewModel.set('appVersion', Ext.getVersion('cooperativista'));
    },
    updateAppSettings: function () {
        //<debug>
        console.debug('running updateAppSettings');
        //</debug>
        const viewModel = this.getViewModel()
        if (viewModel) {
            const { ipcRenderer } = require('electron');
            let appSettings = ipcRenderer.sendSync('get-settings', 'all');
            let appVersion = ipcRenderer.sendSync('get-app-version', 'all');
            Ext.apply(appSettings, appVersion)
            //  let appSettings = settings.getAll();
            viewModel.setData(appSettings);
            viewModel.notify();
            console.log(appSettings)
            this.setPeriodData();
            this.fireEvent('appsettingsrefresh', appSettings);
        }
    },
    /**
     * Setea los datos del período.
     * Debe corresrse después de que esté disponible el ViewModel!
     */
    setPeriodData: function () {
        const { ipcRenderer } = require('electron');
        const viewModel = this.getViewModel();
        const oldAmount = viewModel.get('default_fee_amount');

        /**
         * Default DUE amount!
         */
        const { data: { value: default_fee_amount } } = ipcRenderer.sendSync('get-helper-taxonomy', {
            taxonomy: 'default_fee_amount',
            status: 1
        });
        //<debug>
        console.debug('default_fee_amount -------------->', default_fee_amount);
        //</debug>
        viewModel.set('default_fee_amount', parseFloat(default_fee_amount));
        this.fireEvent('defaultamountchange', parseFloat(default_fee_amount), oldAmount);
        /**
         * Períod Name
         */
        const { data: { value: period_name } } = ipcRenderer.sendSync('get-helper-taxonomy', {
            taxonomy: 'period_name',
            status: 1
        });
        //<debug>
        console.debug('period_name -------------->', period_name);
        //</debug>
        viewModel.set('period_name', parseInt(period_name));
        /**
         * Períod Start
         */
        const { data: { value: period_start } } = ipcRenderer.sendSync('get-helper-taxonomy', {
            taxonomy: 'period_start',
            status: 1
        });
        //<debug>
        console.debug('period_start -------------->', Ext.Date.parse(period_start, 'Y-m-d'));
        //</debug>
        viewModel.set('period_start', Ext.Date.parse(period_start, 'Y-m-d'));
        /**
         * Períod End
         */
        const { data: { value: period_end } } = ipcRenderer.sendSync('get-helper-taxonomy', {
            taxonomy: 'period_end',
            status: 1
        });
        //<debug>
        console.debug('period_end -------------->', Ext.Date.parse(period_end, 'Y-m-d'));
        //</debug>
        viewModel.set('period_end', Ext.Date.parse(period_end, 'Y-m-d'));
        /**
         * default_monthly_fee_concept
         */
        const { data: { value: default_monthly_fee_concept } } = ipcRenderer.sendSync('get-helper-taxonomy', {
            taxonomy: 'default_monthly_fee_concept',
            status: 1
        });
        //<debug>
        console.debug('default_monthly_fee_concept -------------->', parseInt(default_monthly_fee_concept));
        //</debug>
        viewModel.set('default_monthly_fee_concept', parseInt(default_monthly_fee_concept));
        viewModel.notify();

    },
    lastView: null,
    setCurrentView: function (hashTag) {
        hashTag = (hashTag || '').toLowerCase();

        var me = this,
            refs = me.getReferences(),
            mainCard = refs.mainCardPanel,
            mainLayout = mainCard.getLayout(),
            navigationList = refs.navigationTreeList,
            store = navigationList.getStore(),
            node = store.findNode('routeId', hashTag) ||
                store.findNode('viewType', hashTag),
            view = (node && node.get('viewType')) || (this.specialRoutes[hashTag] || 'page404'),
            lastView = me.lastView,
            existingItem = mainCard.child('component[routeId=' + hashTag + ']'),
            newView;

        //<debug>
        console.log(hashTag, existingItem, lastView ? lastView.isWindow : null);
        //</debug>
        // Kill any previously routed window
        if (lastView && lastView.isWindow) {
            //<debug>
            console.debug(lastView);
            //</debug>
            lastView.destroy();
        }

        lastView = mainLayout.getActiveItem();

        if (!existingItem) {
            newView = Ext.create({
                xtype: view,
                routeId: hashTag,  // for existingItem search later
                hideMode: 'offsets'
            });
        }

        if (!newView || !newView.isWindow) {
            // !newView means we have an existing view, but if the newView isWindow
            // we don't add it to the card layout.
            if (existingItem) {
                // We don't have a newView, so activate the existing view.
                if (existingItem !== lastView) {
                    mainLayout.setActiveItem(existingItem);
                }
                newView = existingItem;
            }
            else {
                // newView is set (did not exist already), so add it and make it the
                // activeItem.
                Ext.suspendLayouts();
                mainLayout.setActiveItem(mainCard.add(newView));
                Ext.resumeLayouts(true);
            }
        }

        navigationList.setSelection(node);

        if (newView.isFocusable(true)) {
            newView.focus();
        }

        me.lastView = newView;
    },

    onNavigationTreeSelectionChange: function (tree, node) {
        var to = node && (node.get('routeId') || node.get('viewType'));

        if (to) {
            this.redirectTo(to);
        }
    },
    onToggleNavigationSize: function () {
        var me = this,
            refs = me.getReferences(),
            navigationList = refs.navigationTreeList,
            navTreePanel = refs.navTreePanel,
            wrapContainer = refs.mainContainerWrap,
            collapsing = !navigationList.getMicro(),
            new_width = collapsing ? 64 : 250;

        if (Ext.isIE9m || !Ext.os.is.Desktop) {
            Ext.suspendLayouts();

            refs.appLogo.setWidth(new_width);

            navigationList.setWidth(new_width);
            navigationList.setMicro(collapsing);

            Ext.resumeLayouts(); // do not flush the layout here...

            // No animation for IE9 or lower...
            wrapContainer.layout.animatePolicy = wrapContainer.layout.animate = null;
            wrapContainer.updateLayout();  // ... since this will flush them
        }
        else {
            if (!collapsing) {
                // If we are leaving micro mode (expanding), we do that first so that the
                // text of the items in the navlist will be revealed by the animation.
                navigationList.setMicro(false);
            }
            navigationList.canMeasure = false;

            // Start this layout first since it does not require a layout
            refs.appLogo.animate({ dynamic: true, to: { width: new_width } });

            navTreePanel.setWidth(new_width);
            navTreePanel.canMeasure = false;
            // Directly adjust the width config and then run the main wrap container layout
            // as the root layout (it and its chidren). This will cause the adjusted size to
            // be flushed to the element and animate to that new size.
            navigationList.width = new_width;
            wrapContainer.updateLayout({ isRoot: true });
            navigationList.el.addCls('nav-tree-animating');

            // We need to switch to micro mode on the navlist *after* the animation (this
            // allows the "sweep" to leave the item text in place until it is no longer
            // visible.
            if (collapsing) {
                navigationList.on({
                    afterlayoutanimation: function () {
                        navigationList.setMicro(true);
                        navigationList.el.removeCls('nav-tree-animating');
                        navigationList.canMeasure = true;
                        navTreePanel.canMeasure = trues;
                    },
                    single: true
                });
            }
        }
    },
    onToggleNavigationSize: function () {
        var me = this,
            refs = me.getReferences(),
            navigationList = refs.navigationTreeList,
            navTreePanel = refs.navTreePanel,
            wrapContainer = refs.mainContainerWrap,
            collapsing = !navigationList.getMicro(),
            new_width = collapsing ? 53 : 250,
            navStrip = navigationList.getEl().selectNode('div.x-treelist-toolstrip', false);


        Ext.suspendLayouts();

        if (collapsing) {
            wrapContainer.addCls('nav-collapsed');
        } else {
            wrapContainer.removeCls('nav-collapsed');

        }
        //refs.appLogo.setWidth(new_width);
        refs.appLogo.animate({ dynamic: true, to: { width: new_width } });


        navTreePanel.setWidth(new_width);

        navigationList.setMicro(collapsing);
        Ext.resumeLayouts(); // do not flush the layout here...


        wrapContainer.updateLayout();
    },
    onMainViewRender: function () {
        if (!window.location.hash) {
            this.redirectTo(Cooperativista.app.getDefaultToken());
            console.log('MainRENDER', this)
            Cooperativista.app.setDefaultToken('dashboard')
            Cooperativista.app.defaultToken = 'dashboard'
        }
    },

    onRouteChange: function (id) {
        if (!this.getViewModel().get('currentUser.alias') || !this.getViewModel().get('currentEntityData.name'))
            this.updateAppSettings()
        console.log('ROUT CHANGE ->', id)
        if (this._relayRedirect) {
            this._initializedApp = true;
            Ext.defer(function () {
                this.setCurrentView(id);
                delete this._relayRedirect;
            }, 200, this)
        } else {
            this.setCurrentView(id);

        }
    },

    onLoginRequest: function () {

        const { ipcRenderer } = require('electron');
        let logout = ipcRenderer.sendSync('request-logout');
        if (logout.success) {
            this.updateAppSettings();
            this.redirectTo('login');
        }
    },
    onOptionsRouteChange: function () {
        this.redirectTo('options');
    },
    reloadStore: function (stores) {
        console.log('storemodified', stores);
        if (stores.length > 0) {
            for (const store of stores) {
                let ds = this.getStore(store)
                console.log('storemodified', ds);
                if (ds) {
                    ds = ds.type === "chained" ? ds.source : ds;
                    //<debug>
                    console.debug(ds);
                    //</debug>
                    if (ds) ds.load();
                }
            }
        }
    }
});
