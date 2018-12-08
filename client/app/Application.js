Ext.define('Cooperativista.Application', {
    extend: 'Ext.app.Application',

    name: 'Cooperativista',
    requires:[
        'Ext.state.LocalStorageProvider', 'Ext.state.Manager'
    ],

    stores: [
        'NavigationTree', 'Users', 'Partners', 'Roles', 'Entities'
    ],

    defaultToken: 'dashboard',
    //mainView: 'Cooperativista.view.main.Main',

    launch: function () {       // Renderer Process
        const { rendererPreload } = require('electron-routes');

        const { ipcRenderer } = require('electron');
        ipcRenderer.sendSync('launch');
        rendererPreload();
        const path = require('path')
        const app = require('electron').remote.app
        const settings = require('electron').remote.require('electron-settings')
        let appSettings = settings.getAll()
        if (!appSettings.appInitialized) {
            //<debug>
            console.log('App necesita inicializarse!');
            //</debug>
            this.setDefaultToken('firstsetup');
            this.defaultToken = 'firstsetup'
            // app.relaunch()
            // app.exit()
        } else {

            if ((!appSettings.currentUser || !appSettings.currentUser.alias) && appSettings.appInitialized) {
                console.log('App necesita LOGIN!')
                this.setDefaultToken('login');
                this.defaultToken = 'login'

            }
        }
        console.log(appSettings)

        this.setMainView({
            xclass: 'Cooperativista.view.main.Main'
        })
        // TODO - Launch the application
        //<debug>
        console.log(path.join(__dirname, 'package.json'));
        console.log(app.getPath('userData'));
        console.log(settings.getAll());
        //</debug>
        Ext.state.Manager.setProvider(Ext.create('Ext.state.LocalStorageProvider', {
            prefix: 'Cooperativista-'
        }));
    },

    onAppUpdate: function () {
        Ext.Msg.confirm('Application Update', 'This application has an update, reload?',
            function (choice) {
                if (choice === 'yes') {
                    window.location.reload();
                }
            }
        );
    }
});
