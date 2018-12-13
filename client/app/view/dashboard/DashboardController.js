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
        this.loadNews();
    },
    loadNews: function () {
        const Parser = require('rss-parser');
        const feedUrl = "https://pax17.github.io/cooperativista/feed.xml";
        const parser = new Parser();
        const viewModel = this.getViewModel();
        // console.log('ENV vars?', process.env);

        fetch(feedUrl)
            .then(resp => resp.text())
            .catch(err => {
                console.error(err);
            })
            .then(xml => parser.parseString(xml))
            .catch(err => {
                console.error(err);
            })
            .then(o => {
                o.items = o.items.slice(0, 5);
                viewModel.set('news', o);

                //<debug>
                console.debug(o.items);
                //</debug>
            })
            .catch(err => {
                console.error(err);
            });
    },
    openExternal: function (url) {
        const {shell} = require('electron')

        shell.openExternal(url)
    },
    handleElClick: function (e, el) {
        e.stopEvent();
        console.log('click', arguments, el.dataset.href);
        if ('dataset' in el && 'href' in el.dataset)
            this.openExternal(el.dataset.href);
        if ('dataset' in el && 'role' in el.dataset)
            this.goTo(el.dataset);
        //return false;
    }
});
