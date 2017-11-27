<template>
    <div class="chat-sidebar-chat">
        <div class="chat-sidebar-chat-nav">
            <a @click="backToChatUser" href="#" class="text-left">
                <i class="fa fa-arrow-circle-left"></i> {{L("Back")}}
            </a>
            <div class="clearfix"></div>
        </div>

        <!-- chat-sidebar-chat-user -->
        <div v-if="selectedUserIsReady" class="chat-sidebar-chat-user">
            <div class="chat-user-image">
                <FriendProfilePicture :profilePictureId="selectedUser.friendProfilePictureId" :userId="selectedUser.friendUserId" :tenantId="selectedUser.friendTenantId" :cssClass="'friend-photo'"></FriendProfilePicture>
                <span class="contact-status" :class="{'online': selectedUser.isOnline, 'offline':!selectedUser.isOnline}"></span>
            </div>
            <h5>{{ getShownUserName(selectedUser.friendTenancyName, selectedUser.friendUserName) }}</h5>
            <div class="actions">
                <div class="btn-group">
                    <a class="btn btn-info btn-sm" data-toggle="dropdown" data-hover="dropdown">
                        <i class="fa fa-wrench"></i>
                        <i class="fa fa-angle-down"></i>
                    </a>
                    <ul class="dropdown-menu pull-right">
                        <li v-if="selectedUser.state !== appFriendshipState.Blocked">
                            <a @click="block(selectedUser)" href="#">
                                <i class="fa fa-ban"></i>
                                {{L("BlockUser")}}
                            </a>
                        </li>
                        <li v-if="selectedUser.state === appFriendshipState.Blocked">
                            <a @click="unblock(selectedUser)">
                                <i class="fa fa-check"></i>
                                {{L("UnblockUser")}}
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="clearfix"></div>
        </div>
        <!-- chat-sidebar-chat-user -->

        <!-- chat message list -->
        <div v-if="selectedUserIsReady" class="direct-chat-primary direct-chat-messages-wrapper">
            <ChatMessageItem v-for="(item, index) of userMessages" :key="index" :msg="item" :currentUserAvator="currentUserAvator" :friendAvator="friendAvator"></ChatMessageItem>
        </div>
        <!-- chat message list -->

        <!-- chat user form -->
        <ChatUserForm :selectedFriend="selectFriend"></ChatUserForm>
        <!-- chat user form -->
    </div>
</template>

