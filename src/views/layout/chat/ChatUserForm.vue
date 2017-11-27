<template>
    <div class="chat-user-form">
        <form v-if="selectedUser" ref="chatMessageForm" name="chatMessageForm" @submit.prevent="sendMessage()">
            <div class="col-md-12" v-if="selectedUser.state === appFriendshipState.Blocked">
                <button @click="unblock(selectedUser)" type="button" class="btn btn-block btn-success">{{L("UnblockUser")}}</button>
            </div>
            <div class="progress-wrapper">
                <el-progress :percentage="percentage" :status="status"></el-progress>
            </div>
            <div class="input-group" v-if="selectedUser.state !== appFriendshipState.Blocked">

                <textarea id="chatMessageInput" ref="chatMessageInput" type="text" class="form-control input-group-chat-control" rows="3" :placeholder="L('TypeAMessageHere')" v-model="chatMessage" @keydown.enter="sendMessage()" :disabled="selectedUser.state == appFriendshipState.Blocked" maxlength="4096" required></textarea>

                <div class="input-group-btn dropup">

                    <button :disabled="selectedUser.state == appFriendshipState.Blocked || chatMessage.length < 1 || sendingMessage" type="submit" class="btn btn-primary input-group-chat-control">
                        <i class="fa fa-paper-plane"></i>
                    </button>

                    <button id="chatDropdownToggle" type="button" class="btn btn-primary dropdown-toggle input-group-chat-control" data-toggle="dropdown" tabindex="-1" aria-expanded="false">
                        <i class="fa fa-paperclip fa-2x"></i>
                    </button>
                    <ul class="dropdown-menu pull-right " role="menu">
                        <li>

                            <el-upload class="el-uplaod-zone" :action="uploadUrl" :headers="uploadHeaders" :before-upload="handelImageBeforeUpload" :on-progress="handleImageProgress" :on-success="handleImageSuccess" :show-file-list="false">
                                <a href="javascript:;" slot="trigger">
                                    <i class="fa fa-camera"></i>
                                    <span class="text-label">{{L('Image')}}</span>
                                </a>
                            </el-upload>

                        </li>
                        <li>
                            <el-upload class="el-uplaod-zone" :action="uploadUrl" :headers="uploadHeaders" :on-progress="handleFileProgress" :on-success="handleFileSuccess" :show-file-list="false">
                                <a href="javascript:;" slot="trigger">
                                    <i class="fa fa-file"></i>
                                    <span class="text-label">{{L('File')}}</span>
                                </a>
                            </el-upload>
                        </li>
                        <li>
                            <a href="javascript:;" @click="shareCurrentLink">
                                <i class="fa fa-link"></i>
                                {{L('Link')}}
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </form>
    </div>
</template>

