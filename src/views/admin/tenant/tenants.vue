<template>
    <div class="page-wrapper" v-loading="loading">
        <div class="breadcrumbs" id="breadcrumbs">
            <div class="breadcrumb">
                <a href="#" class="active">{{L('Tenants')}}</a>
            </div>
        </div>

        <!-- Content Header (Page header) -->
        <section class="content-header">
            <h1>
                {{L("Tenants")}}
                <small>{{L("TenantsHeaderInfo")}}</small>
            </h1>
        </section>

        <!-- Main content -->
        <section class="content container-fluid">
            <div class="box box-info">
                <div class="box-body">
                    <el-form size="small">
                        <div class="row">
                            <div class="col-md-6">
                                <el-form-item :label="L('TenantNameOrTenancyCode')">
                                    <el-input v-model="fetchParams.filter" size="small" :placeholder="L('SearchWithThreeDot')" class="input-with-select">
                                        <el-button class="waves-effect" slot="append" icon="el-icon-search" @click="fetchData"></el-button>
                                    </el-input>
                                </el-form-item>
                                <el-checkbox v-model="disabledSubscriptionEndDate" size="medium" :label="L('SubscriptionEndDate')" border></el-checkbox>
                                <DateRangePicker :disabled="!disabledSubscriptionEndDate" size="small" :onChange="fetchData" :start.sync="fetchParams.subscriptionEndDateStart" :end.sync="fetchParams.subscriptionEndDateEnd"></DateRangePicker>

                            </div>
                            <div class="col-md-6">
                                <el-form-item :label="L('Edition')" prop="editions">
                                    <el-select style="width:100%;" size="small" v-model="editions.value" :placeholder="editions.label">
                                        <el-option v-for="item in editions.items" :key="item.value" :label="item.displayText" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-checkbox v-model="disabledCreationTime" size="medium" :label="L('CreationTime')" border></el-checkbox>
                                <DateRangePicker :disabled="!disabledCreationTime" size="small" :start.sync="fetchParams.creationDateStart" :end.sync="fetchParams.creationDateEnd"></DateRangePicker>
                            </div>
                        </div>
                    </el-form>
                </div>
            </div>

            <div class="box box-primary">
                <div class="box-body">
                    <div class="toolbar">
                        <div class="btn-group">
                            <button class="waves-effect btn btn-default" v-if="isGranted('Pages.Tenants.Create')" @click="handleCommand({type:'create'})">
                                <i class="fa fa-plus"></i> {{L('Create')}}</button>
                            <button class="waves-effect btn btn-default">
                                <i class="fa fa-refresh"></i> {{L('Refresh')}}</button>
                        </div>
                    </div>

                    <el-table :data="data" @sort-change="sortChanged" :fit="true" style="width:100%" border stripe>
                        <el-table-column width="160" prop="tenancyName" sortable :label="L('TenancyCodeName')">
                        </el-table-column>
                        <el-table-column width="100" prop="name" sortable :label="L('Name')">
                        </el-table-column>
                        <el-table-column width="100" prop="editionDisplayName" :label="L('Edition')">
                        </el-table-column>
                        <el-table-column min-width="220" sortable prop="subscriptionEndDateUtc" :label="L('SubscriptionEndDateUtc')">
                            <template slot-scope="scope">
                                {{scope.row.subscriptionEndDateUtc|DateTimeFormat('L')}}
                            </template>
                        </el-table-column>
                        <el-table-column width="80" prop="isActive" :label="L('Active')">
                            <template slot-scope="scope">
                                <span v-show="scope.row.isActive" class="label label-success">{{L('Yes')}}</span>
                                <span v-show="!scope.row.isActive" class="label label-default">{{L('No')}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column min-width="160" sortable prop="creationTime" :label="L('CreationTime')">
                            <template slot-scope="scope">
                                {{scope.row.creationTime|DateTimeFormat('L')}}
                            </template>
                        </el-table-column>
                        <el-table-column width="130" :label="L('Action')" align="center">
                            <template slot-scope="scope">
                                <el-dropdown trigger="click" @command="handleCommand">
                                    <el-button type="primary" size="small" class="waves-effect">
                                        <i class="fa fa-cog"></i>
                                        {{L('Actions')}}
                                        <i class="el-icon-caret-bottom el-icon--right"></i>
                                    </el-button>
                                    <el-dropdown-menu slot="dropdown">

                                        <el-dropdown-item v-if="isGranted('Pages.Tenants.Impersonation')" :command="{type: 'impersonation', row: scope.row}">
                                            <i class="fa fa-sign-in"></i> {{L('LoginAsThisTenant')}}
                                        </el-dropdown-item>

                                        <el-dropdown-item v-if="isGranted('Pages.Tenants.Edit')" :command="{type: 'edit', row: scope.row}">
                                            <i class="fa fa-edit"></i> {{L('Edit')}}
                                        </el-dropdown-item>

                                        <el-dropdown-item v-if="isGranted('Pages.Tenants.ChangeFeatures')" :command="{type: 'changeFeatures', row: scope.row}">
                                            <i class="fa fa-list-ul"></i> {{L('Features')}}
                                        </el-dropdown-item>

                                        <el-dropdown-item v-if="isGranted('Pages.Tenants.Delete')" :command="{type: 'delete', row: scope.row}">
                                            <i class="fa fa-remove"></i> {{L('Delete')}}
                                        </el-dropdown-item>

                                        <el-dropdown-item :command="{type: 'unlock', row: scope.row}">
                                            <i class="fa fa-unlock"></i> {{L('Unlock')}}
                                        </el-dropdown-item>

                                    </el-dropdown-menu>
                                </el-dropdown>
                            </template>
                        </el-table-column>
                    </el-table>

                    <el-pagination class="pagin" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.pageIndex" :page-size="fetchParams.maxResultCount" :page-sizes="[15, 30, 60, 100]" layout="sizes,total, prev, pager, next" :total="pagination.totalCount">
                    </el-pagination>
                </div>
            </div>

        </section>
        <!-- /.content -->

        <CreateTenantModal :display.sync="createModal.display" :onSave="()=>{ fetchData()}">
        </CreateTenantModal>

        <EditTenantModal :display.sync="editModal.display" :tenantId="editModal.id" :onSave="()=>{ fetchData()}">
        </EditTenantModal>

        <FeatureModal :display.sync="featureModal.display" :tenantId="featureModal.id" :tenantName="featureModal.tenantName">
        </FeatureModal>

        <LookupModal :display.sync="lookupModal.display" :settings="lookupModal.settings" :fetchProps="lookupModal.fetchProps" :modalProps="lookupModal.modalProps" :columns="lookupModal.columns" :selectedItem="handleSelectedItem">
        </LookupModal>
    </div>
</template>

<script type="text/ecmascript-6">
import * as moment from 'moment';
import DateRangePicker from '../../../components/daterange/DateRangePicker';
import EditionService from '../../../services/admin/EditionService';
import TenantService from '../../../services/admin/TenantService';
import MessageHelper from '../../../base/MessageHelper';
import LookupModal from '../../../components/lookup/LookupModal';
import CommonLookupService from '../../../services/common/CommonLookupService';
import CreateTenantModal from './CreateTenantModal.vue';
import EditTenantModal from './EditTenantModal.vue';
import FeatureModal from './FeatureModal.vue';
import ImpersonationService from '../../../services/account/ImpersonationService';

export default {
    data() {
        return {
            loading: false,
            editions: {
                items: [],
                value: '-1',
                label: null
            },
            createModal: {
                display: false
            },
            editModal: {
                id: null,
                display: false
            },
            featureModal: {
                id: null,
                tenantName: '',
                display: false
            },
            lookupModal: {
                display: false,
                modalProps: {
                    width: '',
                    fullscreen: false
                },
                settings: {
                    dataSource: null,
                    canSelect: () => true
                },
                columns: [
                    {
                        label: this.L('Name'),
                        prop: 'name',
                        width: null,
                        minWidth: '120'
                    }
                ],
                fetchProps: {
                    tenantId: null,
                    filterText: ''
                },
                selectedItem: null
            },
            disabledSubscriptionEndDate: false,
            disabledCreationTime: false,
            fetchParams: {
                filter: '',
                sorting: '',
                subscriptionEndDateStart: moment.Moment,
                subscriptionEndDateEnd: moment.Moment,
                creationDateStart: moment.Moment,
                creationDateEnd: moment.Moment,
                editionId: '',
                editionIdSpecified: '',
                maxResultCount: 10,
                skipCount: 0
            },
            pagination: {
                pageIndex: 1,
                totalCount: 0
            },
            data: []
        };
    },
    created() {
        this.fetchParams.subscriptionEndDateStart = moment().startOf('day');
        this.fetchParams.subscriptionEndDateEnd = moment()
            .add(30, 'days')
            .endOf('day');
        this.fetchParams.creationDateStart = moment()
            .add(-7, 'days')
            .startOf('day');
        this.fetchParams.creationDateEnd = moment().endOf('day');

        EditionService.getEditionComboboxItems({
            selectedEditionId: 0,
            addAllItem: true,
            onlyFreeItems: false
        }).then(rs => {
            var result = rs.result;
            this.editions.items = result;
            this.editions.label = result[0].displayText;
            this.editions.value = result[0].value;
        });
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
        async handleSelectedItem(item) {
            await ImpersonationService.impersonate({
                userId: parseInt(item.value),
                tenantId: this.lookupModal.fetchProps.tenantId
            });
        },
        handleCommand(command) {
            switch (command.type) {
                case 'create':
                    this.createModal.display = true;
                    break;
                case 'edit':
                    this.editModal.display = true;
                    this.editModal.id = command.row.id;
                    break;
                case 'changeFeatures':
                    this.featureModal.display = true;
                    this.featureModal.id = command.row.id;
                    this.featureModal.tenantName = command.row.name;
                    break;
                case 'delete':
                    this.deleteTenant(command.row);
                    break;
                case 'unlock':
                    this.unlockTenant(command.row);
                    break;
                case 'impersonation':
                    this.signInAsTenant(command.row);
                    break;
            }
        },
        signInAsTenant(row) {
            this.lookupModal.display = true;
            this.lookupModal.fetchProps.tenantId = row.id;
            // 测试Promise方法, 模板案例
            // this.lookupModal.settings.canSelect = async item => {
            //     /* eslint-disable no-new */
            //     await new Promise(function(resolve) {
            //         setTimeout(() => {
            //             resolve();
            //         }, 5000);
            //     });

            //     if (parseInt(item.value) == 2) return true;
            //     else return false;
            // };
            this.lookupModal.settings.dataSource = async options => {
                var input = {};
                input.filter = options.filterText;
                input.maxResultCount = options.maxResultCount;
                input.skipCount = options.skipCount;
                input.tenantId = options.tenantId;
                var rs = await CommonLookupService.findUsers(input);
                return rs;
            };
        },
        deleteTenant(row) {
            MessageHelper.confirm(
                '',
                this.L('TenantDeleteWarningMessage', row.tenancyName),
                () => {
                    TenantService.deleteTenant({
                        id: row.id
                    }).then(() => {
                        this.fetchData();
                        abp.notify.success(this.L('SuccessfullyDeleted'));
                    });
                }
            );
        },
        unlockTenant(row) {
            TenantService.unlockTenantAdmin({
                id: row.id
            }).then(() => {
                abp.notify.success(this.L('UnlockedTenandAdmin', row.name));
            });
        },
        fetchData() {
            this.loading = true;
            this.fetchParams.editionId = this.editions.value;
            this.fetchParams.editionIdSpecified =
                this.fetchParams.editionId !== undefined &&
                this.fetchParams.editionId + '' !== '-1';

            var searchParams = Object.assign({}, this.fetchParams);
            if (!this.disabledSubscriptionEndDate) {
                searchParams.subscriptionEndDateStart = null;
                searchParams.subscriptionEndDateEnd = null;
            } else {
                searchParams.subscriptionEndDateStart =
                    '' + this.fetchParams.subscriptionEndDateStart.toJSON();
                searchParams.subscriptionEndDateEnd =
                    '' + this.fetchParams.subscriptionEndDateEnd.toJSON();
            }

            if (!this.disabledCreationTime) {
                searchParams.creationDateEnd = null;
                searchParams.creationDateStart = null;
            } else {
                searchParams.creationDateEnd =
                    '' + this.fetchParams.creationDateEnd.toJSON();
                searchParams.creationDateStart =
                    '' + this.fetchParams.creationDateStart.toJSON();
            }

            TenantService.getTenants(searchParams)
                .then(rs => {
                    var result = rs.result;
                    this.data = result.items;
                    this.total = result.totalCount;
                    this.loading = false;
                })
                .catch(() => {
                    this.loading = false;
                });
        }
    },
    components: {
        DateRangePicker,
        CreateTenantModal,
        EditTenantModal,
        FeatureModal,
        LookupModal
    }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>