Ext.define('Cooperativista.view.authentication.Login', {
    extend: 'Cooperativista.view.authentication.LockingWindow',
    xtype: 'login',

    requires: [
        'Cooperativista.view.authentication.Dialog',
        'Ext.container.Container',
        'Ext.form.field.Text',
        'Ext.form.field.Checkbox',
        'Ext.button.Button'
    ],
    title: 'Cooperativista',
    header: false,

   /* bind:{
        title: '<i class="fas fa-hand-spock fa-lg fontBold"></i> {appName} v.{appVersion}'
    },*/
    defaultFocus: 'authdialog', // Focus the Auth Form to force field focus as well

    items: [
        {
            xtype:'component',
            margin: 15,
            style: 'text-align: center;font-size: 1.8em;text-shadow: 1px 1px 10px #000;color:#fff;',
            bind:{
                html: '<div style="margin-bottom: 25px;"><i class="fas fa-hand-spock fa-2x"></i></div> <span style="text-transform: capitalize; font-weight: lighter;">{appName}</span> <small>v.{appVersion}</small>'
            }
        },
        {
            xtype: 'authdialog',
            defaultButton : 'loginButton',
            autoComplete: true,
            bodyPadding: '20 20',
            cls: 'auth-dialog-login',
            header: false,
            width: 280,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },

            defaults : {
                margin : '5 0'
            },

            items: [
                {
                    xtype: 'textfield',
                    cls: 'auth-textbox',
                    name: 'userid',
                    bind: '',
                    height: 55,
                    hideLabel: true,
                    allowBlank : false,
                    emptyText: 'Usuario',
                    triggers: {
                        glyphed: {
                            cls: 'trigger-glyph-noop auth-email-trigger'
                        }
                    }
                },
                {
                    xtype: 'textfield',
                    cls: 'auth-textbox',
                    height: 55,
                    hideLabel: true,
                    emptyText: 'Clave',
                    inputType: 'password',
                    name: 'password',
                    bind: '',
                    allowBlank : false,
                    triggers: {
                        glyphed: {
                            cls: 'trigger-glyph-noop auth-password-trigger'
                        }
                    }
                },
              /*  {
                    xtype: 'container',
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'checkboxfield',
                            flex : 1,
                            cls: 'form-panel-font-color rememberMeCheckbox',
                            height: 30,
                            bind: '',
                            boxLabel: 'Remember me'
                        },
                        {
                            xtype: 'box',
                            html: '<a href="#passwordreset" class="link-forgot-password"> Forgot Password ?</a>'
                        }
                    ]
                },*/
                {
                    xtype: 'button',
                    reference: 'loginButton',
                    scale: 'large',
                    ui: 'soft-green',
                    iconAlign: 'right',
                    iconCls: 'x-fa fa-angle-right',
                    text: 'Login',
                    formBind: true,
                    listeners: {
                        click: 'onLoginButton'
                    }
                }/*,
                {
                    xtype: 'box',
                    html: '<div class="outer-div"><div class="seperator">OR</div></div>',
                    margin: '10 0'
                },
                {
                    xtype: 'button',
                    scale: 'large',
                    ui: 'facebook',
                    iconAlign: 'right',
                    iconCls: 'x-fa fa-facebook',
                    text: 'Login with Facebook',
                    listeners: {
                        click: 'onFaceBookLogin'
                    }
                },
                {
                    xtype: 'box',
                    html: '<div class="outer-div"><div class="seperator">OR</div></div>',
                    margin: '10 0'
                },
                {
                    xtype: 'button',
                    scale: 'large',
                    ui: 'gray',
                    iconAlign: 'right',
                    iconCls: 'x-fa fa-user-plus',
                    text: 'Create Account',
                    listeners: {
                        click: 'onNewAccount'
                    }
                }*/
            ]
        }
    ],

    initComponent: function() {
        this.addCls('user-login-register-container');
        this.callParent(arguments);
    }
});
