<template>
    <el-dialog :title="L('ChangeTenant')" :visible.sync="selfVisible" @open="handleOpen" @close="handleClose" top="5vh" width="400px" v-loading="loading">

        <el-form class="el-form-small" size="small" ref="textForm">

            <el-form-item :label="L('TenancyName')" prop="tenancyName">
                <el-input ref="tenancyName" v-model="tenancyName" autofocus></el-input>
                <span class="help-block">{{L("LeaveEmptyToSwitchToHost")}}</span>
            </el-form-item>

        </el-form>

        <span slot="footer" class="dialog-footer">
            <el-button class="waves-effect" @click="selfVisible = false">{{L('Cancel')}}</el-button>
            <el-button class="waves-effect" type="primary" @click="save">{{L('Save')}}</el-button>
        </span>
    </el-dialog>
</template>

<script type="text/ecmascript-6">
import types from '../../common/types';
import MessageHelper from '../../base/MessageHelper';
import AccountService from '../../services/account/AccountService';
export default {
    props: {
        display: Boolean,
        tenantName: String
    },
    data() {
        return {
            loading: false,
            selfVisible: this.display,
            tenancyName: ''
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
        clickEnter(e) {
            if (e.keyCode == 13) {
                this.save();
            }
        },
        handleOpen() {
            $(window).bind('keypress', this.clickEnter);
            this.tenancyName = this.tenantName;
        },
        handleClose() {
            $(window).unbind('keypress', this.clickEnter);
        },
        save() {
            this.loading = true;
            if (!this.tenancyName) {
                abp.multiTenancy.setTenantIdCookie(undefined);
                this.loading = false;
                this.selfVisible = false;
                location.reload();
                return;
            }

            let input = {};
            input.tenancyName = this.tenancyName;
            AccountService.isTenantAvailable(input)
                .then(result => {
                    this.loading = false;
                    switch (result.state) {
                        case types.AppTenantAvailabilityState.Available:
                            abp.multiTenancy.setTenantIdCookie(result.tenantId);
                            this.selfVisible = false;
                            window.location.href = '/';
                            return;
                        case types.AppTenantAvailabilityState.InActive:
                            MessageHelper.warning(
                                '',
                                this.L('TenantIsNotActive', this.tenancyName)
                            );
                            break;
                        case types.AppTenantAvailabilityState.NotFound: // NotFound
                            MessageHelper.warning(
                                '',
                                this.L(
                                    'ThereIsNoTenantDefinedWithName{0}',
                                    this.tenancyName
                                )
                            );
                            break;
                    }
                })
                .catch(() => {
                    this.loading = false;
                });
        }
    }
};
</script>

<style lang="scss" rel="stylesheet/scss">

</style>