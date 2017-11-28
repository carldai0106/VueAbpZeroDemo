<template>
    <div class="chat-sidebar-users">
        <div class="chat-sidebar-users-nav">
            <a @click="closeChatPane" href="#" class="text-left pull-left">
                <i class="fa fa-remove"></i>
            </a>
            <div class="clearfix"></div>
        </div>
        <ul class="chat-sidebar-users-search">
            <li>
                <div class="input-icon input-icon-sm right">
                    <el-tooltip v-if="allowTenantToTenantChat || allowTenantToHostChat" effect="dark" placement="bottom">
                        <div slot="content" v-html="L('ChatUserSearch_Hint')"></div>
                        <i class="fa fa-question-circle"></i>
                    </el-tooltip>
                    <input type="text" class="form-control input-sm" :placeholder="L('FilterOrAddUser')" v-model="userNameFilter">
                </div>
            </li>
            <li>
                <button v-if="userNameFilter.length" @click="search()" type="button" class="btn btn-block btn-info">{{L("AddFriend")}}</button>
            </li>
        </ul>

        <div class="panel-group" id="FriendListWrapper">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <h4 class="panel-title">
                        <a href="#" @click="showFriendList = !showFriendList" data-toggle="collapse" data-parent="#FriendListWrapper" data-target="#FriendListBody">
                            {{L("Friends")}}
                            <i class="fa pull-right" :class="showFriendList ? 'fa-plus' : 'fa-minus' "></i>
                        </a>
                    </h4>
                </div>
                <div id="FriendListBody" class="panel-collapse collapse in">
                    <div class="panel-body">
                        <ul class="friend-list" v-for="(friend, index) of acceptedFriends" :key="index">
                            <ChatFriendListItem :friend="friend" :selectChatFriend="(data)=> selectFriend(data)"></ChatFriendListItem>
                        </ul>
                        <p v-if="acceptedFriendCount == 0" class="no-friend-info">{{L("YouDontHaveAnyFriend")}}</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="panel-group" id="BannedUsersWrapper">
            <div class="panel panel-default">
                <div class="panel-heading" :class="showLockedUserList ? '': 'show-bottom-border'">
                    <h4 class="panel-title">
                        <a href="#" @click="showLockedUserList = !showLockedUserList" data-toggle="collapse" data-parent="#BannedUsersWrapper" data-target="#BannedUsersBody">
                            {{L("BlockedUsers")}}
                            <i class="fa pull-right" :class="showLockedUserList ? 'fa-minus' : 'fa-plus' "></i>
                        </a>
                    </h4>
                </div>
                <div id="BannedUsersBody" class="panel-collapse collapse">
                    <div class="panel-body">
                        <ul class="friend-list" v-for="(friend, index) of lockedFriends" :key="index">
                            <ChatFriendListItem :friend="friend" :selectChatFriend="(data)=> selectFriend(data)"></ChatFriendListItem>
                        </ul>
                        <p v-if="lockedFriendCount == 0" class="no-friend-info">{{L("YouDontHaveAnyBlockedFriend")}}</p>
                    </div>
                </div>
            </div>
        </div>

        <LookupModal :display.sync="lookupModal.display" :settings="lookupModal.settings" :fetchProps="lookupModal.fetchProps" :modalProps="lookupModal.modalProps" :columns="lookupModal.columns" :selectedItem="addFriendSelected">
        </LookupModal>
    </div>
</template>

