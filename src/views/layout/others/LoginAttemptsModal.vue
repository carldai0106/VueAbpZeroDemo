<template>
    <el-dialog :title="L('LoginAttempts')" :visible.sync="selfVisible" v-loading="loading" :modal-append-to-body="false" @open="handleOpen" width="700px" top="1vh">
        <div class="form-horizontal">
            <div v-for="(item, index) in data" :key="index" class="row">
                <div class="login-attemp alert bg-gray-light">
                    <div class="col-xs-3 text-center">
                        <div>
                            <img v-if="!profilePicture" src="../../../vendor/AdminLTE/img/user2-160x160.jpg" class="user-image">
                            <img v-else :src="profilePicture" class="user-image">
                        </div>

                        <span class="label label-success" v-if="item.result === 'Success'">{{L('Success')}}</span>
                        <span class="label label-danger" v-else>{{L('Failed')}}</span>
                    </div>
                    <div class="col-xs-9">
                        <div class="row" v-if="item.clientIpAddress">
                            <label class="control-label col-sm-3 text-right">{{L("IpAddress")}}</label>
                            <div class="col-sm-9">
                                <p class="form-control-static">
                                    {{item.clientIpAddress}}
                                </p>
                            </div>
                        </div>

                        <div class="row" v-if="item.clientName">
                            <label class="control-label col-sm-3 text-right">{{L("Client")}}</label>
                            <div class="col-sm-9">
                                <p class="form-control-static">
                                    {{item.clientName}}
                                </p>
                            </div>
                        </div>

                        <div class="row" v-if="item.browserInfo">
                            <label class="control-label col-sm-3 text-right">{{L("Browser")}}</label>
                            <div class="col-sm-9">
                                <p class="form-control-static">
                                    {{item.browserInfo}}
                                </p>
                            </div>
                        </div>

                        <div class="row">
                            <label class="control-label col-sm-3 text-right">{{L("Time")}}</label>
                            <div class="col-sm-9">
                                <p class="form-control-static login-attempt-date">
                                    {{getLoginAttemptTime(item)}}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="clearfix"></div>
                </div>
            </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="selfVisible = false">{{L('Cancel')}}</el-button>
        </span>
    </el-dialog>
</template>

<script type="text/ecmascript-6">
import * as moment from 'moment';
import UserLoginService from '../../../services/admin/UserLoginService';
import ProfileService from '../../../services/admin/ProfileService';
export default {
    props: {
        display: Boolean
    },
    data() {
        return {
            data: [],
            profilePicture: null,
            selfVisible: this.display,
            loading: false
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
        getLoginAttemptTime(userLoginAttempt) {
            return (
                moment(userLoginAttempt.creationTime).fromNow() +
                ' (' +
                moment(userLoginAttempt.creationTime).format(
                    'YYYY-MM-DD hh:mm:ss'
                ) +
                ')'
            );
        },
        async getProfilePicture() {
            var result = await ProfileService.getProfilePicture();
            if (result && result.profilePicture) {
                this.profilePicture =
                    'data:image/jpeg;base64,' + result.profilePicture;
            }
        },
        async getRecentUserLoginAttempts() {
            var rs = await UserLoginService.getRecentUserLoginAttempts();
            this.data = rs.items;
        },
        handleOpen() {
            this.loading = true;
            Promise.all([
                this.getRecentUserLoginAttempts(),
                this.getProfilePicture()
            ])
                .then(() => {
                    this.loading = false;
                })
                .catch(() => {
                    this.loading = false;
                });
        }
    }
};
</script>

<style lang="scss" rel="stylesheet/scss">
.login-attemp {
    margin: 10px 20px;
    border-radius: 0;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
    .label {
        padding: 6px 8px;
    }
    .user-image {
        width: 86px;
        height: 86px;
        border-radius: 50%;
        margin-bottom: 10px;
    }
}
</style>