<script type="text/ecmascript-6">
import { mapState } from 'vuex';
import types from '../../../common/types';
import FriendProfilePicture from './FriendProfilePicture';
import ChatMessageItem from './ChatMessageItem';
import ChatUserForm from './ChatUserForm';
import ChatSidebarHelper from './ChatSidebarHelper';
export default {
    data() {
        return {
            loadingPreviousUserMessages: false,
            appFriendshipState: types.AppFriendshipState,
            selectedUserIsReady: false,
            currentUserAvator: null,
            friendAvator: null,
            selectedUser: null,
            userMessages: null
        };
    },
    computed: {
        ...mapState({
            selectFriend: state => state.chat.selectedUser
        })
    },
    watch: {
        selectFriend(newValue) {
            var self = this;
            console.log('selectFriend');
            console.log(newValue);
            this.selectedUser = newValue;
            this.selectedUserIsReady = false;
            Promise.all([
                this.getCurrentUserProfilePicture(),
                this.getFriendProfilePicture(),
                this.setMessages()
            ]).then(result => {
                this.currentUserAvator = result[0];
                this.friendAvator = result[1];
                if (this.selectFriend && this.selectFriend.messages) {
                    this.selectedUserIsReady = true;
                    this.userMessages = this.selectFriend.messages;
                    ChatSidebarHelper.messages = this.selectFriend.messages;
                    self.initSlimScroll();
                }
            });
        }
    },
    mounted() {},
    methods: {
        initSlimScroll() {
            var self = this;
            this.tagIsReady('.chat-user-form', () => {
                ChatSidebarHelper.initSlimScrollChatMessages(async (e, pos) => {
                    // Use this event to loading message when scrolling messages.
                    if (
                        pos === 0 &&
                        !self.selectFriend.allPreviousMessagesLoaded &&
                        !ChatSidebarHelper.loadingPreviousUserMessages
                    ) {
                        await ChatSidebarHelper.loadMessages(
                            self.selectFriend,
                            null
                        );
                    }
                });
            });
        },
        backToChatUser() {
            // go back to pick up user panel then should set selectedUser to empty
            $('.chat-sidebar-wrapper').removeClass('chat-sidebar-chat-show');
            // to get a smoothness animation, so used setTimeout.
            setTimeout(() => {
                ChatSidebarHelper.selectedUser = {};
            }, 300);
        },
        getShownUserName(tenancyName, userName) {
            return ChatSidebarHelper.getShownUserName(tenancyName, userName);
        },
        block(user) {
            ChatSidebarHelper.block(user);
        },
        unblock(user) {
            ChatSidebarHelper.unblock(user);
        },
        async getCurrentUserProfilePicture() {
            var rs = await ChatSidebarHelper.getCurrentUserProfilePicture();
            return rs;
        },
        async getFriendProfilePicture() {
            var friendTenantId = this.selectedUser.friendTenantId;
            var friendUserId = this.selectedUser.friendUserId;
            var friendProfilePictureId = this.selectedUser
                .friendProfilePictureId;
            var rs = await ChatSidebarHelper.getFriendProfilePicture(
                friendTenantId,
                friendUserId,
                friendProfilePictureId
            );
            return rs;
        },
        async setMessages() {
            let friend = this.selectedUser;
            const chatUser = ChatSidebarHelper.getFriendOrNull(
                friend.friendUserId,
                friend.friendTenantId
            );
            this.selectedUser = chatUser;
            if (!chatUser) {
                return;
            }

            if (!chatUser.messagesLoaded) {
                await ChatSidebarHelper.loadMessages(chatUser, () => {
                    chatUser.messagesLoaded = true;
                    ChatSidebarHelper.scrollToBottom();
                    this.tagIsReady('#chatMessageInput', () => {
                        $('#chatMessageInput').focus();
                    });
                });
            } else {
                await ChatSidebarHelper.markAllUnreadMessagesOfUserAsRead(
                    this.selectedUser
                );
                ChatSidebarHelper.scrollToBottom();
                this.tagIsReady('#chatMessageInput', () => {
                    $('#chatMessageInput').focus();
                });
            }
        }
    },
    components: {
        FriendProfilePicture,
        ChatMessageItem,
        ChatUserForm
    }
};
</script>

<style lang="scss" rel="stylesheet/scss">
.chat-sidebar-chat-show .chat-sidebar-chat {
    transition: margin 0.3s;
    margin-left: 0;
}
.chat-sidebar-chat {
    position: absolute !important;
    width: 320px !important;
    transition: margin 0.3s;
    margin-left: 320px;
    .chat-sidebar-chat-nav {
        a {
            padding: 0 10px;
            display: block;
            line-height: 38px;
            i {
                font-size: 18px;
            }
        }
    }
    .chat-sidebar-chat-user {
        position: relative;
        padding: 10px;
        margin-bottom: 10px;
        display: block;
        border-bottom: 1px solid #36424c;
        .chat-user-image {
            .friend-photo {
                border-radius: 50% !important;
                width: 46px;
                opacity: 0.8;
                float: left;
                margin-right: 10px;
            }
            .contact-status {
                position: absolute;
                width: 12px;
                height: 12px;
                border-radius: 50% !important;
                left: 43px;
                bottom: 10px;
                &.offline {
                    background-color: rgb(191, 202, 209);
                }
                &.online {
                    background-color: #26c281;
                }
            }
        }
        h5 {
            display: inline-block;
            margin-left: 5px;
        }
        .actions {
            float: right;
            padding-top: 5px;
            .btn {
                i {
                    margin-right: 5px;
                }
            }
            .dropdown-menu {
                padding: 0;
            }
        }
    }

    .direct-chat-messages-wrapper {
        padding: 0 10px;
        position: relative;
        .direct-chat-msg {
            .direct-chat-text {
                border: none;
                box-shadow: 1px 1px 10px rgba(255, 254, 246, 0.45);
                line-height: 20px;
            }
            &.right {
                .direct-chat-text {
                    box-shadow: 1px 1px 10px rgba(0, 161, 255, 0.62);
                }
            }
        }
    }
}
</style>