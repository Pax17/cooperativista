Ext.define('Cooperativista.view.main.MainContainerWrap', {
    extend: 'Ext.container.Container',
    xtype: 'maincontainerwrap',

    requires : [
        'Ext.layout.container.HBox'
    ],

    scrollable: 'y',

    layout: {
        type: 'hbox',
       // align: 'stretchmax',
        align: 'stretch',

        // Tell the layout to animate the x/width of the child items.
        animate: true,
        animatePolicy: {
            x: true,
            width: true
        }
    },

    beforeLayout : function() {
        // We setup some minHeights dynamically to ensure we stretch to fill the height
        // of the viewport minus the top toolbar

        var me = this,
            height = Ext.Element.getViewportHeight() - 44,  // offset by topmost toolbar height
            // We use itemId/getComponent instead of "reference" because the initial
            // layout occurs too early for the reference to be resolved
           // navTree = me.getComponent('navigationTreeList');
            navTree = me.down('#navigationTreeList'),
            navTreeUl = navTree.getEl().selectNode('ul.x-treelist-root-container', false),
            navStrip = navTree.getEl().selectNode('div.x-treelist-toolstrip', false),
            nw;

        me.minHeight = height;

        navTree.setStyle({
            'min-height': height + 'px'
        });

        if (navTreeUl) {
         //   nw = navTree.getWidth() + 15;
            //<debug>
            console.debug('NAV TREE >', navTreeUl, navTreeUl.getStyle('width'), navStrip.getStyle('width'), navStrip);
            //</debug>
            navTreeUl.setStyle('min-height', height + 'px');
          //  navTreeUl.setStyle('height', height + 'px')
         //   navTreeUl.setStyle('width', nw + 'px');
            navStrip.setStyle('overflow-y', 'auto');
            navStrip.setStyle('overflow-x', 'hidden');
            navStrip.setStyle('max-height', height + 'px');

            //max-height: 548px; overflow-y: auto; overflow-x: hidden;
            navStrip.setStyle('min-height', height + 'px');
        }

        me.callParent(arguments);
    }
});
