<template>
    <el-dialog :title="L('SelectUsers')" :visible.sync="selfVisible" :modal-append-to-body="false" @open="handleOpen" @close="handleClose" width="500px" v-loading="loading">

        <el-input class="mar-btm-10" v-model="fetchParams.filter" size="small" :placeholder="L('SearchWithThreeDot')">
            <el-button class="waves-effect" slot="append" icon="el-icon-search" @click="fetchData"></el-button>
        </el-input>

        <el-table :data="data" :fit="true" @selection-change="handleSelectionChange" border stripe>
            <el-table-column type="selection" width="55" @selection-change="handleSelectionChange">
            </el-table-column>
            <el-table-column min-width="120" prop="name" :label="L('UserName')">
            </el-table-column>
        </el-table>

        <el-pagination v-show="pagination.totalCount > fetchParams.maxResultCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.pageIndex" :page-size="fetchParams.maxResultCount" :page-sizes="[15, 30, 60, 100]" layout="sizes,total, prev, pager, next" :total="pagination.totalCount">
        </el-pagination>

        <span slot="footer" class="dialog-footer">
            <el-button class="waves-effect" @click="selfVisible = false">{{L('Cancel')}}</el-button>
            <el-button class="waves-effect" type="primary" @click="save">{{L('Save')}}</el-button>
        </span>
    </el-dialog>
</template>

<script type="text/ecmascript-6">
import * as _ from 'lodash';
import config from '../../../common/config';
import OrganizationUnitService from '../../../services/admin/OrganizationUnitService';
export default {
    props: {
        display: Boolean,
        organizationUnitId: Number
    },
    data() {
        return {
            loading: false,
            selfVisible: this.display,
            data: null,
            fetchParams: {
                organizationUnitId: null,
                filter: null,
                sorting: null,
                maxResultCount: config.defaultPageSize,
                skipCount: 0
            },
            pagination: {
                pageIndex: 1,
                totalCount: 0
            },
            selectedList: null
        };
    },
    watch: {
        // 监控父组件传递过来的值来指示是否显示dialog
        display(val) {
            if (val != this.selfVisible) {
                this.selfVisible = val;
            }
        },
        // 监控本组件的显示状态
        selfVisible(val) {
            // 更新状态到父组件是否显示本对话框
            this.$emit('update:display', val);
        }
    },
    methods: {
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
            OrganizationUnitService.findUsers(this.fetchParams).then(
                rs => {
                    this.pagination.totalCount = rs.totalCount;
                    this.data = rs.items;
                    this.loading = false;
                },
                () => {
                    this.loading = false;
                }
            );
        },
        handleOpen() {
            this.fetchParams.organizationUnitId = this.organizationUnitId;
            this.fetchData();
        },
        handleSelectionChange(val) {
            this.selectedList = val;
        },
        handleClose() {},
        save() {
            var self = this;
            var input = {};
            input.organizationUnitId = this.organizationUnitId;
            input.userIds = _.map(this.selectedList, selectedMember =>
                Number(selectedMember.value)
            );
            this.loading = true;
            OrganizationUnitService.addUsersToOrganizationUnit(input)
                .then(() => {
                    var members = {
                        userIds: input.userIds,
                        ouId: input.organizationUnitId
                    };
                    abp.notify.success(self.L('SuccessfullyAdded'));

                    this.selectedList = [];
                    this.$store.dispatch('SetAddedMembers', { members });
                    this.selfVisible = false;
                    this.loading = false;
                })
                .catch(() => {
                    this.loading = false;
                });
        }
    }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>