import config from '../../common/config';
import AjaxHelper from '../../common/js/AjaxHelper';
class UserLinkServcie {
    async linkToUser(input) {
        var url = `${config.remoteUrl}/api/services/app/UserLink/LinkToUser`;
        var rs = await AjaxHelper.post(url, input);
        return rs;
    }

    async getLinkedUsers(input) {
        var url = `${config.remoteUrl}/api/services/app/UserLink/GetLinkedUsers`;
        var rs = await AjaxHelper.get(url, input);
        return rs.result;
    }

    async getRecentlyUsedLinkedUsers() {
        var url = `${config.remoteUrl}/api/services/app/UserLink/GetRecentlyUsedLinkedUsers`;
        var rs = await AjaxHelper.get(url);
        return rs.result;
    }

    async unlinkUser(input) {
        var url = `${config.remoteUrl}/api/services/app/UserLink/UnlinkUser`;
        var rs = await AjaxHelper.post(url, input);
        return rs.result;
    }
}
export default new UserLinkServcie();
