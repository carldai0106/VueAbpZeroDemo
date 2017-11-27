<template>
    <div class="login-wrapper" v-loading="loading">
        <div class="header-title">
            <b>{{L("SendSecurityCode")}}</b>
        </div>
        <div class="panel-body">
            <form method="post" @submit.prevent="submit">
                <div class="form-item">
                    <p class="help-block text-left">{{L("SendSecurityCode_Information")}}</p>
                </div>
                <div class="form-group">
                    <label class="control-label" style="color:#fff;">{{L('TwoFactorProvider')}}</label>
                    <select v-validate="'required'" id="SelectedTwoFactorProvider" name="SelectedTwoFactorProvider" autofocus class="form-control" v-model="selectedTwoFactorProvider">
                        <option :value="null">{{L('PleaseSelectOne')}}</option>
                        <option v-for="(provider, index) of authenticateResult.twoFactorAuthProviders" :key="index" :value="provider">{{provider}}</option>
                    </select>
                    <div v-show="errors.has('SelectedTwoFactorProvider')" class="field-validation-error">
                        <span id="SelectedTwoFactorProviderError" class="">{{L('TheFieldIsRequired', L('TwoFactorProvider'))}}</span>
                    </div>
                </div>

                <div class="row form-item">
                    <div class="col-xs-6 text-left">
                        <a class="waves-effect btn btn-default text-uppercase" @click="back">{{L('Back')}}</a>
                    </div>
                    <div class="col-xs-6 text-right">
                        <button id="btnSubmit" class="waves-effect btn btn-success text-uppercase" type="submit">{{L('Submit')}}</button>
                    </div>
                </div>
            </form>
        </div>
        <!-- <div class="form-item-test">
            <router-link class="btn-link" to='resetpassword'>{{L('ChangedPassword')}}</router-link>
        </div> -->
    </div>
</template>

<script type="text/ecmascript-6">
import TokenAuthService from '../../../services/common/TokenAuthService';
export default {
    data() {
        return {
            loading: false,
            authenticateModel: {},
            authenticateResult: {
                accessToken: '',
                encryptedAccessToken: '',
                expireInSeconds: null,
                shouldResetPassword: false,
                passwordResetCode: '',
                userId: null,
                requiresTwoFactorVerification: false,
                twoFactorAuthProviders: null,
                twoFactorRememberClientToken: '',
                returnUrl: ''
            },
            selectedTwoFactorProvider: null
        };
    },
    created() {
        var params = this.$route.params;
        if (params.authenticateModel) {
            this.authenticateModel = params.authenticateModel;
        }
        if (params.authenticateResult) {
            // 为了便于测试，所以对所有属性重新赋值
            for (var key in this.authenticateResult) {
                this.authenticateResult[key] = params.authenticateResult[key];
            }
        }
    },
    methods: {
        back() {
            var self = this;
            this.$router.push({ name: 'account.login' }, () => {
                self.$route.params.authenticateModel = null;
                self.$route.params.authenticateResult = null;
                self.authenticateModel = null;
                self.authenticateResult = null;
            });
        },
        submit() {
            var self = this;
            const model = {};
            model.userId = this.authenticateResult.userId;
            model.provider = this.selectedTwoFactorProvider;
            this.$validator.validateAll().then(result => {
                if (result) {
                    this.loading = true;
                    TokenAuthService.sendTwoFactorAuthCode(model)
                        .then(() => {
                            self.loading = false;
                            self.$router.push(
                                {
                                    name: 'account.validatetwofactorcode',
                                    params: {
                                        authenticateModel: self
                                            .authenticateModel
                                    }
                                },
                                () => {
                                    self.authenticateModel = null;
                                    self.authenticateResult = null;
                                }
                            );
                        })
                        .catch(() => {
                            self.loading = false;
                        });
                } else {
                    return false;
                }
            });
        }
    }
};
</script>
