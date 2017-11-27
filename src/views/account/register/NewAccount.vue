<template>
    <div id="registerZone" v-loading="loading" style="padding-bottom: 10px;">
        <p class="title">{{L('PersonalInformations')}}</p>
        <ul class="form-wrapper register">
            <li>
                <div class="form-group">
                    <div class="input-group ">
                        <div class="input-group-addon">
                            <i class="fa fa-user-circle"></i>
                        </div>
                        <input v-validate="'required'" v-model="model.name" autofocus autocomplete="off" id="Name" name="Name" type="text" class="form-control" :placeholder="L('Name')">
                    </div>
                    <div v-show="errors.has('Name')" class="field-validation-error">
                        <span>{{L('TheFieldIsRequired', L('Name'))}}</span>
                    </div>
                </div>
            </li>
            <li>
                <div class="form-group">
                    <div class="input-group ">
                        <div class="input-group-addon">
                            <i class="fa fa-user-circle-o"></i>
                        </div>
                        <input v-validate="'required'" v-model="model.surname" autocomplete="off" id="Surname" name="Surname" type="text" class="form-control" :placeholder="L('Surname')">
                    </div>
                    <div v-show="errors.has('Surname')" class="field-validation-error">
                        <span>{{L('TheFieldIsRequired', L('Surname'))}}</span>
                    </div>
                </div>
            </li>
            <li>
                <div class="form-group">
                    <div class="input-group ">
                        <div class="input-group-addon">
                            <i class="fa fa-envelope-o"></i>
                        </div>
                        <input v-validate="'required|email'" v-model="model.emailAddress" autocomplete="off" id="EmailAddress" name="EmailAddress" type="text" class="form-control" :placeholder="L('EmailAddress')">
                    </div>
                    <ul class="field-validation-error text-left" v-show="errors.has('EmailAddress')">
                        <li v-show="errors.firstRule('EmailAddress') == 'required'">{{L("TheFieldIsRequired", L("EmailAddress"))}}</li>
                        <li v-show="errors.firstRule('EmailAddress') == 'email'">{{L("EnterAValidEmail")}}</li>
                    </ul>
                </div>
            </li>
            <li class="hint">
                {{L("AccountSettings")}}
            </li>
            <li>
                <div class="form-group">
                    <div class="input-group ">
                        <div class="input-group-addon">
                            <i class="fa fa-user"></i>
                        </div>
                        <input v-validate="'required'" v-model="model.userName" autocomplete="off" id="UserName" name="UserName" type="text" class="form-control" :placeholder="L('UserName')">
                    </div>
                    <div v-show="errors.has('UserName')" class="field-validation-error">
                        <span>{{L('TheFieldIsRequired', L('UserName'))}}</span>
                    </div>
                </div>
            </li>
            <li>
                <div class="form-group">
                    <div class="input-group">
                        <div class="input-group-addon">
                            <i class="fa fa-asterisk"></i>
                        </div>
                        <input v-validate="getRules+'|confirmed:PasswordRepeat'" v-model="model.password" id="Password" name="Password" type="password" class="form-control" :placeholder="L('Password')" />
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
import ProfileService from '../../../services/admin/ProfileService';
import AccountService from '../../../services/account/AccountService';
export default {
    props: {
        context: Object
    },
    data() {
        return {
            loading: false,
            model: {
                name: '',
                suname: '',
                userName: '',
                emailAddress: '',
                password: '',
                passwordRepeat: '',
                captchaResponse: ''
            },
            recaptchaSiteKey: null,
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
        },
        useCaptcha() {
            return abp.setting.getBoolean(
                'App.UserManagement.UseCaptchaOnRegistration'
            );
        }
    },
    created() {
        this.$emit('update:context', this);
        var self = this;
        this.recaptchaSiteKey = abp.setting.get('Recaptcha.SiteKey');
        this.loading = true;
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
    },
    mounted() {},
    methods: {
        bindEvents() {
            var self = this;
            $('#registerZone input').bind({
                blur: function() {
                    self.resetHeight();
                },
                change: function() {
                    self.resetHeight();
                }
            });
        },
        unbindEvents() {
            var self = this;
            $('#registerZone input').unbind({
                blur: function() {
                    self.resetHeight();
                },
                change: function() {
                    self.resetHeight();
                }
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
                    AccountService.register(this.model)
                        .then(rs => {
                            if (!rs) {
                                this.loading = false;
                            }
                            this.unbindEvents();
                            if (!rs.canLogin) {
                                this.loading = false;
                                abp.notify.success(this.L('SuccessfullyRegistered'));
                                this.$router.push({ name: 'account.login' });
                            } else {
                                AccountService.authenticate(
                                    {
                                        userNameOrEmailAddress: rs.userName,
                                        password: this.model.password
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