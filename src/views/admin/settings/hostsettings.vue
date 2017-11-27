<template>
    <div class="page-wrapper" v-loading="loading">
        <div class="breadcrumbs" id="breadcrumbs">
            <div class="breadcrumb">
                <a href="#">{{L('Administration')}}</a>
                <a href="#" class="active">{{L('Settings')}}</a>
            </div>
        </div>

        <!-- Content Header (Page header) -->
        <section class="content-header">
            <h1>
                {{L('Settings')}}
                <small>{{L("SettingsHeaderInfo")}}</small>
            </h1>
        </section>

        <!-- Main content -->
        <section class="content container-fluid">
            <div class="box box-primary">
                <div class="box-body">
                    <div class="toolbar">
                        <button class="waves-effect btn btn-primary" @click="saveAll">
                            <i class="fa fa-floppy-o"></i> {{L('SaveAll')}}
                        </button>
                    </div>

                    <el-tabs v-model="activeName" type="border-card" v-if="initial.showHostSettings">
                        <el-tab-pane :label="L('General')" name="General" v-if="initial.showTimezoneSelection">
                            <div class="form-group">
                                <label for="">{{L('Timezone')}}</label>
                                <TimezoneSelect v-model="hostSettings.general.timezone" :defaultTimezoneScope="timezoneScope.Application"></TimezoneSelect>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane :label="L('TenantManagement')" name="TenantManagement" v-if="hostSettings.tenantManagement">
                            <el-form class="el-form-small" size="small">
                                <h4>{{L("FormBasedRegistration")}}</h4>
                                <el-form-item style="margin-bottom:0">
                                    <el-checkbox size="medium" style="width:100%;" v-model="hostSettings.tenantManagement.allowSelfRegistration" :label="L('AllowTenantsToRegisterThemselves')" border></el-checkbox>
                                    <span class="help-block">{{L("AllowTenantsToRegisterThemselves_Hint")}}</span>
                                </el-form-item>
                                <el-form-item style="margin-bottom:0">
                                    <el-checkbox size="medium" style="width:100%;" v-model="hostSettings.tenantManagement.isNewRegisteredTenantActiveByDefault" :label="L('NewRegisteredTenantsIsActiveByDefault')" border></el-checkbox>
                                    <span class="help-block">{{L("NewRegisteredTenantsIsActiveByDefault_Hint")}}</span>
                                </el-form-item>
                                <el-form-item>
                                    <el-checkbox size="medium" style="width:100%;" v-model="hostSettings.tenantManagement.useCaptchaOnRegistration" :label="L('UseCaptchaOnRegistration')" border></el-checkbox>
                                </el-form-item>
                                <el-form-item :label="L('Edition')">
                                    <el-select style="width:100%;" size="small" v-model="hostSettings.tenantManagement.defaultEditionId" :placeholder="L('Select')">
                                        <el-option v-for="(item, index) in editions" :key="index" :label="item.displayText" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-form>
                        </el-tab-pane>
                        <el-tab-pane :label="L('UserManagement')" name="UserManagement" v-if="hostSettings.userManagement">
                            <el-form class="el-form-small" size="small">
                                <el-form-item>
                                    <el-checkbox size="medium" style="width:100%;" v-model="hostSettings.userManagement.isEmailConfirmationRequiredForLogin" :label="L('EmailConfirmationRequiredForLogin')" border></el-checkbox>
                                </el-form-item>
                                <el-form-item>
                                    <el-checkbox size="medium" style="width:100%;" v-model="hostSettings.userManagement.smsVerificationEnabled" :label="L('SmsVerificationEnabled')" border></el-checkbox>
                                </el-form-item>
                            </el-form>
                        </el-tab-pane>
                        <el-tab-pane :label="L('Security')" name="Security" v-if="hostSettings.security">
                            <el-form class="el-form-small" size="small">
                                <h4>{{L("PasswordComplexity")}}</h4>
                                <el-form-item>
                                    <el-checkbox size="medium" style="width:100%;" v-model="hostSettings.security.useDefaultPasswordComplexitySettings" :label="L('UseDefaultSettings')" border></el-checkbox>
                                </el-form-item>
                                <el-form-item>
                                    <el-checkbox size="medium" style="width:100%;" v-model="hostSettings.security.passwordComplexity.requireDigit" v-if="!hostSettings.security.useDefaultPasswordComplexitySettings" :label="L('PasswordComplexity_RequireDigit')" border></el-checkbox>

                                    <el-checkbox size="medium" style="width:100%;" v-model="hostSettings.security.defaultPasswordComplexity.requireDigit" v-if="hostSettings.security.useDefaultPasswordComplexitySettings" :label="L('PasswordComplexity_RequireDigit')" border disabled></el-checkbox>
                                </el-form-item>
                                <el-form-item>
                                    <el-checkbox size="medium" style="width:100%;" v-model="hostSettings.security.passwordComplexity.requireLowercase" v-if="!hostSettings.security.useDefaultPasswordComplexitySettings" :label="L('PasswordComplexity_RequireLowercase')" border></el-checkbox>

                                    <el-checkbox size="medium" style="width:100%;" v-model="hostSettings.security.defaultPasswordComplexity.requireLowercase" v-if="hostSettings.security.useDefaultPasswordComplexitySettings" :label="L('PasswordComplexity_RequireLowercase')" border disabled></el-checkbox>
                                </el-form-item>

                                <el-form-item>
                                    <el-checkbox size="medium" style="width:100%;" v-model="hostSettings.security.passwordComplexity.requireNonAlphanumeric" v-if="!hostSettings.security.useDefaultPasswordComplexitySettings" :label="L('PasswordComplexity_RequireNonAlphanumeric')" border></el-checkbox>

                                    <el-checkbox size="medium" style="width:100%;" v-model="hostSettings.security.defaultPasswordComplexity.requireNonAlphanumeric" v-if="hostSettings.security.useDefaultPasswordComplexitySettings" :label="L('PasswordComplexity_RequireNonAlphanumeric')" border disabled></el-checkbox>
                                </el-form-item>
                                <el-form-item>
                                    <el-checkbox size="medium" style="width:100%;" v-model="hostSettings.security.passwordComplexity.requireUppercase" v-if="!hostSettings.security.useDefaultPasswordComplexitySettings" :label="L('PasswordComplexity_RequireUppercase')" border></el-checkbox>

                                    <el-checkbox size="medium" style="width:100%;" v-model="hostSettings.security.defaultPasswordComplexity.requireUppercase" v-if="hostSettings.security.useDefaultPasswordComplexitySettings" :label="L('PasswordComplexity_RequireUppercase')" border disabled></el-checkbox>
                                </el-form-item>
                                <el-form-item :label="L('PasswordComplexity_RequiredLength')">
                                    <el-input type="number" v-model="hostSettings.security.passwordComplexity.requiredLength" v-if="!hostSettings.security.useDefaultPasswordComplexitySettings"></el-input>
                                    <el-input type="number" v-model="hostSettings.security.defaultPasswordComplexity.requiredLength" v-if="hostSettings.security.useDefaultPasswordComplexitySettings" disabled></el-input>

                                </el-form-item>
                                <h4>{{L("UserLockOut")}}</h4>
                                <el-form-item>
                                    <el-checkbox size="medium" style="width:100%;" v-model="hostSettings.security.userLockOut.isEnabled" :label="L('EnableUserAccountLockingOnFailedLoginAttemts')" border></el-checkbox>
                                </el-form-item>
                                <div v-show="hostSettings.security.userLockOut.isEnabled">
                                    <el-form-item :label="L('MaxFailedAccessAttemptsBeforeLockout')">
                                        <el-input type="number" v-model="hostSettings.security.userLockOut.maxFailedAccessAttemptsBeforeLockout"></el-input>
                                    </el-form-item>
                                    <el-form-item :label="L('DefaultAccountLockoutDurationAsSeconds')">
                                        <el-input type="number" v-model="hostSettings.security.userLockOut.defaultAccountLockoutSeconds"></el-input>
                                    </el-form-item>
                                </div>
                                <h4>{{L("TwoFactorLogin")}}</h4>
                                <el-form-item>
                                    <el-checkbox size="medium" style="width:100%;" v-model="hostSettings.security.twoFactorLogin.isEnabled" :label="L('EnableTwoFactorLogin')" border></el-checkbox>
                                </el-form-item>
                                <el-form-item v-if="hostSettings.security.twoFactorLogin.isEnabled">
                                    <el-checkbox size="medium" style="width:100%;" v-model="hostSettings.security.twoFactorLogin.isEmailProviderEnabled" :label="L('IsEmailVerificationEnabled')" border></el-checkbox>
                                </el-form-item>
                                <el-form-item v-if="hostSettings.security.twoFactorLogin.isEnabled">
                                    <el-checkbox size="medium" style="width:100%;" v-model="hostSettings.security.twoFactorLogin.isSmsProviderEnabled" :label="L('IsSmsVerificationEnabled')" border></el-checkbox>
                                </el-form-item>
                                <el-form-item v-if="hostSettings.security.twoFactorLogin.isEnabled">
                                    <el-checkbox size="medium" style="width:100%;" v-model="hostSettings.security.twoFactorLogin.isGoogleAuthenticatorEnabled" :label="L('IsGoogleAuthenticatorEnabled')" border></el-checkbox>
                                </el-form-item>
                                <el-form-item v-if="hostSettings.security.twoFactorLogin.isEnabled">
                                    <el-checkbox size="medium" style="width:100%;" v-model="hostSettings.security.twoFactorLogin.isRememberBrowserEnabled" :label="L('AllowToRememberBrowserForTwoFactorLogin')" border></el-checkbox>
                                </el-form-item>
                            </el-form>
                        </el-tab-pane>
                        <el-tab-pane :label="L('EmailSmtp')" name="EmailSmtp" v-if="hostSettings.email">
                            <el-form class="el-form-small" size="small">
                                <el-form-item :label="L('DefaultFromAddress')">
                                    <el-input type="text" v-model="hostSettings.email.defaultFromAddress"></el-input>
                                </el-form-item>
                                <el-form-item :label="L('DefaultFromDisplayName')">
                                    <el-input type="text" v-model="hostSettings.email.defaultFromDisplayName"></el-input>
                                </el-form-item>
                                <el-form-item :label="L('SmtpHost')">
                                    <el-input type="text" v-model="hostSettings.email.smtpHost"></el-input>
                                </el-form-item>
                                <el-form-item :label="L('SmtpPort')">
                                    <el-input type="number" v-model="hostSettings.email.smtpPort"></el-input>
                                </el-form-item>
                                <el-form-item>
                                    <el-checkbox size="medium" style="width:100%;" v-model="hostSettings.email.smtpUseDefaultCredentials" :label="L('UseDefaultCredentials')" border></el-checkbox>
                                </el-form-item>
                                <el-form-item :label="L('DomainName')" v-show="!hostSettings.email.smtpUseDefaultCredentials">
                                    <el-input type="text" v-model="hostSettings.email.smtpDomain"></el-input>
                                </el-form-item>
                                <el-form-item :label="L('UserName')" v-show="!hostSettings.email.smtpUseDefaultCredentials">
                                    <el-input type="text" v-model="hostSettings.email.smtpUserName"></el-input>
                                </el-form-item>
                                <el-form-item :label="L('Password')" v-show="!hostSettings.email.smtpUseDefaultCredentials">
                                    <el-input type="password" v-model="hostSettings.email.smtpPassword"></el-input>
                                </el-form-item>
                                <hr />
                                <h4>{{L("TestEmailSettingsHeader")}}</h4>
                                <div class="row">
                                    <div class="form-group col-md-4">
                                        <input type="text" class="form-control" v-model="testEmailAddress">
                                    </div>
                                    <div class="form-group col-md-2">
                                        <button class="waves-effect btn btn-primary" type="button" @click="sendTestEmail">{{L("SendTestEmail")}}</button>
                                    </div>
                                </div>
                            </el-form>
                        </el-tab-pane>
                        <el-tab-pane :label="L('Invoice')" name="Invoice">
                            <el-form class="el-form-small" size="small">

                                <h4>{{L("InvoiceInformation")}}</h4>

                                <el-form-item :label="L('LegalName')">
                                    <el-input type="text" v-model="hostSettings.billing.legalName"></el-input>
                                </el-form-item>
                                <el-form-item :label="L('Address')">
                                    <el-input type="textarea" :rows="5" v-model="hostSettings.billing.address"></el-input>
                                </el-form-item>
                            </el-form>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>
        </section>

    </div>
