Ext.define('Cooperativista.model.Partner', {
    extend: 'Cooperativista.model.Base',

    alias: 'model.partner',

    /**
     * SELECT p.id, p.name, p.name_2, p.name_3, p.attribute_1, p.attribute_2, p.attribute_3, p.attribute_4, p.attribute_5, p.partner_type_id, pt.type_description, pt.type_code, pr.parent_partner_id, parent_p.name parent_p_name, parent_p.name_2 parent_p_name_2, parent_p.name_3 parent_p_name_3 FROM partners p INNER JOIN partner_types pt on p.partner_type_id = pt.id LEFT JOIN partners_relations pr on pt.id = pr.partner_id LEFT JOIN partners parent_p on parent_p.id = pr.parent_partner_id LEFT JOIN partner_types parent_pt on parent_p.partner_type_id = parent_pt.id
     */
    fields: [
        {
            name: 'id',
            type:'int'
        },
        {
            name: 'name'
        },
        {
            name: 'name_2'
        },
        {
            name: 'name_3'
        },
        {
            name: 'attribute_1'
        },
        {
            name: 'attribute_2'
        },
        {
            name: 'attribute_3'
        },
        {
            name: 'attribute_4'
        },
        {
            name: 'attribute_5'
        },
        {
            name: 'entity_id',
            type:'int'
        },
        {
            name: 'partner_type_id',
            type:'int'
        },
        {
            name: 'type_description'
        },
        {
            name: 'type_code'
        },
       /* {
            name: 'parent_partner_id'
        },
        {
            name: 'parent_p_name'
        },
        {
            name: 'parent_p_name_2'
        },
        {
            name: 'parent_p_name_3'
        },
        {
            name: 'partner_p_type_id'
        },*/
        {
            name: 'has_attribute_1',
            calculate: function (data) {
                return !!data.attribute_1;
            }
        },
        {
            name: 'has_attribute_2',
            calculate: function (data) {
                return !!data.attribute_2;
            }
        },
        {
            name: 'has_attribute_3',
            calculate: function (data) {
                return !!data.attribute_3;
            }
        },
        {
            name: 'has_attribute_4',
            calculate: function (data) {
                return !!data.attribute_4;
            }
        },
        {
            name: 'has_attribute_5',
            calculate: function (data) {
                return !!data.attribute_5;
            }
        }/*,
        {
            name:'studentCourse',
            calculate: function (data) {
                return data.partner_type_id === 2 ?`${data.parent_p_name}° ${data.parent_p_name_2}`:null;
            }
        }*/
    ],
    proxy: {
        type: 'rest',
        api: {
            create: 'sqlite://partners_add',
            read: 'sqlite://partners_load',
            update: 'sqlite://partners_update',
            destroy: 'sqlite://partners_delete'
        },
        reader: {
            type: 'json',
            rootProperty: 'data'
        }/*,
        extraParams: {
            status: 1
        }*/

    }
});
