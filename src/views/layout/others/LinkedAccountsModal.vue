<template>
    <div>
        <el-dialog :title="L('LinkedAccounts')" :visible.sync="selfVisible" :modal-append-to-body="false" @open="handleOpen" @close="handleClose" v-loading="loading" width="700px" top="1vh">

            <div class="toolbar">
                <button class="btn btn-primary" @click="manageLinkedAccounts">
                    <i class="fa fa-plus fa-lg"></i> {{L("LinkNewAccount")}}</button>
            </div>

            <el-table @sort-change="sortChanged" :data="data" :fit="true" border stripe>
                <el-table-column :label="L('Actions')" width="80">
                    <template slot-scope="scope">
                        <button class="btn btn-sm btn-primary" @click="switchToUser(scope.row)">
                            <i class="fa fa-sign-in fa-lg"></i> {{L('LogIn')}}
                        </button>
                    </template>
                </el-table-column>
                <el-table-column prop="userName" min-width="200" :label="L('UserName')" sortable>
                    <template slot-scope="scope">
                        {{getShownLinkedUserName(scope.row)}}
                    </template>
                </el-table-column>
                <el-table-column :label="L('Delete')" width="80">
                    <template slot-scope="scope">
                        <button class="btn btn-sm btn-danger" @click="deleteLinkedUser(scope.row)">
                            <i class="fa fa-trash fa-lg"></i> {{L('Delete')}}
                        </button>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination class="pagin" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.pageIndex" :page-size="fetchParams.maxResultCount" :page-sizes="[15, 30, 60, 100]" layout="sizes,total, prev, pager, next" :total="pagination.totalCount">
            </el-pagination>
            <span slot="footer" class="dialog-footer">
                <el-button @click="selfVisible = false">{{L('Close')}}</el-button>
            </span>
        </el-dialog>
        <CreateLinkAccountModal :display.sync="createLinkAccountModal.display" :onSave="() => fetchData()"></CreateLinkAccountModal>
    </div>
</template>

<script type="text/ecmascript-6">
import config from '../../../common/config';
import MessageHelper from '../../../base/MessageHelper';
import UserLinkService from '../../../services/admin/UserLinkService';
import AccountService from '../../../services/account/AccountService';
import AppAuthService from '../../../services/common/AppAuthService';
import AppUrlService from '../../../services/common/AppUrlService';
import CreateLinkAccountModal from './CreateLinkAccountModal';
export default {
    props: {
        display: Boolean,
        onSave: Function
    },
    data() {
        return {
            data: [],
            selfVisible: this.display,
            loading: false,
            fetchParams: {
                maxResultCount: config.defaultPageSize,
                skipCount: 0,
                sorting: ''
            },
            pagination: {
                pageIndex: 1,
                totalCount: 0
            },
            createLinkAccountModal: {
                display: false
            }
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
    created() {},
    methods: {
        manageLinkedAccounts() {
            console.log(1234);
            this.createLinkAccountModal.display = true;
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
        sortChanged({ column, prop, order }) {
            if (prop && order) {
                this.fetchParams.sorting = prop + ' ' + order;
                this.fetchData();
            }
        },
        getShownLinkedUserName(row) {
            if (!abp.multiTenancy.isEnabled) {
                return row.username;
            }

            return (row.tenantId ? row.tenancyName : '.') + '\\' + row.username;
        },
        async switchToUser(row) {
            var rs = await AccountService.switchToLinkedAccount({
                targetUserId: row.id,
                targetTenantId: row.tenantId
            });

            AppAuthService.logout(false);

            let targetUrl =
                AppUrlService.getAppRootUrlOfTenant(rs.tenancyName) +
                config.signInAsSomeoneUrlSegment +
                '?switchAccountToken=' +
                rs.switchAccountToken;

            if (row.tenantId) {
                targetUrl = targetUrl + '&tenantId=' + row.tenantId;
            }

            location.href = targetUrl;
        },
        deleteLinkedUser(row) {
            MessageHelper.confirm(
                '',
                this.L('LinkedUserDeleteWarningMessage', row.username),
                () => {
                    const unlinkUserInput = {};
                    unlinkUserInput.userId = row.id;
                    unlinkUserInput.tenantId = row.tenantId;
                    UserLinkService.unlinkUser(unlinkUserInput).then(() => {
                        this.fetchData();
                        abp.notify.success(this.L('SuccessfullyUnlinked'));
                    });
                }
            );
        },
        async handleOpen() {
            await this.fetchData();
        },
        async handleClose() {
            this.onSave && this.onSave();
        },
        async fetchData() {
            this.loading = true;
            try {
                var rs = await UserLinkService.getLinkedUsers(this.fetchParams);
                this.data = rs.items;
                this.pagination.totalCount = rs.totalCount;
            } finally {
                this.loading = false;
            }
        }
    },
    components: { CreateLinkAccountModal }
};
</script>
