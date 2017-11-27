<template>
    <el-dialog v-loading="loading" :title="id ? L('EditEdition') + ' : ' + edition.displayName : L('CreateNewEdition')" :visible.sync="selfVisible" :modal-append-to-body="false" @open="handleOpen" @close="handleClose" top="5vh" width="600px">
        <el-tabs v-model="activeName" @tab-click="handleTabClick">
            <el-tab-pane :label="L('EditionProperties')" name="first">
                <el-form class="el-form-small" size="small" :model="edition" :rules="rules" ref="editionForm">
                    <el-form-item :label="L('EditionName')" prop="displayName">
                        <el-input v-model="edition.displayName" autofocus></el-input>
                    </el-form-item>
                    <el-form-item :label="L('SubscriptionPrice')" prop="isFree">
                        <el-radio-group v-model="initiation.isFree" style="width:100%;" size="medium" @change="changedFree">
                            <el-radio :label="true" style="width:40%;" border>{{L('Free')}}</el-radio>
                            <el-radio :label="false" style="width:40%;" border>{{L('Paid')}}</el-radio>
                        </el-radio-group>
                    </el-form-item>

                    <div v-if="!initiation.isFree" class="row mar-btm-5">
                        <div class="col-md-6">
                            <el-form-item :label="L('MonthlyPrice')" prop="monthlyPrice">
                                <el-input type="number" v-model.number="edition.monthlyPrice"></el-input>
                            </el-form-item>
                        </div>
                        <div class="col-md-6">
                            <el-form-item :label="L('AnnualPrice')" prop="annualPrice">
                                <el-input type="number" v-model.number="edition.annualPrice"></el-input>
                            </el-form-item>
                        </div>
                    </div>

                    <div :hidden="initiation.isFree">
                        <el-form-item label="" prop="isTrialActive">
                            <el-checkbox style="width:100%;" size="medium" v-model="initiation.isTrialActive" :label="L('IsTrialActive')" border></el-checkbox>
                        </el-form-item>

                        <el-form-item v-if="initiation.isTrialActive" :label="L('TrialDayCount')" prop="subscriptionEndDateUtc">
                            <el-input type="number" v-model.number="edition.trialDayCount"></el-input>
                        </el-form-item>

                        <el-form-item label="" prop="isWaitingDayActive">
                            <el-checkbox size="medium" style="width:100%;" v-model="initiation.isWaitingDayActive" :label="L('WaitAfterSubscriptionExpireDate')" border></el-checkbox>
                        </el-form-item>

                        <el-form-item v-if="initiation.isWaitingDayActive" :label="L('WaitingDayAfterExpire')" prop="subscriptionEndDateUtc">
                            <el-input type="number" v-model.number="edition.waitingDayAfterExpire"></el-input>
                        </el-form-item>

                        <el-form-item :label="L('WhatWillDoneAfterSubscriptionExpiry')" prop="expireAction">
                            <el-radio-group style="width:100%;" v-model="initiation.expireAction" size="medium" @change="changeExpireAction">
                                <el-radio label="DeactiveTenant" style="width:40%;" border>{{L('DeactiveTenant')}}</el-radio>
                                <el-radio label="AssignToAnotherEdition" style="width:40%;" border>{{L('AssignToAnotherEdition')}}</el-radio>
                            </el-radio-group>
                        </el-form-item>

                        <el-form-item v-if="initiation.expireAction == 'AssignToAnotherEdition'" :label="L('Edition')" prop="expiringEditionId">
                            <el-select style="width:100%;" size="small" v-model="edition.expiringEditionId" :placeholder="L('Select')">
                                <el-option v-for="(item, index) in expiringEditions" :key="index" :label="item.displayText" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                </el-form>
            </el-tab-pane>

            <el-tab-pane :label="L('Features')" name="second" style="min-height: 100px">
                <FeatureTree :loading.sync="loading" :featureData="feature" :context.sync="featureTree">
                </FeatureTree>
            </el-tab-pane>
        </el-tabs>
        <span slot="footer" class="dialog-footer">
            <el-button class="waves-effect" @click="selfVisible = false">{{L('Cancel')}}</el-button>
            <el-button class="waves-effect" type="primary" @click="save">{{L('Save')}}</el-button>
        </span>
    </el-dialog>
