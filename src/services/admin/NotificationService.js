import config from '../../common/config';
import AjaxHelper from '../../common/js/AjaxHelper';
class NotificationService {
    async getUserNotifications(input) {
        let url = `${config.remoteUrl}/api/services/app/Notification/GetUserNotifications`;
        var rs = await AjaxHelper.get(url, input);
        return rs.result;
    }

    async getNotificationSettings() {
        let url = `${config.remoteUrl}/api/services/app/Notification/GetNotificationSettings`;
        var rs = await AjaxHelper.get(url);
        return rs.result;
    }

    async setAllNotificationsAsRead() {
        let url = `${config.remoteUrl}/api/services/app/Notification/SetAllNotificationsAsRead`;
        var rs = await AjaxHelper.post(url);
        return rs;
    }

    async setNotificationAsRead(input) {
        let url = `${config.remoteUrl}/api/services/app/Notification/SetNotificationAsRead`;
        var rs = await AjaxHelper.post(url, input);
        return rs;
    }

    async updateNotificationSettings(input) {
        let url = `${config.remoteUrl}/api/services/app/Notification/UpdateNotificationSettings`;
        var rs = await AjaxHelper.put(url, input);
        return rs;
    }
}

export default new NotificationService();
