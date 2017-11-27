import config from '../../common/config';
import AjaxHelper from '../../common/js/AjaxHelper';
class TenantRegisterService {
    async registerTenant(input) {
        let url = `${config.remoteUrl}/api/services/app/TenantRegistration/RegisterTenant`;
        var rs = await AjaxHelper.post(url, input);
        return rs.result;
    }

    async getEditionsForSelect() {
        let url = `${config.remoteUrl}/api/services/app/TenantRegistration/GetEditionsForSelect`;
        var rs = await AjaxHelper.get(url);
        return rs.result;
    }

    async getEdition(input) {
        let url = `${config.remoteUrl}/api/services/app/TenantRegistration/GetEdition`;
        var rs = await AjaxHelper.get(url, input);
        return rs.result;
    }
}
export default new TenantRegisterService();
