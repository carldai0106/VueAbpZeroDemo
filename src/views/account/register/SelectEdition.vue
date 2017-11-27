<template>
    <div class="select-edition-wrapper" v-loading.fullscreen="loading">
        <div v-if="isLoadedTenant" class="row">
            <div class="col-md-6 col-sm-12 col-xs-12 mar-btm-15" v-for="(editionWithFeatures, index) in selectEditons.editionsWithFeatures" :key="index">
                <div class="select-edition">
                    <div class="header-title title-color">
                        <b>{{editionWithFeatures.edition.displayName}}</b>
                    </div>
                    <div class="bg-light">
                        <div class="price-table-pricing">
                            <div class="row" v-if="isFree(editionWithFeatures.edition)">
                                <div class="col-md-12">
                                    <div class="price-period">
                                        <div class="price-title">
                                            {{L("Free")}}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row" v-else>
                                <div class="col-xs-6">
                                    <div class="price-period">
                                        <p class="price-content">
                                            <sup class="price-sign">$</sup> {{editionWithFeatures.edition.monthlyPrice}}
                                        </p>
                                        <p class="period">{{L("PerMonth")}}</p>
                                    </div>
                                </div>
                                <div class="col-xs-6">
                                    <div class="price-period">
                                        <p class="price-content">
                                            <sup class="price-sign">$</sup> {{editionWithFeatures.edition.annualPrice}}
                                        </p>
                                        <p class="period">{{L("PerYear")}}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <ul class="price-table-content">
                            <li v-for="(feature, index) in selectEditons.allFeatures" :key="index">
                                <ul>
                                    <li v-if="isTrueFalseFeature(feature)">
                                        <i v-if="featureEnabledForEdition(feature,editionWithFeatures)" class="ion-ios-checkmark-outline font-green"></i>
                                        <i v-else class="ion-ios-close-outline font-red"></i>
                                        <span>{{feature.displayName}}</span>
                                    </li>
                                    <li v-else>
                                        <i class="ion-ios-checkmark-outline font-green"></i>
                                        <span>{{feature.displayName}} : {{getFeatureValueForEdition(feature,editionWithFeatures)}}</span>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                        <div class="button-item text-center pad-btm-15">
                            <button @click="upgrade(editionWithFeatures.edition, editionPaymentType.Upgrade)" v-if="isUserLoggedIn" :disabled="!canUpgrade(editionWithFeatures.edition)" class="waves-effect btn btn-warning uppercase">{{L("Upgrade")}}</button>

                            <button @click="linkTo('account.login', {isNewTenant: true, editionId: editionWithFeatures.edition.id, subscriptionStartType: subscriptionStartType.Free})" v-if="!isUserLoggedIn && isFree(editionWithFeatures.edition)" class="waves-effect btn btn-success uppercase">{{L("Start")}}</button>

                            <button @click="linkTo('account.login', {isNewTenant: true, editionId: editionWithFeatures.edition.id, subscriptionStartType: subscriptionStartType.Trial})" v-if="!isUserLoggedIn && !isFree(editionWithFeatures.edition) && editionWithFeatures.edition.trialDayCount" class="waves-effect btn btn-warning uppercase">{{L("FreeTrial")}}</button>

                            <button @click="linkTo('account.buy', {editionId: editionWithFeatures.edition.id, editionPaymentType: editionPaymentType.NewRegistration, subscriptionStartType: subscriptionStartType.Paid})" v-if="!isUserLoggedIn && !isFree(editionWithFeatures.edition)" class="waves-effect btn btn-info uppercase">{{L("BuyNow")}}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
