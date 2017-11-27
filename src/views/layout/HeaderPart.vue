<template>
    <section v-if="application">
        <!-- Logo -->
        <a href="#" class="logo">
            <!-- mini logo for sidebar mini 50x50 pixels -->
            <div class="logo-mini-d">
                <div class="span-icon">
                    <span class="left-top"></span>
                    <span class="right-top"></span>
                    <span class="left-btm"></span>
                    <span class="right-btm"></span>
                    <div class="clearfix"></div>
                </div>
            </div>
            <!-- logo for regular state and mobile devices -->
            <div class="logo-lg">
                <div class="logo-text">
                    MY
                    <b>Admin</b>
                </div>
            </div>
        </a>

        <!-- Header Navbar -->
        <nav class="navbar navbar-static-top f16" role="navigation">
            <!-- Sidebar toggle button-->
            <a href="#" class="sidebar-toggle" data-toggle="push-menu" role="button">
                <span class="sr-only">Toggle navigation</span>
            </a>
            <!-- Navbar Right Menu -->
            <div class="navbar-custom-menu">
                <ul class="nav navbar-nav">
                    <!-- Messages: style can be found in dropdown.less-->
                    <li class="dropdown notifications-menu">
                        <!-- Menu toggle button -->
                        <a href="#" class="dropdown-toggle " data-toggle="dropdown">
                            <i :class="currentLanguage.icon|flag"></i>
                            <span>{{currentLanguage.displayName}}</span>
                            <i class="fa fa-angle-down"></i>
                        </a>
                        <ul class="dropdown-menu">
                            <li>
                                <ul class="menu language-menu">
                                    <li v-for="(language, index) of languages" :key="index">
                                        <a href="javascript:;" @click="changeLanguage(language.name)">
                                            <i :class="language.icon|flag"></i> {{language.displayName}}
                                        </a>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                    <!-- /.messages-menu -->

                    <!-- Notifications Menu -->
                    <li class="dropdown notifications-menu">
                        <a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
                            <i class="fa fa-bell-o"></i>
                            <span class="label label-danger" v-if="unreadNotificationCount"> {{unreadNotificationCount}} </span>
                        </a>
                        <ul class="dropdown-menu" id="UserNotificationDropdown">
                            <li class="user-header">
                                <div class="text-left">
                                    <a href="#" @click.stop.prevent="setAllNotificationsAsRead" v-if="unreadNotificationCount">{{L("SetAllAsRead")}}</a>
                                    <a href="#" class="pull-right" @click.stop.prevent="openNotificationSettingsModal">{{L("Settings")}}</a>
                                    <div class="clearfix"></div>
                                </div>
                            </li>
                            <li>
                                <ul v-for="(notification, index) of notifications" :key="index" class="menu dropdown-menu-list">
                                    <li class="bg-gray-light">
                                        <a @click="gotoUrl(notification.url)" class="user-notification-item" :class="{'user-notification-item-unread': notification.state=='UNREAD', 'user-notification-item-clickable': notification.url}">
                                            <span class="details">
                                                <i :class="notification.icon"></i> {{notification.text}}
                                            </span>
                                            <div>
                                                <span class="notification-time">{{fromNow(notification.time)}}</span>
                                                <span v-if="notification.state=='UNREAD'"> -
                                                    <span class="set-as-read-text" @click="setNotificationAsRead(notification)">{{L("SetAsRead")}}</span>
                                                </span>
                                            </div>
                                        </a>
                                    </li>
                                </ul>
                                <div class="notification-empty-text" v-if="notifications && !notifications.length">
                                    {{L("ThereIsNoNotification")}}
                                </div>
                            </li>
                            <li class="notifications-footer" v-if="notifications && notifications.length">
                                <router-link to="/dashboard/notifications">{{L("SeeAllNotifications")}}</router-link>
                            </li>
                        </ul>

                    </li>

                    <!-- User Account Menu -->
                    <li class="dropdown user user-menu">
                        <!-- Menu Toggle Button -->
                        <a href="#" class="dropdown-toggle user-link" data-toggle="dropdown">
                            <span class="hidden-xs">
                                <i v-if="isImpersonatedLogin" class="ion-ios-undo-outline"></i>
                                <!-- hidden-xs hides the username on small devices so only the image appears. -->
                                <span class="username-info">{{shownLoginName}}</span>
                            </span>
                            <!-- The user image in the navbar-->
                            <img v-if="!profilePicture" src="../../vendor/AdminLTE/img/user2-160x160.jpg" class="user-image">
                            <img v-else :src="profilePicture" class="user-image">
                        </a>
                        <ul class="dropdown-menu">
                            <!-- The user image in the menu -->
                            <li class="user-header">
                                <img v-if="!profilePicture" src="../../vendor/AdminLTE/img/user2-160x160.jpg" class="img-circle">
                                <img v-else :src="profilePicture" class="img-circle">
                                <p v-if="user">
                                    {{user.name + ' ' + user.surname}}
                                    <small>{{user.emailAddress}}</small>
                                </p>
                            </li>
                            <li>
                                <ul class="my-menu">
                                    <li v-if="isImpersonatedLogin">
                                        <a @click="backToMyAccount()">
                                            <i class="ion-ios-undo-outline"></i>
                                            <strong>{{L("BackToMyAccount")}}</strong>
                                        </a>
                                    </li>
                                    <li v-if="isImpersonatedLogin" class="divider"></li>
                                    <li class="dropdown-submenu">
                                        <a class="open-left">
                                            <i class="fa fa-link fa-fw"></i> {{L("LinkedAccounts")}}
                                        </a>
                                        <ul v-if="recentlyLinkedUsers" id="RecentlyUsedLinkedUsers" class="dropdown-menu open-right">
                                            <li v-for="(linkedUser, index) of recentlyLinkedUsers" :key="index">
                                                <a @click="switchToLinkedUser(linkedUser)" class="recently-linked-user">
                                                    <i class="fa fa-user-circle-o"></i> {{getShownUserName(linkedUser)}}
                                                </a>
                                            </li>
                                            <li>
                                                <a @click="showLinkedAccounts()">
                                                    <i class="fa fa-cog"></i> {{L("ManageAccounts")}}
                                                </a>
                                            </li>
                                        </ul>
                                    </li>
                                    <li>
                                        <a id="UserProfileChangePasswordLink" @click="changePassword()">
                                            <i class="fa fa-key fa-fw"></i> {{L("ChangePassword")}}</a>
                                    </li>
                                    <li>
                                        <a id="ShowLoginAttemptsLink" @click="showLoginAttempts()">
                                            <i class="fa fa-file-text-o fa-fw"></i> {{L("LoginAttempts")}}</a>
                                    </li>
                                    <li>
                                        <a id="UserProfileChangePictureLink" @click="changeProfilePicture()">
                                            <i class="fa fa-user-o fa-fw"></i> {{L("ChangeProfilePicture")}}</a>
                                    </li>
                                    <li>
                                        <a id="UserProfileMySettingsLink" @click="changeMySettings()">
                                            <i class="fa fa-cog fa-fw"></i> {{L("MySettings")}}</a>
                                    </li>
                                    <li class="divider"></li>
                                    <li>
                                        <a href="javascript:;" @click="signOut()">
                                            <i class="fa fa-sign-out fa-fw"></i> {{L("Logout")}}</a>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </li>

                    <li v-if="chatEnabled && !chatConnected" class="dropdown">
                        <a href="javascript:;" class="dropdown-toggle">
                            <el-tooltip v-if="!chatConnected" class="item" effect="dark" :content="L('ChatIsConnecting')" placement="bottom">
                                <i class="fa fa-spinner fa-spin"></i>
                            </el-tooltip>
                        </a>
                    </li>

                    <!-- Control Sidebar Toggle Button -->
                    <li v-if="chatEnabled && chatConnected">
                        <a href="#" data-toggle="control-sidebar" class="chat-sidebar-toggler">
                            <i class="fa fa-comments-o"></i>
                            <span class="label label-danger" v-if="unreadChatMessageCount"> {{unreadChatMessageCount}} </span>
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
        <div v-if="subscriptionStatusBarVisible()" class="subscriptions-info">
            <div class="alert alert-info">
                <span v-if="tenant.isInTrialPeriod && !subscriptionIsExpiringSoon()" v-html="getTrialSubscriptionNotification()"></span>
                <a v-if="subscriptionIsExpiringSoon()" href="/views/admin/subscriptions">
                    <span v-if="subscriptionIsExpiringSoon() && tenant.isInTrialPeriod">
                        <i class="fa fa-exclamation-circle"></i> {{getExpireNotification("TrialExpireNotification")}}</span>
                    <span v-if="subscriptionIsExpiringSoon() && !tenant.isInTrialPeriod">
                        <i class="fa fa-exclamation-circle"></i> {{getExpireNotification("SubscriptionExpireNotification")}}</span>
                </a>
            </div>

        </div>

        <ChangePasswordModal :display.sync="changePasswordModal.display"></ChangePasswordModal>
        <LoginAttemptsModal :display.sync="loginAttemptsModal.display"></LoginAttemptsModal>
        <ChangeProfilePictureModal :display.sync="changeProfilePictureModal.display"></ChangeProfilePictureModal>
        <MySettingsModal :display.sync="mySettingsModal.display" :onSave="()=> onMySettingsModalSaved()"></MySettingsModal>
        <LinkeAccountsModal :display.sync="linkeAccountsModal.display" :onSave="() => getRecentlyLinkedUsers()"></LinkeAccountsModal>
        <NotificationSettingsModal :display.sync="notificationSettingsModal.display"></NotificationSettingsModal>
    </section>
