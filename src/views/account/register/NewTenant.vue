<template>
    <div id="registerZone" v-loading="loading" style="padding-bottom: 10px;">
        <p class="title">({{L("Edition")}}: {{model.edition.displayName}})</p>
        <ul class="form-wrapper register">
            <li class="hint">
                {{L("TenantInformations")}}
            </li>
            <li>
                <div class="form-group">
                    <div class="input-group ">
                        <div class="input-group-addon">
                            <i class="fa fa-hospital-o"></i>
                        </div>
                        <input autofocus autocomplete="off" v-validate="{ required: true, regex: /^[a-zA-Z][a-zA-Z0-9_-]{1,}$/ }" v-model="model.tenancyName" id="TenancyName" name="TenancyName" type="text" class="form-control" :placeholder="L('TenancyName')">
                    </div>
                    <div v-show="errors.firstRule('TenancyName') == 'required'" class="field-validation-error">
                        <span>{{L('TheFieldIsRequired', L('TenancyName'))}}</span>
                    </div>
                    <div v-show="errors.firstRule('TenancyName') == 'regex'" class="field-validation-error">
                        <span>{{L('TenantName_Regex_Description')}}</span>
                    </div>
                </div>
            </li>
            <li>
                <div class="form-group">
                    <div class="input-group ">
                        <div class="input-group-addon">
                            <i class="fa fa-user-o"></i>
                        </div>
                        <input v-validate="'required'" v-model="model.name" autocomplete="off" id="Name" name="Name" type="text" class="form-control" :placeholder="L('Name')">
                    </div>
                    <div v-show="errors.has('Name')" class="field-validation-error">
                        <span>{{L('TheFieldIsRequired', L('Name'))}}</span>
                    </div>
                </div>
            </li>
            <li class="hint">
                {{L("AccountSettings")}}
            </li>
            <li>
                <div class="form-group">
                    <div class="input-group ">
                        <div class="input-group-addon">
                            <i class="fa fa-envelope-o"></i>
                        </div>
                        <input v-validate="'required|email'" v-model="model.adminEmailAddress" id="AdminEmailAddress" name="AdminEmailAddress" autocomplete="off" type="text" class="form-control" :placeholder="L('AdminEmailAddress')">
                    </div>
                    <ul class="field-validation-error text-left" v-show="errors.has('AdminEmailAddress')">
                        <li v-show="errors.firstRule('AdminEmailAddress') == 'required'">{{L("TheFieldIsRequired", L("AdminEmailAddress"))}}</li>
                        <li v-show="errors.firstRule('AdminEmailAddress') == 'email'">{{L("EnterAValidEmail")}}</li>
                    </ul>
                </div>
            </li>
            <li>
                <div class="form-group">
                    <div class="input-group">
                        <div class="input-group-addon">
                            <i class="fa fa-asterisk"></i>
                        </div>
                        <input v-validate="getRules+'|confirmed:PasswordRepeat'" v-model="model.adminPassword" id="AdminPassword" name="AdminPassword" type="password" class="form-control" :placeholder="L('AdminPassword')" />
                    </div>
                    <ul class="field-validation-error text-left" v-show="errors.has('AdminPassword')">
                        <li v-show="errors.firstRule('AdminPassword') == 'required'">{{L("TheFieldIsRequired", L("Password"))}}</li>
                        <li v-show="errors.firstRule('AdminPassword') == 'digits'">{{L("PasswordComplexity_RequireDigit_Hint")}}</li>
                        <li v-show="errors.firstRule('AdminPassword') == 'lowercase'">{{L("PasswordComplexity_RequireLowercase_Hint")}}</li>
                        <li v-show="errors.firstRule('AdminPassword') == 'uppercase'">{{L("PasswordComplexity_RequireUppercase_Hint")}}</li>
                        <li v-show="errors.firstRule('AdminPassword') == 'nonAlphanumeric'">{{L("PasswordComplexity_RequireNonAlphanumeric_Hint")}}</li>
                        <li v-show="errors.firstRule('AdminPassword') == 'min'">{{L("PasswordComplexity_RequiredLength_Hint", settings.requiredLength)}}</li>
                        <li v-show="errors.firstRule('AdminPassword') == 'confirmed'">{{L('PasswordDoesNotMatch', L('AdminPassword'),L('PasswordRepeat'))}}</li>
                    </ul>
                </div>
            </li>
            <li>
                <div class="form-group">
                    <div class="input-group">
                        <div class="input-group-addon">
                            <i class="fa fa-asterisk"></i>
                        </div>
                        <input v-validate="getRules" v-model="model.passwordRepeat" type="password" id="PasswordRepeat" name="PasswordRepeat" class="form-control" :placeholder="L('PasswordRepeat')" />
                    </div>
                    <ul class="field-validation-error text-left" v-show="errors.has('PasswordRepeat')">
                        <li v-show="errors.firstRule('PasswordRepeat') == 'required'">{{L("TheFieldIsRequired", L("PasswordRepeat"))}}</li>
                        <li v-show="errors.firstRule('PasswordRepeat') == 'digits'">{{L("PasswordComplexity_RequireDigit_Hint")}}</li>
                        <li v-show="errors.firstRule('PasswordRepeat') == 'lowercase'">{{L("PasswordComplexity_RequireLowercase_Hint")}}</li>
                        <li v-show="errors.firstRule('PasswordRepeat') == 'uppercase'">{{L("PasswordComplexity_RequireUppercase_Hint")}}</li>
                        <li v-show="errors.firstRule('PasswordRepeat') == 'nonAlphanumeric'">{{L("PasswordComplexity_RequireNonAlphanumeric_Hint")}}</li>
                        <li v-show="errors.firstRule('PasswordRepeat') == 'min'">{{L("PasswordComplexity_RequiredLength_Hint", settings.requiredLength)}}</li>
                    </ul>
                </div>
            </li>
            <li v-if="useCaptcha" class="hint">
                {{L("Captha_Hint")}}
            </li>
            <li v-if="useCaptcha">
                <VueRecaptcha :sitekey="recaptchaSiteKey" @verify="onVerify" @expired="onExpired"></VueRecaptcha>
            </li>
        </ul>
        <div class="form-item text-right" style="padding-right: 40px;">
            <button id="btnSubmit" @click="submit" class="waves-effect btn btn-success text-uppercase" type="submit">{{L('Submit')}}</button>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
