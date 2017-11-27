import config from '../../common/config';
import AjaxHelper from '../../common/js/AjaxHelper';
class TenantSettingsService {
    async getAllSettings() {
        let url = `${config.remoteUrl}/api/services/app/TenantSettings/GetAllSettings`;
        var rs = await AjaxHelper.get(url);
        return rs.result;
    }

    async updateAllSettings(input) {
        let url = `${config.remoteUrl}/api/services/app/TenantSettings/UpdateAllSettings`;
        var rs = await AjaxHelper.put(url, input);
        return rs;
    }

    async clearLogo() {
        let url = `${config.remoteUrl}/api/services/app/TenantSettings/ClearLogo`;
        var rs = await AjaxHelper.post(url);
        return rs;
    }

    async clearCustomCss() {
        let url = `${config.remoteUrl}/api/services/app/TenantSettings/ClearCustomCss`;
        var rs = await AjaxHelper.post(url);
        return rs;
    }

    async sendTestEmail(input) {
        let url = `${config.remoteUrl}/api/services/app/TenantSettings/SendTestEmail`;
        var rs = await AjaxHelper.post(url, input);
        return rs;
    }
}
export default new TenantSettingsService();
