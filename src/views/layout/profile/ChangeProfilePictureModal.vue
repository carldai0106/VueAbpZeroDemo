<template>
    <div>
        <el-dialog :title="L('ChangeProfilePicture')" :visible.sync="selfVisible" :modal-append-to-body="false" @open="handleOpen" @close="handleClose" width="800px" top="2vh">
            <form name="ChangeProfilePictureModalForm">
                <img ref="templateImage" style="display:none;" src="../../../vendor/AdminLTE/img/user2-160x160.jpg">
                <div class="form-group">
                    <input ref="userPicture" id="UserPicture" name="UserPicture" type="file" accept="image/*" class="file-loading">
                    <span class="help-block">{{L('ProfilePicture_Change_Info')}}</span>
                </div>

            </form>

            <span slot="footer" class="dialog-footer">
                <el-button v-show="showPreviewCroped" class="waves-effect pull-left" type="primary" @click="previewCroped">{{L('PreviewCroped')}}</el-button>
                <el-button class="waves-effect" @click="selfVisible = false">{{L('Cancel')}}</el-button>
                <el-button class="waves-effect" type="primary" @click="save">{{L('Save')}}</el-button>
            </span>
        </el-dialog>

        <el-dialog :title="L('CropedImage')" :visible.sync="cropedModal.display" :modal-append-to-body="false">
            <div class="thumbnail mar-no pad-all-15"><img :src="cropedPicture" /></div>
            <span slot="footer" class="dialog-footer">
                <el-button class="waves-effect" @click="cropedModal.display = false">{{L('Close')}}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script type="text/ecmascript-6">
