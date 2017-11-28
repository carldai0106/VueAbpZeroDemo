<template>
    <div class="chat-sidebar-wrapper">
        <aside class="control-sidebar control-sidebar-dark">
            <ChatSidebarUserPane></ChatSidebarUserPane>
            <ChatSidebarChatPane></ChatSidebarChatPane>
        </aside>
        <!-- <div class="control-sidebar-bg"></div>
        <div class="clearfix"></div> -->
    </div>
</template>

<script type="text/ecmascript-6">
import { mapState, mapMutations } from 'vuex';
import * as mTypes from '../../../store/mutation-types';
import types from '../../../common/types';
import ChatSidebarHelper from './ChatSidebarHelper';
import ChatSidebarUserPane from './ChatSidebarUserPane';
import ChatSidebarChatPane from './ChatSidebarChatPane';
export default {
    data() {
        return {
            isLoadedByChatConnected: false
        };
    },
    created() {},
    computed: {
        ...mapState({
            friends: state => state.chat.friends,
            isOpen: state => state.chat.isOpen,
            selectedChatUser: state => state.chat.selectedUser
        })
    },
    watch: {
        friends(newValue) {
            console.log('friends new value');
            console.log(newValue);
            let self = this;
            // to get element if it is in dom
            if (newValue && this.isLoadedByChatConnected) {
                this.isLoadedByChatConnected = false;
                // to get .chat-sidebar-toggler from HeaderPart
                // to get .chat-sidebar-wrapper from this component
                this.tagIsReady(
                    '.chat-sidebar-toggler, .chat-sidebar-wrapper',
                    () => {
                        $('.chat-sidebar-toggler').on('click', () => {
                            ChatSidebarHelper.isOpen = !self.isOpen;
                        });
                        self.tagIsReady('.chat-sidebar-users', () => {
                            ChatSidebarHelper.loadLastState();
                        });
                    }
                );
            }
        }
    },
    mounted() {
        this.registerEvents();
    },
    methods: {
        ...mapMutations({
            setOnline: mTypes.CHAT_SET_FRIEND_IS_ONLINE,
            setState: mTypes.CHAT_SET_FRIEND_STATE,
            setUnreadCount: mTypes.CHAT_SET_FRIEND_UNREAD_COUNT,
            setReceiverReadState:
                mTypes.CHAT_SET_FRIEND_MESSAGE_RECEIVER_READ_STATE,
            setReadState: mTypes.CHAT_SET_FRIEND_MESSAGE_READ_STATE
        }),
        registerEvents() {
            var self = this;
            abp.event.on('app.chat.messageReceived', async message => {
                let result = ChatSidebarHelper.getFriendWithIndex(
                    message.targetUserId,
                    message.targetTenantId
                );

                if (!result) {
                    return;
                }

                var user = result.friend;
                user.messages = user.messages || [];
                var newLength = user.messages.push(message);

                console.log(newLength);
                if (message.side === types.AppChatSide.Receiver) {
                    var unreadMessageCount = user.unreadMessageCount + 1;
                    this.setUnreadCount({
                        index: result.index,
                        count: unreadMessageCount
                    });
                    this.setReadState({
                        friendIndex: result.index,
                        msgIndex: newLength - 1,
                        readState: types.AppChatMessageReadState.Unread
                    });

                    ChatSidebarHelper.triggerUnreadMessageCountChangeEvent();
                    let selectedUser = ChatSidebarHelper.selectedUser;
                    if (
                        ChatSidebarHelper.isOpen &&
                        selectedUser !== null &&
                        user.friendTenantId === selectedUser.friendTenantId &&
                        user.friendUserId === selectedUser.friendUserId
                    ) {
                        console.log('markAllUnreadMessagesOfUserAsRead');
                        await ChatSidebarHelper.markAllUnreadMessagesOfUserAsRead(user);
                    } else {
                        abp.notify.info(
                            abp.utils.formatString(
                                '{0}: {1}',
                                user.friendUserName,
                                abp.utils.truncateString(message.message, 100)
                            ),
                            null,
                            {
                                onclick() {
                                    if (
                                        !$('.control-sidebar').hasClass(
                                            'control-sidebar-open'
                                        )
                                    ) {
                                        $('.control-sidebar').addClass(
                                            'control-sidebar-open'
                                        );
                                        ChatSidebarHelper.isOpen = true;
                                    }

                                    if (
                                        !$('.chat-sidebar-wrapper').hasClass(
                                            'chat-sidebar-chat-show'
                                        )
                                    ) {
                                        $('.chat-sidebar-wrapper').addClass(
                                            'chat-sidebar-chat-show'
                                        );
                                    }

                                    ChatSidebarHelper.selectFriend(user);
                                }
                            }
                        );
                    }
                }

                ChatSidebarHelper.scrollToBottom();
            });

            abp.event.on(
                'app.chat.friendshipRequestReceived',
                (data, isOwnRequest) => {
                    if (!isOwnRequest) {
                        abp.notify.info(
                            abp.utils.formatString(
                                this.L('UserSendYouAFriendshipRequest'),
                                data.friendUserName
                            )
                        );
                    }
                    ChatSidebarHelper.friendshipRequestReceived(
                        data,
                        self.friends
                    );
                }
            );

            abp.event.on('app.chat.userConnectionStateChanged', data => {
                let result = ChatSidebarHelper.getFriendWithIndex(
                    data.friend.userId,
                    data.friend.tenantId
                );
                if (!result) {
                    return;
                }
                this.setOnline({
                    index: result.index,
                    isOnline: data.isConnected
                });
            });

            abp.event.on('app.chat.userStateChanged', data => {
                const result = ChatSidebarHelper.getFriendWithIndex(
                    data.friend.userId,
                    data.friend.tenantId
                );
                if (!result) {
                    return;
                }

                this.setState({
                    index: result.index,
                    status: data.state
                });
            });

            abp.event.on('app.chat.allUnreadMessagesOfUserRead', data => {
                const result = ChatSidebarHelper.getFriendWithIndex(
                    data.friend.userId,
                    data.friend.tenantId
                );
                if (!result) {
                    return;
                }

                this.setUnreadCount({
                    index: result.index,
                    count: 0
                });
                ChatSidebarHelper.triggerUnreadMessageCountChangeEvent();
            });

            abp.event.on('app.chat.readStateChange', data => {
                const result = ChatSidebarHelper.getFriendWithIndex(
                    data.friend.userId,
                    data.friend.tenantId
                );
                if (!result) {
                    return;
                }
                $.each(result.messages, (index, message) => {
                    this.setReceiverReadState({
                        friendIndex: result.index,
                        msgIndex: index,
                        receiverReadState: types.AppChatMessageReadState.Read
                    });
                });
            });

            abp.event.on('app.chat.connected', () => {
                self.$store.dispatch('getUserChatFriendsWithSettings');
                this.isLoadedByChatConnected = true;

                /*
                it removed to above : check it from watch friends
                self.getFriendsAndSettings(() => {
                    self.tagIsReady('.chat-sidebar-wrapper', () => {
                        self.bindUiEvents();

                        self.tagIsReady('.chat-sidebar-tab-pane', () => {
                            self.loadLastState();
                        });
                    });
                });
                */
            });
        }
    },
    components: { ChatSidebarUserPane, ChatSidebarChatPane }
};
</script>

<style lang="scss" rel="stylesheet/scss">
.control-sidebar-bg,
.control-sidebar {
    width: 320px;
    right: -320px;
}
.chat-sidebar-wrapper {
    .control-sidebar {
        position: fixed;
        overflow: hidden;
        padding-top: 0;
        top: 0;
        bottom: 0;
        z-index: 1200;
    }
}
</style>