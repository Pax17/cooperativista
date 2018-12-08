
const electron = require('electron')
const Menu = electron.Menu
const app = electron.app
const i18n = new (require('../translations/i18n'))

const template = [
    {
        label: i18n.__('Edit'),
        submenu: [
            {
                role: 'undo', label: i18n.__('Undo')
            },
            {
                role: 'redo', label: i18n.__('Redo')
            },
            {
                type: 'separator'
            },
            {
                role: 'cut', label: i18n.__('Cut')
            },
            {
                role: 'copy', label: i18n.__('Copy')
            },
            {
                role: 'paste', label: i18n.__('Paste')
            },
            {
                role: 'delete', label: i18n.__('Delete')
            },
            {
                role: 'selectall', label: i18n.__('Select all')
            }
        ]
    },
    {
        label: i18n.__('View'),
        submenu: [
            {role: 'reload', label: i18n.__('Reload')},
         //   {role: 'forcereload'},
         //   {role: 'toggledevtools'},
            /*{
                role: 'resetzoom', label: i18n.__('Actual size')
            },
            {
                role: 'zoomin', label: i18n.__('Zoom in')
            },
            {
                role: 'zoomout', label: i18n.__('Zoom out')
            },
            {
                type: 'separator'
            },*/
            {
                role: 'togglefullscreen', label: i18n.__('Toggle fullscreen')
            }
        ]
    },
    {
        role: 'window', label: i18n.__('Window'),
        submenu: [
            {
                role: 'minimize', label: i18n.__('Minimize'),
                accelerator: 'CmdOrCtrl+M'
            },
            {
                role: 'close', label: i18n.__('Close'),
                accelerator: 'CmdOrCtrl+W'
            },
            {
                type: 'separator'
            },
            {
                label: i18n.__('Dashboard'),
                accelerator: 'CmdOrCtrl+0',
                click() {
                    let win = require('electron').BrowserWindow.getFocusedWindow();
                    //<debug>
                    console.debug(win);
                    //</debug>
                    if(win)
                    win.webContents.send('redirect-request', {token: 'dashboard'})
                }
            },
            {
                label: i18n.__('Partners'),
                accelerator: 'CmdOrCtrl+1',
                click() {
                    let win = require('electron').BrowserWindow.getFocusedWindow();
                    //<debug>
                    console.debug(win);
                    //</debug>
                    if(win)
                    win.webContents.send('redirect-request', {token: 'relations'})
                }
            },
            {
                label: i18n.__('Suppliers'),
                accelerator: 'CmdOrCtrl+2',
                click() {
                    let win = require('electron').BrowserWindow.getFocusedWindow();
                    //<debug>
                    console.debug(win);
                    //</debug>
                    if(win)
                    win.webContents.send('redirect-request', {token: 'suppliers'})
                }
            }
        ]
    },
    {
        role: 'help', label: i18n.__('Help'),
        submenu: [
            {
                label: i18n.__('Cooperativista Help'),
                click() {
                    let win = require('electron').BrowserWindow.getFocusedWindow();
                    //<debug>
                    console.debug(win);
                    //</debug>
                    if(win)
                        win.webContents.send('redirect-request', {token: 'faq'})
                }
            },
            {
                label: i18n.__('Learn more'),
                click() {
                    require('electron').shell.openExternal('https://pax17.github.io/cooperativista/')
                }
            }
        ]
    }
]
if(process.platform !== 'darwin'){
    template[2].submenu.push(
        {
            type: 'separator'
        },
        {
            label: i18n.__('Options') + " " + app.getName(),
            accelerator: 'CmdOrCtrl+Shift+O',
            click() {
                let win = require('electron').BrowserWindow.getFocusedWindow();
                //<debug>
                console.debug(win, win.id);
                //</debug>
                if(win)
                    win.webContents.send('redirect-request', {token: 'options'})
            }
        });
}
if (process.platform === 'darwin') {
    const name = app.getName()
    template.unshift({
        label: name,
        submenu: [
            {
                role: 'about', label: i18n.__('About') + " " + app.getName()
            },
            {
                type: 'separator'
            },
            {
                label: i18n.__('Options') + " " + app.getName(),
                accelerator: 'CmdOrCtrl+;',
                click() {
                    let win = require('electron').BrowserWindow.getFocusedWindow();
                    //<debug>
                    console.debug(win, win.id);
                    //</debug>
                    if(win)
                        win.webContents.send('redirect-request', {token: 'options'})
                }
            },
            {
                type: 'separator'
            },
            {
                role: 'services', label: i18n.__('Services'),
                submenu: []
            },
            {
                type: 'separator'
            },
            {
                role: 'hide', label: i18n.__('Hide') + " " + app.getName()
            },
            {
                role: 'hideothers', label: i18n.__('Hide others')
            },
            {
                role: 'unhide', label: i18n.__('Unhide')
            },
            {
                type: 'separator'
            },
            {
                role: 'quit', label: i18n.__('Quit') + " " + app.getName()
            }
        ]
    })
    /* template[1].submenu.push(
         {
             type: 'separator'
         },
         {
             label: i18n.__('Speech'),
             submenu: [
                 {
                     role: 'startspeaking', label: i18n.__('Start speaking')
                 },
                 {
                     role: 'stopspeaking', label: i18n.__('Stop speaking')
                 }
             ]
         }
     )*/
    template[3].submenu.push(
        {
            type: 'separator'
        },
        {
            label: i18n.__('Bring all to front'),
            role: 'front'
        }
    );
}

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)