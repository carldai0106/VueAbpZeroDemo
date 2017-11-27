import * as _ from 'lodash';
import * as moment from 'moment';
import * as localforage from 'localforage';
import store from '../../../store/index';
import * as mTypes from '../../../store/mutation-types';
import types from '../../../common/types';
import config from '../../../common/config';
import ProfileService from '../../../services/admin/ProfileService';
import FriendshipService from '../../../services/admin/FriendshipService';
import ChatService from '../../../services/admin/ChatService';

function slimScrollChatMessages(callback) {
    var wrapper = $('.control-sidebar');
    var chatHeight = wrapper.height();
    var winHeight = $(window).height();
    if (chatHeight > winHeight) {
        chatHeight = winHeight;
    }
    // console.log('chatHeight ' + chatHeight);
    let chatMessages = wrapper.find('.direct-chat-messages-wrapper');

    let chatUserFormHeight = wrapper.find('.chat-user-form').outerHeight(true);
    let chatMessagesHeight = chatHeight - chatUserFormHeight;
    // console.log(
    //     'chatMessagesHeight : chatHeight - chatUserFormHeight ' +
    //         chatHeight +
    //         ' - ' +
    //         chatUserFormHeight
    // );
    let chatNavHeight = wrapper
        .find('.chat-sidebar-chat-nav')
        .outerHeight(true);
    let chatUserHeight = wrapper
        .find('.chat-sidebar-chat-user')
        .outerHeight(true);
    chatMessagesHeight = chatMessagesHeight - chatNavHeight - chatUserHeight;
    // console.log(
    //     'chatMessagesHeight :  chatMessagesHeight - chatNavHeight - chatUserHeight ' +
    //         chatMessagesHeight +
    //         ' - ' +
    //         chatNavHeight +
    //         ' - ' +
    //         chatUserHeight
    // );
    // console.log('chatMessagesHeight: ' + chatMessagesHeight);

    // chatMessages.slimScroll({
    //     destroy: true
    // });

    var $elem = chatMessages;
    var events = jQuery._data($elem[0], 'events');
    console.log('events');
    console.log(events);
    if (events) {
        jQuery._removeData($elem[0], 'events');
    }

    $('.slimScrollBar,.slimScrollRail').remove();
    $('.slimScrollDiv')
        .contents()
        .unwrap();
    $('.slimScrollDiv').remove();

    var $slimScroll = chatMessages.slimScroll({
        allowPageScroll: true,
        size: '7px',
        height: chatMessagesHeight - 20,
        disableFadeOut: true
    });
    if (callback) {
        $slimScroll.bind('slimscrolling', callback);
    }
}

class ChatSidebarHelper {
    set isOpen(newValue) {
        if (store.state.chat.isOpen != newValue) {
            if (newValue == null) {
                newValue = false;
            }

            store.commit(mTypes.CHAT_SET_OPEN, { isOpen: newValue });
            localforage.setItem('app.chat.isOpen', newValue);

            if (newValue) {
                this.markAllUnreadMessagesOfUserAsRead(this.selectedUser);
            }

            this.adjustNotifyPosition();
        }
    }

    get isOpen() {
        return store.state.chat.isOpen;
    }

    get selectedUser() {
        var friend = store.state.chat.selectedUser;
        return friend;
    }

    set selectedUser(newValue) {
        if (newValue === this.selectedUser || newValue == null) {
            return;
        }
        // NOTE: this is a fix for localForage is not able to store user with messages array filled
        if (newValue.messages) {
            newValue.messages = [];
            newValue.messagesLoaded = false;
        }
        console.log('ChatSidebarHelper newValue.messages');
        console.log(newValue);
        store.commit(mTypes.CHAT_SELECTED_USER, { selectedUser: newValue });
        localforage.setItem('app.chat.selectedUser', newValue);
    }

    get friends() {
        var friends = store.state.chat.friends;
        return friends;
    }

    set friends(newValue) {
        if (this.friends !== newValue) {
            store.commit(mTypes.CHAT_SET_FRIENDS, { friends: newValue });
        }
    }

