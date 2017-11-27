<template>
    <el-dialog :title="L('LinkNewAccount')" :visible.sync="selfVisible" @open="handleOpen" @close="handleClose" width="500px" v-loading="loading" :modal-append-to-body="false">
        <el-form class="el-form-small" size="small" :model="linkUser" :rules="rules" ref="linkUserForm">
            <el-form-item :label="L('TenancyName')" prop="tenancyName">
                <el-input type="text" v-model="linkUser.tenancyName" autofocus></el-input>
            </el-form-item>
            <el-form-item :label="L('UserName')" prop="usernameOrEmailAddress">
                <el-input type="text" v-model="linkUser.usernameOrEmailAddress" auto-complete="false"></el-input>
            </el-form-item>
            <el-form-item :label="L('Password')" prop="password">
                <el-input type="password" v-model="linkUser.password"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button class="waves-effect" @click="selfVisible = false">{{L('Cancel')}}</el-button>
            <el-button class="waves-effect" type="primary" @click="save">{{L('Save')}}</el-button>
        </span>
    </el-dialog>
</template>

<script type="text/ecmascript-6">
import UserLinkService from '../../../services/admin/UserLinkService';
export default {
    props: {
        display: Boolean,
        onSave: Function
    },
    data() {
        return {
            linkUser: {
                tenancyName: '',
                userName: '',
                password: ''
            },
            selfVisible: this.display,
            loading: false,
            rules: {
                usernameOrEmailAddress: [
                    {
                        required: true,
                        message: this.L(
                            'TheFieldIsRequired',
                            this.L('UserName')
                        ),
                        trigger: 'change, blur'
                    }
                ],
                password: [
                    {
                        required: true,
                        message: this.L(
                            'TheFieldIsRequired',
                            this.L('Password')
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
    methods: {
        handleOpen() {},
        handleClose() {
            this.$refs.linkUserForm.resetFields();
        },
        save() {
            this.$refs.linkUserForm.validate(valid => {
                if (valid) {
                    this.loading = true;
                    UserLinkService.linkToUser(this.linkUser)
                        .then(() => {
                            abp.notify.success(this.L('SavedSuccessfully'));

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

<style lang="stylus" rel="stylesheet/stylus">
</style>