const {ipcMain, app, BrowserWindow, dialog} = require('electron');
const fs = require('fs');
const path = require('path');
const config = require(path.join(__dirname, 'package.json'));
const settings = require('electron-settings');
const dbLocation = path.join(app.getPath('userData'), 'db', 'cooperativista.db');
const extDir = (process.argv[process.argv.length - 1] === 'plain') ? 'client' : 'client_built';
const bcrypt = require('bcryptjs');
const sqlite = require('better-sqlite3');
const i18n = new (require('./translations/i18n'))
const {autoUpdater} = require("electron-updater")

require('./server/server')();
require('./server/api')();
const dbManager = require('./db/manager');
const pdf = require('./pdf');
/**
 * Esto evita correr doble instancias en windows??
 */
let mainWindow = null;
const gotTheLock = app.requestSingleInstanceLock();
app.on('second-instance', (commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore()
        mainWindow.focus()
    }
})
if (!gotTheLock) {
    return app.quit()
}
/**
 * para notificaciones deberíamos setear el appUserModelId? 'CompanyName.ProductName.SubProduct.VersionInformation'
 */
// Create myWindow, load the rest of the app, etc...
app.on('ready', function () {
    autoUpdater.checkForUpdatesAndNotify().then(status => {
        console.log(status);
    });
});

function createWindow(savedSettings) {
    let specs = {
        width: 1280, height: 720,
        backgroundColor: 'lightgray',
        title: config.productName,
        show: false
    };
    if (savedSettings && 'winStatus' in savedSettings) {
        if ('size' in savedSettings.winStatus) {
            specs.width = savedSettings.winStatus.size.width || 1280;
            specs.height = savedSettings.winStatus.size.height || 720;
        }
    }
    mainWindow = new BrowserWindow(specs);
    mainWindow.loadURL(`file://${__dirname}/${extDir}/index.html`);

    if (process.defaultApp) mainWindow.webContents.webContents.openDevTools();
    mainWindow.on('closed', function () {
        mainWindow = null;
    });

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        if (settings.get('currentEntityData.name')) {
            console.log(settings.getAll(), settings.get('currentEntityData.name'));
            mainWindow.setTitle(settings.get('currentEntityData.name'));
        }
    });
    mainWindow.onbeforeunload = (e) => {
        // Prevent Command-R from unloading the window contents.
        e.returnValue = false
    }
    require('./menu/main');
    console.log(app.getLocale(), 'LANG')
}

function isEmpty(obj) {
    for (let prop in obj) if (obj.hasOwnProperty(prop)) {
        return false;
    }
    return JSON.stringify(obj) === JSON.stringify({});
}

function objectFlatten(ob) {
    let toReturn = {};

    for (let i in ob) {
        if (!ob.hasOwnProperty(i)) continue;

        if ((typeof ob[i]) === 'object') {
            let flatObject = objectFlatten(ob[i]);
            for (let x in flatObject) {
                if (!flatObject.hasOwnProperty(x)) continue;

                toReturn[i + '.' + x] = flatObject[x];
            }
        } else {
            toReturn[i] = ob[i];
        }
    }
    return toReturn;
}