</template>

<script type="text/ecmascript-6">
import * as _ from 'lodash';
import * as moment from 'moment';
import config from '../../common/config';
import types from '../../common/types';
import AppAuthService from '../../services/common/AppAuthService';
import AbpSession from '../../services/common/AbpSession';
import SessionService from '../../services/common/SessionService';
import LocalizationService from '../../services/common/LocalizationService';
import ProfileService from '../../services/admin/ProfileService';
import UserLinkService from '../../services/admin/UserLinkService';
import ImpersonationService from '../../services/account/ImpersonationService';
import AccountService from '../../services/account/AccountService';
import AppUrlService from '../../services/common/AppUrlService';
import ChangePasswordModal from './profile/ChangePasswordModal';
import LoginAttemptsModal from './others/LoginAttemptsModal';
import ChangeProfilePictureModal from './profile/ChangeProfilePictureModal';
import MySettingsModal from './profile/MySettingsModal';
import LinkeAccountsModal from './others/LinkedAccountsModal';
import NotificationService from '../../services/admin/NotificationService';
import UserNotificationHelper from './UserNotificationHelper';
import NotificationSettingsModal from './others/NotificationSettingsModal';

export default {
    data() {
        return {
            multiTenancySideIsTenant: false,
            languages: null,
            currentLanguage: null,
            isImpersonatedLogin: false,
            shownLoginNameTitle: null,
            shownLoginName: null,
            tenant: null,
            application: null,
            user: null,
            profilePicture: null,
            recentlyLinkedUsers: null,
            unreadChatMessageCount: 0,
            unreadNotificationCount: 0,
            notifications: null,
            chatConnected: false,
            fetchMessage: {
                State: null,
                MaxResultCount: 0,
                SkipCount: 0
            },
            changePasswordModal: {
                display: false
            },
            loginAttemptsModal: {
                display: false
            },
            changeProfilePictureModal: {
                display: false
            },
            mySettingsModal: {
                display: false
            },
            linkeAccountsModal: {
                display: false
            },
            notificationSettingsModal: {
                display: false
            }
        };
    },
    created() {
        this.multiTenancySideIsTenant = AbpSession.TentantId > 0;

        this.languages = _.filter(
            LocalizationService.languages,
            x => x.isDisabled === false
        );

        this.currentLanguage = LocalizationService.currentLanguage;
        this.isImpersonatedLogin = AbpSession.ImpersonatorUserId > 0;
        this.registerToEvents();
        Promise.all([
            this.getCurrentLoginInformations(),
            this.getProfilePicture(),
            this.getRecentlyLinkedUsers(),
            this.loadNotifications()
        ]).then(() => {});
    },
    mounted() {
        this.$nextTick(() => {
            this.tagIsReady('.language-menu', () => {
                $('.language-menu').slimScroll({
                    height: '200px'
                });
            });
        });
    },
    computed: {
        chatEnabled() {
            return (
                this.application.features['SignalR'] &&
                (!AbpSession.TentantId ||
                    abp.features.isEnabled('App.ChatFeature'))
            );
        }
    },
    methods: {
        registerToEvents() {
            abp.event.on('profilePictureChanged', async () => {
                await this.getProfilePicture();
            });

            abp.event.on('app.chat.unreadMessageCountChanged', messageCount => {
                this.unreadChatMessageCount = messageCount;
            });

            abp.event.on('app.chat.connected', () => {
                this.chatConnected = true;
            });

            abp.event.on(
                'abp.notifications.received',
                async userNotification => {
                    UserNotificationHelper.show(userNotification);
                    await this.loadNotifications();
                }
            );

            abp.event.on('app.notifications.refresh', async () => {
                await this.loadNotifications();
            });

            abp.event.on('app.notifications.read', userNotificationId => {
                for (let i = 0; i < this.notifications.length; i++) {
                    if (
                        this.notifications[i].userNotificationId ===
                        userNotificationId
                    ) {
                        this.notifications[i].state = 'READ';
                    }
                }

                this.unreadNotificationCount -= 1;
            });
        },
        async setAllNotificationsAsRead() {
            await UserNotificationHelper.setAllAsRead();
        },
        openNotificationSettingsModal() {
            this.notificationSettingsModal.display = true;
        },
        async setNotificationAsRead(userNotification) {
            await UserNotificationHelper.setAsRead(
                userNotification.userNotificationId
            );
        },
        gotoUrl(url) {
            if (url) {
                location.href = url;
            }
        },
        async loadNotifications() {
            this.fetchMessage.MaxResultCount = 3;
            var result = await NotificationService.getUserNotifications(
                this.fetchMessage
            );
            this.unreadNotificationCount = result.unreadCount;
            this.notifications = [];
            $.each(result.items, (index, item) => {
                this.notifications.push(UserNotificationHelper.format(item));
            });
        },
        async getCurrentLoginInformations() {
            this.shownLoginName = await SessionService.getShownLoginName();
            var result = await SessionService.getCurrentLoginInformations();
            this.tenant = result.tenant;
            this.user = result.user;
            this.application = result.application;
            console.log(result);
        },
        async getProfilePicture() {
            var result = await ProfileService.getProfilePicture();
            if (result && result.profilePicture) {
                this.profilePicture =
                    'data:image/jpeg;base64,' + result.profilePicture;
            }
        },
        async getRecentlyLinkedUsers() {
            var result = await UserLinkService.getRecentlyUsedLinkedUsers();
            this.recentlyLinkedUsers = result.items;
        },
        signOut() {
            AppAuthService.logout();
        },
        async backToMyAccount() {
            await ImpersonationService.backToImpersonator();
        },
        async switchToLinkedUser(linkedUser) {
            const input = {};
            input.targetUserId = linkedUser.id;
            input.targetTenantId = linkedUser.tenantId;

            try {
                var result = await AccountService.switchToLinkedAccount(input);
                AppAuthService.logout(false);

                let targetUrl =
                    AppUrlService.getAppRootUrlOfTenant(result.tenancyName) +
                    config.signInAsSomeoneUrlSegment +
                    '?switchAccountToken=' +
                    result.switchAccountToken;
                if (input.targetTenantId) {
                    targetUrl = targetUrl + '&tenantId=' + input.targetTenantId;
                }

                location.href = targetUrl;
            } catch (e) {
                throw e;
            }
        },
        getShownUserName(linkedUser) {
            if (!abp.multiTenancy.isEnabled) {
                return linkedUser.username;
            }

            return (
                (linkedUser.tenantId ? linkedUser.tenancyName : '.') +
                '\\' +
                linkedUser.username
            );
        },
        showLinkedAccounts() {
            this.linkeAccountsModal.display = true;
        },
        changePassword() {
            this.changePasswordModal.display = true;
        },
        showLoginAttempts() {
            this.loginAttemptsModal.display = true;
        },
        changeProfilePicture() {
            this.changeProfilePictureModal.display = true;
        },
        changeMySettings() {
            this.mySettingsModal.display = true;
        },
        async onMySettingsModalSaved() {
            this.shownLoginName = await SessionService.getShownLoginName();
            var result = await SessionService.getCurrentLoginInformations();
            this.tenant = result.tenant;
            this.user = result.user;
        },
        changeLanguage(languageName) {
            const input = {};
            input.languageName = languageName;

            ProfileService.changeLanguage(input).then(() => {
                abp.utils.setCookieValue(
                    'Abp.Localization.CultureName',
                    languageName,
                    new Date(new Date().getTime() + 5 * 365 * 86400000),
                    abp.appPath
                );

                window.location.reload();
            });
        },
        subscriptionStatusBarVisible() {
            return (
                AbpSession.TentantId > 0 &&
                (this.tenant.isInTrialPeriod ||
                    this.subscriptionIsExpiringSoon())
            );
        },
        subscriptionIsExpiringSoon() {
            if (this.tenant && this.tenant.subscriptionEndDateUtc) {
                var days = parseInt(
                    abp.setting.get(
                        'App.TenantManagement.SubscriptionExpireNotifyDayCount'
                    )
                );
                return (
                    moment()
                        .utc()
                        .add(days, 'days') >=
                    moment(this.tenant.subscriptionEndDateUtc)
                );
            }

            return false;
        },
        getSubscriptionExpiringDayCount() {
            if (!this.tenant || !this.tenant.subscriptionEndDateUtc) {
                return 0;
            }

            return Math.round(
                moment(this.tenant.subscriptionEndDateUtc).diff(
                    moment().utc(),
                    'days',
                    true
                )
            );
        },
        fromNow(date) {
            return moment(date).fromNow();
        },
        getTrialSubscriptionNotification() {
            if (!this.tenant) {
                return;
            }
            return abp.utils.formatString(
                this.L('TrialSubscriptionNotification'),
                '<strong>' + this.tenant.edition.displayName + '</strong>',
                "<a href='/views/account/buy?editionId=" +
                    this.tenant.edition.id +
                    '&editionPaymentType=' +
                    types.EditionPaymentType.BuyNow +
                    "'>" +
                    this.L('ClickHere') +
                    '</a>'
            );
        },
        getExpireNotification(localizationKey) {
            return abp.utils.formatString(
                this.L(localizationKey),
                this.getSubscriptionExpiringDayCount()
            );
        }
    },
    components: {
        ChangePasswordModal,
        LoginAttemptsModal,
        ChangeProfilePictureModal,
        MySettingsModal,
        LinkeAccountsModal,
        NotificationSettingsModal
    }
};
</script>

