<template>
    <div v-loading="loading">
        <el-dialog :title="L('VerifyYourCode')" :visible.sync="selfVisible" :modal-append-to-body="false" @open="handleOpen" width="500px">
            <el-form class="el-form-small" size="small" :model="sms" :rules="rules" ref="smsForm">
                <el-form-item :label="L('YourCode')" prop="code">
                    <el-input type="text" v-model="sms.code" :placeholder="L('YourCode')" autofocus></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button class="waves-effect" @click="selfVisible = false">{{L('Cancel')}}</el-button>
                <el-button class="waves-effect" type="primary" @click="save">{{L('Verify')}}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script type="text/ecmascript-6">
import ProfileService from '../../../services/admin/ProfileService';
export default {
    props: {
        display: Boolean,
        onSave: Function
    },
    data() {
        return {
            selfVisible: this.display,
            loading: false,
            sms: {
                code: ''
            },
            rules: {
                code: [
                    {
                        required: true,
                        message: this.L(
                            'TheFieldIsRequired',
                            this.L('YourCode')
                        ),
                        trigger: 'blur,change'
                    }
                ]
            }
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
    mounted() {},
    methods: {
        handleOpen() {},
        save() {
            this.$refs.smsForm.validate(valid => {
                if (valid) {
                    this.loading = true;

                    ProfileService.verifySmsCode({ code: this.sms.code })
                        .then(() => {
                            abp.notify.success(
                                this.L('VerifiedSmsCodeSuccessfully')
                            );

                            this.loading = false;
                            this.selfVisible = false;
                            this.onSave && this.onSave();
                        })
                        .catch(() => {
                            this.loading = false;
                        });
                } else {
                    return false;
                }
            });
        }
    }
};
</script>
<style lang="scss" scoped>
.krajee-default.file-preview-frame .kv-file-content {
    height: auto;
}
</style>
