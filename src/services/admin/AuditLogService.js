import config from '../../common/config';
import AjaxHelper from '../../common/js/AjaxHelper';
class AuditLogService {
    async getAuditLogs(fetchParam) {
        let url = `${config.remoteUrl}/api/services/app/AuditLog/GetAuditLogs`;
        var rs = await AjaxHelper.get(url, fetchParam);
        return rs;
    }
}

export default new AuditLogService();
