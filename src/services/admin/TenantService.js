import config from '../../common/config';
import AjaxHelper from '../../common/js/AjaxHelper';
class TenantService {
    async getTenants(fetchParam) {
        let url = config.remoteUrl + '/api/services/app/Tenant/GetTenants';
        var rs = await AjaxHelper.get(url, fetchParam);
        return rs;
    }

    async getTenantForEdit(input) {
        let url = config.remoteUrl + '/api/services/app/Tenant/GetTenantForEdit';
        var rs = await AjaxHelper.get(url, input);
        return rs.result;
    }

    async updateTenant(input) {
        let url = config.remoteUrl + '/api/services/app/Tenant/UpdateTenant';
        var rs = await AjaxHelper.put(url, input);
        return rs.result;
    }

    async createTenant(input) {
        let url = config.remoteUrl + '/api/services/app/Tenant/CreateTenant';
        var rs = await AjaxHelper.post(url, input);
        return rs.result;
    }

    async unlockTenantAdmin(input) {
        let url = config.remoteUrl + '/api/services/app/Tenant/UnlockTenantAdmin';
        var rs = await AjaxHelper.post(url, input);
        return rs;
    }

    async deleteTenant(input) {
        let url = config.remoteUrl + '/api/services/app/Tenant/DeleteTenant';
        var rs = await AjaxHelper.delete(url, input);
        return rs;
    }

    async getTenantFeaturesForEdit(input) {
        let url = config.remoteUrl + '/api/services/app/Tenant/GetTenantFeaturesForEdit';
        var rs = await AjaxHelper.get(url, input);
        return rs.result;
    }

    async updateTenantFeatures(input) {
        let url = config.remoteUrl + '/api/services/app/Tenant/UpdateTenantFeatures';
        var rs = await AjaxHelper.put(url, input);
        return rs;
    }

    async resetTenantSpecificFeatures(input) {
        let url = config.remoteUrl + '/api/services/app/Tenant/ResetTenantSpecificFeatures';
        var rs = await AjaxHelper.post(url, input);
        return rs;
    }
}

export default new TenantService();
