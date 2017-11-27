<template>
    <div class="page-wrapper" v-loading="loading">
        <div class="breadcrumbs" id="breadcrumbs">
            <div class="breadcrumb">
                <a href="#">{{L('Administration')}}</a>
                <a href="#" class="active">{{L('AuditLogs')}}</a>
            </div>
        </div>

        <!-- Content Header (Page header) -->
        <section class="content-header">
            <h1>
                {{L('AuditLogs')}}
            </h1>
        </section>

        <!-- Main content -->
        <section class="content container-fluid">

            <div class="box box-primary">
                <div class="box-body">
                    <el-form size="small" label-width="120px">
                        <div class="row">
                            <div class="col-md-6">
                                <el-form-item :label="L('DateRange')">
                                    <DateRangePicker :onChange="fetchData" :start.sync="fetchParams.startDate" :end.sync="fetchParams.endDate"></DateRangePicker>
                                </el-form-item>
                                <el-form-item :label="L('Service')">
                                    <el-input :placeholder="L('Service')" v-model="fetchParams.serviceName" @keyup.enter.native="fetchData"></el-input>
                                </el-form-item>
                                <el-form-item :label="L('ErrorState')">
                                    <el-select style="width:100%;" size="small" :placeholder="errorState.label" v-model="fetchParams.hasException" @change="fetchData">
                                        <el-option v-for="item in errorState.options" :key="item.value" :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                            <div class="col-md-6">
                                <el-form-item :label="L('UserName')">
                                    <el-input :placeholder="L('UserName')" v-model="fetchParams.userName" @keyup.enter.native="fetchData"></el-input>
                                </el-form-item>
                                <el-form-item :label="L('Action')">
                                    <el-input :placeholder="L('Action')" v-model="fetchParams.methodName" @keyup.enter.native="fetchData"></el-input>
                                </el-form-item>
                                <el-form-item :label="L('Browser')">
                                    <el-input :placeholder="L('Browser')" v-model="fetchParams.browserInfo" @keyup.enter.native="fetchData"></el-input>
                                </el-form-item>
                            </div>
                        </div>
                    </el-form>
                </div>
            </div>

            <div class="panel panel-default">
                <div class="panel-body">
                    <div class="toolbar">
                        <button @click="refresh" class="waves-effect btn btn-default">
                            <i class="fa fa-refresh"></i> Refresh</button>
                    </div>
                    <el-table class="data-table" @sort-change="sortChanged" :data="data" :fit="true" border stripe>
                        <el-table-column width="50">
                            <template slot-scope="scope">
                                <i class="fa fa-check-circle text-success" style="font-size:22px;" v-if="!scope.row.exception"></i>
                                <i class="fa fa-check-circle text-danger" style="font-size:22px;" v-else></i>
                            </template>
                        </el-table-column>
                        <el-table-column min-width="160" :label="L('Time')" prop="executionTime" sortable>
                            <template slot-scope="scope">
                                <i>{{scope.row.executionTime|DateTimeFormat('YYYY-MM-DD HH:mm:ss')}}</i>
                            </template>
                        </el-table-column>
                        <el-table-column width="120" prop="userName" :label="L('UserName')" sortable></el-table-column>
                        <el-table-column min-width="250" prop="serviceName" :label="L('Service')"></el-table-column>
                        <el-table-column min-width="250" prop="methodName" :label="L('Action')"></el-table-column>
                        <el-table-column width="100" :label="L('Duration')" prop="executionDuration" sortable>
                            <template slot-scope="scope">
                                <i>{{scope.row.executionDuration}} ms</i>
                            </template>
                        </el-table-column>
                        <el-table-column prop="clientIpAddress" width="120" :label="L('IpAddress')"></el-table-column>
                        <el-table-column prop="clientName" width="100" :label="L('Client')"></el-table-column>
                        <el-table-column prop="browserInfo" min-width="260" :label="L('Browser')"></el-table-column>
                        <el-table-column width="100" :label="L('Action')" align="center" fixed="right">
                            <template slot-scope="scope">
                                <el-button class="waves-effect" size="small" icon="fa fa-search" @click="dialogDetail.isShow=true;dialogDetail.model=scope.row"></el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination class="pagin" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.pageIndex" :page-size="fetchParams.maxResultCount" :page-sizes="[15, 30, 60, 100]" layout="sizes,total, prev, pager, next" :total="pagination.totalCount">
                    </el-pagination>
                </div>
            </div>

        </section>
        <!-- /.content -->

        <!--详情信息的弹出框-->
        <el-dialog class="dialog-detail" :title="L('AuditLogDetail')" :visible.sync="dialogDetail.isShow">
            <article>
                <h2>{{L('UserInformations')}}</h2>
                <article>
                    <section>
                        <em>{{L('UserName')}}:</em> {{dialogDetail.model.userName}}</section>
                    <section>
                        <em>{{L('IpAddress')}}:</em> {{dialogDetail.model.clientIpAddress}}</section>
                    <section>
                        <em>{{L('Client')}}:</em> {{dialogDetail.model.clientName}}</section>
                    <section>
                        <em>{{L('Browser')}}:</em> {{dialogDetail.model.browserInfo}}</section>
                </article>

                <h2>{{L('ActionInformations')}}</h2>
                <article>
                    <section>
                        <em>{{L('Service')}}:</em> {{dialogDetail.model.serviceName}}</section>
                    <section>
                        <em>{{L('Action')}}:</em> {{dialogDetail.model.methodName}}</section>
                    <section>
                        <em>{{L('Time')}}:</em> {{dialogDetail.model.executionTime | DateTimeFormat('YYYY-MM-DD HH:mm:ss')}}</section>
                    <section>
                        <em>{{L('Duration')}}:</em> {{dialogDetail.model.executionDuration}} ms</section>
                    <section>
                        <em>{{L('Parameters')}}:</em>
                        <pre lang="js">{{dialogDetail.model.parameters ? JSON.stringify(JSON.parse(dialogDetail.model.parameters), null, '\t') : ''}}</pre>
                    </section>
                </article>

                <h2>{{L('CustomData')}}</h2>
                <article>
                    <section>{{dialogDetail.model.customData || L('None')}}</section>
                </article>

                <h2>{{L('ErrorState')}}</h2>
                <article class="error-status">
                    <section>
                        <i class="fa fa-check-circle text-success" style="font-size:18px;" v-if="!dialogDetail.model.exception"></i>
                        <span>{{dialogDetail.model.exception || L('Success')}}</span>
                    </section>
                </article>
            </article>
            <span slot="footer" class="dialog-footer">
                <el-button class="waves-effect" @click="dialogDetail.isShow = false">{{L('Close')}}</el-button>
            </span>
        </el-dialog>

        
    </div>
