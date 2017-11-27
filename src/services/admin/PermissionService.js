import config from '../../common/config';
import AjaxHelper from '../../common/js/AjaxHelper';
class PermissionService {
    async getAllPermissions() {
        var url = `${config.remoteUrl}/api/services/app/Permission/GetAllPermissions`;
        var rs = await AjaxHelper.get(url);
        return rs.result;
    }
}

export default new PermissionService();
