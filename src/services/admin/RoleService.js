import config from '../../common/config';
import AjaxHelper from '../../common/js/AjaxHelper';

class RoleService {
    async getRoles(permission) {
        var url = `${config.remoteUrl}/api/services/app/Role/GetRoles`;
        var rs = await AjaxHelper.get(url, permission);
        return rs.result;
    }

    async getRoleForEdit(input) {
        var url = `${config.remoteUrl}/api/services/app/Role/GetRoleForEdit`;
        var rs = await AjaxHelper.get(url, input);
        return rs.result;
    }

    async createOrUpdateRole(input) {
        var url = `${config.remoteUrl}/api/services/app/Role/CreateOrUpdateRole`;
        var rs = await AjaxHelper.post(url, input);
        return rs;
    }

    async deleteRole(input) {
        var url = `${config.remoteUrl}/api/services/app/Role/DeleteRole`;
        var rs = await AjaxHelper.delete(url, input);
        return rs;
    }
}

export default new RoleService();
