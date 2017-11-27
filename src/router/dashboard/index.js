/* eslint eol-last:0 */
export default [
    {
        path: '/dashboard/HostDashboard',
        name: 'admin.hostdashboard',
        component: resolve =>
            require(['../../views/dashboard/HostDashboard.vue'], resolve),
        meta: {
            permission: 'Pages.Administration.Host.Dashboard',
            requireAuthorized: true,
            title: 'Dashboard'
        }
    },
    {
        path: '/dashboard/TenantDashboard',
        name: 'admin.tenantdashboard',
        component: resolve =>
            require(['../../views/dashboard/TenantDashboard.vue'], resolve),
        meta: {
            permission: 'Pages.Tenant.Dashboard',
            requireAuthorized: true,
            title: 'Dashboard'
        }
    },
    {
        path: '/dashboard/notifications',
        name: 'admin.notifications',
        component: resolve =>
            require(['../../views/dashboard/Notifications.vue'], resolve),
        meta: {
            permission: '',
            requireAuthorized: false,
            title: 'Notifications'
        }
    }
];
