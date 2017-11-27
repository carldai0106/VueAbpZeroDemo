<template>
    <div class="page-wrapper" v-loading="loading">

        <div class="breadcrumbs" id="breadcrumbs">
            <div class="breadcrumb">
                <a href="#">{{L('Administration')}}</a>
                <a href="#" class="active">{{L('Subscription')}}</a>
            </div>
        </div>

        <!-- Content Header (Page header) -->
        <section class="content-header">
            <h1>
                {{L('Subscription')}}
            </h1>
        </section>

        <!-- Main content -->
        <section class="content container-fluid">
            <div class="box box-primary">
                <div class="box-body">
                    <el-tabs v-model="activeName" type="border-card" @tab-click="handleTabClick">
                        <el-tab-pane :label="L('SubscriptionInformation')" name="Subscription">
                            <form class="form-horizontal">

                                <div class="form-group">
                                    <label class="col-sm-4 control-label bold">{{L("Edition")}}</label>
                                    <div class="col-sm-8">
                                        <p v-if="tenant.edition" class="form-control-static">
                                            {{tenant.edition.displayName}}
                                            <span v-if="tenant.edition.isFree" class="label label-success">{{L("Free")}}</span>
                                            <span v-if="tenant.isInTrialPeriod" class="label label-warning">{{L("Trial")}}</span>
                                        </p>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="col-sm-4 control-label bold">{{L("SubscriptionStartDate")}}</label>
                                    <div class="col-sm-8">
                                        <p class="form-control-static">{{ tenant.creationTimeString }}</p>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="col-sm-4 control-label bold">{{L("SubscriptionEndDate")}}</label>
                                    <div class="col-sm-8">
                                        <p v-if="tenant.edition" class="form-control-static">
                                            <span>{{tenant.subscriptionDateString}}</span>
                                        </p>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="col-sm-4 control-label"></label>
                                    <div class="col-sm-8">
                                        <router-link v-if="tenant.edition && !tenant.edition.isFree && !tenant.isInTrialPeriod" :to="{path: '/account/extend', params: {editionPaymentType: editionPaymentType.Extend} }" class="waves-effect btn btn-info"> {{L("Extend")}} </router-link>

                                        <router-link v-if="tenant.isInTrialPeriod" :to="{path: '/account/buy', params: {editionPaymentType: editionPaymentType.BuyNow, editionId: tenant.edition.id} }" class="waves-effect btn btn-info"> {{L("BuyNow")}} </router-link>

                                        <router-link v-if="tenant.edition && (tenant.edition.isFree || !tenant.edition.isHighestEdition) && !tenant.isInTrialPeriod" :to="{name: 'account.selectedition', params: {editionPaymentType: editionPaymentType.BuyNow, editionId: tenant.edition.id} }" class="waves-effect btn btn-warning"> {{L("Upgrade")}} </router-link>
                                    </div>
                                </div>
                            </form>
                        </el-tab-pane>
                        <el-tab-pane :label="L('PaymentHistory')" name="PaymentHistory">
                            <el-table :data="data" @sort-change="sortChanged" :fit="true" border stripe>

                                <el-table-column width="160" prop="creationTime" sortable :label="L('ProcessTime')">
                                    <template slot-scope="scope">
                                        {{scope.row.creationTime|DateTimeFormat('L')}}
                                    </template>
                                </el-table-column>
                                <el-table-column width="140" prop="editionDisplayName" :label="L('Edition')">
                                </el-table-column>
                                <el-table-column min-width="150" sortable prop="gateway" :label="L('Gateway')">
                                    <template slot-scope="scope">
                                        {{ L('SubscriptionPaymentGatewayType_' + scope.row.gateway)}}
                                    </template>
                                </el-table-column>
                                <el-table-column width="100" prop="amount" :label="L('Amount')" sortable>
                                </el-table-column>
                                <el-table-column min-width="150" sortable prop="status" :label="L('Status')">
                                    <template slot-scope="scope">
                                        {{ L('SubscriptionPaymentStatus_' + scope.row.status)}}
                                    </template>
                                </el-table-column>
                                <el-table-column min-width="150" sortable prop="paymentPeriodType" :label="L('Period')">
                                    <template slot-scope="scope">
                                        {{ L('PaymentPeriodType_' + scope.row.paymentPeriodType)}}
                                    </template>
                                </el-table-column>
                                <el-table-column width="100" prop="dayCount" :label="L('DayCount')">
                                </el-table-column>
                                <el-table-column width="250" prop="paymentId" :label="L('PaymentId')">
                                </el-table-column>
                                <el-table-column width="150" prop="invoiceNo" :label="L('InvoiceNo')" sortable>
                                </el-table-column>
                                <el-table-column width="130" :label="L('Invoice')" align="center">
                                    <template slot-scope="scope">
                                        <el-button type="primary" size="small" class="waves-effect" @click="createOrShowInvoice(scope.row.id, scope.row.invoiceNo)">
                                            {{L('ShowInvoice')}}
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>

                            <el-pagination class="pagin" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.pageIndex" :page-size="fetchParams.maxResultCount" :page-sizes="[15, 30, 60, 100]" layout="sizes,total, prev, pager, next" :total="pagination.totalCount">
                            </el-pagination>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>
        </section>

    </div>
