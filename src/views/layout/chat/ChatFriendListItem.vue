<template>
    <li v-if="friendData" class="friend-item" @click="selectedFriend(friendData)">
        <div class="friend-status">
            <span v-if="friendData.unreadMessageCount" class="label">{{ friendData.unreadMessageCount }}</span>
        </div>

        <FriendProfilePicture :profilePictureId="friendData.friendProfilePictureId" :userId="friendData.friendUserId" :tenantId="friendData.friendTenantId" :cssClass="'friend-photo'"></FriendProfilePicture>
        <div class="friend-body">
            <h4 class="friend-heading">{{getShownUserName(friendData.friendTenancyName, friendData.friendUserName)}}</h4>
        </div>
        <span class="contact-status" :class="{'online':friendData.isOnline, 'offline':!friendData.isOnline}"></span>
    </li>
</template>

<script type="text/ecmascript-6">
import config from '../../../common/config';
import FriendProfilePicture from './FriendProfilePicture';
export default {
    props: {
        friend: Object,
        selectChatFriend: Function
    },
    data() {
        return {
            multiTenancy: abp.multiTenancy.isEnabled,
            friendData: null
        };
    },
    mounted() {
        this.friendData = this.friend;
    },
    methods: {
        getShownUserName(tenancyName, userName) {
            if (!abp.multiTenancy.isEnabled) {
                return userName;
            }
            var name = tenancyName;
            return (tenancyName ? name : '.') + '\\' + userName;
        },
        getRemoteImageUrl(profilePictureId, userId, tenantId) {
            return (
                config.remoteUrl +
                '/Profile/GetFriendProfilePictureById?id=' +
                profilePictureId +
                '&userId=' +
                userId +
                '&tenantId=' +
                tenantId
            );
        },
        selectedFriend(data) {
            this.selectChatFriend && this.selectChatFriend(data);
        }
    },
    components: { FriendProfilePicture }
};
</script>

<style lang="scss" rel="stylesheet/scss">
.friend-list {
    .friend-item {
        padding: 15px 15px;
        position: relative;
        &:hover {
            cursor: pointer;
            background: rgb(25, 33, 39);
        }
        &:first-child {
            margin-top: 0;
        }
        .friend-status {
            margin-top: 10px;
            right: 10px;
            position: absolute;
            display: inline-block;
        }
        .friend-photo {
            border-radius: 50% !important;
            width: 46px;
            opacity: 0.8;
            filter: alpha(opacity=80);
            float: left;
            margin-right: 10px;
        }
        .friend-body {
            padding-top: 10px;
            .friend-heading {
                margin: 5px 0 0 0;
                font-size: 14px;
            }
        }

        .contact-status {
            position: absolute;
            width: 12px;
            height: 12px;
            border-radius: 50% !important;
            left: 48px;
            bottom: 14px;
            &.offline {
                background-color: rgb(191, 202, 209);
            }
            &.online {
                background-color: #26c281;
            }
        }
    }
    .friend-item,
    .friend-body {
        zoom: 1;
        overflow: hidden;
    }
}
</style>