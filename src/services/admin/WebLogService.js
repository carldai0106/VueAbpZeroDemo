import config from '../../common/config';
import AjaxHelper from '../../common/js/AjaxHelper';
class WebLogService {
    async getLatestWebLogs() {
        let url = `${config.remoteUrl}/api/services/app/WebLog/GetLatestWebLogs`;
        var rs = await AjaxHelper.get(url);
        return rs.result;
    }

    async downloadWebLogs() {
        let url = `${config.remoteUrl}/api/services/app/WebLog/DownloadWebLogs`;
        var rs = await AjaxHelper.post(url);
        return rs.result;
    }
}

export default new WebLogService();
