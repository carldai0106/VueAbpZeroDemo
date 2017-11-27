/* eslint eol-last:0 */
export default [
    {
        path: '/lifecycle',
        name: 'lifecycle',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('../../views/account/lifecycle.vue'));
            });
        },
        meta: {
            requireAuthorized: false,
            title: 'Lifecycle'
        }
    },
    {
        path: '/transfer',
        name: 'transfer',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('../../views/account/transfer.vue'));
            });
        },
        meta: {
            requireAuthorized: false,
            title: 'Transfer'
        }
    },
    {
        path: '/account',
        component: resolve => {
            require.ensure([], () => {
                resolve(require('../../views/account/Index.vue'));
            });
        },
        meta: {
            requireAuthorized: false
        },
        children: [
            {
                path: '',
                redirect: 'login'
            },
            {
                path: 'login',
                name: 'account.login',
                component: resolve =>
                    require(['../../views/account/login/Login.vue'], resolve),
                meta: {
                    requireAuthorized: false,
                    title: 'Login'
                }
            },
            {
                path: 'EmailActivation',
                name: 'account.emailactivation',
                component: resolve =>
                    require([
                        '../../views/account/email/EmailActivation.vue'
                    ], resolve),
                meta: {
                    requireAuthorized: false,
                    title: 'EmailActivation'
                }
            },
            {
                path: 'ForgotPassword',
                name: 'account.forgotpassword',
                component: resolve => {
                    require.ensure([], () => {
                        resolve(
                            require('../../views/account/password/ForgotPassword.vue')
                        );
                    });
                },
                meta: {
                    requireAuthorized: false,
                    title: 'ForgotPassword'
                }
            },
            {
                path: 'ResetPassword',
                name: 'account.resetpassword',
                component: resolve => {
                    require.ensure([], () => {
                        resolve(
                            require('../../views/account/password/ResetPassword.vue')
                        );
                    });
                },
                meta: {
                    requireAuthorized: false,
                    title: 'ChangedPassword'
                }
            },
            {
                path: 'SendTwoFactorCode',
                name: 'account.sendtwofactorcode',
                component: resolve =>
                    require([
                        '../../views/account/login/SendTwoFactorCode.vue'
                    ], resolve),
                meta: {
                    requireAuthorized: false,
                    title: 'SendTwoFactorCode'
                }
            },
            {
                path: 'ValidateTwoFactorCode',
                name: 'account.validatetwofactorcode',
                component: resolve =>
                    require([
                        '../../views/account/login/ValidateTwoFactorCode.vue'
                    ], resolve),
                meta: {
                    requireAuthorized: false,
                    title: 'ValidateTwoFactorCode'
                }
            },
            {
                path: 'SelectEdition',
                name: 'account.selectedition',
                component: resolve =>
                    require([
                        '../../views/account/register/SelectEdition.vue'
                    ], resolve),
                meta: {
                    requireAuthorized: false,
                    title: 'SelectEdition'
                }
            },
            {
                path: 'Upgrade',
                name: 'account.upgrade',
                component: resolve =>
                    require([
                        '../../views/account/payment/UpgradeOrExtend.vue'
                    ], resolve),
                meta: {
                    requireAuthorized: false,
                    title: 'Upgrade'
                }
            },
            {
                path: 'Extend',
                name: 'account.extend',
                component: resolve =>
                    require([
                        '../../views/account/payment/UpgradeOrExtend.vue'
                    ], resolve),
                meta: {
                    requireAuthorized: false,
                    title: 'Extend'
                }
            },
            {
                path: 'Buy',
                name: 'account.buy',
                component: resolve =>
                    require(['../../views/account/payment/Buy.vue'], resolve),
                meta: {
                    requireAuthorized: false,
                    title: 'Buy'
                }
            },
            {
                path: 'RegisterTenantResult',
                name: 'account.registertenantresult',
                component: resolve =>
                    require([
                        '../../views/account/register/RegisterTenantResult.vue'
                    ], resolve),
                meta: {
                    requireAuthorized: false,
                    title: 'RegisterTenantResult'
                }
            }
        ]
    }
];