import * as _ from 'lodash';
import types from '../../../common/types';
import TenantRegisterService from '../../../services/account/TenantRegisterService';
import SessionService from '../../../services/common/SessionService';
import SubscriptionService from '../../../services/admin/SubscriptionService';
export default {
    data() {
        return {
            loading: false,
            isLoadedTenant: false,
            tenant: null,
            selectEditons: {
                tenantEditionId: null,
                allFeatures: {},
                editionsWithFeatures: {}
            },
            editionPaymentType: types.EditionPaymentType,
            subscriptionStartType: types.SubscriptionStartType
        };
    },
    created() {},
    mounted() {
        this.loading = true;
        Promise.all([this.getTenant(), this.getEditions()])
            .then(() => {
                this.loading = false;
            })
            .catch(() => {
                this.loading = false;
            });

        this.$nextTick(() => {
            $('.tenant-item').hide();
        });
    },
    computed: {
        isUserLoggedIn() {
            return abp.session.userId > 0;
        }
    },
    methods: {
        async getTenant() {
            var rs = await SessionService.getTenant();
            this.tenant = rs;
            this.isLoadedTenant = true;
        },
        isFree(edition) {
            return !edition.monthlyPrice && !edition.annualPrice;
        },
        isTrueFalseFeature(feature) {
            return feature.inputType.name === 'CHECKBOX';
        },
        featureEnabledForEdition(feature, edition) {
            const featureValues = _.filter(edition.featureValues, {
                name: feature.name
            });
            if (!featureValues || featureValues.length <= 0) {
                return false;
            }

            const featureValue = featureValues[0];
            return featureValue.value.toLowerCase() === 'true';
        },
        getFeatureValueForEdition(feature, edition) {
            const featureValues = _.filter(edition.featureValues, {
                name: feature.name
            });
            if (!featureValues || featureValues.length <= 0) {
                return '';
            }

            const featureValue = featureValues[0];
            return featureValue.value;
        },
        canUpgrade(edition) {
            if (this.tenant.edition.id === edition.id) {
                return false;
            }

            const currentMonthlyPrice = this.tenant.edition.monthlyPrice
                ? this.tenant.edition.monthlyPrice
                : 0;

            const targetMonthlyPrice =
                edition && edition.monthlyPrice ? edition.monthlyPrice : 0;

            return (
                this.isUserLoggedIn &&
                this.tenant.edition &&
                currentMonthlyPrice <= targetMonthlyPrice
            );
        },
        upgrade(upgradeEdition, editionPaymentType) {
            if (
                editionPaymentType === types.EditionPaymentType.Upgrade &&
                this.upgradeIsFree(upgradeEdition)
            ) {
                SubscriptionService.upgradeTenantToEquivalentEdition({
                    upgradeEditionId: upgradeEdition.id
                }).then(() => {
                    this.$router.push({ name: 'admin.subscriptions' });
                });
            } else {
                this.$router.push({
                    name: 'account.upgrade',
                    params: {
                        upgradeEditionId: upgradeEdition.id,
                        editionPaymentType: editionPaymentType
                    }
                });
            }
        },
        upgradeIsFree(upgradeEdition) {
            if (!this.tenant || !this.tenant.edition) {
                return false;
            }

            const bothEditionsAreFree =
                this.tenant.edition.isFree && upgradeEdition.isFree;

            const bothEditionsHasSamePrice =
                !upgradeEdition.isFree &&
                upgradeEdition.monthlyPrice ===
                    this.tenant.edition.monthlyPrice &&
                upgradeEdition.annualPrice === this.tenant.edition.annualPrice;

            return bothEditionsAreFree || bothEditionsHasSamePrice;
        },
        linkTo(name, query) {
            this.$router.push({ name: name, query: query });
        },
        async getEditions() {
            var rs = await TenantRegisterService.getEditionsForSelect();
            this.selectEditons = rs;

            if (
                !this.selectEditons.editionsWithFeatures ||
                this.selectEditons.editionsWithFeatures.length <= 0
            ) {
                this.$router.push({
                    name: 'account.login',
                    params: {
                        isNewTenant: true
                    }
                });
            }
        }
    }
};
</script>

<style lang="scss" rel="stylesheet/scss">
.select-edition-wrapper {
    max-width: 860px;
    position: relative;
    margin: auto;
    margin-top: 5%;
    background-color: transparent;
    box-shadow: none;
    .header-title {
        height: 66px;
        line-height: 66px;
        text-align: center;
        font-size: 1.6em;
        color: #fff;
    }
}
.font-green {
    color: #26c281;
}
.font-red {
    color: #e7505a;
}
.title-color {
    background-color: rgba(14, 199, 139, 0.78) !important;
}
.price-table-pricing {
    min-height: 100px;
    vertical-align: middle;
    .price-period {
        margin: 20px 0 20px 0;
        .price-title,
        .price-content {
            font-size: 1.4em;
            font-weight: bold;
            text-align: center;
        }
        .period {
            font-size: 1.4em;
            text-align: center;
        }
    }
}
.price-table-content {
    padding: 20px 0 20px 30px;
    background-color: #f7f9fb;
    li {
        line-height: 40px;
        i {
            font-size: 18px;
        }
        span {
            padding-left: 20px;
        }
    }
    margin-bottom: 15px;
}
.button-item {
    padding: 10px 0 20px 0;
}

@media screen and (max-width: 1000px) {
    .select-edition-wrapper {
        max-width: 450px;
        position: relative;
        margin: auto;
        padding: 0 20px;
        margin-top: 5%;
        background-color: transparent;
        box-shadow: none;
        .select-edition {
            margin-bottom: 20px;
        }
    }
}
</style>