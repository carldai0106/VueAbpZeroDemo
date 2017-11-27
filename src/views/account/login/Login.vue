<style rel="styleesheet" lang="scss">

</style>

<template>
    <div class="login-wrapper" v-loading.fullscreen="loading">
        <ul class="login-tabs">
            <li :class="{'current': selectedTab === 'SignIn' }">
                <a @click="changeTab('SignIn')" href="#" class="uppercase">
                    {{ L('LogIn')}}
                </a>
            </li>
            <li :class="{'current': selectedTab === 'NewTenant' || selectedTab === 'NewAccount'}">
                <a @click="goNewTenant" v-if="showNewTenant" href="#" class="uppercase">
                    {{ L('NewTenant')}}
                </a>
                <a @click="changeTab('NewAccount')" v-else href="#" class="uppercase">
                    {{ L('CreateAnAccount')}}
                </a>
            </li>
        </ul>
        <div ref="tabPanel" class="tab-panel">
            <div :class="{ 'tab-item-transform': selectedTab === 'SignIn' }" ref="SignIn" class="tab-item">
                <div id="signInZone">
                    <form @submit.prevent="login" method="post">
                        <p class="title">
                            {{L('SignInYourAccount')}}
                        </p>
                        <ul class="form-wrapper">
                            <li>
                                <div class="form-group">
                                    <div class="input-group">
                                        <div class="input-group-addon">
                                            <i class="fa fa-user"></i>
                                        </div>
                                        <input v-validate="'required|alpha'" v-model="formData.userNameOrEmailAddress" name="UserNameOrEmail" id="UserNameOrEmail" type="text" class="form-control" autocomplete="off" :placeholder="L('UserNameOrEmail')">
                                    </div>
                                    <div v-show="errors.has('UserNameOrEmail')" class="field-validation-error text-left">
                                        <span id="UserNameOrEmailError">{{L('TheFieldIsRequired', L('UserNameOrEmail'))}}</span>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div class="form-group">
                                    <div class="input-group">
                                        <div class="input-group-addon">
                                            <i class="fa fa-asterisk"></i>
                                        </div>
                                        <input v-validate="'required'" v-model="formData.password" type="password" name="Password" id="Password" class="form-control" :placeholder="L('Password')">
                                    </div>
                                    <div v-show="errors.has('Password')" class="field-validation-error text-left">
                                        <span id="PasswordError">{{L('TheFieldIsRequired', L('Password'))}}</span>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div class="row">
                                    <div class="col-xs-8 text-left">
                                        <label class="form-control-static remember">
                                            <input type="checkbox" id="rememberme" v-model="formData.rememberClient"> {{L('RememberMe')}}
                                        </label>
                                    </div>
                                    <div class="col-xs-4">
                                        <div class="form-control-static text-right">
                                            <button id="btnLogin" class="waves-effect btn btn-success text-uppercase btn-signin" type="submit">{{L('Login')}}</button>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </form>
                    <!-- get third-part authorization in here, but I do not implement it. you can refer to angular zero project -->
                    <ul class="third-part">
                        <li>
                            <a href="#" class="facebook">
                                <div class="icon-wrapper">
                                    <i class="fa fa-facebook"></i>
                                </div>
                                <div class="third-part-content">
                                    <span>Sign in with
                                        <strong>Facebook</strong>
                                    </span>
                                </div>
                            </a>
                        </li>
                        <li>
                            <a href="#" class="googleplus">
                                <div class="icon-wrapper">
                                    <i class="fa fa-google-plus"></i>
                                </div>
                                <div class="third-part-content">
                                    <span>Sign in with
                                        <strong>Google+</strong>
                                    </span>
                                </div>
                            </a>
                        </li>
                    </ul>

                    <ul class="ul-link">
                        <!-- <li v-if="isSelfRegistrationAllowed">
                        <router-link class="btn-link uppercase" to='forgotpassword'>{{L('CreateAnAccount')}}</router-link>
                    </li> -->
                        <li>
                            <router-link class="btn-link uppercase" to='forgotpassword'>{{L('ForgotPassword')}}</router-link>
                        </li>
                        <li>
                            <router-link class="btn-link uppercase" to='EmailActivation'>{{L('EmailActivation')}}</router-link>
                        </li>
                    </ul>

                    <!-- <ul class="ul-link">
                    <li>
                        <router-link class="btn-link uppercase" to='SendTwoFactorCode'>{{L('SendSecurityCode')}}</router-link>
                    </li>
                    <li>
                        <router-link class="btn-link uppercase" to='ValidateTwoFactorCode'>{{L('VerifySecurityCode')}}</router-link>
                    </li>
                     <li>
                        <router-link class="btn-link uppercase" to='SelectEdition'>{{L('SelectEdition')}}</router-link>
                    </li>
                </ul> -->
                </div>
            </div>
            <div :class="{ 'tab-item-transform': selectedTab === 'NewTenant' }" v-if="showNewTenant" ref="NewTenant" class="tab-item">
                <NewTenant :context.sync="newTenantContext"></NewTenant>
            </div>
            <div :class="{ 'tab-item-transform': selectedTab === 'NewAccount' }" v-else ref="NewAccount" class="tab-item">
                <NewAccount :context.sync="newAccountContext"></NewAccount>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