    get loadingPreviousUserMessages() {
        return store.state.chat.loadingPreviousUserMessages;
    }

    set loadingPreviousUserMessages(newValue) {
        if (this.loadingPreviousUserMessages === newValue) return;

        store.commit(mTypes.CHAT_LOAD_PREVIOUS_USER_MESSAGES, {
            loadingPreviousUserMessages: newValue
        });
    }

    selectFriend(friend) {
        const chatUser = this.getFriendOrNull(
            friend.friendUserId,
            friend.friendTenantId
        );
        this.selectedUser = chatUser;
        // switch to chat panel, to get a smoothness animation, so used setTimeout.
        setTimeout(() => {
            $('.chat-sidebar-wrapper').addClass('chat-sidebar-chat-show');
        }, 120);
    }

    getShownUserName(tenancyName, userName) {
        if (!abp.multiTenancy.isEnabled) {
            return userName;
        }
        var name = tenancyName;
        return (tenancyName ? name : '.') + '\\' + userName;
    }

    getFriendOrNull(userId, tenantId) {
        const result = _.filter(
            this.friends,
            friend =>
                friend.friendUserId === userId &&
                friend.friendTenantId === tenantId
        );
        if (result.length) {
            return result[0];
        }

        return null;
    }

    getFriendWithIndex(userId, tenantId) {
        let index = _.findIndex(
            this.friends,
            friend =>
                friend.friendUserId === userId &&
                friend.friendTenantId === tenantId
        );

        if (index != -1) {
            return {
                friend: this.friends[index],
                index: index
            };
        }

        return null;
    }

    block(user) {
        const blockUserInput = {};
        blockUserInput.tenantId = user.friendTenantId;
        blockUserInput.userId = user.friendUserId;

        FriendshipService.blockUser(blockUserInput).then(() => {
            abp.notify.info(window.L('UserBlocked'));
        });
    }

    unblock(user) {
        const unblockUserInput = {};
        unblockUserInput.tenantId = user.friendTenantId;
        unblockUserInput.userId = user.friendUserId;

        FriendshipService.unblockUser(unblockUserInput).then(() => {
            abp.notify.info(window.L('UserUnblocked'));
        });
    }

    getUserNameByChatSide(chatSide) {
        return chatSide === types.AppChatSide.Sender
            ? store.state.session.user.userName
            : store.state.chat.selectedUser.friendUserName;
    }

    getFixedMessageTime(messageTime) {
        var serverTime = store.state.chat.serverTime;
        return moment(messageTime)
            .add(-1 * serverTime, 'seconds')
            .fromNow();
    }

    async getCurrentUserProfilePicture() {
        var result = await ProfileService.getProfilePicture();
        var profilePicture =
            config.baseUrl + '/static/images/user2-160x160.jpg';
        if (result && result.profilePicture) {
            profilePicture = 'data:image/jpeg;base64,' + result.profilePicture;
        }
        return profilePicture;
    }

    async getFriendProfilePicture(tenantId, userId, profileImageId) {
        var result = await ProfileService.getFriendProfilePictureById({
            profilePictureId: profileImageId,
            userId: userId,
            tenantId: tenantId
        });
        let profilePicture =
            config.baseUrl + '/static/images/user8-128x128.jpg';
        if (result && result.profilePicture) {
            profilePicture = 'data:image/jpeg;base64,' + result.profilePicture;
        }
        return profilePicture;
    }

    async markAllUnreadMessagesOfUserAsRead(user) {
        if (!user || !this.isOpen) {
            return;
        }

        const unreadMessages = _.filter(
            user.messages,
            m => m.readState === types.AppChatMessageReadState.Unread
        );
        const unreadMessageIds = _.map(unreadMessages, 'id');

        if (!unreadMessageIds.length) {
            return;
        }

        const input = {};
        input.tenantId = user.friendTenantId;
        input.userId = user.friendUserId;

        await ChatService.markAllUnreadMessagesOfUserAsRead(input);

        _.forEach(user.messages, message => {
            if (unreadMessageIds.indexOf(message.id) >= 0) {
                message.readState = types.AppChatMessageReadState.Read;
            }
        });
    }

