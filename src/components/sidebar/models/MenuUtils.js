import { SideBarMenu } from './SideBarMenu';
import { SideBarMenuItem } from './SideBarMenuItem';

class MenuUtils {
    constructor() {
        this.menu = new SideBarMenu('MainMenu', 'MainMenu', [
            new SideBarMenuItem(
                'Dashboard',
                'Pages.Administration.Host.Dashboard',
                'fa fa-home',
                '/dashboard/hostdashboard'
            ),
            new SideBarMenuItem(
                'Dashboard',
                'Pages.Tenant.Dashboard',
                'fa fa-home',
                '/dashboard/tenantdashboard'
            ),
            new SideBarMenuItem(
                'Tenants',
                'Pages.Tenants',
                'fa fa-globe',
                '/admin/tenants'
            ),
            new SideBarMenuItem(
                'Editions',
                'Pages.Editions',
                'fa fa-bars',
                '/admin/editions'
            ),
            new SideBarMenuItem(
                'Administration',
                'Pages.Administration',
                'fa fa-wrench',
                '#',
                [
                    new SideBarMenuItem(
                        'OrganizationUnits',
                        'Pages.Administration.OrganizationUnits',
                        'fa fa-th',
                        '/admin/organization'
                    ),
                    new SideBarMenuItem(
                        'Roles',
                        'Pages.Administration.Roles',
                        'fa fa-briefcase',
                        '/admin/roles'
                    ),
                    new SideBarMenuItem(
                        'Users',
                        'Pages.Administration.Users',
                        'fa fa-group',
                        '/admin/users'
                    ),
                    new SideBarMenuItem(
                        'Languages',
                        'Pages.Administration.Languages',
                        'fa fa-flag',
                        '/admin/languages'
                    ),
                    new SideBarMenuItem(
                        'AuditLogs',
                        'Pages.Administration.AuditLogs',
                        'fa fa-lock',
                        '/admin/auditlogs'
                    ),
                    new SideBarMenuItem(
                        'Maintenance',
                        'Pages.Administration.Host.Maintenance',
                        'fa fa-wrench',
                        '/admin/maintenance'
                    ),
                    new SideBarMenuItem(
                        'Subscription',
                        'Pages.Administration.Tenant.SubscriptionManagement',
                        'fa fa-refresh',
                        '/admin/subscriptions'
                    ),
                    new SideBarMenuItem(
                        'Settings',
                        'Pages.Administration.Host.Settings',
                        'fa fa-cog',
                        '/admin/hostsettings'
                    ),
                    new SideBarMenuItem(
                        'Settings',
                        'Pages.Administration.Tenant.Settings',
                        'fa fa-cog',
                        '/admin/tenantsettings'
                    )
                ]
            )
            // ,
            // new SideBarMenuItem(
            //     'DemoUiComponents',
            //     'Pages.DemoUiComponents',
            //     'fa fa-puzzle-piece',
            //     '/app/admin/demo-ui-components'
            // )
        ]);

        abp.nav.menus = this.menu;
    }

    get getMenu() {
        return this.menu;
    }
}

export default new MenuUtils();
