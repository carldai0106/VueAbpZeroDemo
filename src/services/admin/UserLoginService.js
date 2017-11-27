import config from '../../common/config';
import AjaxHelper from '../../common/js/AjaxHelper';
class UserLoginService {
    async getRecentUserLoginAttempts(input) {
        var url = `${config.remoteUrl}/api/services/app/UserLogin/GetRecentUserLoginAttempts`;
        var rs = await AjaxHelper.get(url, input);
        return rs.result;
    }
}
export default new UserLoginService();
