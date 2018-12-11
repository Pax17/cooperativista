Ext.define('Cooperativista.view.main.MainModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.main',
    requires: [
        'Cooperativista.store.Users'
    ],

    data: {
        currentView: null,
        name: 'Cooperativista',
        currentEntity: 1,
        currentEntityData: {
            name: undefined
        },
        currentUser: { name: undefined, alias: undefined },

        loremIpsum: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'

    },
    formulas: {},
    stores: {
        users: {
            type: 'users'
        },
        currentUsers: {
            source: '{users}',
            filters: [
                {
                    property: 'entity_id',
                    value: '{currentEntity}'
                }
            ]
        },
        expense_types: {
            type: 'expenseTypesFull',
            groupField: 'expense_grand_type_description'
        },
        expense_grand_types: {
            type: 'expenseGrandTypes'
        },
        receipt_grand_types: {
            type: 'receiptGrandTypes'
        },
        receipt_types: {
            type: 'receiptTypesFull',
            groupField: 'receipt_grand_type_description'
        },
        payment_grand_types: {
            type: 'paymentGrandTypes'
        },
        payment_types: {
            type: 'paymentTypesFull',
            groupField: 'payment_grand_type_description'
        },
        suppliers: {
            type: 'suppliers'
        },

        partners: {
            type: 'partners'
        },

        partners_type: {
            type: 'partnerTypes'
        },
        courses: {
            type: 'courses',
            filters: [
                {
                    property: 'entity_id',
                    value: '{currentEntity}'
                }
            ],
            sorters: [
                {
                    property: 'name'
                },
                {
                    property: 'name_2'
                }
            ]
        },
        studentsStoreOrigin: {
            type: 'students'
        },
        donators: {
            type: 'donators',
            filters: [
                {
                    property: 'entity_id',
                    value: '{currentEntity}'
                }
            ]
        },
        roles: {
            type: 'roles'
        },
        users: {
            type: 'users'
        }
    }
});
