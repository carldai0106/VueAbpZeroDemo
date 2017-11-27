<template>
    <el-dialog :title="role.id? L('EditRole') + ' : ' + role.displayName : L('CreateNewRole')" :visible.sync="selfVisible" :modal-append-to-body="false" v-loading="loading" @open="handleOpen" @close="handleClose" width="600px" top="2vh">
        <el-tabs v-model="activeName" @tab-click="handleTabClick">
            <el-tab-pane :label="L('RoleProperties')" name="first">
                <el-form class="el-form-small" size="small" :model="role" :rules="rules" ref="roleForm" label-width="100px">
                    <el-form-item :label="L('RoleName')" prop="displayName">
                        <el-input v-model="role.displayName" autofocus></el-input>
                    </el-form-item>
                    <el-form-item label="" prop="isDefault">
                        <el-checkbox style="width:100%;" v-model="role.isDefault" :label="L('Default')" border size="medium"></el-checkbox>
                        {{L('DefaultRole_Description')}}
                    </el-form-item>

                </el-form>
            </el-tab-pane>

            <el-tab-pane :label="L('Permissions')" name="second" style="min-height: 100px">
                <PermissionTree :loading.sync="loading" :context.sync="permissionTree" :permissions="permissions"></PermissionTree>
            </el-tab-pane>
        </el-tabs>
        <div class="help-block">
            <em>{{L('Note_RefreshPageForPermissionChanges')}}</em>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button class="waves-effect" @click="selfVisible = false">{{L('Cancel')}}</el-button>
            <el-button class="waves-effect" type="primary" @click="save">{{L('Save')}}</el-button>
        </span>
    </el-dialog>
</template>

<script type="text/ecmascript-6">
import PermissionTree from '../../../components/tree/PermissionTree.vue';
import RoleService from '../../../services/admin/RoleService';
export default {
    props: {
        roleId: Number,
        display: Boolean,
        onSave: Function
    },
    data() {
        return {
            activeName: 'first',
            selfVisible: this.display,
            loading: false,
            role: {},
            permissions: void 0,
            title: '',
            rules: {
                displayName: [
                    {
                        required: true,
                        message: this.L(
                            'TheFieldIsRequired',
                            this.L('RoleName')
                        ),
                        trigger: 'change,blur'
                    }
                ]
            },
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
        async handleOpen() {
            this.activeName = 'first';
            this.loading = true;

            var rs = await RoleService.getRoleForEdit({ id: this.roleId });
            this.role = rs.role;
            this.permissions = rs;
        },
        handleTabClick(item) {},
        handleClose() {},
        save() {
            var self = this;
            this.$refs.roleForm.validate(valid => {
                if (valid) {
                    this.loading = true;
                    var rs = this.permissionTree.getGrantedPermissionNames();
                    RoleService.createOrUpdateRole({
                        role: this.role,
                        grantedPermissionNames: rs
                    })
                        .then(() => {
                            abp.notify.success(self.L('SavedSuccessfully'));
                            this.loading = false;
                            this.selfVisible = false;
                            this.onSave &&
                                this.onSave(this.role.id ? 'edit' : 'add');
                        })
                        .catch(() => {
                            this.loading = false;
                        });
                } else {
                    return false;
                }
            });
        }
    },
    components: {
        PermissionTree
    }
};
</script>