import * as moment from 'moment';
import NotificationService from '../../services/admin/NotificationService';

class UserNotificationHelper {
    getUrl(userNotification) {
        switch (userNotification.notification.notificationName) {
            case 'App.NewUserRegistered':
                return (
                    '/app/admin/users?filterText=' +
                    userNotification.notification.data.properties.emailAddress
                );
            case 'App.NewTenantRegistered':
                return (
                    '/app/admin/tenants?filterText=' +
                    userNotification.notification.data.properties.tenancyName
                );
            // Add your custom notification names to navigate to a URL when user clicks to a notification.
        }

        // No url for this notification
        return '';
    }

    /* PUBLIC functions ******************************************/

    getUiIconBySeverity(severity) {
        switch (severity) {
            case abp.notifications.severity.SUCCESS:
                return 'fa fa-check';
            case abp.notifications.severity.WARN:
                return 'fa fa-warning';
            case abp.notifications.severity.ERROR:
                return 'fa fa-bolt';
            case abp.notifications.severity.FATAL:
                return 'fa fa-bomb';
            case abp.notifications.severity.INFO:
            default:
                return 'fa fa-info';
        }
    }

    format(userNotification, truncateText) {
        let formatted = {
            userNotificationId: userNotification.id,
            text: abp.notifications.getFormattedMessageFromUserNotification(
                userNotification
            ),
            time: moment(userNotification.notification.creationTime).format(
                'YYYY-MM-DD HH:mm:ss'
            ),
            creationTime: userNotification.notification.creationTime,
            icon: this.getUiIconBySeverity(
                userNotification.notification.severity
            ),
            state: abp.notifications.getUserNotificationStateAsString(
                userNotification.state
            ),
            data: userNotification.notification.data,
            url: this.getUrl(userNotification),
            isUnread:
                userNotification.state ===
                abp.notifications.userNotificationState.UNREAD
        };

        if (truncateText || truncateText === undefined) {
            formatted.text = abp.utils.truncateStringWithPostfix(
                formatted.text,
                100
            );
        }

        return formatted;
    }

    show(userNotification) {
        // Application notification
        abp.notifications.showUiNotifyForUserNotification(userNotification, {
            onclick: () => {
                // Take action when user clicks to live toastr notification
                let url = this.getUrl(userNotification);
                if (url) {
                    location.href = url;
                }
            }
        });

        // Desktop notification
        // Push.create('AbpZeroTemplate', {
        //     body: this.format(userNotification).text,
        //     icon: abp.appPath + 'assets/common/images/app-logo-small.png',
        //     timeout: 6000,
        //     onClick: function() {
        //         window.focus();
        //         this.close();
        //     }
        // });
    }

    async setAllAsRead(callback) {
        await NotificationService.setAllNotificationsAsRead();
        abp.event.trigger('app.notifications.refresh');
        if (callback) {
            callback();
        }
    }

    async setAsRead(userNotificationId, callback) {
        const input = {};
        input.id = userNotificationId;
        await NotificationService.setNotificationAsRead(input);
        abp.event.trigger('app.notifications.read', userNotificationId);
        if (callback) {
            callback(userNotificationId);
        }
    }
}

export default new UserNotificationHelper();
