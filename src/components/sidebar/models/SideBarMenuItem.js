export class SideBarMenuItem {
    name = '';
    permissionName = '';
    icon = '';
    path = '';
    items = [];

    constructor(name, permissionName, icon, path, siderBarMenuItems) {
        this.name = name;
        this.permissionName = permissionName;
        this.icon = icon;
        this.path = path;

        if (siderBarMenuItems === undefined) {
            this.items = [];
        } else {
            this.items = siderBarMenuItems;
        }
    }
}
