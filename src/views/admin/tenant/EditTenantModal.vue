<template>
    <el-dialog :title="L('EditTenant') + ' : ' + tenant.tenancyName" v-loading="loading" :visible.sync="selfVisible" :modal-append-to-body="false" @open="handleOpen" @close="handleClose" top="5vh">

        <el-form class="el-form-small" size="small" :model="tenant" :rules="rules" ref="editTenantForm" v-loading="loading">

            <el-form-item :label="L('Name')" prop="name">
                <el-input v-model="tenant.name" :placeholder="L('Name')"></el-input>
            </el-form-item>

            <el-form-item v-if="initiation.currentConnectionString" prop="connectionString">
                <el-checkbox size="medium" style="width:100%;" v-model="tenant.connectionString" :label="L('DatabaseConnectionString')" border></el-checkbox>

                <div style="padding:5px 15px;" class="alert alert-warning" v-if="initiation.currentConnectionString">
                    {{L("TenantDatabaseConnectionStringChangeWarningMessage")}}
                </div>
            </el-form-item>

            <el-form-item :label="L('Edition')" prop="editions">
                <el-select style="width:100%;" size="small" @change="onEditionChange($event)" v-model="tenant.editionId" :placeholder="L('Select')">
                    <el-option v-for="(item, index) in editions" :key="index" :label="item.displayText" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item :hidden="!initiation.isSubscriptionFieldsVisible" label="" prop="isUnlimited">
                <el-checkbox size="medium" style="width:100%;" v-model="initiation.isUnlimited" @change="onUnlimitedChange" :label="L('UnlimitedTimeSubscription')" border></el-checkbox>
            </el-form-item>

            <el-form-item :hidden="initiation.isUnlimited || !initiation.isSubscriptionFieldsVisible" :label="L('SubscriptionEndDate')" prop="subscriptionEndDateUtc">
                <el-date-picker v-model="tenant.subscriptionEndDateUtc" align="left" type="date" :editable="false" style="width:100%;">
                </el-date-picker>
            </el-form-item>

            <el-form-item :hidden="!initiation.isSubscriptionFieldsVisible" prop="isInTrialPeriod">
                <el-checkbox size="medium" style="width:100%;" v-model="tenant.isInTrialPeriod" :label="L('IsInTrialPeriod')" border :disabled="selectedEditionIsFree"></el-checkbox>

                <div style="margin-top:15px;margin-bottom:0px;padding:5px 15px;" class="alert alert-warning" v-if="selectedEditionIsFree">
                    {{L("FreeEditionsCannotHaveTrialVersions")}}
                </div>
            </el-form-item>

            <el-form-item>
                <ul class="ul-list">
                    <li>
                        <label class="checkbox-item">
                            <input type="checkbox" v-model="tenant.isActive" />
                            <span>{{L('Active')}}</span>
                        </label>
                    </li>
                </ul>
            </el-form-item>

        </el-form>

        <span slot="footer" class="dialog-footer">
            <el-button class="waves-effect" @click="selfVisible = false">{{L('Cancel')}}</el-button>
            <el-button class="waves-effect" type="primary" @click="save">{{L('Save')}}</el-button>
        </span>
    </el-dialog>
</template>

<script type="text/ecmascript-6">
import * as _ from 'lodash';
import * as moment from 'moment';
import TenantService from '../../../services/admin/TenantService';
import CommonLookupService from '../../../services/common/CommonLookupService';

export default {
    props: {
        tenantId: Number,
        display: Boolean,
        onSave: Function
    },
    data() {
        var initVals = {
            currentConnectionString: '',
            isSubscriptionFieldsVisible: false,
            isUnlimited: false,
            subscriptionEndDateUtcIsValid: false
        };
        return {
            loading: false,
            selfVisible: this.display,
            initiation: initVals,
            editions: [],
            tenant: {
                name: '',
                connectionString: '',
                editionId: 0,
                subscriptionEndDateUtc: null,
                isInTrialPeriod: false,
                isActive: false
            },
            rules: {
                name: [
                    {
                        required: true,
                        message: this.L('TheFieldIsRequired', this.L('Name')),
                        trigger: 'blur, change'
                    }
                ],
                subscriptionEndDateUtc: []
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
    async created() {
        this.editions.push({
            value: 0,
            displayText: this.L('NotAssigned')
        });

        var rsEditions = await CommonLookupService.getEditionsForCombobox({
            onlyFreeItems: false
        });

        rsEditions.items.forEach(item => {
            this.editions.push(item);
        });
    },
    computed: {
        selectedEditionIsFree() {
            if (!this.tenant.editionId) {
                return true;
            }

            let selectedEditions = _.filter(this.editions, {
                value: this.tenant.editionId
            });
            if (selectedEditions.length !== 1) {
                return true;
            }

            let selectedEdition = selectedEditions[0];
            return selectedEdition.isFree;
        }
    },
    methods: {
        async handleOpen() {
            this.loading = true;
            try {
                var rs = await TenantService.getTenantForEdit({
                    id: this.tenantId
                });
                this.tenant = rs;
                this.initiation.currentConnectionString = rs.connectionString;
                this.tenant.editionId = rs.editionId + '' || 0;
                this.initiation.isUnlimited = !rs.subscriptionEndDateUtc;
                this.toggleSubscriptionFields();
            } finally {
                this.loading = false;
            }
        },
        handleClose() {},
        onEditionChange() {
            if (this.selectedEditionIsFree) {
                this.tenant.isInTrialPeriod = false;
            }
            this.toggleSubscriptionFields();
        },
        onUnlimitedChange() {
            if (this.initiation.isUnlimited) {
                this.rules.subscriptionEndDateUtc.shift();
                this.tenant.subscriptionEndDateUtc = null;
            } else {
                this.rules.subscriptionEndDateUtc.push({
                    type: 'date',
                    required: true,
                    message: this.L(
                        'TheFieldIsRequired',
                        this.L('SubscriptionEndDate')
                    ),
                    trigger: 'blur,change'
                });
            }
        },
        toggleSubscriptionFields() {
            if (this.tenant.editionId > 0) {
                this.initiation.isSubscriptionFieldsVisible = true;
            } else {
                this.initiation.isSubscriptionFieldsVisible = false;
            }
        },
        save() {
            var self = this;
            this.$refs.editTenantForm.validate(valid => {
                if (valid) {
                    this.loading = true;

                    if (parseInt(this.tenant.editionId) === 0) {
                        this.tenant.editionId = null;
                    }

                    if (!this.initiation.isUnlimited && this.tenant.editionId) {
                        this.tenant.subscriptionEndDateUtc = moment(
                            moment(this.tenant.subscriptionEndDateUtc).format(
                                'YYYY-MM-DDTHH:mm:ss'
                            ) + 'Z'
                        );
                    } else {
                        this.tenant.subscriptionEndDateUtc = null;
                    }

                    TenantService.updateTenant(this.tenant)
                        .then(() => {
                            abp.notify.success(self.L('SavedSuccessfully'));
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

<style lang="scss" rel="stylesheet/scss">

</style>