import NewAccount from '../register/NewAccount';
import NewTenant from '../register/NewTenant';
import loginService from '../../../services/account/AccountService';
import AbpSession from '../../../services/common/AbpSession';
import UrlHelper from '../../../common/js/UrlHelper';
import SessionService from '../../../services/common/SessionService';

export default {
    data() {
        return {
            loading: false,
            formData: {
                userNameOrEmailAddress: '',
                password: '',
                rememberClient: false,
                twoFactorVerificationCode: '',
                twoFactorRememberClientToken: '',
                singleSignIn: false,
                returnUrl: ''
            },
            selectedTab: 'SignIn',
            newAccountContext: void 0,
            newTenantContext: void 0
        };
    },
    async created() {
        if (
            AbpSession.UserId > 0 &&
            UrlHelper.getReturnUrl() &&
            UrlHelper.getSingleSignIn()
        ) {
            var rs = await SessionService.UpdateUserSignInToken();
            var result = rs.result;

            const initialReturnUrl = UrlHelper.getReturnUrl();
            const returnUrl =
                initialReturnUrl +
                (initialReturnUrl.indexOf('?') >= 0 ? '&' : '?') +
                'accessToken=' +
                result.signInToken +
                '&userId=' +
                result.encodedUserId +
                '&tenantId=' +
                result.encodedTenantId;
            location.href = returnUrl;
        }
    },
    computed: {
        multiTenancySideIsTeanant() {
            return AbpSession.TentantId > 0;
        },
        isSelfRegistrationAllowed() {
            if (!AbpSession.TentantId) {
                return false;
            }

            return abp.setting.getBoolean(
                'App.UserManagement.AllowSelfRegistration'
            );
        },
        showNewTenant() {
            var tenantId = abp.multiTenancy.getTenantIdCookie();
            if (tenantId == null) tenantId = AbpSession.TentantId;

            if (tenantId != null) return false;
            return true;
        }
    },
    mounted() {
        var self = this;
        this.$nextTick(() => {
            var params = self.$route.params;
            var query = self.$route.query;
            if (
                (params != null && params.isNewTenant) ||
                (query != null && query.isNewTenant)
            ) {
                abp.multiTenancy.setTenantIdCookie(undefined);
                this.changeTab('NewTenant');
            } else {
                this.changeTab('SignIn');
            }

            $('#signInZone input').bind({
                blur: function() {
                    self.resetHeight();
                },
                change: function() {
                    self.resetHeight();
                },
                keypress: function() {
                    self.resetHeight();
                }
            });
        });
    },
    methods: {
        resetHeight() {
            setTimeout(() => {
                var loginWrapper = $('.tab-panel');
                loginWrapper.height($('#signInZone').height());
            }, 15);
        },
        goNewTenant() {
            this.$router.push({ name: 'account.selectedition' });
        },
        changeTab(tab) {
            var tabItemHeight = this.$refs[tab].clientHeight;
            this.$refs.tabPanel.style.height = tabItemHeight + 'px';

            if (tab === 'NewTenant') {
                $('.login-wrapper').css({ 'margin-top': '70px' });
                $('.tenant-item').hide();
            } else {
                $('.login-wrapper').css({ 'margin-top': '10px' });
                $('.tenant-item').show();
            }
            if (this.newAccountContext) {
                if (tab === 'NewAccount') {
                    this.newAccountContext.bindEvents();
                } else {
                    this.newAccountContext.unbindEvents();
                }
            }

            this.selectedTab = tab;
            if (this.newAccountContext) {
                setTimeout(() => {
                    this.newAccountContext.clearErrors();
                }, 15);
            }
            if (this.newTenantContext) {
                setTimeout(() => {
                    this.newTenantContext.clearErrors();
                }, 15);
            }
        },
        login() {
            this.resetHeight();
            this.$validator.validateAll().then(result => {
                if (result) {
                    this.loading = true;
                    loginService
                        .authenticate(this.formData, this.$router)
                        .then(() => {
                            this.loading = false;
                        })
                        .catch(rs => {
                            this.loading = false;
                        });
                } else {
                    return false;
                }
            });
        }
    },
    components: {
        NewAccount,
        NewTenant
    }
};
</script>