<style lang="scss" rel="stylesheet/scss">
$margin-width: 4px;
$width: 16px;
.subscriptions-info {
    position: absolute;
    top: 52px;
    left: 0;
    right: 0;
    font-size: 16px;
}

.main-header .logo {
    padding: 0;
    padding-left: 6px;
    text-align: left;
    & > div {
        display: inline-block !important;
    }
}
.logo-mini,
.logo-mini-d {
    .span-icon {
        display: inline-block;
        vertical-align: middle;
        span {
            height: $width;
            float: left;
            width: $width;
            border-radius: 2px;
        }
        .left-top {
            background: #5cb85c;
            margin-bottom: $margin-width;
            margin-right: $margin-width;
        }
        .right-top {
            background: #5bc0de;
            margin-bottom: $margin-width;
        }
        .left-btm {
            background: #f0ad4e;
            clear: left;
            margin-right: $margin-width;
        }
        .right-btm {
            background: #d9534f;
        }
    }
}
.logo-lg {
    text-align: left;
    .span-icon {
        display: inline-block;
        vertical-align: middle;
        margin-left: 20px;
        span {
            height: $width;
            float: left;
            width: $width;
            border-radius: 2px;
        }
        .left-top {
            background: #5cb85c;
            margin-bottom: $margin-width;
            margin-right: $margin-width;
        }
        .right-top {
            background: #5bc0de;
            margin-bottom: $margin-width;
        }
        .left-btm {
            background: #f0ad4e;
            clear: left;
            margin-right: $margin-width;
        }
        .right-btm {
            background: #d9534f;
        }
    }
    .logo-text {
        margin-left: 20px;
        display: inline-block;
        vertical-align: middle;
    }
}
@media (max-width: 991px) {
    .navbar-custom-menu .navbar-nav > li > a.user-link {
        padding-top: 0;
        padding-bottom: 0;
    }
}
@media (min-width: 768px) {
    .navbar-nav > li > a.user-link {
        padding-top: 0;
        padding-bottom: 0;
    }
}