<script type="text/ecmascript-6">
import { mapState } from 'vuex';
import config from '../../../common/config';
import types from '../../../common/types';
import MessageHelper from '../../../base/MessageHelper';
import TokenHelper from '../../../common/js/TokenHelper';
import ChatSidebarHelper from './ChatSidebarHelper';
import ChatSignalrService from '../../../services/admin/ChatSignalrService';
export default {
    data() {
        return {
            chatMessage: '',
            appFriendshipState: types.AppFriendshipState,
            selectedUser: null,
            sendingMessage: false,
            uploadUrl: `${config.remoteUrl}/Chat/UploadFile`,
            percentage: 0,
            status: null
        };
    },
    computed: {
        ...mapState({
            selectFriend: state => state.chat.selectedUser,
            tenant: state => state.session.tenant,
            user: state => state.session.user
        }),
        uploadHeaders() {
            var bearer = 'Bearer ' + TokenHelper.getAccessToken();
            return { Authorization: bearer };
        }
    },
    watch: {
        selectFriend(newValue) {
            console.log('selectFriend');
            console.log(newValue);
            this.selectedUser = newValue;
            this.chatMessage = '';
        }
    },
    mounted() {
        this.chatMessage = '';
    },
    methods: {
        unblock(user) {
            ChatSidebarHelper.unblock(user);
        },
        handelImageBeforeUpload(file) {
            if (file.type.indexOf('image') >= 0) {
                return true;
            } else {
                MessageHelper.error(
                    '',
                    this.L(
                        'MakeSureAValidFileType',
                        this.L('Image'),
                        ' (.jpg,.png,.bmp)'
                    )
                );
                return false;
            }
        },
        handleImageProgress(event, file, fileList) {
            this.percentage = parseFloat(event.percent.toFixed(2));
        },
        handleImageSuccess(response, file, fileList) {
            if (response.success) {
                this.status = 'success';
                var result = response.result;
                this.chatMessage =
                    '[image]{"id":"' +
                    result.id +
                    '", "name":"' +
                    result.name +
                    '", "contentType":"' +
                    result.contentType +
                    '"}';
                this.sendMessage();
            } else {
                this.status = 'exception';
                MessageHelper.error('', response.error.message);
            }

            setTimeout(() => {
                this.percentage = 0;
                this.status = null;
            }, 1000);
        },
        handleFileProgress(event, file, fileList) {
            this.percentage = parseFloat(event.percent.toFixed(2));
        },
        handleFileSuccess(response, file, fileList) {
            if (response.success) {
                this.status = 'success';
                var result = response.result;
                this.chatMessage =
                    '[file]{"id":"' +
                    result.id +
                    '", "name":"' +
                    result.name +
                    '", "contentType":"' +
                    result.contentType +
                    '"}';
                this.sendMessage();
            } else {
                this.status = 'exception';
                MessageHelper.error('', response.error.message);
            }

            setTimeout(() => {
                this.percentage = 0;
                this.status = null;
            }, 1000);
        },
        shareCurrentLink() {
            this.chatMessage =
                '[link]{"message":"' + window.location.href + '"}';
            this.sendMessage();
        },
        sendMessage() {
            if (!this.chatMessage) {
                return;
            }

            this.sendingMessage = true;
            const tenancyName = this.tenant ? this.tenant.tenancyName : null;
            ChatSignalrService.sendMessage(
                {
                    tenantId: this.selectedUser.friendTenantId,
                    userId: this.selectedUser.friendUserId,
                    message: this.chatMessage,
                    tenancyName: tenancyName,
                    userName: this.user.userName,
                    profilePictureId: this.user.profilePictureId
                },
                () => {
                    this.chatMessage = '';
                    this.sendingMessage = false;
                }
            );
        }
    }
};
</script>

<style lang="scss" rel="stylesheet/scss">
.chat-user-form {
    border-top: 1px solid rgb(54, 66, 76);
    margin-top: 10px;
    padding: 0 10px 10px 10px;
    .progress-wrapper {
        padding: 5px 0;
        .el-progress__text {
            color: #fff;
        }
        .el-progress.is-success .el-progress__text {
            color: rgb(103, 194, 58);
        }
    }
    .input-group {
        .input-group-chat-control {
            height: 72px;
        }
        .btn-primary {
            &:focus,
            &:hover {
                border-color: transparent;
            }
            &:active {
                outline: none;
            }
        }
        .dropdown-menu {
            padding: 0;
            li {
                &:hover {
                    background-color: rgb(225, 227, 233);
                    color: rgb(51, 51, 51);
                    transition: all 0.3s ease-in-out;
                }
                .el-uplaod-zone {
                    .el-upload.el-upload--text {
                        display: block;
                    }
                }
                a {
                    transition: all 0.3s ease-in-out;
                    line-height: 26px;
                    display: block;
                    padding: 3px 20px;
                    clear: both;
                    font-weight: 400;
                    color: rgb(119, 119, 119);
                    text-align: left;
                    white-space: nowrap;
                    .text-label {
                        padding-left: 10px;
                    }
                }
            }
        }
    }
}
</style>