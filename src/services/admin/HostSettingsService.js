import config from '../../common/config';
import AjaxHelper from '../../common/js/AjaxHelper';
class HostSettingsService {
    async getAllSettings() {
        let url = `${config.remoteUrl}/api/services/app/HostSettings/GetAllSettings`;
        var rs = await AjaxHelper.get(url);
        return rs.result;
    }

    async updateAllSettings(input) {
        let url = `${config.remoteUrl}/api/services/app/HostSettings/UpdateAllSettings`;
        var rs = await AjaxHelper.put(url, input);
        return rs;
    }

    async sendTestEmail(input) {
        let url = `${config.remoteUrl}/api/services/app/HostSettings/SendTestEmail`;
        var rs = await AjaxHelper.post(url, input);
        return rs;
    }
}
export default new HostSettingsService();
