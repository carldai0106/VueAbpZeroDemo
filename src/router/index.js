/* eslint-disable import/first */

import Vue from 'vue';
import Router from 'vue-router';

// 导入其他路由分支
import account from './account';
import dashboard from './dashboard';
import admin from './admin';
import MenuUtils from '../components/sidebar/models/MenuUtils';
import store from '../store/index';
import * as types from '../store/mutation-types';
import AppAuthService from '../services/common/AppAuthService';

Vue.use(Router);

let router = new Router({
    routes: [
        {
            path: '/',
            redirect: '/dashboard/TenantDashboard'
            // redirect: 'account'
        },
        {
            path: '/temp',
            component: resolve => require(['../views/temp/login.vue'], resolve)
        },
        {
            path: '/temp/login3',
            component: resolve => require(['../views/temp/login3.vue'], resolve)
        },
        ...account,
        {
            path: '/',
            name: 'admin.layout',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../views/Layout.vue'));
                });
            },
            meta: {
                permission: 'Pages',
                requireAuthorized: true
            },
            children: [...dashboard, ...admin]
        }
    ],
    base: '/views/',
    mode: 'history'
});

function selectBestRoute() {
    if (abp.auth.isGranted('Pages.Administration.Host.Dashboard')) {
        return 'admin.hostdashboard';
    }

    if (abp.auth.isGranted('Pages.Tenant.Dashboard')) {
        return 'admin.tenantdashboard';
    }

    if (abp.auth.isGranted('Pages.Tenants')) {
        return 'admin.tenants';
    }

    if (abp.auth.isGranted('Pages.Administration.Users')) {
        return 'admin.users';
    }

    if (abp.session.userId == null) {
        AppAuthService.logout(false);
        return 'account.login';
    } else {
        return 'admin.notifications';
    }
}

function getSelectedMenu(to, menu) {
    var fullPath = to.fullPath.toLowerCase();
    var permission = to.meta.permission;

    if (menu.path) {
        var path = menu.path.toLowerCase();
        var permissionName = menu.permissionName;
        if (fullPath == path && permission == permissionName) {
            return menu;
        }
    }

    var rs = null;
    for (var item of menu.items) {
        rs = getSelectedMenu(to, item);
        if (rs) break;
    }

    return rs;
}

router.beforeEach((to, from, next) => {
    document.title = window.lang(to.meta.title);

    var selectedMenu = getSelectedMenu(to, MenuUtils.menu);
    if (selectedMenu) {
        var menu = selectedMenu;
        store.commit(types.IndexSetActiveMenu, {
            menu
        });
    }

    // 判断是否需要权限
    if (to.meta.requireAuthorized) {
        if (abp.session.userId == null) {
            next({
                name: 'account.login'
            });
        }

        if (abp.auth.isGranted(to.meta.permission)) {
            next();
        } else {
            // selectBestRoute();
            next({
                name: selectBestRoute()
            });
        }
    } else {
        next();
    }
});

router.beforeResolve((to, from, next) => {
    console.log('beforeResolve');
    next();
});

router.afterEach((to, from) => {
    console.log('afterEach');
});

export default router;