function initMainApp() {
    const initialSettings = require('./initialSettings');
    const savedSettings = settings.getAll();
    console.log('settings', settings.getAll());
    /**
     * Inicializamos las configuraciones
     */
    if (isEmpty(savedSettings)) {
        settings.setAll(initialSettings);
    } else {
        if (savedSettings.settingsVersion < initialSettings.settingsVersion) {
            let flatInitial = objectFlatten(initialSettings);
            for (let prop in flatInitial) {
                console.log(`obj.${prop} = ${flatInitial[prop]}`);
                if (!settings.has(prop))
                    settings.set(prop, flatInitial[prop])
            }
            settings.set('settingsVersion', initialSettings.settingsVersion, savedSettings)
        }
    }

    console.log('dbVersion', savedSettings.dbVersion, savedSettings);
    // Si existe la base de datos creamos la ventana de la app

    // console.log(path.join(__dirname, 'db'), dirContent);
    if (fs.existsSync(dbLocation)) {
        if (!savedSettings.dbVersion || savedSettings.dbVersion < initialSettings.dbVersion) {
            let oVersion = !savedSettings.dbVersion ? 1 : savedSettings.dbVersion;
            if (oVersion < initialSettings.dbVersion) {
                let dbUpdateContent = fs.readdirSync(path.join(__dirname, 'db'));
                let updateFases = {};
                if (dbUpdateContent.length > 0) {
                    console.log(dbUpdateContent);
                    for (let fileUpdate of dbUpdateContent) {
                        let parsedFileName = fileUpdate.split('-');
                        console.log(fileUpdate, parsedFileName, parsedFileName[0]);
                        console.log(parsedFileName[0]);
                        if (parsedFileName[0] === 'updateFrom') {
                            console.log(parsedFileName[1].replace('.sql', ''))
                            updateFases[parseFloat(parsedFileName[1].replace('.sql', ''))] = path.join(__dirname, 'db', fileUpdate);
                        }
                    }
                }
                console.log(updateFases);
                let needUpdate = true;
                let db = new sqlite(dbLocation);
                const orderedFases = {};
                Object.keys(updateFases).sort().forEach(function (key) {
                    orderedFases[key] = updateFases[key];
                });
                console.log(needUpdate, fs.existsSync(path.join(__dirname, 'db', `updateFrom-${oVersion}.sql`)), `updateFrom-${oVersion}.sql`);
                if (needUpdate) {
                    for (let version in updateFases) {
                        console.log(version, oVersion, version > oVersion);
                        if (orderedFases.hasOwnProperty(version) && version >= oVersion) {
                            console.log(version, oVersion);
                            console.log(orderedFases[version]);
                            let migration = fs.readFileSync(orderedFases[version], 'utf8');
                            console.log(migration);
                            db.exec(migration);
                        }
                    }
                    db.close();
                }

            }
            settings.set('dbVersion', initialSettings.dbVersion);
        }

        createWindow(savedSettings);
    } else {
        // Chequeamos la ruta a la carpeta contenedora de la base SQLite3. Si no existe la creamos
        if (!fs.existsSync(path.join(app.getPath('userData'), 'db'))) {
            fs.mkdirSync(path.join(app.getPath('userData'), 'db'));
        }
        settings.setAll(initialSettings);
        let db = new sqlite(dbLocation);
        const migration = fs.readFileSync(path.join(__dirname, 'db', 'cooperativista.sql'), 'utf8');
        db.exec(migration);
        const data = fs.readFileSync(path.join(__dirname, 'db', 'initialData.sql'), 'utf8');
        db.exec(data);
        db.close();
        createWindow(initialSettings);
    }
    //TEMP!
    let db = new sqlite(dbLocation);
    let table = 'entities';
    const sqlInfo = db.pragma(`table_info('${table}');`);
    let colnames = [];
    for (const col of sqlInfo) {
        colnames.push(col.name);
    }

    let select = `SELECT ${colnames.join(', ')} FROM ${table}`;
    let insert = `INSERT INTO ${table} (${colnames.join(', ')}) VALUES (@${colnames.join(', @')})`;
    console.log('PRAGMA****************>>>>>>>>>>>>>>>>>>>>', select);
    console.log('PRAGMA****************>>>>>>>>>>>>>>>>>>>>', insert);
    db.close();
}

function extend(obj, src) {
    Object.keys(src).forEach(function (key) {
        obj[key] = src[key];
    });
    return obj;
}

