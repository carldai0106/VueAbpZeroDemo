import config from '../../common/config';
import AjaxHelper from '../../common/js/AjaxHelper';
class TimingService {
    async getTimezones(input) {
        let url = `${config.remoteUrl}/api/services/app/Timing/GetTimezones`;
        var rs = await AjaxHelper.get(url, input);
        return rs.result;
    }

    async getTimezoneComboboxItems(input) {
        let url = `${config.remoteUrl}/api/services/app/Timing/GetTimezoneComboboxItems`;
        var rs = await AjaxHelper.get(url, input);
        return rs.result;
    }
}
export default new TimingService();
