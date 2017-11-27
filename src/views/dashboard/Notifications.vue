<template>
    <div class="page-wrapper" v-loading="loading">
        <div class="breadcrumbs" id="breadcrumbs">
            <div class="breadcrumb">
                <a href="#" class="active">{{L('Notifications')}}</a>
            </div>
        </div>

        <!-- Content Header (Page header) -->
        <section class="content-header">
            <h1>
                {{L('Notifications')}}
            </h1>
        </section>

        <!-- Main content -->
        <section class="content container-fluid">

            <div class="box box-info">
                <div class="box-body">

                    <div class="form-group">

                        <select v-on:change="handleChange" v-model="fetchParams.readStateFilter" class="form-control">
                            <option value="ALL">{{L('All')}}</option>
                            <option value="UNREAD">{{L('Unread')}}</option>
                        </select>

                    </div>
                </div>
            </div>

            <div class="box box-primary">
                <div class="box-body">

                    <div class="toolbar">
                        <div class="btn-group">
                            <button class="btn btn-default" @click="openNotificationSettingsModal">
                                <i class="fa fa-cog"></i> {{L("NotificationSettings")}}</button>
                            <button class="btn btn-default" @click="setAllNotificationsAsRead">
                                <i class="fa fa-check"></i> {{L("SetAllAsRead")}}</button>
                            <button class="btn btn-default" @click="getNotifications">
                                <i class="fa fa-refresh"></i> {{L("Refresh")}}</button>
                        </div>
                    </div>

                    <el-table class="data-table" v-loading="loading" :data="data" :fit="true" border stripe>
                        <el-table-column min-width="320" :label="L('Notification')">
                            <template slot-scope="scope">
                                <a v-if="scope.row.formattedNotification.url" :href="scope.row.formattedNotification.url" :class="getRowClass(scope.row)">{{truncateString(scope.row.formattedNotification.text, 120)}}</a>
                                <span v-if="!scope.row.formattedNotification.url" :title="scope.row.formattedNotification.text" :class="getRowClass(scope.row)">{{truncateString(scope.row.formattedNotification.text, 120)}}</span>
                            </template>
                        </el-table-column>

                        <el-table-column width="200" prop="creationTime" :label="L('CreationTime')">
                            <template slot-scope="scope">
                                <span :class="getRowClass(scope.row)">{{fromNow(scope.row.notification.creationTime)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column width="110" :label="L('Actions')">
                            <template slot-scope="scope">
                                <button class="btn btn-primary" :title="L('SetAsRead')" @click="setAsRead(scope.row)" :disabled="isRead(scope.row)">
                                    <i class="fa fa-check" v-if="isRead(scope.row)"></i>
                                    <i class="fa fa-circle-o" v-if="!isRead(scope.row)"></i>
                                </button>
                            </template>
                        </el-table-column>
                    </el-table>

                    <el-pagination class="pagin" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.pageIndex" :page-size="fetchParams.maxResultCount" :page-sizes="[15, 30, 60, 100]" layout="sizes,total, prev, pager, next" :total="pagination.totalCount">
                    </el-pagination>
                </div>
            </div>

        </section>
        <!-- /.content -->

        <NotificationSettingsModal :display.sync="notificationSettingsModal.display"></NotificationSettingsModal>
    </div>
</template>

<script type="text/ecmascript-6">
import * as moment from 'moment';
import config from '../../common/config';
import NotificationService from '../../services/admin/NotificationService';
import UserNotificationHelper from '../layout/UserNotificationHelper';
import NotificationSettingsModal from '../layout/others/NotificationSettingsModal';

export default {
    data() {
        return {
            loading: false,
            data: [],
            fetchParams: {
                readStateFilter: 'ALL',
                filter: null,
                sorting: null,
                maxResultCount: config.defaultPageSize,
                skipCount: 0
            },
            pagination: {
                pageIndex: 1,
                totalCount: 0
            },
            notificationSettingsModal: {
                display: false
            }
        };
    },
    mounted() {
        this.getNotifications();
    },
    methods: {
        handleCurrentChange(val) {
            this.fetchParams.skipCount =
                Math.abs(val - 1) * this.fetchParams.maxResultCount;
            this.getNotifications();
        },
        handleSizeChange(val) {
            this.fetchParams.maxResultCount = val;
            this.getNotifications();
        },
        setAsRead(record) {
            this.setNotificationAsRead(record, () => {
                this.getNotifications();
            });
        },
        isRead(record) {
            return record.formattedNotification.state === 'READ';
        },
        fromNow(date) {
            return moment(date).fromNow();
        },
        formatRecord(record) {
            return UserNotificationHelper.format(record, false);
        },
        formatNotification(record) {
            const formattedRecord = this.formatRecord(record);
            return abp.utils.truncateStringWithPostfix(
                formattedRecord.text,
                120
            );
        },
        formatNotifications(records) {
            const formattedRecords = [];
            for (const record of records) {
                record.formattedNotification = this.formatRecord(record);
                formattedRecords.push(record);
            }
            return formattedRecords;
        },
        truncateString(text, length) {
            return abp.utils.truncateStringWithPostfix(text, length);
        },
        async setAllNotificationsAsRead() {
            await UserNotificationHelper.setAllAsRead(() => {
                this.getNotifications();
            });
        },
        openNotificationSettingsModal() {
            this.notificationSettingsModal.display = true;
        },
        async setNotificationAsRead(userNotification, callback) {
            await UserNotificationHelper.setAsRead(userNotification.id, () => {
                if (callback) {
                    callback();
                }
            });
        },
        getRowClass(record) {
            return record.formattedNotification.state === 'READ'
                ? 'notification-read'
                : '';
        },
        handleChange() {
            console.log('change');
            this.getNotifications();
        },
        getNotifications() {
            this.loading = true;
            this.fetchParams.State =
                this.fetchParams.readStateFilter == 'ALL' ? undefined : 0;
            NotificationService.getUserNotifications(this.fetchParams)
                .then(result => {
                    this.pagination.totalCount = result.totalCount;
                    this.data = this.formatNotifications(result.items);
                    console.log(this.data);
                    this.loading = false;
                })
                .catch(() => {
                    this.loading = false;
                });
        }
    },
    components: { NotificationSettingsModal }
};
</script>
<style lang="scss" scoped>
.data-table {
    a {
        color: #000;
    }

    .notification-read {
        color: #999;

        a {
            color: #999;
        }
    }
}
</style>
