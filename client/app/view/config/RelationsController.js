Ext.define('Cooperativista.view.config.RelationsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.relations',

    init: function () {

    },
    initViewModel: function (viewModel) {
        console.log('currentEntity', viewModel.get('currentEntity'), viewModel)
    },
    getStore: function (store) {
        let instance = this.callParent(arguments);
        if (instance == null)
            instance = this.getViewModel().getParent().getStore(store);
        return instance;
    },
    restoreView: function () {
        //<debug>
        console.debug('rstore view!');
        //</debug>
        this.lookup('student-grid').getView().refresh();
    },
    closeWins: function (tabPanel, newCard, oldCard) {
        let wins = tabPanel.query('window');
        for (const win of wins) {
            if (win.isVisible())
                win.hide();
        }
    },
    loadEntityForm: function () {
        this.getViewModel().set('entityData', this.getViewModel().get('entities').getAt(0).getData())

    },

    addCourse: function (cmp) {
        this.lookup('addCourseWin').show(cmp);
    },
    doAddCourse: function () {

        let courseData = this.lookup('addCourseForm').getForm().getValues();
        courseData.entity_id = this.getViewModel().get('currentEntity');
        let isDuplicated = this.getStore('courses').findBy(function (rec) {
            return rec.get('name') === courseData.name && rec.get('name_2') === courseData.name_2;
        }, this);

        let path = require("path");
        const {dialog, nativeImage} = require('electron').remote;
        const appPath = require('electron').remote.app.getAppPath();
        const i18n = new (require(path.resolve(appPath, './translations/i18n')));
        if (isDuplicated > -1) {
            dialog.showErrorBox('Registro duplicado', 'Ya existe un ítem con los datos especificados');
            return;
        }
        const {ipcRenderer} = require('electron');
        let add = ipcRenderer.sendSync('add-partner', {partners: courseData}); //update-enity-settings
        if (add.success) {
            this.fireEvent('storemodified', ['courses', 'partners']);
            this.getStore('partners').load({
                callback: function () {
                    this.lookup('addCourseForm').reset();
                    this.lookup('addCourseForm').getForm().setValues({entity_id: this.getViewModel().get('currentEntity')});
                    dialog.showMessageBox({
                        title: 'Datos guardados',
                        message: 'Se agregó el curso ' + courseData.name + ' ' + courseData.name_2,
                        icon: nativeImage.createFromPath(path.resolve(appPath, './assets/icons/png/256x256.png')),
                        buttons: [i18n.__('OK')]
                    });
                    this.getStore('courses').load(
                        {
                            callback: function (store) {
                                let courseExists = this.getStore('courses').findBy(function (rec) {
                                    let exists = true;
                                    for (const key in courseData) {
                                        if (courseData.hasOwnProperty(key)) {
                                            exists = courseData[key] === rec.get(key);
                                        }
                                        console.log(key, exists, courseData[key], rec.get(key));
                                        return exists;
                                    }
                                }, this);
                                console.log(courseExists)
                                if (courseExists > -1) {
                                    let course = this.getStore('courses').getAt(courseExists);
                                    console.log(course)
                                    if (this.lookup('course_selector').isVisible())
                                        this.lookup('course_selector').select(course);
                                    if (this.lookup('new_course_selector').isVisible())
                                        this.lookup('new_course_selector').select(course);
                                }
                                this.lookup('addCourseWin').close();
                            },
                            scope: this
                        }
                    );
                },
                scope: this
            })
        } else {
            //<debug>
            console.debug(add);
            //</debug>
            dialog.showErrorBox('Error en la configuración', 'Se generó un error al actualizar los datos');
        }
    },
    checkValid: function (btn) {
        let formPanel = btn.up('form') || btn.nextSibling('form') || btn.previousSibling('form'),
            fields = formPanel.getForm().getFields(),
            invalid = [],
            msg,
            icon,
            i = 0;
        fields.each(
            function (field) {
                if (!field.isValid()) {
                    invalid.push(field.up('[reference]').getReference() + '-> ' + (field.fieldLabel || field.emptyText || field.name || field.id).replace('...', '') + ('('/* + (field.disabled ? 'D.' : 'H.')*/ + (field.reference ? field.reference : 'NN') + ')'));
                    i++;
                }
            }
        );
        if (invalid.length > 0) {
            msg = 'Los siguientes campos no son válidos: <ul><li>' + invalid.join('</li><li>') + '</li></ul>';
            icon = Ext.MessageBox.ERROR;
        } else {
            msg = 'El formulario es válido';
            icon = Ext.MessageBox.INFO;
        }
        Ext.Msg.show({
            title: 'Estado del formulario',
            msg: msg,
            buttons: Ext.MessageBox.OK,
            icon: icon
        });
    },
    addStudent: function (btn) {
        //<debug>
        console.debug('Abrimos ventana???', this.lookup('addStudentWin'));
        //</debug>
        this.lookup('addStudentForm').reset();
        this.lookup('addStudentForm').getForm().setValues({entity_id: this.getViewModel().get('currentEntity')});
        this.getViewModel().set('userAction', btn.action);
        this.getViewModel().notify();

        //<debug>
        console.debug(this.getViewModel().get('userAction'), this.lookup('addStudentForm').getForm().getValues());
        //</debug>

        if (btn.action === "update") {
            let user = btn.value.getData();
            user.course_partner_id = user.course_id;
            user.family_partner_id = user.family_id;
            this.lookup('addStudentForm').getForm().setValues(user);
            console.log(user);
        }

        //this.lookup('addStudentWin').renderTo = this.lookup('student-grid').getEl();
        this.lookup('addStudentWin').show(this.lookup('student-grid'));

    },
    doAddStudent: function () {

        let studentData = this.lookup('addStudentForm').getForm().getValues();
        studentData.entity_id = this.getViewModel().get('currentEntity');
        let isDuplicated = this.getStore('studentsStore').findBy(function (rec) {//parent_partner_id
            let baseCheck = rec.get('name') === studentData.name && rec.get('name_2') === studentData.name_2 && rec.get('name_3') === studentData.name_3 && rec.get('course_id') === studentData.course_partner_id;
            /**
             * Si la comparación de nombre y curso da igual chequeamos los atributos.
             * Esto es para que puedan existir registros con mismo nombre en un curso, no es habitual pero si posible
             * El usuario debería registra algún atributo extra para diferenciarlo.
             * El alumno se asocia también a una "familia" (otro registro en "partners_relations"), pero al momento del alta esa relación no existe.
             */
            if (baseCheck) {
                baseCheck = baseCheck && rec.get('attribute_1') === studentData.attribute_1 && rec.get('attribute_2') === studentData.attribute_2 && rec.get('attribute_3') === studentData.attribute_3 && rec.get('attribute_4') === studentData.attribute_4 && rec.get('attribute_5') === studentData.attribute_5 && rec.get('family_id') === studentData.family_partner_id;
            }
            return baseCheck;
        }, this);

        let path = require("path");
        const {dialog} = require('electron').remote;
        const nativeImage = require('electron').remote.nativeImage;
        const appPath = require('electron').remote.app.getAppPath();
        const i18n = new (require(path.resolve(appPath, './translations/i18n')));

        if (isDuplicated > -1) {
            dialog.showErrorBox('Registro duplicado', 'Ya existe un ítem con los datos especificados');
            return;
        }
        let courseId = studentData.course_partner_id;
        let familyId = studentData.family_partner_id;

        delete studentData.course_partner_id;
        delete studentData.family_partner_id;

        let relations = [
            {
                parent_partner_id: courseId
            },
            {
                parent_partner_id: familyId
            }
        ]

        const {ipcRenderer} = require('electron');
        let add = ipcRenderer.sendSync('add-partner', {partners: studentData, partners_relations: relations}); //update-enity-settings
        if (add.success) {
            this.fireEvent('storemodified', ['studentsStore', 'partners']);
            this.getStore('partners').load({
                callback: function () {
                    this.lookup('addStudentForm').reset();
                    this.lookup('addStudentForm').getForm().setValues({entity_id: this.getViewModel().get('currentEntity')});
                    dialog.showMessageBox({
                        title: 'Datos guardados',
                        message: 'Se agregó el alumno ' + studentData.name + ' ' + studentData.name_2,
                        icon: nativeImage.createFromPath(path.resolve(appPath, './assets/icons/png/256x256.png')),
                        buttons: [i18n.__('OK')]
                    });
                    this.getStore('studentsStore').getSource().load();
                },
                scope: this
            })
        } else {
            //<debug>
            console.debug(add);
            //</debug>
            dialog.showErrorBox('Error en la configuración', 'Se generó un error al actualizar los datos');
        }
    },
    doEditStudent: function (btn) {
        let studentData = this.lookup('addStudentForm').getForm().getValues();
        studentData.entity_id = this.getViewModel().get('currentEntity');


        let courseId = studentData.course_partner_id;
        let courseRelationId = studentData.course_relation_id;
        let familyId = studentData.family_partner_id;
        let familyRelationId = studentData.family_relation_id;

        delete studentData.course_partner_id;
        delete studentData.course_relation_id;
        delete studentData.family_partner_id;
        delete studentData.family_relation_id;

        let relations = [
            {
                parent_partner_id: courseId,
                id: courseRelationId
            },
            {
                parent_partner_id: familyId,
                id: familyRelationId
            }
        ]

        //<debug>
        console.log('Actualiza??', studentData, relations);
        //</debug>
        const {ipcRenderer} = require('electron');
        let update = ipcRenderer.sendSync('update-student', {partners: studentData, partners_relations: relations});
        let path = require("path");
        const {dialog} = require('electron').remote;
        const nativeImage = require('electron').remote.nativeImage;
        const appPath = require('electron').remote.app.getAppPath();
        const i18n = new (require(path.resolve(appPath, './translations/i18n')));
        if (update.success) {
            this.fireEvent('storemodified', ['studentsStore', 'partners']);
            this.getStore('partners').load({
                callback: function () {
                    this.lookup('addStudentForm').reset();
                    this.lookup('addStudentForm').getForm().setValues({entity_id: this.getViewModel().get('currentEntity')});
                    this.getStore('studentsStore').getSource().load({
                        callback: function () {
                            this.getViewModel().notify();
                            dialog.showMessageBox({
                                title: 'Datos guardados',
                                message: 'Se actualizó el alumno ' + studentData.name + ' ' + studentData.name_2,
                                icon: nativeImage.createFromPath(path.resolve(appPath, './assets/icons/png/256x256.png')),
                                buttons: [i18n.__('OK')]
                            });
                            this.lookup('addStudentWin').close();
                            this.lookup('student-grid').getView().refresh();


                            //<debug>
                            console.debug('addStudentForm------------->', this.lookup('addStudentForm').getForm().getValues());
                            //</debug>
                        },
                        scope: this
                    });
                },
                scope: this
            })
        } else {
            //<debug>
            console.debug(update);
            //</debug>
            dialog.showErrorBox('Error en la configuración', 'Se generó un error al actualizar los datos');
        }

    },
    promoteStudens: function (btn) {
        this.lookup('promoteStudentWin').show(btn)
    },
    doPromoteStudents: function (btn) {
        let studentData = this.lookup('promoteStudentForm').getForm().getValues();
        let relations = [];
        let students = this.lookup('student-grid').getSelection();
        for (const student of students) {
            relations.push({
                parent_partner_id: studentData.course_partner_id,
                id: student.get('course_relation_id')
            });
        }
        //<debug>
        console.debug(relations);
        //</debug>
        const {ipcRenderer} = require('electron');
        let update = ipcRenderer.sendSync('update-student', {partners_relations: relations});
        let path = require("path");
        const {dialog} = require('electron').remote;
        const nativeImage = require('electron').remote.nativeImage;
        const appPath = require('electron').remote.app.getAppPath();
        const i18n = new (require(path.resolve(appPath, './translations/i18n')));
        if (update.success) {
            this.fireEvent('storemodified', ['studentsStore', 'partners']);
            this.getStore('partners').load({
                callback: function () {
                    this.lookup('addStudentForm').reset();
                    this.lookup('addStudentForm').getForm().setValues({entity_id: this.getViewModel().get('currentEntity')});
                    this.getStore('studentsStore').getSource().load({
                        callback: function () {
                            this.getViewModel().notify();
                            dialog.showMessageBox({
                                title: 'Datos guardados',
                                message: 'Se actualizó el curso de los alumnos selecciondos',
                                icon: nativeImage.createFromPath(path.resolve(appPath, './assets/icons/png/256x256.png')),
                                buttons: [i18n.__('OK')]
                            });
                            this.lookup('promoteStudentWin').close();
                            this.lookup('student-grid').getView().refresh();
                        },
                        scope: this
                    });
                },
                scope: this
            })
        } else {
            //<debug>
            console.debug(update);
            //</debug>
            dialog.showErrorBox('Error en la configuración', 'Se generó un error al actualizar los datos');
        }
    },
    graduateStudents: function (btn) {
        this.lookup('graduateStudentWin').show(btn);
    },
    doGraduateStudents: function (btn) {

        let studentData = this.lookup('graduateStudentForm').getForm().getValues();
        let partners = [];
        let students = this.lookup('student-grid').getSelection();
        for (const student of students) {
            partners.push({
                attribute_5: studentData.student_graduation_date,
                id: student.get('id')
            });
        }
        //<debug>
        console.debug(partners);
        //</debug>
        const {ipcRenderer} = require('electron');
        let update = ipcRenderer.sendSync('update-student', {partners: partners});
        let path = require("path");
        const {dialog} = require('electron').remote;
        const nativeImage = require('electron').remote.nativeImage;
        const appPath = require('electron').remote.app.getAppPath();
        const i18n = new (require(path.resolve(appPath, './translations/i18n')));
        if (update.success) {
            this.fireEvent('storemodified', ['studentsStore', 'partners']);
            this.getStore('partners').load({
                callback: function () {
                    this.lookup('addStudentForm').reset();
                    this.lookup('addStudentForm').getForm().setValues({entity_id: this.getViewModel().get('currentEntity')});
                    this.getStore('studentsStore').getSource().load({
                        callback: function () {
                            this.getViewModel().notify();
                            dialog.showMessageBox({
                                title: 'Datos guardados',
                                message: 'Se egresaron los alumnos selecciondos',
                                icon: nativeImage.createFromPath(path.resolve(appPath, './assets/icons/png/256x256.png')),
                                buttons: [i18n.__('OK')]
                            });
                            this.lookup('graduateStudentWin').close();
                            this.lookup('student-grid').getView().refresh();
                        },
                        scope: this
                    });
                },
                scope: this
            })
        } else {
            //<debug>
            console.debug(update);
            //</debug>
            dialog.showErrorBox('Error en la configuración', 'Se generó un error al actualizar los datos');
        }
    },
    addFamily: function () {
        //<debug>
        console.debug('Abrimos ventana???', this.lookup('addFamilyWin'));
        //</debug>
        this.lookup('addFamilyWin').show();

    },
    doAddFamily: function () {
        let familyData = this.lookup('addFamilyForm').getForm().getValues();
        familyData.entity_id = this.getViewModel().get('currentEntity');
        let isDuplicated = this.getStore('partners').findBy(function (rec) {
            return rec.get('name') === familyData.name && rec.get('name_2') === familyData.name_2 && rec.get('name_3') === familyData.name_3;
        }, this);
        let path = require("path");
        const {dialog} = require('electron').remote;
        const nativeImage = require('electron').remote.nativeImage;
        const appPath = require('electron').remote.app.getAppPath();
        const i18n = new (require(path.resolve(appPath, './translations/i18n')));

        if (isDuplicated > -1) {
            dialog.showErrorBox('Registro duplicado', 'Ya existe un ítem con los datos especificados');
            return;
        }
        const {ipcRenderer} = require('electron');
        let add = ipcRenderer.sendSync('add-partner', {partners: familyData}); //update-enity-settings
        if (add.success) {
            this.fireEvent('storemodified', ['partners']);
            this.getStore('partners').load({
                callback: function () {
                    this.lookup('addFamilyForm').reset();
                    this.lookup('addFamilyForm').getForm().setValues({entity_id: this.getViewModel().get('currentEntity')});
                    dialog.showMessageBox({
                        title: 'Datos guardados',
                        message: 'Se el grupo familiar ' + familyData.name + ' ' + familyData.name_2,
                        icon: nativeImage.createFromPath(path.resolve(appPath, './assets/icons/png/256x256.png')),
                        buttons: [i18n.__('OK')]
                    });
                    this.lookup('addFamilyWin').close();

                    let familyExists = this.getStore('families').findBy(function (rec) {
                        let exists = true;
                        for (const key in familyData) {
                            if (familyData.hasOwnProperty(key)) {
                                exists = familyData[key] === rec.get(key);
                            }
                            console.log(key, exists, familyData[key], rec.get(key));
                            return exists;
                        }
                    }, this);
                    console.log(familyExists)
                    if (familyExists > -1) {
                        let family = this.getStore('families').getAt(familyExists);
                        console.log(family)
                        this.lookup('family_selector').select(family);
                    }
                    this.lookup('addCourseWin').close();
                },
                scope: this
            })
        } else {
            //<debug>
            console.debug(add);
            //</debug>
            dialog.showErrorBox('Error en la configuración', 'Se generó un error al actualizar los datos');
        }
    },


    addDonator: function () {
        //  this.lookup('addDonatorWin').renderTo = this.lookup('donators-grid').getEl();
        this.lookup('addDonatorWin').show(this.lookup('donators-grid'));
    },
    doAddDonator: function () {
        let donatorData = this.lookup('addDonatorForm').getForm().getValues();
        donatorData.entity_id = this.getViewModel().get('currentEntity');
        let isDuplicated = this.getStore('donators').findBy(function (rec) {
            return rec.get('name') === donatorData.name && rec.get('name_2') === donatorData.name_2 && rec.get('name_3') === donatorData.name_3;
        }, this);

        let path = require("path");
        const {dialog} = require('electron').remote;
        const nativeImage = require('electron').remote.nativeImage;
        const appPath = require('electron').remote.app.getAppPath();
        const i18n = new (require(path.resolve(appPath, './translations/i18n')));

        if (isDuplicated > -1) {
            dialog.showErrorBox('Registro duplicado', 'Ya existe un ítem con los datos especificados');
            return;
        }
        const {ipcRenderer} = require('electron');
        let add = ipcRenderer.sendSync('add-partner', {partners: donatorData}); //update-enity-settings
        if (add.success) {
            this.fireEvent('storemodified', ['donators', 'partners']);
            this.getStore('partners').load({
                callback: function () {
                    this.lookup('addDonatorForm').reset();
                    this.lookup('addDonatorForm').getForm().setValues({entity_id: this.getViewModel().get('currentEntity')})
                    let notif = new Notification('Datos guardados', {
                        body: 'Se agregó la entidad ' + donatorData.name + ' ' + donatorData.name_2 + ' ' + donatorData.name_3
                    });
                    Ext.toast(notif.body);

                    dialog.showMessageBox({
                        title: 'Datos guardados',
                        message: 'Se agregó la entidad ' + donatorData.name + ' ' + donatorData.name_2 + ' ' + donatorData.name_3,
                        icon: nativeImage.createFromPath(path.resolve(appPath, './assets/icons/png/256x256.png')),
                        buttons: [i18n.__('OK')]
                    });

                    this.getStore('donators').load();
                    this.lookup('addDonatorWin').close();
                },
                scope: this
            })
        } else {
            //<debug>
            console.debug(add);
            //</debug>
            dialog.showErrorBox('Error en la configuración', 'Se generó un error al actualizar los datos');
        }
    },
    onStudentsSelChange: function (store, selected) {
        let courses = [],
            courseLevel = 0;
        for (const student of selected) {
            let course = student.get('studentCourse');
            //<debug>
            console.debug(courses.includes(course));
            //</debug>er
            if (!courses.includes(course)) courses.push(course);
            courseLevel = parseInt(student.get('course_name'));
        }
        //<debug>
        console.debug(courses, courses.length);
        //</debug>

        this.getViewModel().set('studentsPromoteFrom', courses.length === 1 ? courseLevel : 0);
        this.getViewModel().set('studentsCanPromote', courses.length === 1);
        this.getViewModel().set('studentsSelected', selected.length);
        this.getViewModel().notify();
        console.log('Elegidos ' + this.getViewModel().get('studentsSelected') + ' students', this.getViewModel().get('studentsCanPromote'), this.getViewModel().get('studentsPromoteFrom'));

    },
    updateStatusBtn: function (btn) {
        const { ipcRenderer } = require('electron');
        let status = btn.value.get('has_attribute_5') == 1 ? null : Ext.util.Format.date(new Date, 'Y-m-d');
        ipcRenderer.sendSync('update-partner', { attribute_5: status, id: btn.value.get('id') });
        this.fireEvent('storemodified', ['donators']);
    }

    // TODO - Add control logic or remove is not needed
});