import VueRecaptcha from 'vue-recaptcha';
import MessageHelper from '../../../base/MessageHelper';
import types from '../../../common/types';
import SessionService from '../../../services/common/SessionService';
import ProfileService from '../../../services/admin/ProfileService';
import TenantRegisterService from '../../../services/account/TenantRegisterService';
export default {
    props: {
        context: Object
    },
    data() {
        return {
            loading: false,
            model: {
                tenancyName: '',
                name: '',
                adminEmailAddress: '',
                adminPassword: '',
                passwordRepeat: '',
                captchaResponse: '',
                subscriptionStartType: null,
                gateway: null,
                editionId: null,
                paymentId: null,
                edition: {}
            },
            recaptchaSiteKey: null,
            settings: {
                requiredLength: 0
            },
            subscriptionStartType: null,
            paymentPeriodType: null,
            selectedPaymentPeriodType: types.PaymentPeriodType.Monthly,
            subscriptionPaymentGateway: null,
            paymentId: '',
            rule: {
                required: false,
                digits: false,
                min: 0,
                lowercase: false,
                uppercase: false,
                nonAlphanumeric: false
            },
            isSelectedNewTenant: false
        };
    },
    computed: {
        getRules(name) {
            var arr = [];
            if (this.rule.required) {
                arr.push('required');
            }
            if (this.rule.digits) {
                arr.push('digits');
            }
            if (this.rule.min > 0) {
                arr.push('min:' + this.rule.min);
            }
            if (this.rule.lowercase) {
                arr.push('lowercase');
            }
            if (this.rule.uppercase) {
                arr.push('uppercase');
            }
            if (this.rule.nonAlphanumeric) {
                arr.push('nonAlphanumeric');
            }
            var rs = arr.join('|');
            return rs;
        },
        useCaptcha() {
            return abp.setting.getBoolean(
                'App.UserManagement.UseCaptchaOnRegistration'
            );
        }
    },
    created() {
        this.$emit('update:context', this);
        this.recaptchaSiteKey = abp.setting.get('Recaptcha.SiteKey');
        var query = this.$route.query;
        this.model.editionId = query.editionId;
        if (this.model.editionId) {
            this.model.subscriptionStartType = query.subscriptionStartType;
            this.model.gateway = query.gateway;
            this.model.paymentId = query.paymentId;
            this.isSelectedNewTenant = true;
        }

        this.loading = true;
        Promise.all([
            this.getTenant(),
            this.getEdition(),
            this.getPasswordComplexitySetting()
        ])
            .then(() => {
                this.loading = false;
            })
            .catch(() => {
                this.loading = false;
            });
    },
    mounted() {
        var self = this;
        this.$nextTick(() => {
            if (this.isSelectedNewTenant) {
                $('#registerZone input').bind({
                    blur: function() {
                        self.resetHeight();
                    },
                    change: function() {
                        self.resetHeight();
                    }
                });
                this.isSelectedNewTenant = false;
            }
        });
    },
    methods: {
        async getTenant() {
            var self = this;
            var rs = await SessionService.getTenant();
            if (rs.tenant) {
                self.$route.push({ name: 'account.login' });
            }
        },
        async getEdition() {
            if (this.model.editionId) {
                var rs = await TenantRegisterService.getEdition({
                    editionId: this.model.editionId
                });
                this.model.edition = rs;
            }
        },
        async getPasswordComplexitySetting() {
            var self = this;
            var rs = await ProfileService.getPasswordComplexitySetting();
            var setting = rs.setting;
            this.settings = setting;
            var list = {
                required: true,
                digits: setting.requireDigit,
                min: setting.requiredLength,
                lowercase: setting.requireLowercase,
                uppercase: setting.requireUppercase,
                nonAlphanumeric: setting.requireNonAlphanumeric
            };
            self.rule = list;
            // 添加自定义验证规则
            const validates = {
                lowercase: {
                    getMessage(field) {
                        return self.L(
                            'PasswordComplexity_RequireLowercase_Hint'
                        );
                    },
                    validate(value, obj) {
                        if (list.lowercase && !/[a-z]/.test(value)) {
                            return false;
                        }
                        return true;
                    }
                },
                uppercase: {
                    getMessage(field) {
                        return self.L(
                            'PasswordComplexity_RequireUppercase_Hint'
                        );
                    },
                    validate(value, obj) {
                        console.log(value);
                        if (list.uppercase && !/[A-Z]/.test(value)) {
                            return false;
                        }
                        return true;
                    }
                },
                nonAlphanumeric: {
                    getMessage(field) {
                        return self.L(
                            'PasswordComplexity_RequireNonAlphanumeric_Hint'
                        );
                    },
                    validate(value, obj) {
                        if (
                            list.nonAlphanumeric &&
                            /[0-9a-zA-Z]+$/.test(value)
                        ) {
                            return false;
                        }
                        return true;
                    }
                }
            };
            Object.keys(validates).forEach(rule => {
                self.$validator.extend(rule, validates[rule]);
            });
        },
        clearErrors() {
            this.errors.clear();
        },
        resetHeight() {
            setTimeout(() => {
                var loginWrapper = $('.tab-panel');
                loginWrapper.height($('#registerZone').outerHeight());
            }, 15);
        },
        onVerify(response) {
            this.model.captchaResponse = response;
        },
        onExpired() {},
        submit() {
            this.resetHeight();

            if (this.useCaptcha && !this.model.captchaResponse) {
                MessageHelper.warning('', this.L('CaptchaCanNotBeEmpty'));
                return false;
            }

            this.$validator.validateAll().then(result => {
                if (result) {
                    this.loading = true;
                    TenantRegisterService.registerTenant(this.model)
                        .then(rs => {
                            $('#registerZone input').unbind({
                                blur: function() {
                                    self.resetHeight();
                                },
                                change: function() {
                                    self.resetHeight();
                                }
                            });

                            this.loading = false;
                            abp.notify.success(
                                self.L('SuccessfullyRegistered')
                            );

                            this.$router.push({
                                name: 'account.registertenantresult',
                                params: {
                                    registrationResult: rs
                                }
                            });
                        })
                        .catch(() => {
                            this.loading = false;
                        });
                }
            });
        }
    },
    components: {
        VueRecaptcha
    }
};
</script>

<style lang="scss" rel="stylesheet/scss">
ul.field-validation-error li {
    padding: 0 !important;
}
.form-wrapper.register li.hint {
    color: #fff;
    padding: 5px 40px !important;
}
.form-wrapper.register li {
    padding-top: 0 !important;
    padding-bottom: 5px !important;
    // .field-validation-error {
    //     margin-bottom: 5px;
    // }
}
</style>