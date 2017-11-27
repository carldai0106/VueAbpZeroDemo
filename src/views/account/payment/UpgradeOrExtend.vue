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
            <form method="post" @submit.prevent="submit">

                <input type="hidden" name="EditionId" v-model="edition.id" />
                <input type="hidden" name="Gateway" v-model="subscriptionPaymentGateway.Paypal" />
                <input type="hidden" name="EditionPaymentType" v-model="editionPaymentType" />

                <div class="form-item">
                    <p v-if="editionPaymentType == editionPaymentTypeCheck.Extend" class="help-block text-center">{{L("Extend_Edition_Description",edition.displayName)}}</p>
                    <p v-if="editionPaymentType == editionPaymentTypeCheck.Upgrade" class="help-block text-center">{{L("Upgrade_Edition_Description",edition.displayName)}}</p>
                </div>

                <div v-if="!isUpgrade()" class="form-group">
                    <ul class="ul-list">
                        <li>
                            <label class="checkbox-item">
                                <input class="form-control" type="radio" name="PaymentPeriodType" checked :value="paymentPeriodType.Monthly" @change="onPaymentPeriodChangeChange(paymentPeriodType.Monthly)" />
                                <span>{{L("MonthlyPrice")}} : $ {{edition.monthlyPrice | currency(2)}}
                                </span>
                            </label>
                        </li>
                        <li>
                            <label class="checkbox-item">
                                <input class="form-control" type="radio" name="PaymentPeriodType" :value="paymentPeriodType.Annual" @change="onPaymentPeriodChangeChange(paymentPeriodType.Annual)" />
                                <span>{{L("AnnualPrice")}} : $ {{edition.annualPrice | currency(2)}}
                                </span>
                            </label>
                        </li>
                    </ul>
                </div>

                <hr v-if="isUpgrade()" class="border-green" />

                <div v-if="isUpgrade()" class="form-actions">
                    <div class="form-group row">
                        <label class="col-sm-8 control-label">{{L("Total")}}</label>
                        <div class="col-sm-4 text-right">
                            {{additionalPrice}}
                        </div>
                    </div>
                </div>

                <Paypal v-if="edition.additionalData != null && edition.additionalData.Paypal" :editionData="edition" :paymentPeriodType="selectedPaymentPeriodType" :editionPaymentType="editionPaymentType"></Paypal>

                <div class="row form-item">
                    <div class="col-xs-12 text-right">
                        <a class="waves-effect btn btn-default text-uppercase" @click="back">{{L('Back')}}</a>
                    </div>
                    <!-- <div class="col-xs-6 text-right">
                        <button id="btnSubmit" class="waves-effect btn btn-success text-uppercase" type="submit">{{L('Submit')}}</button>
                    </div> -->
                </div>
            </form>
        </div>

    </div>
</template>

<script type="text/ecmascript-6">
import types from '../../../common/types';
import Paypal from './Paypal';
import PaymentService from '../../../services/admin/PaymentService';
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

            // begin 配对检测
            editionPaymentType: null,
            editionPaymentTypeCheck: types.EditionPaymentType,
            // end 配对检测

            paymentPeriodType: types.PaymentPeriodType,

            additionalPrice: 0,
            selectedPaymentPeriodType: types.PaymentPeriodType.Monthly
        };
    },
    created() {
        var params = this.$route.params;
        this.editionPaymentType = params.editionPaymentType;
        var upgradeEditionId = params.upgradeEditionId;

        PaymentService.getPaymentInfo({
            UpgradeEditionId: upgradeEditionId
        }).then(rs => {
            for (var key in this.edition) {
                this.edition[key] = rs.edition[key];
            }

            this.additionalPrice = Number(rs.additionalPrice.toFixed(2));
        });
    },
    methods: {
        back() {
            this.$router.go(-1);
        },
        isUpgrade() {
            return this.additionalPrice > 0;
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
