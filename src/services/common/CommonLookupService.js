import config from '../../common/config';
import AjaxHelper from '../../common/js/AjaxHelper';
class CommonLookupService {
    async getEditionsForCombobox(input) {
        let url =
            config.remoteUrl +
            '/api/services/app/CommonLookup/GetEditionsForCombobox';
        var rs = await AjaxHelper.get(url, input);
        return rs.result;
    }

    async getDefaultEditionName() {
        let url =
            config.remoteUrl +
            '/api/services/app/CommonLookup/GetDefaultEditionName';
        var rs = await AjaxHelper.get(url);
        return rs.result;
    }

    async findUsers(input) {
        let url =
            config.remoteUrl +
            '/api/services/app/CommonLookup/FindUsers';
        var rs = await AjaxHelper.post(url, input);
        return rs.result;
    }
}

export default new CommonLookupService();
