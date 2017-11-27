export class SideBarMenu {
    name = '';
    displayName = '';
    items = [];

    constructor(name, displayName, siderBarMenuItems) {
        this.name = name;
        this.displayName = displayName;
        this.items = siderBarMenuItems;
    }
}