    triggerUnreadMessageCountChangeEvent() {
        let totalUnreadMessageCount = 0;
        if (this.friends) {
            totalUnreadMessageCount = _.reduce(
                this.friends,
                (memo, friend) => memo + friend.unreadMessageCount,
                0
            );
        }
        abp.event.trigger(
            'app.chat.unreadMessageCountChanged',
            totalUnreadMessageCount
        );
    }

    friendshipRequestReceived(data, friends) {
        if (
            !_.filter(
                friends,
                f =>
                    f.friendUserId === data.friendUserId &&
                    f.friendTenantId === data.friendTenantId
            ).length
        ) {
            friends.push(data);
            this.friends = friends;
        }
    }

    async loadMessages(user, callback) {
        this.loadingPreviousUserMessages = true;
        let minMessageId;
        if (user.messages && user.messages.length) {
            minMessageId = _.min(_.map(user.messages, m => m.id));
        }

        var result = await ChatService.getUserChatMessages(
            user.friendTenantId ? user.friendTenantId : undefined,
            user.friendUserId,
            minMessageId
        );

        if (!user.messages) {
            user.messages = [];
        }

        user.messages = result.items.concat(user.messages);
        await this.markAllUnreadMessagesOfUserAsRead(user);
        if (!result.items.length) {
            user.allPreviousMessagesLoaded = true;
        }

        this.loadingPreviousUserMessages = false;
        if (callback) {
            callback();
        }
    }

    adjustNotifyPosition() {
        if (this.isOpen) {
            this.changeNotifyPosition('toast-chat-open');
        } else {
            this.changeNotifyPosition('toast-bottom-right');
        }
    }

    changeNotifyPosition(positionClass) {
        if (!toastr) {
            return;
        }
        toastr.clear();
        toastr.options.positionClass = positionClass;
    }

    loadLastState() {
        const self = this;
        localforage.getItem('app.chat.isOpen', (err, isOpen) => {
            if (err) {
                console.log(
                    '**************** begin app.chat.isOpen error ******************'
                );
                console.log(err);
                console.log(
                    '**************** end app.chat.isOpen error ******************'
                );
            }
            self.isOpen = isOpen;

            console.log('app.chat.isOpen ' + isOpen);
            if (isOpen) {
                $('.control-sidebar')
                    .addClass('control-sidebar-open')
                    .promise()
                    .done(() => {
                        console.log('completed control-sidebar-open');
                        localforage.getItem(
                            'app.chat.selectedUser',
                            (err, selectedUser) => {
                                if (err) {
                                    console.log(
                                        '**************** begin app.chat.selectedUser error ******************'
                                    );
                                    console.log(err);
                                    console.log(
                                        '**************** end app.chat.selectedUser error ******************'
                                    );
                                }
                                if (selectedUser && selectedUser.friendUserId) {
                                    $('.chat-sidebar-wrapper').addClass(
                                        'chat-sidebar-chat-show'
                                    );

                                    self.selectFriend(selectedUser);
                                } else {
                                    $('.chat-sidebar-wrapper').removeClass(
                                        'chat-sidebar-chat-show'
                                    );
                                }
                            }
                        );
                    });
            }
        });
    }

    scrollToBottom() {
        setTimeout(() => {
            const $scrollArea = $('.direct-chat-messages-wrapper');
            const scrollToVal = $scrollArea.prop('scrollHeight');
            console.log('scrollToBottom ' + scrollToVal);
            $scrollArea.slimScroll({ scrollTo: scrollToVal });
        }, 200);
    }

    initSlimScrollChatUsers() {
        var wrapper = $('.control-sidebar');
        var chatUsers = $('.chat-sidebar-users');
        var height = wrapper.height();
        chatUsers.slimScroll({
            allowPageScroll: true,
            size: '7px',
            height: height,
            disableFadeOut: true
        });
    }

    initSlimScrollChatMessages(callback) {
        slimScrollChatMessages(callback);
        $(window).resize(() => {
            slimScrollChatMessages(callback);
        });
    }
}

export default new ChatSidebarHelper();
