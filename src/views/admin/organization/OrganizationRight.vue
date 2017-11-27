<template>
    <div class="box box-primary" v-loading="loading">

        <div class="box-header with-border">
            <h3 class="box-title">
                <span v-if="organizationUnit">{{organizationUnit.displayName}}</span>
                <span v-if="!organizationUnit">{{L("Members")}}</span>
            </h3>

            <!-- tools box -->
            <div class="pull-right box-tools">
                <button v-if="isGranted('Pages.Administration.OrganizationUnits.ManageMembers') && organizationUnit" type="button" class="waves-effect btn btn-primary btn-sm" @click="openAddModal">
                    <i class="fa fa-plus"></i> {{L('AddMember')}}
                </button>
            </div>
            <!-- /. tools -->
        </div>

        <div class="box-body">

            <el-table v-if="organizationUnit" v-loading="loading" @sort-change="sortChanged" :data="data" :fit="true" border stripe>
                <el-table-column min-width="120" prop="userName" :label="L('UserName')" sortable='custom'>
                </el-table-column>
                <el-table-column width="200" prop="addedTime" :label="L('AddedTime')" sortable='custom'>
                    <template slot-scope="scope">
                        {{scope.row.addedTime | DateTimeFormat('LLL')}}
                    </template>
                </el-table-column>
                <el-table-column width="100" :label="L('Action')">
                    <template slot-scope="scope">
                        <button class="waves-effect btn btn-danger" @click="removeMember($event, scope.row)">
                            <i class="fa fa-trash"></i> {{L('Delete')}}</button>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination v-show="pagination.totalCount > fetchParams.maxResultCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.pageIndex" :page-size="fetchParams.maxResultCount" :page-sizes="[15, 30, 60, 100]" layout="sizes,total, prev, pager, next" :total="pagination.totalCount">
            </el-pagination>

            <div v-if="!organizationUnit" class="text-muted">
                {{L("SelectAnOrganizationUnitToSeeMembers")}}
            </div>
        </div>

        <AddMemberModal :display.sync="modal.display" :organizationUnitId="modal.id"></AddMemberModal>
    </div>
</template>

<script type="text/ecmascript-6">
// import * as _ from 'lodash';
import MessageHelper from '../../../base/MessageHelper';
import OrganizationUnitService from '../../../services/admin/OrganizationUnitService';
import AddMemberModal from './AddMemberModal';
export default {
    props: {
        organizationUnit: Object
    },
    data() {
        return {
            loading: false,
            data: null,
            modal: {
                display: false,
                id: null
            },
            fetchParams: {
                id: null,
                filter: null,
                sorting: null,
                maxResultCount: 15,
                skipCount: 0
            },
            pagination: {
                pageIndex: 1,
                totalCount: 0
            },
            selectedOu: null
        };
    },
    watch: {
        organizationUnit(val) {
            this.selectedOu = val;
            this.fetchData();
        },
        '$store.state.organization.addedMembers'(val) {
            if (val) {
                this.fetchData();
            }
        }
    },
    mounted() {},
    methods: {
        sortChanged({ column, prop, order }) {
            if (prop && order) {
                this.fetchParams.sorting = prop + ' ' + order;
                this.fetchData();
            }
        },
        fetchData() {
            if (!this.selectedOu) {
                return;
            }

            this.loading = true;
            this.fetchParams.id = this.selectedOu.id;
            OrganizationUnitService.getOrganizationUnitUsers(this.fetchParams)
                .then(rs => {
                    this.data = rs.items;
                    this.pagination.totalCount = rs.totalCount;
                    this.loading = false;
                })
                .catch(() => {
                    this.loading = false;
                });
        },
        openAddModal() {
            this.modal.id = this.selectedOu.id;
            this.modal.display = true;
            console.log(this.selectedOu);
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
        removeMember(e, row) {
            var self = this;
            MessageHelper.confirm(
                '',
                this.L(
                    'RemoveUserFromOuWarningMessage',
                    row.userName,
                    this.selectedOu.displayName
                ),
                () => {
                    OrganizationUnitService.removeUserFromOrganizationUnit({
                        UserId: row.id,
                        OrganizationUnitId: this.selectedOu.id
                    }).then(() => {
                        var member = {
                            userId: row.id,
                            ouId: this.selectedOu.id
                        };
                        this.$store.dispatch('SetRemovedMember', { member });
                        this.fetchData();
                        abp.notify.success(self.L('SuccessfullyRemoved'));
                    });
                }
            );
        }
    },
    components: {
        AddMemberModal
    }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>