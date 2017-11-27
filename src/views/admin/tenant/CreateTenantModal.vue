<template>
    <el-dialog :title="L('CreateNewTenant')" v-loading="loading" :visible.sync="selfVisible" :modal-append-to-body="false" @open="handleOpen" @close="handleClose" top="5vh">

        <el-form class="el-form-small" size="small" :model="tenant" :rules="rules" ref="createTenantForm" v-loading="loading">

            <el-form-item :label="L('TenancyName')" prop="tenancyName">
                <el-input v-model="tenant.tenancyName" :placeholder="L('TenancyName')"></el-input>
            </el-form-item>

            <el-form-item :label="L('Name')" prop="name">
                <el-input v-model="tenant.name" :placeholder="L('Name')"></el-input>
            </el-form-item>

            <el-form-item prop="useHostDb">
                <el-checkbox style="width:100%;" v-model="initVals.useHostDb" :label="L('UseHostDatabase')" border size="medium"></el-checkbox>
            </el-form-item>

            <el-form-item v-if="!initVals.useHostDb" :label="L('DatabaseConnectionString')" prop="connectionString">
                <el-input v-model="tenant.connectionString"></el-input>
            </el-form-item>

            <el-form-item :label="L('AdminEmailAddress')" prop="adminEmailAddress">
                <el-input v-model="tenant.adminEmailAddress"></el-input>
            </el-form-item>

            <el-form-item label="" prop="setRandomPassword">
                <el-checkbox size="medium" style="width:100%;" v-model="initVals.setRandomPassword" :label="L('SetRandomPassword')" border></el-checkbox>
            </el-form-item>

            <el-form-item v-if="initVals.setRandomPassword" :label="L('AdminPassword')" prop="adminPassword">
                <el-input type="password" v-model="tenant.adminPassword"></el-input>
            </el-form-item>

            <el-form-item v-if="initVals.setRandomPassword" :label="L('AdminPasswordRepeat')" prop="adminPasswordRepeat">
                <el-input type="password" v-model="tenant.adminPasswordRepeat"></el-input>
            </el-form-item>

            <el-form-item :label="L('Edition')" prop="editions">
                <el-select style="width:100%;" size="small" @change="onEditionChange($event)" v-model="tenant.editionId" :placeholder="L('Select')">
                    <el-option v-for="(item, index) in editions" :key="index" :label="item.displayText" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item :hidden="!initVals.isSubscriptionFieldsVisible" label="" prop="isUnlimited">
                <el-checkbox size="medium" style="width:100%;" v-model="initVals.isUnlimited" :label="L('UnlimitedTimeSubscription')" border @change="onUnlimitedChange"></el-checkbox>
            </el-form-item>

            <el-form-item :hidden="initVals.isUnlimited || !initVals.isSubscriptionFieldsVisible" :label="L('SubscriptionEndDate')" prop="subscriptionEndDateUtc">
                <el-date-picker v-model="tenant.subscriptionEndDateUtc" align="left" type="date" :editable="false" style="width:100%;">
                </el-date-picker>
            </el-form-item>

            <el-form-item :hidden="!initVals.isSubscriptionFieldsVisible" prop="isInTrialPeriod">
                <el-checkbox size="medium" style="width:100%;" v-model="tenant.isInTrialPeriod" :label="L('IsInTrialPeriod')" border :disabled="initVals.isSelectedEditionFree"></el-checkbox>

                <div style="margin-top:15px;margin-bottom:0px;padding:5px 15px;" class="alert alert-warning" v-if="initVals.isSelectedEditionFree">
                    {{L("FreeEditionsCannotHaveTrialVersions")}}
                </div>
            </el-form-item>

            <el-form-item>
                <ul class="ul-list">
                    <li>
                        <label class="checkbox-item">
                            <input type="checkbox" v-model="tenant.shouldChangePasswordOnNextLogin" />
                            <span>{{L('ShouldChangePasswordOnNextLogin')}}</span>
                        </label>
                    </li>
                    <li>
                        <label class="checkbox-item">
                            <input type="checkbox" v-model="tenant.sendActivationEmail" />
                            <span>{{L('SendActivationEmail')}}</span>
                        </label>
                    </li>
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
import ProfileService from '../../../services/admin/ProfileService';
import CommonLookupService from '../../../services/common/CommonLookupService';
import TenantService from '../../../services/admin/TenantService';

