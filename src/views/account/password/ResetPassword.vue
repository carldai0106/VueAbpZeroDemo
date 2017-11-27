<template>
    <div class="login-wrapper" v-loading="loading">
        <div class="header-title">
            <b>{{L("ChangePassword")}}</b>
        </div>
        <div class="panel-body">
            <form method="post" @submit.prevent="resetPassword">
                <div class="form-item">
                    <p class="help-block text-center">{{L("PleaseEnterYourNewPassword")}}</p>
                </div>
                <div class="form-group">
                    <div class="input-group">
                        <div class="input-group-addon">
                            <i class="fa fa-asterisk"></i>
                        </div>
                        <input v-validate="getRules+'|confirmed:PasswordRepeat'" v-model="formData.password" id="Password" name="Password" type="password" class="form-control" :placeholder="L('Password')" />
                    </div>
                    <ul class="field-validation-error text-left" v-show="errors.has('Password')">
                        <li v-show="errors.firstRule('Password') == 'required'">{{L("TheFieldIsRequired", L("Password"))}}</li>
                        <li v-show="errors.firstRule('Password') == 'digits'">{{L("PasswordComplexity_RequireDigit_Hint")}}</li>
                        <li v-show="errors.firstRule('Password') == 'lowercase'">{{L("PasswordComplexity_RequireLowercase_Hint")}}</li>
                        <li v-show="errors.firstRule('Password') == 'uppercase'">{{L("PasswordComplexity_RequireUppercase_Hint")}}</li>
                        <li v-show="errors.firstRule('Password') == 'nonAlphanumeric'">{{L("PasswordComplexity_RequireNonAlphanumeric_Hint")}}</li>
                        <li v-show="errors.firstRule('Password') == 'min'">{{L("PasswordComplexity_RequiredLength_Hint", settings.requiredLength)}}</li>
                        <li v-show="errors.firstRule('Password') == 'confirmed'">{{L('PasswordDoesNotMatch', L('Password'),L('PasswordRepeat'))}}</li>
                    </ul>
                </div>
                <div class="form-group">
                    <div class="input-group">
                        <div class="input-group-addon">
                            <i class="fa fa-asterisk"></i>
                        </div>
                        <input v-validate="getRules" v-model="formData.passwordRepeat" type="password" id="PasswordRepeat" name="PasswordRepeat" class="form-control" :placeholder="L('PasswordRepeat')" />
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
                <div class="row form-item">
                    <div class="col-xs-6 text-left">
                        <router-link class="waves-effect btn btn-default text-uppercase" to='login'>{{L('Back')}}</router-link>
                    </div>
                    <div class="col-xs-6 text-right">
                        <button id="btnSubmit" class="waves-effect btn btn-success text-uppercase" type="submit">{{L('Submit')}}</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
import ProfileService from '../../../services/admin/ProfileService';
import accountService from '../../../services/account/AccountService';
import sessionService from '../../../services/common/SessionService';

export default {
    data() {
        return {
            loading: false,
            formData: {
                password: '',
                passwordRepeat: '',
                userId: 0,
                resetCode: '',
                tenantId: '',
                singleSignIn: ''
            },
            settings: {
                requiredLength: 0
            },
            rule: {
                required: false,
                digits: false,
                min: 0,
                lowercase: false,
                uppercase: false,
                nonAlphanumeric: false
            }
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
        }
    },
    async created() {
        this.loading = true;
        var self = this;
        ProfileService.getPasswordComplexitySetting()
            .then(rs => {
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
                this.loading = false;
            })
            .catch(() => {
                this.loading = false;
            });

        var params = this.$route.params;

        this.formData.userId = params.userId;
        this.formData.resetCode = params.resetCode;
        this.formData.tenantId = params.tenantId;

        await sessionService.changeTenantIfNeeded(this.tenantId);
    },
    methods: {
        resetPassword() {
            this.$validator.validateAll().then(result => {
                if (result) {
                    this.loading = true;
                    accountService
                        .resetPassword(this.formData)
                        .then(rs => {
                            if (!rs) {
                                this.loading = false;
                            }
                            console.log(rs);
                            if (!rs.canLogin) {
                                this.$router.push({ name: 'account.login' });
                                this.loading = false;
                            } else {
                                accountService
                                    .authenticate(
                                        {
                                            userNameOrEmailAddress: rs.userName,
                                            password: this.formData.password
                                        },
                                        this.$router
                                    )
                                    .then(() => {
                                        this.loading = false;
                                    })
                                    .catch(() => {
                                        this.loading = false;
                                    });
                            }
                        })
                        .catch(() => {
                            this.loading = false;
                        });
                }
            });
        }
    },
    mounted() {
        console.log(this.$route);
    }
};
</script>
