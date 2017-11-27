<template>
    <div v-if="message" class="direct-chat-msg" :class="message.side === 1 ? 'right': ''">
        <div class="direct-chat-info clearfix">
            <span class="direct-chat-name pull-left">{{getUserNameByChatSide(message.side)}}</span>
            <span class="direct-chat-timestamp pull-right">{{getFixedMessageTime(message.creationTime)}}</span>
        </div>
        <!-- /.direct-chat-info -->
        <img class="direct-chat-img" v-if="message.side === 1 && currentAvator" :src="currentAvator">
        <img class="direct-chat-img" v-if="message.side === 2 && otherAvator" :src="otherAvator">

        <!-- /.direct-chat-img -->
        <div class="direct-chat-text">
            <a v-if="chatMessageType === 'image'" :href="chatMessage" target="_blank">
                <img :src="chatMessage" class="chat-image-preview" />
            </a>
            <a v-if="chatMessageType === 'file'" :href="chatMessage" target="_blank" class="chat-file-preview">
                <i class="fa fa-file"></i>
                <span> {{fileName}}</span>
                <i class="fa fa-download"></i>
            </a>
            <a v-if="chatMessageType === 'link'" :href="chatMessage" target="_blank" class="chat-link-message">
                <i class="fa fa-link"></i>
                {{chatMessage}}
            </a>
            <span v-if="chatMessageType === 'text'">
                {{chatMessage}}
            </span>
        </div>
        <!-- /.direct-chat-text -->
    </div>
</template>

<script type="text/ecmascript-6">
import config from '../../../common/config';
import ChatSidebarHelper from './ChatSidebarHelper';
export default {
    props: {
        msg: Object,
        currentUserAvator: String,
        friendAvator: String
    },
    data() {
        return {
            message: null,
            currentAvator: null,
            otherAvator: null,
            chatMessage: null,
            chatMessageType: null,
            fileName: null,
            fileContentType: null
        };
    },
    mounted() {
        this.message = this.msg;
        this.currentAvator = this.currentUserAvator;
        this.otherAvator = this.friendAvator;

        this.setChatMessageType();
    },
    methods: {
        getUserNameByChatSide(chatSide) {
            return ChatSidebarHelper.getUserNameByChatSide(chatSide);
        },
        getFixedMessageTime(time) {
            return ChatSidebarHelper.getFixedMessageTime(time);
        },
        setChatMessageType() {
            if (this.message.message.startsWith('[image]')) {
                this.chatMessageType = 'image';

                let image = JSON.parse(
                    this.message.message.substring('[image]'.length)
                );
                this.chatMessage =
                    config.remoteUrl +
                    '/Chat/GetUploadedObject?fileId=' +
                    image.id +
                    '&contentType=' +
                    image.contentType;
            } else if (this.message.message.startsWith('[file]')) {
                this.chatMessageType = 'file';

                let file = JSON.parse(
                    this.message.message.substring('[file]'.length)
                );
                this.chatMessage =
                    config.remoteUrl +
                    '/Chat/GetUploadedObject?fileId=' +
                    file.id +
                    '&contentType=' +
                    file.contentType;
                this.fileName = file.name;
            } else if (this.message.message.startsWith('[link]')) {
                this.chatMessageType = 'link';

                let linkMessage = JSON.parse(
                    this.message.message.substring('[link]'.length)
                );

                this.chatMessage =
                    linkMessage.message == null ? '' : linkMessage.message;
            } else {
                this.chatMessageType = 'text';

                this.chatMessage = this.message.message;
            }
        }
    }
};
</script>

<style lang="scss" rel="stylesheet/scss">
.direct-chat-msg {
    .direct-chat-text {
        .chat-image-preview {
            width: 230px;
        }
        .chat-file-preview {
            position: relative;
            text-align: left;
            padding: 5px 10px;
            margin: 5px 0;
            background-color: rgba(17, 41, 51, 0.89);
            display: block;
            color: rgb(247, 247, 247);
            box-shadow: 1px 1px 10px rgb(6, 18, 25);
            &:hover {
                text-decoration: underline;
                color: rgba(11, 228, 200, 0.91);
            }
            span {
                padding-left: 5px;
                position: absolute;
                top: 6px;           
                width: 190px;
                text-overflow: ellipsis;
                overflow-x: hidden;
            }
            .fa-download {
                position: absolute;
                right: 10px;
                top: 10px;
            }
        }
        .chat-link-message {
            display: block;
            text-overflow: ellipsis;
            overflow-x: hidden;
            white-space: nowrap;
            padding: 5px 10px;
            margin: 5px 0;
            text-align: left;
            background-color: rgb(88, 38, 87);
            color: rgb(247, 247, 247);
            box-shadow: 1px 1px 10px rgb(6, 18, 25);
            &:hover {
                text-decoration: underline;
                color: rgba(11, 228, 200, 0.91);
            }
        }
    }
}
</style>