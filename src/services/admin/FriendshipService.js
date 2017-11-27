import config from '../../common/config';
import AjaxHelper from '../../common/js/AjaxHelper';
class FriendshipService {
    async createFriendshipRequest(input) {
        let url = `${
            config.remoteUrl
        }/api/services/app/Friendship/CreateFriendshipRequest`;
        var rs = await AjaxHelper.post(url, input);
        return rs.result;
    }

    async createFriendshipRequestByUserName(input) {
        let url = `${
            config.remoteUrl
        }/api/services/app/Friendship/CreateFriendshipRequestByUserName`;
        var rs = await AjaxHelper.post(url, input);
        return rs.result;
    }

    async blockUser(input) {
        let url = `${config.remoteUrl}/api/services/app/Friendship/BlockUser`;
        var rs = await AjaxHelper.post(url, input);
        return rs;
    }

    async unblockUser(input) {
        let url = `${config.remoteUrl}/api/services/app/Friendship/UnblockUser`;
        var rs = await AjaxHelper.post(url, input);
        return rs;
    }

    async acceptFriendshipRequest(input) {
        let url = `${
            config.remoteUrl
        }/api/services/app/Friendship/AcceptFriendshipRequest`;
        var rs = await AjaxHelper.post(url, input);
        return rs;
    }
}

export default new FriendshipService();
