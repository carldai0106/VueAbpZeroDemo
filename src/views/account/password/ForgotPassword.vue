<template>
    <div class="login-wrapper" v-loading="loading">
        <div class="header-title">
            <b>{{L("ForgotPassword")}}</b>
        </div>
        <div class="panel-body">
            <form method="post" @submit.prevent="sentEmail">
                <div class="form-item">
                    <p class="help-block text-left">{{L("SendPasswordResetLink_Information")}}</p>
                </div>
                <div class="form-group">
                    <div class="input-group">
                        <div class="input-group-addon">
                            <i class="fa fa-envelope-o"></i>
                        </div>
                        <input v-validate="'required|email'" v-model="emailAddress" id="EmailAddress" name="EmailAddress" type="text" class="form-control" autocomplete="off" autofocus :placeholder="L('EmailAddress')" />
                    </div>
                    <div v-show="errors.has('EmailAddress')" class="field-validation-error">
                        <span id="EmailAddressError" class="">{{L('TheFieldIsRequired', L('EmailAddress'))}}</span>
                    </div>
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
import AccountService from '../../../services/account/AccountService';
import MessageHelper from '../../../base/MessageHelper';
export default {
    data() {
        return {
            loading: false,
            emailAddress: null
        };
    },
    methods: {
        sentEmail() {
            var self = this;
            this.$validator.validateAll().then(result => {
                if (result) {
                    this.loading = true;
                    AccountService.sendPasswordResetCode({
                        emailAddress: this.emailAddress
                    })
                        .then(() => {
                            this.loading = false;
                            MessageHelper.success(
                                this.L('MailSent'),
                                this.L('PasswordResetMailSentMessage')
                            ).done(() => {
                                self.$router.push({ name: 'account.login' });
                            });
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