</template>

<script type="text/ecmascript-6">
import CommonLookupService from '../../../services/common/CommonLookupService';
import EditionService from '../../../services/admin/EditionService';
import FeatureTree from '../../../components/tree/FeatureTree';

export default {
    props: {
        id: Number,
        display: Boolean,
        onSave: Function
    },
    data() {
        let initVals = {
            isFree: true,
            isTrialActive: false,
            isWaitingDayActive: false,
            expireAction: 'DeactiveTenant'
        };

        return {
            activeName: 'first',
            selfVisible: this.display,
            loading: false,
            edition: {},
            feature: void 0,
            expiringEditions: [],
            initiation: initVals,
            rules: {
                displayName: [
                    {
                        required: true,
                        message: this.L(
                            'TheFieldIsRequired',
                            this.L('EditionName')
                        ),
                        trigger: 'change, blur'
                    }
                ],
                monthlyPrice: [
                    {
                        type: 'number',
                        required: false,
                        message: this.L(
                            'TheFieldIsRequired',
                            this.L('MonthlyPrice')
                        ),
                        trigger: 'change, blur'
                    }
                ],
                annualPrice: [
                    {
                        type: 'number',
                        required: false,
                        message: this.L(
                            'TheFieldIsRequired',
                            this.L('AnnualPrice')
                        ),
                        trigger: 'change, blur'
                    }
                ],
                expiringEditionId: [
                    {
                        required: false,
                        message: this.L(
                            'TheFieldIsRequired',
                            this.L('Edition')
                        ),
                        trigger: 'change, blur'
                    }
                ]
            },
            featureTree: void 0
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
    async created() {
        this.expiringEditions.push({
            value: null,
            displayText: this.L('NotAssigned'),
            isSelected: true
        });

        var rsEditions = await CommonLookupService.getEditionsForCombobox({
            onlyFreeItems: true
        });

        rsEditions.items.forEach(item => {
            this.expiringEditions.push(item);
        });
    },
    methods: {
        changedFree() {
            this.rules.monthlyPrice[0].required = !this.initiation.isFree;
            this.rules.annualPrice[0].required = !this.initiation.isFree;
        },
        changeExpireAction() {
            this.rules.expiringEditionId[0].required =
                this.initiation.expireAction === 'AssignToAnotherEdition';
        },
        handleOpen() {
            this.activeName = 'first';
            this.loading = true;
            EditionService.getEditionForEdit({ id: this.id })
                .then(
                    rs => {
                        var edition = rs.edition;
                        this.feature = {
                            features: rs.features,
                            featureValues: rs.featureValues
                        };
                        this.initiation.expireAction =
                            this.edition.expiringEditionId > 0
                                ? 'AssignToAnotherEdition'
                                : 'DeactiveTenant';

                        this.initiation.isFree =
                            !edition.monthlyPrice && !edition.annualPrice;
                        this.initiation.isTrialActive =
                            edition.trialDayCount > 0;
                        this.initiation.isWaitingDayActive =
                            edition.waitingDayAfterExpire > 0;

                        this.edition = edition;
                    },
                    () => {
                        this.loading = false;
                    }
                )
                .catch(() => {
                    this.loading = false;
                });
        },
        handleTabClick(item) {},
        handleClose() {
            this.$refs.editionForm.resetFields();
        },
        save() {
            var self = this;
            this.$refs.editionForm.validate(valid => {
                if (valid) {
                    this.loading = true;
                    var features = this.featureTree.getGrantedFeatures();
                    var input = {
                        edition: this.edition,
                        featureValues: features
                    };
                    EditionService.createOrUpdateEdition(input)
                        .then(() => {
                            abp.notify.success(self.L('SavedSuccessfully'));
                            this.loading = false;
                            this.selfVisible = false;
                            this.onSave &&
                                this.onSave(this.id ? 'edit' : 'add');
                        })
                        .catch(() => {
                            this.loading = false;
                        });
                } else {
                    this.loading = false;
                    return false;
                }
            });
        }
    },
    components: { FeatureTree }
};
</script>