</template>

<script type="text/ecmascript-6">
import { mapState } from 'vuex';
import * as moment from 'moment';
import types from '../../../common/types';
import PaymentService from '../../../services/admin/PaymentService';
import InvoiceService from '../../../services/admin/InvoiceService';
export default {
    data() {
        return {
            loading: false,
            activeName: 'Subscription',
            user: {},
            tenant: {
                tenancyName: '',
                name: '',
                logoId: '',
                logoFileType: '',
                customCssId: '',
                subscriptionEndDateUtc: moment.Moment,
                isInTrialPeriod: false,
                edition: {
                    displayName: '',
                    trialDayCount: null,
                    monthlyPrice: null,
                    annualPrice: null,
                    isHighestEdition: false,
                    isFree: false,
                    id: null
                },
                creationTime: moment.Moment,
                paymentPeriodType: null,
                subscriptionDateString: '',
                creationTimeString: '',
                id: null
            },
            application: {},
            subscriptionStartType: types.SubscriptionStartType,
            editionPaymentType: types.EditionPaymentType,
            data: null,
            fetchParams: {
                filter: '',
                sorting: '',
                maxResultCount: 10,
                skipCount: 0
            },
            pagination: {
                pageIndex: 1,
                totalCount: 0
            }
        };
    },
    mounted() {
        this.getSettings();
    },
    computed: {
        ...mapState({
            sessionUser: state => state.session.user,
            sessionTenant: state => state.session.tenant,
            sessionApplication: state => state.session.application
        })
    },
    methods: {
        createOrShowInvoice(paymentId, invoiceNo) {
            if (invoiceNo) {
                window.open('/app/admin/invoice/' + paymentId, '_blank');
            } else {
                InvoiceService.createInvoice({
                    subscriptionPaymentId: paymentId
                }).then(async () => {
                    await this.getPaymentHistory();
                    window.open('/app/admin/invoice/' + paymentId, '_blank');
                });
            }
        },
        sortChanged({ column, prop, order }) {
            if (prop && order) {
                this.fetchParams.sorting = prop + ' ' + order;
                this.getPaymentHistory();
            }
        },
        handleTabClick($v, $e) {
            if (this.activeName == 'PaymentHistory') {
                this.getPaymentHistory();
            }
        },
        getPaymentHistory() {
            this.loading = true;
            PaymentService.getPaymentHistory(this.fetchParams)
                .then(rs => {
                    this.data = rs.items;
                    this.total = rs.totalCount;
                    this.loading = false;
                })
                .catch(() => {
                    this.loading = false;
                });
        },
        getSettings() {
            this.user = this.sessionUser;
            this.tenant = this.sessionTenant;
            this.application = this.sessionApplication;
        },
        handleCurrentChange(val) {
            this.fetchParams.skipCount =
                Math.abs(val - 1) * this.fetchParams.maxResultCount;
            this.fetchData();
        },
        handleSizeChange(val) {
            this.fetchParams.maxResultCount = val;
            this.fetchData();
        }
    },
    components: {}
};
</script>

<style lang="scss" rel="stylesheet/scss">

</style>