export default [
    {
        name: 'admin.editions',
        path: '/admin/editions',
        component: resolve =>
            require(['../../views/admin/edition/editions.vue'], resolve),
        meta: {
            permission: 'Pages.Editions',
            requireAuthorized: true,
            title: 'Editions'
        }
    },
    {
        name: 'admin.tenants',
        path: '/admin/tenants',
        component: resolve =>
            require(['../../views/admin/tenant/tenants.vue'], resolve),
        meta: {
            permission: 'Pages.Tenants',
            requireAuthorized: true,
            title: 'Tenants'
        }
    },
    {
        name: 'admin.auditlogs',
        path: '/admin/auditlogs',
        component: resolve =>
            require(['../../views/admin/auditlog/auditlogs.vue'], resolve),
        meta: {
            permission: 'Pages.Administration.AuditLogs',
            requireAuthorized: true,
            title: 'AuditLogs'
        }
    },
    {
        name: 'admin.languages',
        path: '/admin/languages',
        component: resolve =>
            require(['../../views/admin/language/languages.vue'], resolve),
        meta: {
            permission: 'Pages.Administration.Languages',
            requireAuthorized: true,
            title: 'Languages'
        }
    },
    {
        name: 'admin.languages.texts',
        path: '/admin/languages/:name/texts',
        component: resolve =>
            require(['../../views/admin/language/LanguageTexts.vue'], resolve),
        meta: {
            permission: 'Pages.Administration.Languages.ChangeTexts',
            requireAuthorized: true,
            title: 'LanguageTexts'
        }
    },
    {
        name: 'admin.organization',
        path: '/admin/organization',
        component: resolve =>
            require([
                '../../views/admin/organization/organization.vue'
            ], resolve),
        meta: {
            permission: 'Pages.Administration.OrganizationUnits',
            requireAuthorized: true,
            title: 'Organization'
        }
    },
    {
        name: 'admin.roles',
        path: '/admin/roles',
        component: resolve =>
            require(['../../views/admin/role/roles.vue'], resolve),
        meta: {
            permission: 'Pages.Administration.Roles',
            requireAuthorized: true,
            title: 'Roles'
        }
    },
    {
        name: 'admin.users',
        path: '/admin/users',
        component: resolve =>
            require(['../../views/admin/user/users.vue'], resolve),
        meta: {
            permission: 'Pages.Administration.Users',
            requireAuthorized: true,
            title: 'Users'
        }
    },
    {
        name: 'admin.hostsettings',
        path: '/admin/hostsettings',
        component: resolve =>
            require(['../../views/admin/settings/hostsettings.vue'], resolve),
        meta: {
            permission: 'Pages.Administration.Host.Settings',
            requireAuthorized: true,
            title: 'HostSettings'
        }
    },
    {
        name: 'admin.maintenance',
        path: '/admin/maintenance',
        component: resolve =>
            require(['../../views/admin/maintenance/maintenance.vue'], resolve),
        meta: {
            permission: 'Pages.Administration.Host.Maintenance',
            requireAuthorized: true,
            title: 'Mainteance'
        }
    },
    {
        name: 'admin.tenantsettings',
        path: '/admin/tenantsettings',
        component: resolve =>
            require(['../../views/admin/settings/tenantsettings.vue'], resolve),
        meta: {
            permission: 'Pages.Administration.Tenant.Settings',
            requireAuthorized: true,
            title: 'TenantSettings'
        }
    },
    {
        name: 'admin.subscriptions',
        path: '/admin/subscriptions',
        component: resolve =>
            require(['../../views/admin/subscription/subscriptions.vue'], resolve),
        meta: {
            permission: 'Pages.Administration.Tenant.SubscriptionManagement',
            requireAuthorized: true,
            title: 'Subscriptions'
        }
    }
];