.nav > li > a.user-link {
    position: relative;
    display: block;
    padding: 0 10px;
    line-height: 50px;
    height: 50px;
    .ion-ios-undo-outline {
        font-size: 20px;
        color: rgb(250, 255, 31);
    }
    .username-info {
        font-size: 14px;
        padding: 0 5px;
    }
    .user-image {
        float: none;
        width: 30px;
        height: 30px;
    }
}
.my-menu {
    list-style-type: none;
    padding: 0;
    margin: 0;

    li {
        line-height: 32px;
        a {
            color: #444 !important;
            cursor: pointer;
            padding: 0 20px;
            display: block;
            .ion-ios-undo-outline {
                font-size: 18px;
            }
            strong {
                padding-left: 5px;
            }
        }
        &:hover {
            background-color: rgb(244, 244, 244);
        }
    }
    .divider {
        margin: 0;
    }
}

.dropdown-submenu {
    position: relative;
    a.open-left {
        &:after {
            display: block;
            content: ' ';
            position: absolute;
            width: 0;
            height: 0;
            top: 11px;
            left: 8px;
            border-color: rgba(0, 0, 0, 0);
            border-style: solid;
            border-width: 5px 5px 5px 0;
            border-right-color: rgb(72, 71, 71);
        }
    }
    a.open-right {
        &:after {
            display: block;
            content: ' ';
            position: absolute;
            width: 0;
            height: 0;
            top: 11px;
            right: 8px;
            border-color: transparent;
            border-style: solid;
            border-width: 5px 0 5px 5px;
            border-left-color: #ccc;
        }
    }
    > .dropdown-menu {
        padding: 0;
        margin: 0;
        &.open-left {
            top: 0;
            left: 100%;
            margin-top: 0;
            border-radius: 0;
        }
        &.open-right {
            top: 0;
            right: 100%;
            left: inherit;
            margin-top: 0;
            border-radius: 0;
        }
        li {
            a {
                display: block;
                background-color: transparent;
                padding: 0 10px;
                line-height: 32px;
                &:hover {
                    background-color: rgb(244, 244, 244);
                }
            }
        }
    }
    &:hover {
        > .dropdown-menu {
            display: block;
        }
    }
    &:hover > a:after {
        border-left-color: #fff;
    }
    &.pull-left {
        > .dropdown-menu {
            left: -100%;
            margin-left: 10px;
            -webkit-border-radius: 6px 0 6px 6px;
            -moz-border-radius: 6px 0 6px 6px;
            border-radius: 6px 0 6px 6px;
        }
    }
}

