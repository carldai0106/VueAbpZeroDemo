<template>
    <el-dialog :title="L('NotificationSettings')" :visible.sync="selfVisible" @open="handleOpen" @close="handleClose" width="500px" v-loading="loading" :modal-append-to-body="false">
        <el-form v-if="settings" class="el-form-small" size="small">
            <h4>{{L("ReceiveNotifications")}}</h4>

            <el-form-item>
                <el-switch v-model="settings.receiveNotifications" :on-text="L('On')" :off-text="L('Off')">
                </el-switch>
                <span class="help-block">{{L("ReceiveNotifications_Definition")}}</span>
            </el-form-item>

            <h4 v-if="settings.notifications.length">{{L("NotificationTypes")}}</h4>

            <p v-if="settings.notifications.length && !settings.receiveNotifications" class="text-danger">
                <small>{{L("ReceiveNotifications_DisableInfo")}}</small>
            </p>

            <el-form-item v-for="(notification, index) of settings.notifications" :key="index">
                <el-checkbox style="width:100%;" v-model="notification.isSubscribed" :disabled="!settings.receiveNotifications" :label="notification.displayName" border size="medium"></el-checkbox>
                {{L('DefaultRole_Description')}}
                <span v-if="notification.description" class="help-block">{{notification.description}}</span>
            </el-form-item>

        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button class="waves-effect" @click="selfVisible = false">{{L('Cancel')}}</el-button>
            <el-button class="waves-effect" type="primary" @click="save">{{L('Save')}}</el-button>
        </span>
    </el-dialog>
</template>

<script type="text/ecmascript-6">
import * as _ from 'lodash';
import NotificationService from '../../../services/admin/NotificationService';
export default {
    props: {
        display: Boolean
    },
    data() {
        return {
            selfVisible: this.display,
            loading: false,
            settings: null,
            notifications: {}
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
        async handleOpen() {
            this.loading = true;
            await this.getSettings();
            this.loading = false;
        },
        handleClose() {},
        async getSettings() {
            var rs = await NotificationService.getNotificationSettings();
            this.settings = rs;
        },
        save() {
            this.loading = true;
            var input = {};
            input.receiveNotifications = this.settings.receiveNotifications;
            input.notifications = _.map(this.settings.notifications, n => {
                let subscription = {};
                subscription.name = n.name;
                subscription.isSubscribed = n.isSubscribed;
                return subscription;
            });

            NotificationService.updateNotificationSettings(input)
                .then(() => {
                    abp.notify.success(this.L('SavedSuccessfully'));

                    this.loading = false;
                    this.selfVisible = false;
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