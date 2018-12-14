Ext.define('Cooperativista.view.dashboard.DashboardModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.dashboard',

    requires: [
        'Ext.data.Store',
        'Ext.data.field.Integer',
        'Ext.data.field.String',
        'Ext.data.field.Boolean'
    ],
    data: {

        nav: [
            {
                title: 'Configuraciones del entorno',
                tip: 'Agregar conceptos de pagos y gastos, cambiar datos de la entidad y usuario...',
                role: 'options',
                icon: 'fas fa-plug'
            },
            {
                title: 'Agregar alumno',
                tip: 'Agregar alumnos y aportantes...',
                role: 'relations',
                icon: 'fas fa-user'
            },
            {
                title: 'Generar Recibo',
                tip: 'Ingresar pagos, imprimir recibos...',
                role: 'receipts',
                icon: 'fas fa-receipt'
            }
        ]
    },
    stores: {}
});
