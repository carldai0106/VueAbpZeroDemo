<template>
    <el-dialog :title="L('Permissions') + ' - ' + userName" v-loading="loading" :visible.sync="selfVisible" :modal-append-to-body="false" @open="handleOpen" @close="handleClose" top="1vh" width="600px">

        <PermissionTree :loading.sync="loading" :context.sync="permissionTree" :permissions="permissions"></PermissionTree>

        <div class="alert alert-warning" style="margin-bottom: 0; margin-top: 15px">
            <em>{{L('Note_RefreshPageForPermissionChanges')}}</em>
        </div>

        <span slot="footer" class="dialog-footer">
            <el-tooltip :content="L('ResetPermissionsTooltip')" placement="top">
                <el-button class="waves-effect pull-left" @click="resetPermissions">{{L('ResetSpecialPermissions')}}</el-button>
            </el-tooltip>
            <el-button class="waves-effect" @click="selfVisible = false">{{L('Cancel')}}</el-button>
            <el-button class="waves-effect" type="primary" @click="save">{{L('Save')}}</el-button>
        </span>
    </el-dialog>
</template>

<script type="text/ecmascript-6">
import PermissionTree from '../../../components/tree/PermissionTree';
import UserService from '../../../services/admin/UserService';
export default {
    props: {
        userId: Number,
        userName: String,
        display: Boolean
    },
    data() {
        return {
            selfVisible: this.display,
            loading: false,
            resettingPermissions: false,
            permissions: void 0,
            permissionTree: void 0
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
        handleOpen() {
            this.loadPermissions();
        },
        handleClose() {},
        loadPermissions() {
            this.loading = true;
            UserService.getUserPermissionsForEdit({
                id: this.userId
            }).then(
                rs => {
                    this.permissions = rs;
                },
                () => {
                    this.loading = false;
                }
            );
        },
        resetPermissions() {
            this.loading = true;
            var input = {};
            input.id = this.userId;
            this.resettingPermissions = true;
            UserService.resetUserSpecificPermissions(input).then(
                () => {
                    abp.notify.success(this.L('ResetSuccessfully'));

                    this.resettingPermissions = false;
                    this.loadPermissions();
                },
                () => {
                    this.resettingPermissions = false;
                }
            );
        },
        save() {
            this.loading = true;

            const input = {};
            input.id = this.userId;
            input.grantedPermissionNames = this.permissionTree.getGrantedPermissionNames();

            UserService.updateUserPermissions(input)
                .then(() => {
                    abp.notify.success(this.L('SavedSuccessfully'));

                    this.loading = false;
                    this.selfVisible = false;
                })
                .catch(() => {
                    this.loading = false;
                });
        }
    },
    components: { PermissionTree }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>