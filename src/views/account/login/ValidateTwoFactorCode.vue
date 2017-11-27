<template>
    <div class="login-wrapper" v-loading="loading">
        <div class="header-title">
            <b>{{L("VerifySecurityCode")}}</b>
        </div>
        <div class="panel-body">
            <form method="post" @submit.prevent="submit">
                <div class="form-item">
                    <p class="help-block text-center">{{L("VerifySecurityCode_Information")}}</p>
                </div>

                <div class="form-group">
                    <label for="Code" class="control-label" style="color:#fff;">{{L('Code')}}</label>
                    <input autofocus v-model="code" v-validate="'required'" id="Code" name="Code" type="password" class="form-control" :placeholder="L('Code')">
                    <div v-show="errors.has('Code')" class="field-validation-error">
                        <span id="CodeError" class="">{{L('TheFieldIsRequired', L('Code'))}}</span>
                    </div>
                </div>

                <div class="form-group mar-no">
                    <label class="control-label " style="color:#fff;">
                        <input class="form-control" v-model="authenticateModel.rememberClient" type="checkbox" name="rememberClient" value="true" /> {{L('RememberThisBrowser')}}
                    </label>
                </div>
                <div class="form-item">
                    <span class="help-block alert alert-info mar-no">
                        {{L("RemainingTime")}}: {{L("SecondShort{0}", remainingSeconds)}}
                    </span>
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
    </div>
</template>

<script type="text/ecmascript-6">
import MessageHelper from '../../../base/MessageHelper';
import AccountService from '../../../services/account/AccountService';
export default {
    data() {
        return {
            loading: false,
            authenticateModel: {
                userNameOrEmailAddress: '',
                password: '',
                twoFactorVerificationCode: '',
                rememberClient: false,
                twoFactorRememberClientToken: '',
                singleSignIn: false,
                returnUrl: ''
            },
            code: '',
            remainingSeconds: 90,
            $timer: null
        };
    },
    created() {
        if (this.$route.params.authenticateModel) {
            var authenticateModel = this.$route.params.authenticateModel;
            for (var key in this.authenticateModel) {
                this.authenticateModel[key] = authenticateModel[key];
            }
        }
    },
    mounted() {
        this.$timer = setInterval(this.countDown, 1000);
    },
    methods: {
        back() {
            var self = this;
            this.$router.push({ name: 'account.login' }, () => {
                clearInterval(self.$timer);
                self.$route.params.authenticateModel = null;
            });
        },
        countDown() {
            var self = this;
            if (this.remainingSeconds > 0) {
                --this.remainingSeconds;
            } else {
                clearInterval(self.$timer);
                MessageHelper.warning(
                    '',
                    self.L('TimeoutPleaseTryAgain')
                ).then(() => {
                    this.$router.push({ name: 'account.login' }, () => {
                        self.$route.params.authenticateModel = null;
                    });
                });
            }
        },
        submit() {
            console.log(this.authenticateModel);
            this.$validator.validateAll().then(result => {
                if (result) {
                    this.authenticateModel.twoFactorVerificationCode = this.code;
                    this.loading = true;
                    AccountService.authenticate(
                        this.authenticateModel,
                        this.$router,
                        null
                    )
                        .then(() => {
                            this.loading = false;
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
