<style scoped>
.bg-light p.help-block {
    color: #444;
    font-size: 14px;
}
.border-green {
    border-color: rgb(0, 141, 76);
}
</style>

<template>
    <div class="login-wrapper" v-loading="loading">
        <div class="header-title">
            <b>{{L("PaymentInfo")}}</b>
        </div>
        <div v-if="edition.id" class="panel-body bg-light">
            <form method="post">

                <input type="hidden" name="EditionId" v-model="edition.id" />
                <input type="hidden" name="Gateway" v-model="subscriptionPaymentGateway.Paypal" />
                <input type="hidden" name="EditionPaymentType" v-model="editionPaymentType" />

                <div class="form-item">
                    <p class="help-block text-center">{{L("Edition")}}: {{edition.displayName}}</p>
                </div>

                <div class="form-group">
                    <ul class="ul-list">
                        <li v-if="edition.monthlyPrice">
                            <label class="checkbox-item">
                                <input class="form-control" type="radio" name="PaymentPeriodType" checked :value="paymentPeriodType.Monthly" @change="onPaymentPeriodChangeChange(paymentPeriodType.Monthly)" />
                                <span>{{L("MonthlyPrice")}} : $ {{edition.monthlyPrice | currency(2)}}
                                </span>
                            </label>
                        </li>
                        <li v-if="edition.annualPrice">
                            <label class="checkbox-item">
                                <input class="form-control" type="radio" name="PaymentPeriodType" :value="paymentPeriodType.Annual" @change="onPaymentPeriodChangeChange(paymentPeriodType.Annual)" />
                                <span>{{L("AnnualPrice")}} : $ {{edition.annualPrice | currency(2)}}
                                </span>
                            </label>
                        </li>
                    </ul>
                </div>

                <Paypal v-if="edition.additionalData != null && edition.additionalData.Paypal" :editionData="edition" :paymentPeriodType="selectedPaymentPeriodType" :editionPaymentType="editionPaymentType"></Paypal>

                <div class="row form-item">
                    <div class="col-xs-12 text-right">
                        <a class="waves-effect btn btn-default text-uppercase" @click="back">{{L('Back')}}</a>
                    </div>
                </div>
            </form>
        </div>

    </div>
</template>

<script type="text/ecmascript-6">
import types from '../../../common/types';
import Paypal from './Paypal';
import TenantRegisterService from '../../../services/account/TenantRegisterService';
export default {
    data() {
        return {
            loading: false,

            edition: {
                id: null,
                name: '',
                displayName: '',
                expiringEditionId: null,
                monthlyPrice: null,
                annualPrice: null,
                trialDayCount: null,
                waitingDayAfterExpire: null,
                isFree: false,
                additionalData: {}
            },
            subscriptionPaymentGateway: types.SubscriptionPaymentGatewayType,

            editionPaymentType: null,

            paymentPeriodType: types.PaymentPeriodType,
            selectedPaymentPeriodType: types.PaymentPeriodType.Monthly
        };
    },
    created() {
        var params = this.$route.query;
        this.editionPaymentType = params.editionPaymentType;
        var editionId = params.editionId;

        TenantRegisterService.getEdition({
            editionId: editionId
        }).then(rs => {
            for (var key in this.edition) {
                this.edition[key] = rs[key];
            }
        });
    },
    methods: {
        back() {
            this.$router.go(-1);
        },
        onPaymentPeriodChangeChange(selectedPaymentPeriodType) {
            this.selectedPaymentPeriodType = selectedPaymentPeriodType;
        }
    },
    components: {
        Paypal
    }
};
</script>
