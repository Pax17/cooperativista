Ext.define('Ext.override.data.ChainedStore', {
    override: 'Ext.data.ChainedStore',

    load: function (cfg) {
        this.getSource().load(cfg);
    },
    reload: function (cfg) {
        this.getSource().load(cfg);
    }
});