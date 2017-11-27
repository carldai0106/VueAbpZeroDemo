<template>
    <div v-loading="loading">
        <input type="hidden" name="PaymentId" value="" />
        <input type="hidden" name="PayerId" value="" />
        <div class="text-center" v-if="demoUsername">
            <h4 class="block">{{L("DemoPayPalAccount")}}</h4>
            <p class="text-left account-info">
                <span>{{L("UserName")}} :
                    <strong>{{demoUsername}}</strong>
                </span><br />
                <span>{{L("Password")}} :
                    <strong>{{demoPassword}}</strong>
                </span>
            </p>
        </div>
        <PaypalCheckout v-if="dev" invoiceNumber="201701011000" :amount="amount" currency="USD" :buttonStyle="myStyle" :client="paypal" :dev="dev" :commit="true" :paypal-payment="payment" :paypal-paymentAuthorized="onAuthorize">
        </PaypalCheckout>
    </div>
</template>

<script type="text/ecmascript-6">
import PaypalCheckout from '../../../components/paypal/PaypalCheckout';
import types from '../../../common/types';
import SessionService from '../../../services/common/SessionService';
import PaymentService from '../../../services/admin/PaymentService';

export default {
    props: {
        editionData: Object,
        paymentPeriodType: Number,
        editionPaymentType: Number
    },
    data() {
        return {
            loading: false,

            subscriptionPaymentGateway: types.SubscriptionPaymentGatewayType,
            subscriptionStartType: types.SubscriptionStartType,

            userId: null,
            demoUsername: '',
            demoPassword: '',
            edition: null,
            amount: 10.0,
            dev: null,
            myStyle: {
                label: 'checkout',
                size: 'responsive',
                shape: 'pill',
                color: 'gold'
            },
            paypal: {
                sandbox:
                    'Ad1voWYq3VL8J4jy6zWARKwz4tjbuDl_TFBa3WQqy_DwAFWd7hkU4i99jijGqaoqU3E-ODqXDayVnOdl',
                production:
                    'AVZhosFzrnZ5Mf3tiOxAD0M6NHv8pcB2IFNHAfp_h69mmbd-LElFYkJUSII3Y0FPbm7S7lxBuqWImLbl'
            }
        };
    },
    async created() {
        this.edition = this.editionData;
        this.userId = await SessionService.getUserId();

        if (this.paymentPeriodType == types.PaymentPeriodType.Monthly) {
            this.amount = this.edition.monthlyPrice.toFixed(2);
        } else {
            this.amount = this.edition.annualPrice.toFixed(2);
        }

        var paypal = this.edition.additionalData.Paypal;
        this.dev = paypal.Environment === 'sandbox';
        this.demoUsername = paypal.DemoUserName;
        this.demoPassword = paypal.DemoPassword;
        // for test
        // if (!this.demoUsername) {
        //     this.demoUsername = 'Demo Username';
        //     this.demoPassword = 'Demo Password';
        // }
    },
    mounted() {},

    methods: {
        getAdditionalData(key) {
            return this.edition.additionalData['paypal'][key];
        },
        setAdditionalData(key, value) {
            return (this.edition.additionalData['paypal'][key] = value);
        },
        payment() {
            var self = this;
            const input = {};

            input.editionId = self.edition.id;
            input.subscriptionPaymentGatewayType =
                self.subscriptionPaymentGateway.Paypal;

            // from props
            input.editionPaymentType = self.editionPaymentType;
            input.paymentPeriodType = self.selectedPaymentPeriodType;

            return PaymentService.createPayment(input).then(result => {
                return result.id;
            });
        },
        onAuthorize(data) {
            var self = this;
            const input = {};

            input.gateway = self.subscriptionPaymentGateway.Paypal;
            input.editionId = self.edition.id;
            input.additionalData = self.edition.additionalData.paypal;

            // from props;
            input.paymentPeriodType = self.selectedPaymentPeriodType;
            input.editionPaymentType = self.editionPaymentType;

            self.setAdditionalData('PaymentId', data.paymentID);
            self.setAdditionalData('PayerId', data.payerID);

            PaymentService.executePayment(input).then(result => {
                if (self.userId) {
                    self.$router.push({ name: 'admin.subscriptions' });
                } else {
                    var tenantId = abp.multiTenancy.getTenantIdCookie();
                    if (tenantId != null) {
                        abp.multiTenancy.setTenantIdCookie(undefined);
                    }

                    self.$router.push({
                        name: 'account.login',
                        params: {
                            isNewTenant: true,
                            editionId: self.edition.id,
                            subscriptionStartType:
                                self.subscriptionStartType.Paid,
                            gateway: self.subscriptionPaymentGateway.Paypal,
                            paymentId: data.paymentID
                        }
                    });
                }
            });
        }
    },
    components: {
        PaypalCheckout
    }
};
</script>

<style lang="scss" rel="stylesheet/scss">
.paypal-button-text {
    color: #fff !important;
}
.account-info span {
    line-height: 30px;
    font-size: 14px;
    padding-left: 20px;
}
</style>