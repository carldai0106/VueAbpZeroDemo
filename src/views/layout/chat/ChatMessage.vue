<template>
    <p class="message-item" v-if="message">
        <a v-if="chatMessageType === 'image'" :href="chatMessage" target="_blank">
            <img :src="chatMessage" class="chat-image-preview" />
        </a>
        <a v-if="chatMessageType === 'file'" :href="chatMessage" target="_blank" class="chat-file-preview">
            <i class="fa fa-file"></i>
            {{fileName}}
            <i class="fa fa-download pull-right"></i>
        </a>
        <a v-if="chatMessageType === 'link'" :href="chatMessage" target="_blank" class="chat-link-message">
            <i class="fa fa-link"></i>
            {{chatMessage}}
        </a>
        <span v-if="chatMessageType === 'text'">
            {{chatMessage}}
        </span>
    </p>
</template>


<script type="text/ecmascript-6">
import config from '../../../common/config';
export default {
    props: {
        messageData: Object
    },
    data() {
        return {
            message: null,
            chatMessage: null,
            chatMessageType: null,
            fileName: null,
            fileContentType: null
        };
    },
    mounted() {
        this.message = this.messageData;
        this.setChatMessageType();
        this.$nextTick(() => {
            $('#chatImageUpload')
                .find('.fa-plus')
                .addClass('fa-camera')
                .removeClass('fa-plus');
            $('#chatFileUpload')
                .find('.fa-plus')
                .addClass('fa-file')
                .removeClass('fa-plus');
        });
    },
    methods: {
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

<style lang="stylus" rel="stylesheet/stylus">
</style>