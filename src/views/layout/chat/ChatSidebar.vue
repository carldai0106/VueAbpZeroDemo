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
import { mapState } from 'vuex';
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
        registerEvents() {
            var self = this;
            abp.event.on('app.chat.messageReceived', async message => {
                const user = ChatSidebarHelper.getFriendOrNull(
                    message.targetUserId,
                    message.targetTenantId
                );
                if (!user) {
                    return;
                }

                user.messages = user.messages || [];
                user.messages.push(message);

                if (message.side === types.AppChatSide.Receiver) {
                    let result = ChatSidebarHelper.getFriendOrNull(
                        message.targetUserId,
                        message.targetTenantId
                    );

                    if (!result) {
                        return;
                    }

                    user.unreadMessageCount += 1;
                    message.readState = types.AppChatMessageReadState.Unread;

                    // this.$set(
                    //     this.$store.state.chat.friends[result.index],
                    //     'unreadMessageCount',
                    //     count
                    // );
                    // this.$set(
                    //     this.$store.state.chat.selectedUser.messages[
                    //         newLen - 1
                    //     ],
                    //     'readState',
                    //     types.AppChatMessageReadState.Unread
                    // );
                    // selectedChatUser.messages
                    console.log('readState');
                    ChatSidebarHelper.triggerUnreadMessageCountChangeEvent();
                    let selectedUser = ChatSidebarHelper.selectedUser;
                    if (
                        ChatSidebarHelper.isOpen &&
                        selectedUser !== null &&
                        user.friendTenantId === selectedUser.friendTenantId &&
                        user.friendUserId === selectedUser.friendUserId
                    ) {
                        console.log('markAllUnreadMessagesOfUserAsRead');
                        await ChatSidebarHelper.markAllUnreadMessagesOfUserAsRead(
                            user
                        );
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
                const user = ChatSidebarHelper.getFriendOrNull(
                    data.friend.userId,
                    data.friend.tenantId
                );
                if (!user) {
                    return;
                }
                user.isOnline = data.isConnected;
            });

            abp.event.on('app.chat.userStateChanged', data => {
                const user = ChatSidebarHelper.getFriendOrNull(
                    data.friend.userId,
                    data.friend.tenantId
                );
                if (!user) {
                    return;
                }
                user.state = data.state;
            });

            abp.event.on('app.chat.allUnreadMessagesOfUserRead', data => {
                const user = ChatSidebarHelper.getFriendOrNull(
                    data.friend.userId,
                    data.friend.tenantId
                );
                if (!user) {
                    return;
                }

                user.unreadMessageCount = 0;
                ChatSidebarHelper.triggerUnreadMessageCountChangeEvent();
            });

            abp.event.on('app.chat.readStateChange', data => {
                const user = ChatSidebarHelper.getFriendOrNull(
                    data.friend.userId,
                    data.friend.tenantId
                );
                if (!user) {
                    return;
                }
                $.each(user.messages, (index, message) => {
                    message.receiverReadState =
                        types.AppChatMessageReadState.Read;
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
        position: absolute;
        overflow: hidden;
        padding-top: 0;
        top: 50px;
        bottom: 49px;
    }
}
</style>