#UserNotificationDropdown {
    border: 1px solid #4b97c3;
    border-top: 1px solid #fff;
}
.notifications-menu {
    .user-header {
        padding: 8px;
        a {
            color: #fff;
            &:hover {
                color: rgb(17, 255, 59);
            }
        }
    }
    .dropdown-menu-list {
        padding-right: 0 !important;
        padding-left: 0;
        list-style: none;
        .user-notification-item {
            background-color: #fff !important;
            color: #444;
            &:hover {
                background-color: rgba(228, 251, 249, 0.85) !important;
            }
            .fa-check {
                font-size: 16px;
                color: rgb(243, 30, 255);
            }
            .fa-info {
                font-size: 16px;
                color: #24d253;
            }
            .set-as-read-text {
                color: rgb(243, 30, 255);
                cursor: pointer;
            }
        }
        .details {
            white-space: initial;
        }
        > li > a {
            display: block;
            clear: both;
            font-weight: 300;
            line-height: 20px;
            white-space: normal;
            font-size: 13px;
            padding: 16px 15px 18px;
            text-shadow: none;
        }
    }
    .notification-empty-text {
        color: #444;
        padding: 10px;
        text-align: center;
    }
    .notifications-footer {
        background-color: rgb(60, 141, 188);
        a {
            color: #fff;
            padding: 8px;
            text-align: center;
            &:hover {
                background-color: rgb(60, 141, 188);
                color: rgb(17, 255, 59);
            }
        }
    }
}
</style>