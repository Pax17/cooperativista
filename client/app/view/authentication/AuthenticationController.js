Ext.define('Cooperativista.view.authentication.AuthenticationController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.authentication',
    onLoginButton: function () {
        console.log(this.getView())
        const formVals = this.getView().getValues()
        //const viewModel = this.getViewModel()
        //const settings = require('electron').remote.require('electron-settings')
        const { ipcRenderer } = require('electron');
        let login = ipcRenderer.sendSync('get-login', formVals)
        console.log(login)
        if (login)
            this.redirectTo('dashboard', true);
    }
});