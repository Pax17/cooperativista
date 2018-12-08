Ext.define('Cooperativista.view.dashboard.DashboardController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.dashboard',

    requires: [
        'Ext.util.TaskRunner'
    ],

    destroy: function () {
        this.callParent();
    },

    onHideView: function () {
    },
    goTo: function (btn, tool) {
        let route = btn.role || tool.role;
        this.redirectTo(route);
    },
    startMigration: function () {

    }
});