<script type="text/ecmascript-6">
import * as _ from 'lodash';
import { mapState } from 'vuex';
import types from '../../../common/types';
import LookupModal from '../../../components/lookup/LookupModal';
import CommonLookupService from '../../../services/common/CommonLookupService';
import FriendshipService from '../../../services/admin/FriendshipService';
import ChatSidebarHelper from './ChatSidebarHelper';
import ChatFriendListItem from './ChatFriendListItem';
export default {
    data() {
        return {
            allowTenantToTenantChat: false,
            allowTenantToHostChat: false,
            allowInnerTenantChat: false,
            userNameFilter: '',
            showFriendList: false,
            showLockedUserList: false,

            lookupModal: {
                display: false,
                modalProps: {
                    title: this.L('SelectAUser'),
                    width: '',
                    fullscreen: false
                },
                settings: {
                    dataSource: null,
                    canSelect: () => true
                },
                columns: [
                    {
                        label: this.L('Name'),
                        prop: 'name',
                        width: null,
                        minWidth: '120'
                    }
                ],
                fetchProps: {
                    tenantId: null,
                    filterText: ''
                },
                selectedItem: null
            }
        };
    },
    async created() {
        this.init();
    },
    computed: {
        ...mapState({
            friends: state => state.chat.friends,
            tenant: state => state.session.tenant,
            currentUser: state => state.session.user,
            application: state => state.session.application
        }),
        acceptedFriends() {
            var rs = this.getFilteredFriends(
                types.AppFriendshipState.Accepted,
                this.userNameFilter
            );
            return rs;
        },
        lockedFriends() {
            var rs = this.getFilteredFriends(
                types.AppFriendshipState.Blocked,
                this.userNameFilter
            );
            return rs;
        },
        acceptedFriendCount() {
            var rs = this.getFilteredFriendsCount(
                types.AppFriendshipState.Accepted
            );
            return rs;
        },
        lockedFriendCount() {
            var rs = this.getFilteredFriendsCount(
                types.AppFriendshipState.Blocked
            );
            return rs;
        }
    },
    methods: {
        init() {
            this.lookupModal.settings.dataSource = async options => {
                var input = {};
                input.filter = options.filterText;
                input.maxResultCount = options.maxResultCount;
                input.skipCount = options.skipCount;
                input.tenantId = options.tenantId;
                var rs = await CommonLookupService.findUsers(input);
                return rs;
            };

            this.allowTenantToTenantChat = abp.features.isEnabled(
                'App.ChatFeature.TenantToTenant'
            );

            this.allowTenantToHostChat = abp.features.isEnabled(
                'App.ChatFeature.TenantToHost'
            );

            this.allowInnerTenantChat =
                abp.features.isEnabled('App.ChatFeature.TenantToTenant') ||
                abp.features.isEnabled('App.ChatFeature.TenantToHost') ||
                !this.tenant;
        },
        closeChatPane() {
            ChatSidebarHelper.isOpen = false;
        },
        getFilteredFriends(state, userName) {
            const foundFriends = _.filter(
                this.friends,
                friend =>
                    friend.state === state &&
                    ChatSidebarHelper.getShownUserName(
                        friend.friendTenancyName,
                        friend.friendUserName
                    )
                        .toLocaleLowerCase()
                        .indexOf(userName.toLocaleLowerCase()) >= 0
            );

            return foundFriends;
        },
        getFilteredFriendsCount(state) {
            return _.filter(this.friends, friend => friend.state === state)
                .length;
        },
        search() {
            const input = {};
            if (this.userNameFilter.indexOf('\\') === -1) {
                input.userName = this.userNameFilter;
            } else {
                const tenancyAndUserNames = this.userNameFilter.split('\\');
                input.tenancyName = tenancyAndUserNames[0];
                input.userName = tenancyAndUserNames[1];
            }

            if (!input.tenancyName || !this.allowInnerTenantChat) {
                const tenantId = this.tenant ? this.tenant.id : null;
                this.openSearchModal(input.userName, tenantId);
            } else {
                FriendshipService.createFriendshipRequestByUserName(input).then(
                    () => {
                        this.userNameFilter = '';
                    }
                );
            }
        },
        openSearchModal(userName, tenantId) {
            this.lookupModal.fetchProps.tenantId = tenantId;
            this.lookupModal.fetchProps.filterText = userName;
            this.lookupModal.display = true;
        },
        addFriendSelected(item) {
            const userId = item.value;
            const input = {};
            input.userId = parseInt(userId);
            input.tenantId = this.tenant ? this.tenant.id : null;

            FriendshipService.createFriendshipRequest(input).then(() => {
                this.userNameFilter = '';
            });
        },

        /*
            when a user was selected, it will call another selectFriend in ChatSidebarChatPane,
            you can check it from watch => selectFriend
        */
        selectFriend(friend) {
            ChatSidebarHelper.selectFriend(friend);
        }
    },
    components: { LookupModal, ChatFriendListItem }
};
</script>

<style lang="scss" rel="stylesheet/scss">
.chat-sidebar-chat-show .chat-sidebar-users {
    transition: all 0.3s ease;
    margin-left: -320px;
}
.chat-sidebar-users {
    position: absolute !important;
    width: 320px !important;
    transition: all 0.3s ease;
    .chat-sidebar-users-nav {       
        border-bottom: 1px solid rgb(54, 66, 76);
        a {
            padding: 4px 15px 0 15px;
            display: block;
            line-height: 38px;
            i {
                font-size: 18px;
            }
        }
    }
    .chat-sidebar-users-search {
        margin: 0;
        padding: 0;
        list-style: none;
        li {
            margin: 10px 5px;
        }
    }
    .panel-group {
        margin-bottom: 0;
        .panel {
            border: none;
            overflow: visible;
            background-color: transparent;
            box-shadow: none;
            &.panel-default {
                border-color: transparent;
            }
            .panel-heading {
                border: 1px solid rgb(54, 66, 76);
                border-bottom: none;
                background-color: rgba(28, 33, 39, 0.85);
                border-radius: 0px;
                color: rgb(108, 130, 150);
                a {
                    display: block;
                }
            }
            .panel-body {
                border-top: 1px solid rgb(54, 66, 76) !important;
                border: none;
                padding: 0 !important;
                .friend-list {
                    list-style: none;
                    margin: 0;
                    padding: 0;
                }
                .no-friend-info {
                    margin: 10px;
                    line-height: 20px;
                }
            }
        }
    }
    .show-bottom-border {
        border-bottom: 1px solid rgb(54, 66, 76) !important;
    }
    #BannedUsersBody > .panel-body {
        border-bottom: 1px solid rgb(54, 66, 76);
    }
}
</style>