function updateEntityData(entity_id) {
    let sql = 'SELECT id, name, name_2, name_3, attribute_1, attribute_2, attribute_3, attribute_4, attribute_5 FROM entities WHERE id = $entity_id',
        params = {
            entity_id: entity_id
        },

        focusedWindow = BrowserWindow.getFocusedWindow();

    const db = new sqlite(dbLocation, {
        fileMustExist: true,
        readonly: true
    });
    let currentSettings = settings.get('currentEntityData');
    try {
        let stmt = db.prepare(sql);
        let currentEntityData = stmt.get(params);
        let mergedSettings = extend(currentSettings, currentEntityData)
        settings.set('currentEntityData', mergedSettings);
        console.log('*******************');
        console.log(mergedSettings);
        console.log('*******************');
        if ('name' in currentEntityData)
            focusedWindow.setTitle(mergedSettings.name)
    } catch (err) {
        return console.error(err.message);
    }
    db.close();
}

function updateCurrentUserData(alias, dbObj) {
    let sql = 'SELECT u.id, passcode, alias, name, last_name, entity_id, role_id, attribute_1, attribute_2, attribute_3, attribute_4, attribute_5 FROM base_users u WHERE alias = $alias AND status = 1',
        params = {
            alias: alias
        };
    const db = new sqlite(dbLocation, {
        fileMustExist: true,
        readonly: true
    });
    try {
        let stmt = db.prepare(sql);
        let currentUser = stmt.get(params);
        settings.set('currentUser', currentUser);
    } catch (err) {
        return console.error(err.message);
    }
    db.close();
}

app.on('ready', initMainApp);

