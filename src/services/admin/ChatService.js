import config from '../../common/config';
import AjaxHelper from '../../common/js/AjaxHelper';
class ChatService {
    async getUserChatFriendsWithSettings() {
        let url = `${
            config.remoteUrl
        }/api/services/app/Chat/GetUserChatFriendsWithSettings`;

        var rs = await AjaxHelper.get(url);
        return rs.result;
    }

    async getUserChatMessages(tenantId, userId, minMessageId) {
        let url = `${
            config.remoteUrl
        }/api/services/app/Chat/GetUserChatMessages?`;

        if (tenantId !== undefined) {
            url += 'TenantId=' + encodeURIComponent('' + tenantId) + '&';
        }
        if (userId !== undefined) {
            url += 'UserId=' + encodeURIComponent('' + userId) + '&';
        }
        if (minMessageId !== undefined) {
            url +=
                'MinMessageId=' + encodeURIComponent('' + minMessageId) + '&';
        }
        url = url.replace(/[?&]$/, '');

        var rs = await AjaxHelper.get(url);
        return rs.result;
    }

    async markAllUnreadMessagesOfUserAsRead(input) {
        let url = `${
            config.remoteUrl
        }/api/services/app/Chat/MarkAllUnreadMessagesOfUserAsRead`;
        var rs = await AjaxHelper.post(url, input);
        return rs;
    }

    async findMessageAsync(input) {
        let url = `${config.remoteUrl}/api/services/app/Chat/FindMessageAsync`;
        var rs = await AjaxHelper.post(url, input);
        return rs.result;
    }
}

export default new ChatService();