import 'cropper/dist/cropper.min.css';
import 'cropper';
import 'bootstrap-fileinput/css/fileinput.min.css';
import 'bootstrap-fileinput';
import 'bootstrap-fileinput/themes/fa/theme.min.js';
import config from '../../../common/config';
import TokenHelper from '../../../common/js/TokenHelper';
import ProfileService from '../../../services/admin/ProfileService';
export default {
    props: {
        display: Boolean
    },
    data() {
        return {
            selfVisible: this.display,
            loading: false,
            showPreviewCroped: false,
            cropedPicture: null,
            $image: null,
            cropedModal: {
                display: false
            },
            uploadUrl: config.remoteUrl + '/Profile/UploadProfilePicture',
            temporaryPictureFileName: null
        };
    },
    watch: {
        // 监控父组件传递过来的值来指示是否显示dialog
        display(val) {
            if (val != this.selfVisible) {
                this.selfVisible = val;
            }
        },
        // 监控本组件的显示状态
        selfVisible(val) {
            // 更新状态到父组件是否显示本对话框
            this.$emit('update:display', val);
        }
    },
    created() {
        // var rs = await ProfileService.getPasswordComplexitySetting();
    },
    mounted() {},
    methods: {
        handleOpen() {
            this.$nextTick(() => {
                this.init();
            });
        },
        handleClose() {
            $(this.$refs.userPicture).fileinput('destroy');
        },
        init() {
            var self = this;
            var initialPreview = [];
            var source = this.$refs.templateImage.src;
            initialPreview = [
                "<img src='" +
                    source +
                    "' class='file-preview-image' style='max-width:800px;'>"
            ];

            var userPicture = $(this.$refs.userPicture);
            userPicture.fileinput({
                theme: 'fa',
                uploadUrl: self.uploadUrl,
                ajaxSettings: {
                    headers: {
                        Authorization: 'Bearer ' + TokenHelper.getAccessToken()
                    }
                },
                uploadAsync: true,
                showUpload: false,
                showPreview: true,
                maxFileSize: 1024,
                // browseOnZoneClick: true,
                // initialPreviewAsData: true,
                previewSettings: {
                    image: { width: '800px', height: '400px' }
                },
                fileActionSettings: {
                    showZoom: true,
                    showDrag: false,
                    showDelete: false
                },
                initialPreview: initialPreview,
                previewFileType: 'image',
                browseClass: 'btn btn-primary',
                browseLabel: self.L('PickUpImage'),
                browseIcon: '<i class="fa fa-file-image-o"></i> ',
                removeClass: 'btn btn-danger',
                removeLabel: self.L('Delete'),
                removeIcon: '<i class="fa fa-trash"></i>'
            });

            userPicture.on('fileloaded', function(
                event,
                file,
                previewId,
                index,
                reader
            ) {
                self.showPreviewCroped = true;
            });

            userPicture.on('filebatchselected', function(event, files) {
                userPicture.fileinput('upload');
            });

            userPicture.on('fileuploaded', function(
                event,
                data,
                previewId,
                index
            ) {
                if (self.$image != null) {
                    self.$image.cropper('destroy');
                }

                self.$image = $('#' + previewId).find('img');
                // if you want to flex freely, you can set it 'NaN'
                // self.$image.cropper({ aspectRatio: 'NaN' });
                self.$image.cropper({
                    aspectRatio: 1,
                    left: 0,
                    top: 0,
                    width: 100,
                    height: 100
                });

                self.showPreviewCroped = true;
                var json = data.jqXHR.responseJSON;
                if (json) {
                    self.temporaryPictureFileName = json.result.fileName;
                }
                $('.kv-file-content').css({ height: 'auto', width: 'auto' });
            });

            userPicture.on('fileclear', function(event) {
                self.showPreviewCroped = false;
            });

            userPicture.on('filesuccessremove', function(event) {
                self.showPreviewCroped = false;
            });
        },
        previewCroped() {
            if (this.$image != null) {
                var result = this.$image.cropper('getCroppedCanvas');
                this.cropedPicture = result.toDataURL();
            }
            this.cropedModal.display = true;
        },
        save() {
            var self = this;
            if (!self.temporaryPictureFileName) {
                return;
            }

            let imgData = {};

            let data = {};
            if (self.$image) {
                imgData = self.$image.cropper('getImageData');
                data = self.$image.cropper('getData');
            }

            /* 鉴于裁剪工具有放大缩小的功能，缩小的时候如果裁剪不当会导致内存溢出。
             当然可以禁止缩放功能，但是为了更好的用户体验，就做一个自动容错的功能。
             其实完全可以用base64位字符串来保存图片，现在的主流浏览器都支持html5了。
             对于不是截图后的大size图片，我们都可以使用base64位字符串来存储图片，
             既可以存入数据库，也可以在服务端将字符串转换为图片。
             目前我做的几个项目都是这么弄的。
             当然如果是专门的商城，或者图片网站，可能不建议这么做。
             */
            var naturalHeight = imgData.naturalHeight;
            var naturalWidth = imgData.naturalWidth;
            var croped = {
                x: Math.floor(data.x),
                y: Math.floor(data.y),
                width: Math.floor(data.width),
                height: Math.floor(data.height)
            };

            // 容错计算
            if (croped.x < 0) {
                croped.width = croped.width + croped.x;
                croped.x = 0;
            }
            if (croped.y < 0) {
                croped.height = croped.height + croped.y;
                croped.y = 0;
            }

            if (croped.x + croped.width > naturalWidth) {
                croped.width = naturalWidth - croped.x;
            }

            if (croped.y + croped.height > naturalHeight) {
                croped.height = naturalHeight - croped.y;
            }

            const input = {};
            input.fileName = self.temporaryPictureFileName;
            input.x = croped.x;
            input.y = croped.y;
            input.width = croped.width;
            input.height = croped.height;

            this.loading = true;
            ProfileService.updateProfilePicture(input)
                .then(() => {
                    const self = this;
                    self.$image.cropper('destroy');
                    self.$image = null;
                    abp.event.trigger('profilePictureChanged');
                    this.loading = false;
                    this.selfVisible = false;
                })
                .catch(() => {
                    this.loading = false;
                });
        }
    }
};
</script>
<style lang="scss">
.krajee-default.file-preview-frame .kv-file-content {
    height: auto;
    width: auto;
}
.krajee-default .file-caption-info,
.krajee-default .file-size-info {
    line-height: 18px !important;
    height: initial;
}
.krajee-default .file-footer-caption {
    margin-bottom: 16px;
}
.file-preview {
    padding: 10px;
    .fileinput-remove {
        top: 5px;
        right: 5px;
        line-height: 10px;
    }
}
.krajee-default .file-thumb-progress {
    top: 42px;
}
.krajee-default.file-preview-frame .file-thumbnail-footer {
    height: initial;
}
</style>
