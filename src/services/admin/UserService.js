import config from '../../common/config';
import AjaxHelper from '../../common/js/AjaxHelper';
class UserService {
    async getUsers(input) {
        var url = `${config.remoteUrl}/api/services/app/User/GetUsers`;
        var rs = await AjaxHelper.get(url, input);
        return rs.result;
    }

    async getUserForEdit(input) {
        var url = `${config.remoteUrl}/api/services/app/User/GetUserForEdit`;
        var rs = await AjaxHelper.get(url, input);
        return rs.result;
    }

    async createOrUpdateUser(input) {
        var url = `${config.remoteUrl}/api/services/app/User/CreateOrUpdateUser`;
        var rs = await AjaxHelper.post(url, input);
        return rs.result;
    }

    async deleteUser(input) {
        var url = `${config.remoteUrl}/api/services/app/User/DeleteUser`;
        var rs = await AjaxHelper.delete(url, input);
        return rs;
    }

    async unlockUser(input) {
        var url = `${config.remoteUrl}/api/services/app/User/UnlockUser`;
        var rs = await AjaxHelper.post(url, input);
        return rs;
    }

    async getUserPermissionsForEdit(input) {
        var url = `${config.remoteUrl}/api/services/app/User/GetUserPermissionsForEdit`;
        var rs = await AjaxHelper.get(url, input);
        return rs.result;
    }

    async updateUserPermissions(input) {
        var url = `${config.remoteUrl}/api/services/app/User/UpdateUserPermissions`;
        var rs = await AjaxHelper.put(url, input);
        return rs;
    }

    async resetUserSpecificPermissions(input) {
        var url = `${config.remoteUrl}/api/services/app/User/ResetUserSpecificPermissions`;
        var rs = await AjaxHelper.post(url, input);
        return rs;
    }
}

export default new UserService();