export default {
    props: {
        display: Boolean,
        onSave: Function
    },
    data() {
        var initialValues = {
            useHostDb: true,
            setRandomPassword: false,
            isUnlimited: true,
            isSubscriptionFieldsVisible: false,
            isSelectedEditionFree: false
        };
        var self = this;
        return {
            editions: [],
            initVals: initialValues,
            selfVisible: this.display,
            loading: false,
            tenant: {
                tenancyName: null,
                name: null,
                isActive: true,
                shouldChangePasswordOnNextLogin: true,
                sendActivationEmail: true,
                editionId: void 0,
                isInTrialPeriod: false,
                subscriptionEndDateUtc: null
            },
            title: '',
            passwordComplexitySetting: {},
            rules: {
                tenancyName: [
                    {
                        required: true,
                        message: this.L('TenantName_Regex_Description'),
                        trigger: 'blur'
                    },
                    {
                        pattern: /^[a-zA-Z][a-zA-Z0-9_-]{1,}$/,
                        message: this.L('TenantName_Regex_Description'),
                        trigger: 'blur'
                    }
                ],
                name: [
                    {
                        required: true,
                        message: this.L('TheFieldIsRequired', this.L('Name')),
                        trigger: 'blur'
                    }
                ],
                adminEmailAddress: [
                    {
                        required: true,
                        message: this.L(
                            'TheFieldIsRequired',
                            this.L('AdminEmailAddress')
                        ),
                        trigger: 'blur,change'
                    },
                    { type: 'email', trigger: 'blur,change' }
                ],
                adminPassword: [
                    {
                        required: !initialValues.setRandomPassword,
                        trigger: 'blur,change'
                    }
                ],
                adminPasswordRepeat: [
                    {
                        required: !initialValues.setRandomPassword,
                        trigger: 'blur,change'
                    },
                    {
                        validator: (rule, value, callback) => {
                            if (
                                value != undefined &&
                                value !== self.tenant.adminPassword
                            ) {
                                callback(
                                    new Error(
                                        self.L(
                                            'PasswordDoesNotMatch',
                                            self.L('AdminPasswordRepeat'),
                                            self.L('AdminPassword')
                                        )
                                    )
                                );
                            } else {
                                callback();
                            }
                        },
                        trigger: 'blur,change'
                    }
                ],
                subscriptionEndDateUtc: []
            }
        };
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

        var rs = await ProfileService.getPasswordComplexitySetting();
        var settings = rs.setting;
        this.passwordComplexitySetting = settings;
        if (settings.requireDigit) {
            var dignitRule = {
                pattern: /^[0-9]*$/,
                message: this.L('PasswordComplexity_RequireDigit_Hint'),
                trigger: 'blur,change'
            };
            this.rules.adminPassword.push(dignitRule);
            this.rules.adminPasswordRepeat.push(dignitRule);
        }
        if (settings.requireLowercase) {
            var lowercaseRule = {
                pattern: /[a-z]/,
                message: this.L('PasswordComplexity_RequireLowercase_Hint'),
                trigger: 'blur,change'
            };
            this.rules.adminPassword.push(lowercaseRule);
            this.rules.adminPasswordRepeat.push(lowercaseRule);
        }
        if (settings.requireUppercase) {
            var uppercase = {
                pattern: /[A-Z]/,
                message: this.L('PasswordComplexity_RequireUppercase_Hint'),
                trigger: 'blur,change'
            };
            this.rules.adminPassword.push(uppercase);
            this.rules.adminPasswordRepeat.push(uppercase);
        }
        if (settings.requireNonAlphanumeric) {
            var nonalphanumericRule = {
                pattern: /[0-9a-zA-Z]+$/,
                message: this.L(
                    'PasswordComplexity_RequireNonAlphanumeric_Hint'
                ),
                trigger: 'blur,change'
            };
            this.rules.adminPassword.push(nonalphanumericRule);
            this.rules.adminPasswordRepeat.push(nonalphanumericRule);
        }
        if (settings.requiredLength) {
            var lengthRule = {
                min: settings.requiredLength,
                message: this.L(
                    'PasswordComplexity_RequiredLength_Hint',
                    settings.requiredLength
                ),
                trigger: 'blur,change'
            };
            this.rules.adminPassword.push(lengthRule);
            this.rules.adminPasswordRepeat.push(lengthRule);
        }
    },
    mounted() {
        this.tenant.isActive = true;
        this.tenant.shouldChangePasswordOnNextLogin = true;
        this.tenant.sendActivationEmail = true;
        this.tenant.editionId = 0;
        this.tenant.isInTrialPeriod = false;
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
            this.loading = true;
            var defaultEditionName = await CommonLookupService.getDefaultEditionName();
            let defaultEdition = _.filter(this.editions, {
                displayText: defaultEditionName.name
            });

            if (defaultEdition && defaultEdition[0]) {
                this.tenant.editionId = defaultEdition[0].value;
                this.toggleSubscriptionFields();
            }
            this.loading = false;
        },
        handleClose() {
            this.$refs.createTenantForm.resetFields();
        },
        onUnlimitedChange() {
            if (
                this.initVals.isUnlimited ||
                parseInt(this.tenant.editionId) <= 0
            ) {
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
        selectedEditionIsFree() {
            let selectedEditions = _.filter(this.editions, {
                value: this.tenant.editionId
            });
            if (selectedEditions.length !== 1) {
                this.isSelectedEditionFree = true;
            }
            let selectedEdition = selectedEditions[0];
            this.initVals.isSelectedEditionFree = selectedEdition.isFree;
            return selectedEdition.isFree;
        },
        onEditionChange() {
            this.tenant.isInTrialPeriod =
                this.tenant.editionId > 0 && !this.selectedEditionIsFree();
            this.toggleSubscriptionFields();

            this.onUnlimitedChange();
        },
        toggleSubscriptionFields() {
            if (this.tenant.editionId > 0) {
                this.initVals.isSubscriptionFieldsVisible = true;
            } else {
                this.initVals.isSubscriptionFieldsVisible = false;
            }
        },
        save() {
            var self = this;
            this.$refs.createTenantForm.validate(valid => {
                if (valid) {
                    this.loading = true;
                    if (this.initVals.setRandomPassword) {
                        this.tenant.adminPassword = null;
                    }
                    if (parseInt(this.tenant.editionId) === 0) {
                        this.tenant.editionId = null;
                    }

                    if (!this.initVals.isUnlimited && this.tenant.editionId) {
                        this.tenant.subscriptionEndDateUtc = moment(
                            moment(this.tenant.subscriptionEndDateUtc).format(
                                'YYYY-MM-DDTHH:mm:ss'
                            ) + 'Z'
                        );
                    } else {
                        this.tenant.subscriptionEndDateUtc = null;
                    }

                    TenantService.createTenant(this.tenant)
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

