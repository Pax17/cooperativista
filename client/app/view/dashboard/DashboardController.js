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
    init: function () {
        fetch('mrf://pax17-rss')
            .then(resp => resp.json())
            .catch(err => {
                console.log(err, '<---------------------rsserr'); // { hello: 'world' }

            })
            .then(o => {
                console.log(o, '<---------------------rss'); // { hello: 'world' }
            })
            .catch(err => {
            console.log(err, '<---------------------rsserr'); // { hello: 'world' }

        });
    }
});
