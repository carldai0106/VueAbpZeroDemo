<template>
    <div v-loading="loading">
        <el-dialog :title="L('MySettings')" :visible.sync="selfVisible" :modal-append-to-body="false" @open="handleOpen" @close="handleClose" width="500px">
            <el-tabs v-model="activeName" @tab-click="handleTabClick" type="border-card">
                <el-tab-pane :label="L('Profile')" name="Profile">
                    <el-form class="el-form-small" size="small" :model="user" :rules="rules" ref="mySettingsForm">
                        <el-form-item :label="L('Name')" prop="name">
                            <el-input type="text" v-model="user.name" :placeholder="L('Name')" autofocus></el-input>
                        </el-form-item>
                        <el-form-item :label="L('Surname')" prop="surname">
                            <el-input type="text" v-model="user.surname" :placeholder="L('Surname')"></el-input>
                        </el-form-item>
                        <el-form-item :label="L('EmailAddress')" prop="emailAddress">
                            <el-input type="text" v-model="user.emailAddress" :placeholder="L('EmailAddress')"></el-input>
                        </el-form-item>

                        <el-form-item v-if="initial.smsEnabled && !initial.isPhoneNumberEmpty" :label="L('PhoneNumber')" prop="phoneNumber">
                            <el-input type="text" :placeholder="L('PhoneNumber')" v-model="user.phoneNumber">
                                <template slot="append">
                                    <el-tooltip v-if="!initial.isPhoneNumberConfirmed" class="item" effect="dark" :content="L('YourPhoneNumberIsNotVerified')" placement="top">
                                        <el-button class="waves-effect" @click="smsVerify">
                                            <i class="fa fa-warning font-warning"></i> {{L('Verify')}}</el-button>
                                    </el-tooltip>
                                    <el-tooltip v-else class="item" effect="dark" :content="L('YourPhoneNumberIsVerified')" placement="top">
                                        <i class="fa fa-check font-success"></i>
                                    </el-tooltip>
                                </template>
                            </el-input>
                        </el-form-item>

                        <el-form-item v-else :label="L('PhoneNumber')" prop="phoneNumber">
                            <el-input type="text" v-model="user.phoneNumber" :placeholder="L('PhoneNumber')"></el-input>
                        </el-form-item>

                        <el-form-item :label="L('UserName')" prop="userName">
                            <el-input :disabled="!initial.canChangeUserName" type="text" v-model="user.userName" :placeholder="L('UserName')"></el-input>

                            <span class="help-block" v-if="!initial.canChangeUserName">{{L("CanNotChangeAdminUserName")}}</span>
                        </el-form-item>

                        <el-form-item v-if="initial.showTimezoneSelection" :label="L('Timezone')" prop="timezone">
                            <TimezoneSelect v-model="user.timezone" :defaultTimezoneScope="initial.defaultTimezoneScope"></TimezoneSelect>
                        </el-form-item>

                    </el-form>
                </el-tab-pane>

                <el-tab-pane :label="L('TwoFactorLogin')" name="TwoFactorLogin">
                    <h4>
                        Google Authenticator
                    </h4>

                    <div :hidden="!initial.isGoogleAuthenticatorEnabled">
                        <div>
                            {{L("ScanQrCodeWithYourMobileApp")}}
                        </div>
                        <div class="text-center">
                            <img :src="user.qrCodeSetupImageUrl" />
                        </div>
                        <small>
                            {{L("GoogleAuthenticatorReferrerLink")}}:
                            <a href="https://support.google.com/accounts/answer/1066447" target="_blank" rel="noopener noreferrer">Google Authenticator</a>
                        </small>
                    </div>

                    <div :hidden="initial.isGoogleAuthenticatorEnabled">
                        <button type="button" class="waves-effect btn btn-primary" @click="updateQrCodeSetupImageUrl">{{L("Enable")}}</button>
                    </div>

                </el-tab-pane>

            </el-tabs>
            <span slot="footer" class="dialog-footer">
                <el-button class="waves-effect" @click="selfVisible = false">{{L('Cancel')}}</el-button>
                <el-button class="waves-effect" type="primary" @click="save">{{L('Save')}}</el-button>
            </span>
        </el-dialog>

        <SmsVerificationModal :display.sync="smsVerificationModal.display" :onSave="()=> { changePhoneNumberToVerified(); }"></SmsVerificationModal>
    </div>
