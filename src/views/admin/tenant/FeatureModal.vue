<template>
    <el-dialog :modal-append-to-body="false" :title="L('Features') + ' - ' + tenantName" v-loading="loading" :visible.sync="selfVisible" @open="handleOpen" @close="handleClose" top="5vh">

        <el-form class="el-form-small" size="small" ref="editTenantFeaturesForm" v-loading="loading">
            <el-form-item>
                <FeatureTree :loading.sync="loading" :featureData="features" :context.sync="featureTree"></FeatureTree>
            </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
            <el-tooltip :content="L('ResetFeaturesTooltip')" placement="top">
                <el-button class="waves-effect pull-left" @click="resetFeatures">{{L('ResetSpecialFeatures')}}</el-button>
            </el-tooltip>
            <el-button class="waves-effect" @click="selfVisible = false">{{L('Cancel')}}</el-button>
            <el-button class="waves-effect" type="primary" @click="save">{{L('Save')}}</el-button>
        </span>
    </el-dialog>
</template>

<script type="text/ecmascript-6">
import TenantService from '../../../services/admin/TenantService';
import FeatureTree from '../../../components/tree/FeatureTree';
import MessageHelper from '../../../base/MessageHelper';

export default {
    props: {
        tenantId: Number,
        tenantName: String,
        display: Boolean
    },
    data() {
        return {
            loading: false,
            selfVisible: this.display,
            resettingFeatures: false,
            features: void 0,
            featureTree: void 0
        };
    },
    mounted() {},
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
            this.loadFeatures();
        },
        handleClose() {},
        loadFeatures() {
            this.loading = true;
            TenantService.getTenantFeaturesForEdit({
                id: this.tenantId
            }).then(
                rs => {
                    this.features = rs;
                },
                () => {
                    this.loading = false;
                }
            );
        },
        resetFeatures() {
            var self = this;
            this.loading = true;
            const input = {};
            input.id = this.tenantId;
            this.resettingFeatures = true;
            TenantService.resetTenantSpecificFeatures(input).then(
                () => {
                    abp.notify.success(self.L('ResetSuccessfully'));

                    this.resettingFeatures = false;
                    this.loadFeatures();
                },
                () => {
                    this.loading = false;
                    this.resettingFeatures = false;
                }
            );
        },
        save() {
            var self = this;
            this.loading = true;
            if (!this.featureTree.areAllValuesValid()) {
                MessageHelper.warning(this.L('InvalidFeaturesWarning'));
                return;
            }

            const input = {};
            input.id = this.tenantId;
            input.featureValues = this.featureTree.getGrantedFeatures();

            TenantService.updateTenantFeatures(input)
                .then(() => {
                    abp.notify.success(self.L('SavedSuccessfully'));

                    this.loading = false;
                    this.selfVisible = false;
                })
                .catch(() => {
                    this.loading = false;
                });
        }
    },
    components: {
        FeatureTree
    }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>