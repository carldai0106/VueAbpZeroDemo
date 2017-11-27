import config from '../../common/config';
import AjaxHelper from '../../common/js/AjaxHelper';

class OrganizationUnitService {
    async getOrganizationUnits() {
        let url =
            config.remoteUrl +
            '/api/services/app/OrganizationUnit/GetOrganizationUnits';
        var rs = await AjaxHelper.get(url);
        return rs.result;
    }

    async getOrganizationUnitUsers(input) {
        let url =
            config.remoteUrl +
            '/api/services/app/OrganizationUnit/GetOrganizationUnitUsers';
        var rs = await AjaxHelper.get(url, input);
        return rs.result;
    }

    async createOrganizationUnit(input) {
        let url =
            config.remoteUrl +
            '/api/services/app/OrganizationUnit/CreateOrganizationUnit';
        var rs = await AjaxHelper.post(url, input);
        return rs.result;
    }

    async updateOrganizationUnit(input) {
        let url =
            config.remoteUrl +
            '/api/services/app/OrganizationUnit/UpdateOrganizationUnit';
        var rs = await AjaxHelper.put(url, input);
        return rs.result;
    }

    async moveOrganizationUnit(input) {
        let url =
            config.remoteUrl +
            '/api/services/app/OrganizationUnit/MoveOrganizationUnit';
        var rs = await AjaxHelper.post(url, input);
        return rs.result;
    }

    async deleteOrganizationUnit(input) {
        let url =
            config.remoteUrl +
            '/api/services/app/OrganizationUnit/DeleteOrganizationUnit';
        var rs = await AjaxHelper.delete(url, input);
        return rs;
    }

    async removeUserFromOrganizationUnit(input) {
        let url =
            config.remoteUrl +
            '/api/services/app/OrganizationUnit/RemoveUserFromOrganizationUnit';
        var rs = await AjaxHelper.delete(url, input);
        return rs;
    }

    async addUsersToOrganizationUnit(input) {
        let url =
            config.remoteUrl +
            '/api/services/app/OrganizationUnit/AddUsersToOrganizationUnit';
        var rs = await AjaxHelper.post(url, input);
        return rs;
    }

    async findUsers(input) {
        let url =
            config.remoteUrl + '/api/services/app/OrganizationUnit/FindUsers';
        var rs = await AjaxHelper.post(url, input);
        return rs.result;
    }
}

export default new OrganizationUnitService();