</template>

<script type="text/ecmascript-6">
import * as moment from 'moment';
import config from '../../../common/config';
import DateRangePicker from '../../../components/daterange/DateRangePicker';
import AuditLogService from '../../../services/admin/AuditLogService';

export default {
    data() {
        return {
            errorState: {
                options: [
                    {
                        value: null,
                        label: this.L('All')
                    },
                    {
                        value: false,
                        label: 'Success'
                    },
                    {
                        value: true,
                        label: 'HasError'
                    }
                ],
                value: null,
                label: this.L('All')
            },
            loading: false,
            data: [],
            fetchParams: {
                startDate: moment.Moment,
                endDate: moment.Moment,
                userName: '',
                serviceName: '',
                methodName: '',
                browserInfo: '',
                hasException: null,
                minExecutionDuration: null,
                maxExecutionDuration: null,
                sorting: '',
                maxResultCount: config.defaultPageSize,
                skipCount: 0
            },
            pagination: {
                pageIndex: 1,
                totalCount: 0
            },
            dialogDetail: {
                isShow: false,
                model: {}
            }
        };
    },
    created() {
        this.fetchParams.startDate = moment().startOf('day');
        this.fetchParams.endDate = moment().endOf('day');
    },
    mounted() {
        this.fetchData();
    },
    methods: {
        sortChanged({ column, prop, order }) {
            if (prop && order) {
                this.fetchParams.sorting = prop + ' ' + order;
                this.fetchData();
            }
        },
        handleCurrentChange(val) {
            this.fetchParams.skipCount =
                Math.abs(val - 1) * this.fetchParams.maxResultCount;
            this.fetchData();
        },
        handleSizeChange(val) {
            this.fetchParams.maxResultCount = val;
            this.fetchData();
        },
        fetchData() {
            this.loading = true;

            var search = Object.assign({}, this.fetchParams);
            search.startDate = '' + this.fetchParams.startDate.toJSON();
            search.endDate = '' + this.fetchParams.endDate.toJSON();

            AuditLogService.getAuditLogs(search)
                .then(rs => {
                    var result = rs.result;
                    this.data = result.items;
                    this.total = result.totalCount;
                    this.loading = false;
                })
                .catch(() => {
                    this.loading = false;
                });
        },
        refresh() {
            this.fetchData();
        }
    },

    components: {
        DateRangePicker
    }
};
</script>

<style lang="scss" rel="stylesheet/scss">

</style>