</template>

<script type="text/ecmascript-6">
import types from '../../../common/types';
import config from '../../../common/config';
import MessageHelper from '../../../base/MessageHelper';
import TimezoneSelect from '../../../components/select/TimezoneSelect';
import ProfileService from '../../../services/admin/ProfileService';
import SmsVerificationModal from './SmsVerificationModal';
export default {
    props: {
        display: Boolean,
        onSave: Function
    },
    data() {
        var initialVals = {
            isGoogleAuthenticatorEnabled: false,
            isPhoneNumberConfirmed: false,
            isPhoneNumberEmpty: false,
            smsEnabled: false,
            showTimezoneSelection: abp.clock.provider.supportsMultipleTimezone,
            canChangeUserName: false,
            defaultTimezoneScope: types.AppTimezoneScope.User,
            initialTimezone: null
        };
        return {
            selfVisible: this.display,
            loading: false,
            activeName: 'Profile',
            initial: initialVals,
            user: {},
            smsVerificationModal: {
                display: false
            },
            rules: {
                name: [
                    {
                        required: true,
                        message: this.L('TheFieldIsRequired', this.L('Name')),
                        trigger: 'blur,change'
                    }
                ],
                surname: [
                    {
                        required: true,
                        message: this.L(
                            'TheFieldIsRequired',
                            this.L('Surname')
                        ),
                        trigger: 'blur,change'
                    }
                ],
                emailAddress: [
                    {
                        type: 'email',
                        required: true,
                        message: this.L(
                            'EnterAValidEmail',
                            this.L('EmailAddress')
                        ),
                        trigger: 'change, blur'
                    }
                ],
                userName: [
                    {
                        required: true,
                        message: this.L(
                            'TheFieldIsRequired',
                            this.L('UserName')
                        ),
                        trigger: 'blur,change'
                    }
                ]
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
        smsVerify() {
            ProfileService.sendVerificationSms().then(() => {
                this.smsVerificationModal.display = true;
            });
        },
        changePhoneNumberToVerified() {
            this.initial.isPhoneNumberConfirmed = true;
        },
        handleTabClick() {},
        handleOpen() {
            this.activeName = 'Profile';
            this.loading = true;
            ProfileService.getCurrentUserProfileForEdit()
                .then(rs => {
                    this.user = rs;
                    this.initial.smsEnabled = abp.setting.getBoolean(
                        'App.UserManagement.SmsVerificationEnabled'
                    );
                    this.initial.initialTimezone = rs.timezone;
                    this.initial.canChangeUserName =
                        this.user.userName != config.defaultAdminUserName;
                    this.initial.isGoogleAuthenticatorEnabled =
                        rs.isGoogleAuthenticatorEnabled;
                    this.initial.isPhoneNumberConfirmed =
                        rs.isPhoneNumberConfirmed;
                    this.initial.isPhoneNumberEmpty = rs.phoneNumber === '';
                    this.loading = false;
                })
                .catch(() => {
                    this.loading = false;
                });
        },
        handleClose() {},
        updateQrCodeSetupImageUrl() {
            ProfileService.updateGoogleAuthenticatorKey().then(result => {
                this.user.qrCodeSetupImageUrl = result.qrCodeSetupImageUrl;
                this.initial.isGoogleAuthenticatorEnabled = true;
            });
        },
        save() {
            this.$refs.mySettingsForm.validate(valid => {
                if (valid) {
                    this.loading = true;
                    ProfileService.updateCurrentUserProfile(this.user).then(
                        () => {
                            abp.notify.success(this.L('SavedSuccessfully'));

                            this.loading = false;
                            this.selfVisible = false;
                            this.onSave && this.onSave();

                            if (
                                abp.clock.provider.supportsMultipleTimezone &&
                                this.initial.initialTimezone !==
                                    this.user.timezone
                            ) {
                                MessageHelper.info(
                                    '',
                                    this.L(
                                        'TimeZoneSettingChangedRefreshPageNotification'
                                    )
                                ).then(() => {
                                    window.location.reload();
                                });
                            }
                        }
                    );
                } else {
                    return false;
                }
            });
        }
    },
    components: {
        TimezoneSelect,
        SmsVerificationModal
    }
};
</script>