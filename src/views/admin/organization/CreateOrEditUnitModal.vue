<template>
    <el-dialog :title="this.id ? L('Edit') + ' : ' + this.displayName : L('NewOrganizationUnit')" :visible.sync="selfVisible" :modal-append-to-body="false" @open="handleOpen" @close="handleClose" width="500px" v-loading="loading">
        <el-form class="el-form-small" size="small" :model="organizationUnit" :rules="rules" ref="unitForm">
            <el-form-item :label="L('Name')" prop="displayName">
                <el-input v-model="organizationUnit.displayName" autofocus></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button class="waves-effect" @click="selfVisible = false">{{L('Cancel')}}</el-button>
            <el-button class="waves-effect" type="primary" @click="save">{{L('Save')}}</el-button>
        </span>
    </el-dialog>
</template>

<script type="text/ecmascript-6">
import OrganizationUnitService from '../../../services/admin/OrganizationUnitService';
export default {
    props: {
        parentId: Number,
        id: Number,
        displayName: String,
        display: Boolean,
        onSave: Function
    },
    data() {
        return {
            selfVisible: this.display,
            loading: false,
            organizationUnit: {},
            rules: {
                displayName: [
                    {
                        required: true,
                        message: this.L('TheFieldIsRequired', this.L('Name')),
                        trigger: 'change, blur'
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
        handleOpen() {
            this.organizationUnit = {
                parentId: this.parentId,
                id: this.id,
                displayName: this.displayName
            };
        },
        handleClose() {},
        createUnit() {
            var self = this;
            const createInput = {};
            createInput.parentId = this.organizationUnit.parentId;
            createInput.displayName = this.organizationUnit.displayName;

            OrganizationUnitService.createOrganizationUnit(createInput)
                .then(rs => {
                    abp.notify.success(self.L('SavedSuccessfully'));

                    this.loading = false;
                    this.selfVisible = false;
                    var output = {
                        type: 'create',
                        result: rs
                    };
                    this.onSave && this.onSave(output);
                })
                .catch(() => {
                    this.loading = false;
                });
        },
        updateUnit() {
            var self = this;
            const updateInput = {};
            updateInput.id = this.organizationUnit.id;
            updateInput.displayName = this.organizationUnit.displayName;

            OrganizationUnitService.updateOrganizationUnit(updateInput).then(
                rs => {
                    abp.notify.success(self.L('SavedSuccessfully'));
                    this.loading = false;
                    this.selfVisible = false;
                    var output = {
                        type: 'edit',
                        result: rs
                    };
                    this.onSave && this.onSave(output);
                },
                () => {
                    this.loading = false;
                }
            );
        },
        save() {
            this.$refs.unitForm.validate(valid => {
                this.loading = true;
                if (valid) {
                    if (!this.organizationUnit.id) {
                        this.createUnit();
                    } else {
                        this.updateUnit();
                    }
                } else {
                    this.loading = false;
                    return false;
                }
            });
        }
    }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>