// Quit when all windows are closed, except for Mac users
app.on('window-all-closed', function () {
    if (settings.get('currentUser') !== null)
        settings.set('lastUser', settings.get('currentUser'));
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {
    //  let mainWindow = BrowserWindow.getFocusedWindow();
    //console.debug( mainWindow)
    if (mainWindow === null) {
        initMainApp();
    }
});

// Handle plain IPC call from the browser window
ipcMain.on('launch', (event, arg) => {
    let focusedWindow = BrowserWindow.getFocusedWindow();
    let title = settings.get('currentEntityData.name');
    if (focusedWindow && title)
        focusedWindow.setTitle(title)
    event.returnValue = title;
});

// Handle plain IPC call from the browser window
ipcMain.on('get-app-version', (event, arg) => {
    event.returnValue = {
        appName: config.name,
        appVersion: config.version
    }
});
// Handle plain IPC call from the browser window
ipcMain.on('get-settings', (event, arg) => {
    console.log(arg); // prints "ping"
    if (arg === 'all') {
        event.returnValue = settings.getAll()
    } else {
        if (settings.has(arg))
            event.returnValue = settings.get(arg)
    }
});
ipcMain.on('save-setting', (event, args) => {
    for (const key in args) {
        if (args.hasOwnProperty(key)) {
            //const element = args[key];
            settings.set('key'.args[key])

        }
    }
    event.returnValue = true;
});
ipcMain.on('get-first-run-data', (event, args) => {
    const db = new sqlite(dbLocation, {
        fileMustExist: true,
        readonly: true
    });

    let params = {};
    let sql = 'SELECT u.id, alias, name, last_name, entity_id, role_id, attribute_1, attribute_2, attribute_3, attribute_4, attribute_5 FROM base_users u';

    try {
        let stmt = db.prepare(sql);
        let currentUser = stmt.get();
        console.log(sql, currentUser);
        if ('id' in currentUser) {
            params = {
                entity_id: currentUser.entity_id
            };
            sql = 'SELECT id, name, name_2, name_3, attribute_1, attribute_2, attribute_3, attribute_4, attribute_5 FROM entities WHERE id = $entity_id';
            stmt = db.prepare(sql);
            currentEntityData = stmt.get(params);
            console.log(sql, params, currentEntityData);
            event.returnValue = {
                user: currentUser,
                entity: currentEntityData
            }
        }
    } catch (err) {
        event.returnValue = false;
        return console.error(err);
    }
    db.close();
});
ipcMain.on('update-enity-settings', (event, args) => {
    if (args.entity_id)
        updateEntityData(args.entity_id);
    event.returnValue = true
});
ipcMain.on('set-first-run-data', (event, args) => {
    let params = {},
        filters = [],
        filter = '',
        setters = [],
        setter = '',
        table,
        userStmt, passParamsUser = {},
        periodStmt = [], passParamsPeriod = {},
        entityStmt, passParamsEntity = {},
        sql, entityId, userId;

    try {
        const db = new sqlite(dbLocation, {
            fileMustExist: true,
        });
        if (args.userData) {
            params = args.userData;
            filters = [];
            filter = '';
            setters = [];
            setter = '',
                table = 'base_users';
            //let passParamsUser = {};
            sql = () => `UPDATE ${table} SET ${setter} WHERE ${filter}`;
            if (!'id' in params) {
                event.returnValue = {
                    success: false
                }
                return console.error('Faltan parámetros');
            }
            userId = params.alias;
            for (let param in params) {
                passParamsUser[param] = param === 'passcode' ? bcrypt.hashSync(params[param], bcrypt.genSaltSync(10)) : params[param];
                if (param === 'id') {
                    filters.push(`${param}=$${param}`)
                } else {
                    setters.push(`${param}=$${param}`)
                }
            }
            filter = filters.join(' AND ');
            setter = setters.join(', ');

            console.log(sql());


            if (setters.length === 0) {
                event.returnValue = {
                    success: false
                }
                return console.error('Faltan parámetrps para generar la consulta');
            }
            userStmt = db.prepare(sql());
        }

        if (args.entityData) {
            params = args.entityData;
            filters = [];
            filter = '';
            setters = [];
            setter = '';
            table = 'entities';
            sql = () => `UPDATE ${table} SET ${setter} WHERE ${filter}`;
            if (!'id' in params) {
                event.returnValue = {
                    success: false
                }
                return console.error('Faltan parámetros');
            }
            entityId = params.id;
            for (let param in params) {
                passParamsEntity[param] = params[param];
                if (param === 'id') {
                    filters.push(`${param}=$${param}`)
                } else {
                    setters.push(`${param}=$${param}`)
                }
            }
            filter = filters.join(' AND ');
            setter = setters.join(', ');

            console.log(sql());
            if (setters.length === 0) {
                event.returnValue = {
                    success: false
                }
                return console.error('Faltan parámetros');
            }
            entityStmt = db.prepare(sql())
        }


        if (args.periodData) {
            let multiParams = args.periodData;
            let getStmt = (params) => {
                let filters = [];
                let filter = '';
                let setters = [];
                let setter = '';
                let table = 'helper_attr';
                let sql = () => `UPDATE ${table} SET ${setter} WHERE ${filter}`;
                if (!'taxonomy' in params) {
                    return console.error('Faltan parámetros');
                }
                for (let param in params) {
                    passParamsPeriod[param] = params[param];
                    if (param === 'taxonomy') {
                        filters.push(`${param}=$${param}`)
                    } else {
                        setters.push(`${param}=$${param}`)
                    }
                }
                filter = filters.join(' AND ');
                setter = setters.join(', ');

                console.log(sql());
                if (setters.length === 0) {
                    return console.error('Faltan parámetros');
                }
                return {
                    stmt: db.prepare(sql()),
                    params: passParamsPeriod
                }
            }
            for (const multi of multiParams) {
                periodStmt.push(getStmt(multi))
            }

        }
        const transUpdate = db.transaction(() => {
            let entity, user, period;
            if (userStmt !== undefined && passParamsUser !== undefined) {
                user = userStmt.run(passParamsUser);
                console.log(user);
            }
            if (entityStmt !== undefined && passParamsEntity !== undefined) {
                entity = entityStmt.run(passParamsEntity)
                console.log(entity);
            }
            if (periodStmt.length > 0) {
                for (const periodUpdate of periodStmt) {
                    period = periodUpdate.stmt.run(periodUpdate.params);
                    console.log(period);
                }
            }
            if (entity !== undefined || user !== undefined || period !== undefined) {
                return true;
            } else {
                return false;
            }
        });
        let update = transUpdate();
        console.log(update)
        if (update) {
            console.log('usuario!!!!', userStmt, userId, passParamsUser);
            if (userStmt !== undefined && passParamsUser !== undefined)
                updateCurrentUserData(userId);
            if (entityStmt !== undefined && passParamsEntity !== undefined)
                updateEntityData(entityId);
            if (!settings.get('appInitialized')) settings.set('appInitialized', true);
            event.returnValue = {
                success: true
            }
        } else {
            //
            throw 'Se generó un error al actualizar los datos';
        }

    } catch (error) {
        event.returnValue = {
            success: false,
            error: error
        }
        return console.error(error);

    }

});

ipcMain.on('request-logout', (event) => {
    dialog.showMessageBox({
        icon: './assets/icons/png/128x128.png',
        message: '¿Desea cerrar la sesión actual?', buttons: [i18n.__('NO'), i18n.__('YES')]
    }, function (choice) {
        console.log(arguments);
        if (choice === 1) {
            settings.set('currentUser', {});
            settings.set('currentEntityData', {});
            event.returnValue = {
                success: true,
                settings: settings
            }
            return;
        }
        event.returnValue = {
            success: false
        }
    });
});
ipcMain.on('get-login', (event, args) => {
    console.log(args); // prints "ping"
    try {
        if ('userid' in args && 'password' in args) {

            let params = {
                alias: args.userid
            };
            let sql = 'SELECT u.id, passcode, alias, name, last_name, entity_id, role_id, attribute_1, attribute_2, attribute_3, attribute_4, attribute_5 FROM base_users u WHERE alias = $alias AND status = 1';

            const db = new sqlite(dbLocation, {
                fileMustExist: true,
                readonly: true
            });
            let stmt = db.prepare(sql);
            let currentUser = stmt.get(params);
            console.log(args, currentUser, sql, params, stmt);
            if (!currentUser) {
                event.returnValue = false
                console.error(args);
                throw 'Usuario no coincide';
            }
            let pass = currentUser.passcode;
            if ('passcode' in currentUser) {
                delete currentUser.passcode
            }

            if (bcrypt.compareSync(args.password, pass)) {
                updateCurrentUserData(currentUser.alias);
                updateEntityData(currentUser.entity_id);
                event.returnValue = currentUser;

            } else {
                throw 'Clave no coincide';
            }
            db.close();
        } else {
            throw 'Faltan datos';
        }
    } catch (err) {
        dialog.showErrorBox('Credenciales inválidas', 'El usuario o la clave no coincide, inténtelo nuevamente');
        event.returnValue = false
        return console.error(err.message, err);
    }

});
///pdf
ipcMain.on('pdf-get', (event, args) => {
    console.log('pdf-get------------------------------>', args)
    if (args.type === 'receipts') pdf.generateReceipt(args.data);
    event.returnValue = {
        success: true
    }
});

ipcMain.on('pdf-preview', (event, args) => {
    // console.log('pdf-preview------------------------------>',args)
    if (args.type === 'receipts') pdf.previewLayout(args.options, args.settings);
    event.returnValue = {
        success: true
    }
});
/**
 * Migración de DB. Usado para finalizar un período y comenzar uno nuevo
 * Migra la base de datos actual a otro archivo, borra el actual y lo recreea con el script cooperativista.sql.
 * Migra datos de la base anterior a la nueva (alumnos, proveedores, usuarios...)
 */
ipcMain.on('start-db-migration', (event, args) => {
    let status = dbManager.startMigraion(args, mainWindow);
    console.log('MIGRATION END STATUS----------------->', status)
    let response;
    if (status === true) {
        response = {
            success: true
        }
    } else {
        response = {
            success: false,
            error: status
        }
    }

    event.sender.send('end-db-migration', response);
});