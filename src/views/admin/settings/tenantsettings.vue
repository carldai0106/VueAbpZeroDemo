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

                    <el-tabs v-model="activeName" type="border-card" v-if="tenantSettings">
                        <el-tab-pane :label="L('General')" name="General" v-if="initial.showTimezoneSelection">
                            <div class="form-group">
                                <label for="">{{L('Timezone')}}</label>
                                <TimezoneSelect v-model="tenantSettings.general.timezone" :defaultTimezoneScope="timezoneScope.Tenant"></TimezoneSelect>
                            </div>
                        </el-tab-pane>

                        <el-tab-pane :label="L('Appearance')" name="Appearance">

                            <div class="row">
                                <div class="col-md-6">
                                    <el-form class="el-form-small" size="small">
                                        <h4>{{L("ApplicationLogo")}}</h4>
                                        <el-form-item>
                                            <el-upload :action="uploadLogoUrl" :auto-upload="false" :headers="uploadHeaders" :limit="1" :on-preview="handleLogoPreview" :on-remove="handleLogoRemove" :on-success="handleLogoSuccess" ref="uploadLogo">
                                                <el-button slot="trigger" size="small" type="primary">{{L("ChooseFile")}}</el-button>
                                                <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUploadLogo">{{L("Upload")}}</el-button>
                                                <el-button style="margin-left: 10px;" size="small" type="danger" @click="clearLogo">{{L("Clear")}}</el-button>
                                                <div slot="tip" class="el-upload__tip">{{L("UploadLogo_Info")}}</div>
                                            </el-upload>
                                        </el-form-item>
                                    </el-form>
                                </div>
                                <div class="col-md-6">
                                    <el-form v-if="tenant" class="el-form-small" size="small">
                                        <h4>{{L("CustomCSS")}}</h4>
                                        <p v-if="tenant.customCssId">
                                            <a :href="remoteServiceBaseUrl + '/TenantCustomization/GetCustomCss?id=' + tenant.customCssId" target="_blank">{{L('Download')}}</a>
                                        </p>
                                        <el-form-item>
                                            <el-upload :action="uploadCssUrl" :auto-upload="false" :headers="uploadHeaders" :limit="1" :on-preview="handleCssPreview" :on-remove="handleCssRemove" :on-success="handleCssSuccess" ref="uploadCss">
                                                <el-button slot="trigger" size="small" type="primary">{{L("ChooseFile")}}</el-button>
                                                <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUploadCss">{{L("Upload")}}</el-button>
                                                <el-button style="margin-left: 10px;" size="small" type="danger" @click="clearCustomCss">{{L("Clear")}}</el-button>
                                                <div slot="tip" class="el-upload__tip">{{L("UploadCSS_Info")}}</div>
                                            </el-upload>
                                        </el-form-item>
                                    </el-form>
                                </div>
                            </div>

                        </el-tab-pane>

                        <el-tab-pane :label="L('UserManagement')" name="UserManagement" v-if="tenantSettings.userManagement">
                            <el-form class="el-form-small" size="small">
                                <h4>{{L("FormBasedRegistration")}}</h4>
                                <el-form-item>
                                    <el-checkbox size="medium" style="width:100%;" v-model="tenantSettings.userManagement.allowSelfRegistration" :label="L('AllowUsersToRegisterThemselves')" border></el-checkbox>

                                    <span class="help-block">{{L("AllowUsersToRegisterThemselves_Hint")}}</span>
                                </el-form-item>
                                <!-- <div v-show="!tenantSettings.userManagement.allowSelfRegistration"> -->
                                <el-form-item>
                                    <el-checkbox size="medium" style="width:100%;" v-model="tenantSettings.userManagement.isNewRegisteredUserActiveByDefault" :label="L('NewRegisteredUsersIsActiveByDefault')" border></el-checkbox>

                                    <span class="help-block">{{L("NewRegisteredUsersIsActiveByDefault_Hint")}}</span>
                                </el-form-item>

                                <el-form-item>
                                    <el-checkbox size="medium" style="width:100%;" v-model="tenantSettings.userManagement.useCaptchaOnRegistration" :label="L('UseCaptchaOnRegistration')" border></el-checkbox>

                                </el-form-item>
                                <!-- </div> -->

                                <div v-if="!initial.isMultiTenancyEnabled && tenantSettings.ldap.isModuleEnabled">
                                    <el-form-item>
                                        <el-checkbox size="medium" style="width:100%;" v-model="tenantSettings.ldap.isEnabled" :label="L('EnableLdapAuthentication')" border></el-checkbox>
                                    </el-form-item>
                                    <div v-show="!settings.ldap.isEnabled">
                                        <el-form-item :label="L('DomainName')">
                                            <el-input type="text" v-model="tenantSettings.ldap.domain"></el-input>
                                        </el-form-item>
                                        <el-form-item :label="L('UserName')">
                                            <el-input type="text" v-model="tenantSettings.ldap.userName"></el-input>
                                        </el-form-item>
                                        <el-form-item :label="L('Password')">
                                            <el-input type="password" v-model="tenantSettings.ldap.password"></el-input>
                                        </el-form-item>
                                    </div>
                                </div>
                                <h4>{{L("OtherSettings")}}</h4>
                                <el-form-item>
                                    <el-checkbox size="medium" style="width:100%;" v-model="tenantSettings.userManagement.isEmailConfirmationRequiredForLogin" :label="L('EmailConfirmationRequiredForLogin')" border></el-checkbox>

                                </el-form-item>
                            </el-form>
                        </el-tab-pane>
                        <el-tab-pane :label="L('Security')" name="Security" v-if="tenantSettings.security">
                            <el-form class="el-form-small" size="small">
                                <h4>{{L("PasswordComplexity")}}</h4>
                                <el-form-item>
                                    <el-checkbox size="medium" style="width:100%;" v-model="tenantSettings.security.useDefaultPasswordComplexitySettings" :label="L('UseDefaultSettings')" border></el-checkbox>
                                </el-form-item>
                                <el-form-item>
                                    <el-checkbox size="medium" style="width:100%;" v-model="tenantSettings.security.passwordComplexity.requireDigit" v-if="!tenantSettings.security.useDefaultPasswordComplexitySettings" :label="L('PasswordComplexity_RequireDigit')" border></el-checkbox>

                                    <el-checkbox size="medium" style="width:100%;" v-model="tenantSettings.security.defaultPasswordComplexity.requireDigit" v-if="tenantSettings.security.useDefaultPasswordComplexitySettings" :label="L('PasswordComplexity_RequireDigit')" border disabled></el-checkbox>
                                </el-form-item>
                                <el-form-item>
                                    <el-checkbox size="medium" style="width:100%;" v-model="tenantSettings.security.passwordComplexity.requireLowercase" v-if="!tenantSettings.security.useDefaultPasswordComplexitySettings" :label="L('PasswordComplexity_RequireLowercase')" border></el-checkbox>

                                    <el-checkbox size="medium" style="width:100%;" v-model="tenantSettings.security.defaultPasswordComplexity.requireLowercase" v-if="tenantSettings.security.useDefaultPasswordComplexitySettings" :label="L('PasswordComplexity_RequireLowercase')" border disabled></el-checkbox>
                                </el-form-item>

                                <el-form-item>
                                    <el-checkbox size="medium" style="width:100%;" v-model="tenantSettings.security.passwordComplexity.requireNonAlphanumeric" v-if="!tenantSettings.security.useDefaultPasswordComplexitySettings" :label="L('PasswordComplexity_RequireNonAlphanumeric')" border></el-checkbox>

                                    <el-checkbox size="medium" style="width:100%;" v-model="tenantSettings.security.defaultPasswordComplexity.requireNonAlphanumeric" v-if="tenantSettings.security.useDefaultPasswordComplexitySettings" :label="L('PasswordComplexity_RequireNonAlphanumeric')" border disabled></el-checkbox>
                                </el-form-item>
                                <el-form-item>
                                    <el-checkbox size="medium" style="width:100%;" v-model="tenantSettings.security.passwordComplexity.requireUppercase" v-if="!tenantSettings.security.useDefaultPasswordComplexitySettings" :label="L('PasswordComplexity_RequireUppercase')" border></el-checkbox>

                                    <el-checkbox size="medium" style="width:100%;" v-model="tenantSettings.security.defaultPasswordComplexity.requireUppercase" v-if="tenantSettings.security.useDefaultPasswordComplexitySettings" :label="L('PasswordComplexity_RequireUppercase')" border disabled></el-checkbox>
                                </el-form-item>
                                <el-form-item :label="L('PasswordComplexity_RequiredLength')">
                                    <el-input type="number" v-model="tenantSettings.security.passwordComplexity.requiredLength" v-if="!tenantSettings.security.useDefaultPasswordComplexitySettings"></el-input>
                                    <el-input type="number" v-model="tenantSettings.security.defaultPasswordComplexity.requiredLength" v-if="tenantSettings.security.useDefaultPasswordComplexitySettings" disabled></el-input>

                                </el-form-item>
                                <h4>{{L("UserLockOut")}}</h4>
                                <el-form-item>
                                    <el-checkbox size="medium" style="width:100%;" v-model="tenantSettings.security.userLockOut.isEnabled" :label="L('EnableUserAccountLockingOnFailedLoginAttemts')" border></el-checkbox>
                                </el-form-item>
                                <el-form-item v-if="tenantSettings.security.userLockOut.isEnabled" :label="L('MaxFailedAccessAttemptsBeforeLockout')">
                                    <el-input type="number" v-model="tenantSettings.security.userLockOut.maxFailedAccessAttemptsBeforeLockout"></el-input>
                                </el-form-item>
                                <el-form-item v-if="tenantSettings.security.userLockOut.isEnabled" :label="L('DefaultAccountLockoutDurationAsSeconds')">
                                    <el-input type="number" v-model="tenantSettings.security.userLockOut.defaultAccountLockoutSeconds"></el-input>
                                </el-form-item>

                                <div v-if="!initial.isMultiTenancyEnabled || tenantSettings.security.twoFactorLogin.isEnabledForApplication">
                                    <h4>{{L("TwoFactorLogin")}}</h4>
                                    <el-form-item>
                                        <el-checkbox size="medium" style="width:100%;" v-model="tenantSettings.security.twoFactorLogin.isEnabled" :label="L('EnableTwoFactorLogin')" border></el-checkbox>
                                    </el-form-item>
                                    <el-form-item v-if="tenantSettings.security.twoFactorLogin.isEnabled">
                                        <el-checkbox size="medium" style="width:100%;" v-model="tenantSettings.security.twoFactorLogin.isEmailProviderEnabled" :label="L('IsEmailVerificationEnabled')" border></el-checkbox>
                                    </el-form-item>
                                    <el-form-item v-if="tenantSettings.security.twoFactorLogin.isEnabled">
                                        <el-checkbox size="medium" style="width:100%;" v-model="tenantSettings.security.twoFactorLogin.isSmsProviderEnabled" :label="L('IsSmsVerificationEnabled')" border></el-checkbox>
                                    </el-form-item>
                                    <el-form-item v-if="tenantSettings.security.twoFactorLogin.isEnabled">
                                        <el-checkbox size="medium" style="width:100%;" v-model="tenantSettings.security.twoFactorLogin.isGoogleAuthenticatorEnabled" :label="L('IsGoogleAuthenticatorEnabled')" border></el-checkbox>
                                    </el-form-item>
                                    <el-form-item v-if="tenantSettings.security.twoFactorLogin.isEnabled">
                                        <el-checkbox size="medium" style="width:100%;" v-model="tenantSettings.security.twoFactorLogin.isRememberBrowserEnabled" :label="L('AllowToRememberBrowserForTwoFactorLogin')" border></el-checkbox>
                                    </el-form-item>
                                </div>
                            </el-form>
                        </el-tab-pane>
                        <el-tab-pane :label="L('EmailSmtp')" name="EmailSmtp" v-if="!initial.isMultiTenancyEnabled">
                            <el-form class="el-form-small" size="small">
                                <el-form-item :label="L('DefaultFromAddress')">
                                    <el-input type="text" v-model="tenantSettings.email.defaultFromAddress"></el-input>
                                </el-form-item>
                                <el-form-item :label="L('DefaultFromDisplayName')">
                                    <el-input type="text" v-model="tenantSettings.email.defaultFromDisplayName"></el-input>
                                </el-form-item>
                                <el-form-item :label="L('SmtpHost')">
                                    <el-input type="text" v-model="tenantSettings.email.smtpHost"></el-input>
                                </el-form-item>
                                <el-form-item :label="L('SmtpPort')">
                                    <el-input type="number" v-model="tenantSettings.email.smtpPort"></el-input>
                                </el-form-item>
                                <el-form-item>
                                    <el-checkbox size="medium" style="width:100%;" v-model="tenantSettings.email.smtpUseDefaultCredentials" :label="L('UseDefaultCredentials')" border></el-checkbox>
                                </el-form-item>
                                <el-form-item :label="L('DomainName')" v-show="!tenantSettings.email.smtpUseDefaultCredentials">
                                    <el-input type="text" v-model="tenantSettings.email.smtpDomain"></el-input>
                                </el-form-item>
                                <el-form-item :label="L('UserName')" v-show="!tenantSettings.email.smtpUseDefaultCredentials">
                                    <el-input type="text" v-model="tenantSettings.email.smtpUserName"></el-input>
                                </el-form-item>
                                <el-form-item :label="L('Password')" v-show="!tenantSettings.email.smtpUseDefaultCredentials">
                                    <el-input type="password" v-model="tenantSettings.email.smtpPassword"></el-input>
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
                                    <el-input type="text" v-model="tenantSettings.billing.legalName"></el-input>
                                </el-form-item>
                                <el-form-item :label="L('Address')">
                                    <el-input type="textarea" :rows="5" v-model="tenantSettings.billing.address"></el-input>
                                </el-form-item>

                                <el-form-item :label="L('Tax/VatNo')">
                                    <el-input type="text" :rows="5" v-model="tenantSettings.billing.taxVatNo"></el-input>
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
import config from '../../../common/config';
import TimezoneSelect from '../../../components/select/TimezoneSelect';
import MessageHelper from '../../../base/MessageHelper.js';
import TokenHelper from '../../../common/js/TokenHelper';
import TenantSettingsService from '../../../services/admin/TenantSettingsService';
export default {
    data() {
        return {
            loading: false,
            activeName: 'General',
            timezoneScope: types.AppTimezoneScope,
            testEmailAddress: '',
            initial: {
                isMultiTenancyEnabled: abp.multiTenancy.isEnabled,
                showTimezoneSelection:
                    abp.clock.provider.supportsMultipleTimezone
            },
            remoteServiceBaseUrl: config.remoteUrl,
            tenantSettings: {
                general: {},
                userManagement: {},
                email: {},
                ldap: {},
                billing: {},
                security: {
                    defaultPasswordComplexity: {},
                    passwordComplexity: {},
                    twoFactorLogin: {},
                    userLockOut: {},
                    useDefaultPasswordComplexitySettings: false
                }
            },
            tenant: null,
            initialTimezone: null,
            usingDefaultTimezone: null,
            uploadCssUrl:
                config.remoteUrl + '/TenantCustomization/UploadCustomCss',
            uploadLogoUrl: config.remoteUrl + '/TenantCustomization/UploadLogo'
        };
    },
    computed: {
        ...mapState({
            user: state => state.session.user,
            sessionTenant: state => state.session.tenant
        }),
        uploadHeaders() {
            var bearer = 'Bearer ' + TokenHelper.getAccessToken();
            return { Authorization: bearer };
        }
    },
    created() {
        var self = this;
        self.tenant = this.sessionTenant;
        this.loading = true;
        Promise.all([this.setTestEmailAddress(), this.loadSettings()])
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
        async setTestEmailAddress() {
            this.testEmailAddress = this.user ? this.user.emailAddress : '';
        },
        async loadSettings() {
            var rs = await TenantSettingsService.getAllSettings();
            for (var key in this.tenantSettings) {
                if (key === 'security') {
                    for (var subKey in this.tenantSettings[key]) {
                        this.tenantSettings[key][subKey] = rs[key][subKey];
                    }
                } else {
                    this.tenantSettings[key] = rs[key];
                }
            }

            this.initialTimezone = rs.general.timezone;
            this.usingDefaultTimezone =
                rs.general.timezoneForComparison ===
                abp.setting.get('Abp.Timing.TimeZone');
        },
        sendTestEmail() {
            var self = this;
            this.loading = true;
            const input = {};
            input.emailAddress = this.testEmailAddress;
            TenantSettingsService.sendTestEmail(input)
                .then(result => {
                    abp.notify.success(self.L('TestEmailSentSuccessfully'));

                    this.loading = false;
                })
                .catch(() => {
                    this.loading = false;
                });
        },
        clearLogo() {
            var self = this;
            TenantSettingsService.clearLogo().then(() => {
                abp.notify.success(self.L('ClearedSuccessfully'));
            });
        },

        clearCustomCss() {
            var self = this;
            TenantSettingsService.clearCustomCss().then(() => {
                $('#TenantCustomCss').remove();
                abp.notify.success(self.L('ClearedSuccessfully'));
            });
        },
        handleLogoPreview() {},
        handleLogoRemove() {
            this.clearLogo();
        },
        handleCssPreview() {},
        handleCssRemove() {
            this.clearCustomCss();
        },
        handleLogoSuccess(response, file, fileList) {
            var self = this;
            if (response.success) {
                abp.notify.success(self.L('SavedSuccessfully'));
            } else {
                MessageHelper.error('', response.error.message);
            }
        },
        handleCssSuccess(response, file, fileList) {
            var self = this;
            if (response.success) {
                abp.notify.success(self.L('SavedSuccessfully'));

                var result = response.result;
                $('#TenantCustomCss').remove();
                $('head').append(
                    '<link id="TenantCustomCss" href="' +
                        config.remoteUrl +
                        '/TenantCustomization/GetCustomCss?id=' +
                        result.id +
                        '" rel="stylesheet"/>'
                );
            } else {
                MessageHelper.error('', response.error.message);
            }
        },
        submitUploadLogo() {
            this.$refs.uploadLogo.submit();
        },
        submitUploadCss() {
            this.$refs.uploadCss.submit();
        },
        saveAll() {
            this.loading = true;
            const self = this;
            TenantSettingsService.updateAllSettings(self.tenantSettings)
                .then(result => {
                    this.loading = false;
                    abp.notify.success(self.L('SavedSuccessfully'));
                    if (
                        abp.clock.provider.supportsMultipleTimezone &&
                        self.usingDefaultTimeZone &&
                        self.initialTimeZone !==
                            self.tenantSettings.general.timezone
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