</template>

<script type="text/ecmascript-6">
import { mapState } from 'vuex';
import types from '../../../common/types';
import TimezoneSelect from '../../../components/select/TimezoneSelect';
import MessageHelper from '../../../base/MessageHelper.js';
import HostSettingsService from '../../../services/admin/HostSettingsService';
import CommonLookupService from '../../../services/common/CommonLookupService';
export default {
    data() {
        return {
            loading: false,
            activeName: 'General',
            timezoneScope: types.AppTimezoneScope,
            testEmailAddress: '',
            initial: {
                showHostSettings: false,
                showTimezoneSelection:
                    abp.clock.provider.supportsMultipleTimezone
            },
            hostSettings: {
                billing: {},
                email: {},
                general: {},
                security: {
                    defaultPasswordComplexity: {},
                    passwordComplexity: {},
                    twoFactorLogin: {},
                    userLockOut: {},
                    useDefaultPasswordComplexitySettings: false
                },
                tenantManagement: {},
                userManagement: {}
            },
            initialTimezone: null,
            usingDefaultTimezone: null,
            editions: []
        };
    },
    computed: {
        ...mapState({
            user: state => state.session.user
        })
    },
    async created() {
        var self = this;
        this.loading = true;
        this.testEmailAddress = this.user ? this.user.emailAddress : '';
        Promise.all([this.loadEditions(), this.loadHostSettings()])
            .then(() => {
                self.loading = false;
            })
            .catch(() => {
                self.loading = false;
            });
    },
    mounted() {
        if (!this.initial.showTimezoneSelection) {
            this.activeName = 'Invoice';
        }
    },
    methods: {
        async loadHostSettings() {
            var rs = await HostSettingsService.getAllSettings();
            if (rs) {
                this.initial.showHostSettings = true;
            } else {
                this.initial.showHostSettings = false;
            }

            for (var key in this.hostSettings) {
                if (key === 'security') {
                    for (var subKey in this.hostSettings[key]) {
                        this.hostSettings[key][subKey] = rs[key][subKey];
                    }
                } else {
                    this.hostSettings[key] = rs[key];
                }
            }

            this.initialTimezone = rs.general.timezone;
            this.usingDefaultTimezone =
                rs.general.timezoneForComparison ===
                abp.setting.get('Abp.Timing.TimeZone');
        },
        async loadEditions() {
            this.editions.push({
                value: null,
                displayText: this.L('NotAssigned'),
                isSelected: true
            });

            var rs = await CommonLookupService.getEditionsForCombobox({
                onlyFreeItems: false
            });
            rs.items.forEach(item => {
                this.editions.push(item);
            });
        },
        sendTestEmail() {
            var self = this;
            this.loading = true;
            const input = {};
            input.emailAddress = this.testEmailAddress;
            HostSettingsService.sendTestEmail(input)
                .then(result => {
                    abp.notify.success(self.L('TestEmailSentSuccessfully'));

                    this.loading = false;
                })
                .catch(() => {
                    this.loading = false;
                });
        },
        saveAll() {
            this.loading = true;
            const self = this;
            HostSettingsService.updateAllSettings(self.hostSettings)
                .then(result => {
                    this.loading = false;
                    abp.notify.success(self.L('SavedSuccessfully'));

                    if (
                        abp.clock.provider.supportsMultipleTimezone &&
                        self.usingDefaultTimeZone &&
                        self.initialTimeZone !==
                            self.hostSettings.general.timezone
                    ) {
                        MessageHelper.info(
                            self.L(
                                'TimeZoneSettingChangedRefreshPageNotification'
                            )
                        ).then(function() {
                            window.location.reload();
                        });
                    }
                })
                .catch(() => {
                    this.loading = false;
                });
        }
    },
    components: { TimezoneSelect }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.help-block {
    margin: 0 0 5px 0;
}
</style>