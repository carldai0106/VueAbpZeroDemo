<template>
    <el-dialog :title="id ? L('EditUser') + ' : ' + user.userName : L('CreateNewUser')" :visible.sync="selfVisible" :modal-append-to-body="false" @open="handleOpen" @close="handleClose" top="1vh" width="600px" v-loading="loading">
        <el-tabs v-model="activeName" @tab-click="handleTabClick" type="border-card">
            <el-tab-pane :label="L('UserInformations')" name="first">

                <el-form class="el-form-small" size="small" :model="user" :rules="rules" ref="userForm">

                    <div class="row mar-btm-10">
                        <div class="col-sm-4">
                            <img class="img-thumbnail img-rounded" src="../../../assets/images/default-profile-picture.png" />
                        </div>
                        <div class="col-sm-8">
                            <el-form-item :label="L('Name')" prop="name">
                                <el-input v-model="user.name" :placeholder="L('Name')"></el-input>
                            </el-form-item>
                            <el-form-item :label="L('Surname')" prop="surname">
                                <el-input v-model="user.surname" :placeholder="L('Surname')"></el-input>
                            </el-form-item>
                        </div>
                    </div>

                    <el-form-item :label="L('EmailAddress')" prop="emailAddress">
                        <el-input v-model="user.emailAddress" :placeholder="L('EmailAddress')"></el-input>
                    </el-form-item>

                    <el-form-item :label="L('PhoneNumber')" prop="phoneNumber">
                        <el-input v-model="user.phoneNumber" :placeholder="L('PhoneNumber')"></el-input>
                    </el-form-item>

                    <!-- initiation.canChangeUserName -->
                    <el-form-item :label="L('UserName')" prop="userName">
                        <el-input v-model="user.userName" :placeholder="L('UserName')" :disabled="!initiation.canChangeUserName"></el-input>
                        <span class="alert alert-info help-block" v-if="!initiation.canChangeUserName" style="margin-bottom: 0px; padding: 0 15px; margin-top:10px; border-radius: 3px;">{{L("CanNotChangeAdminUserName")}}</span>
                    </el-form-item>

                    <!-- initiation.setRandomPassword -->
                    <el-form-item prop="setRandomPassword">
                        <el-checkbox size="medium" style="width:100%;" border :label="L('SetRandomPassword')" v-model="initiation.setRandomPassword"></el-checkbox>
                    </el-form-item>

                    <el-form-item :label="L('Password')" prop="password" v-if="!initiation.setRandomPassword">
                        <el-input type="password" v-model="user.password" :placeholder="L('Password')"></el-input>
                    </el-form-item>

                    <!-- initiation.setRandomPassword -->
                    <el-form-item :label="L('PasswordRepeat')" prop="passwordRepeat" v-if="!initiation.setRandomPassword">
                        <el-input type="password" v-model="user.passwordRepeat" :placeholder="L('PasswordRepeat')"></el-input>
                    </el-form-item>

                    <el-form-item prop="shouldChangePasswordOnNextLogin">
                        <el-checkbox :label="L('ShouldChangePasswordOnNextLogin')" size="medium" style="width:100%;" border v-model="user.shouldChangePasswordOnNextLogin"></el-checkbox>
                    </el-form-item>

                    <!-- initiation.sendActivationEmail -->
                    <el-form-item prop="sendActivationEmail">
                        <el-checkbox :label="L('SendActivationEmail')" size="medium" style="width:100%;" border v-model="initiation.sendActivationEmail"></el-checkbox>
                    </el-form-item>

                    <el-form-item prop="isActive">
                        <el-checkbox :label="L('Active')" size="medium" style="width:100%;" border v-model="user.isActive"></el-checkbox>
                    </el-form-item>

                    <!-- initiation.isTwoFactorEnabled -->
                    <el-form-item v-if="initiation.isTwoFactorEnabled" prop="isTwoFactorEnabled">
                        <el-checkbox :label="L('IsTwoFactorEnabled')" size="medium" style="width:100%;" border v-model="user.isTwoFactorEnabled"></el-checkbox>
                    </el-form-item>

                    <!-- initiation.isLockoutEnabled -->
                    <el-form-item v-if="initiation.isLockoutEnabled" prop="isLockoutEnabled">
                        <el-checkbox :label="L('IsLockoutEnabled')" size="medium" style="width:100%;" border v-model="user.isLockoutEnabled"></el-checkbox>
                    </el-form-item>

                </el-form>
            </el-tab-pane>

            <el-tab-pane name="second">
                <span slot="label">{{L('Roles')}}
                    <el-badge :hidden="false" :value="assignedRoleCount" class="item"></el-badge>
                </span>
                <ul class="ul-chk-list">
                    <li v-for="item in roles" :key="item.roleId" class="chk-item-bg">
                        <el-checkbox v-model="item.isAssigned">
                            {{item.roleDisplayName}}
                        </el-checkbox>
                    </li>
                </ul>

            </el-tab-pane>
            <el-tab-pane :label="L('OrganizationUnits')" name="thrid" style="min-height: 100px">
                <OrganizationTree :context.sync="organizationTree" :organizationUnit="organizationUnit"></OrganizationTree>
            </el-tab-pane>
        </el-tabs>
        <span slot="footer" class="dialog-footer">
            <el-button class="waves-effect" @click="selfVisible = false">{{L('Cancel')}}</el-button>
            <el-button class="waves-effect" type="primary" @click="save">{{L('Save')}}</el-button>
        </span>
    </el-dialog>
</template>
<style lang="scss" scoped>
ul,
li {
    list-style: none;
    padding: 0;
}
.ul-chk-list {
    overflow: hidden;
    margin: 0 0 10px 0;
    padding-right: 10px;
}

.ul-chk-list li {
    float: left;
    border: 1px solid #dedede;
    margin: 10px 0 0 10px;
    border-radius: 3px;
    min-width: 100px;
}

.ul-chk-list li > label {
    line-height: 35px;
    display: inline-block;
    padding: 0 10px 0 15px;
    width: 100%;
    margin: 0;
}

.ul-chk-list li > label > span {
    font-weight: normal;
}
</style>

<script type="text/ecmascript-6">
import * as _ from 'lodash';
import config from '../../../common/config';
import OrganizationTree from '../../../components/tree/OrganizationTree';
import UserService from '../../../services/admin/UserService';
import ProfileService from '../../../services/admin/ProfileService';
export default {
    props: {
        id: Number,
        display: Boolean,
        onSave: Function
    },
    data() {
        var self = this;
        var initVals = {
            canChangeUserName: true,
            sendActivationEmail: false,
            setRandomPassword: false,
            isTwoFactorEnabled: false,
            isLockoutEnabled: false
        };

        return {
            activeName: 'first',
            selfVisible: this.display,
            loading: false,
            user: {},
            roles: {},
            organizationUnit: {},
            organizationTree: null,
            profilePicture: null,
            passwordComplexitySetting: null,
            initiation: initVals,
            rules: {
                name: [
                    {
                        required: true,
                        message: this.L('TheFieldIsRequired', this.L('Name')),
                        trigger: 'change, blur'
                    }
                ],
                surname: [
                    {
                        required: true,
                        message: this.L(
                            'TheFieldIsRequired',
                            this.L('Surname')
                        ),
                        trigger: 'change, blur'
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
                        trigger: 'change, blur'
                    }
                ],
                password: [
                    {
                        required: !initVals.setRandomPassword,
                        message: this.L(
                            'TheFieldIsRequired',
                            this.L('Password')
                        ),
                        trigger: 'blur,change'
                    }
                ],
                passwordRepeat: [
                    {
                        required: !initVals.setRandomPassword,
                        message: this.L(
                            'TheFieldIsRequired',
                            this.L('PasswordRepeat')
                        ),
                        trigger: 'blur,change'
                    },
                    {
                        validator: (rule, value, callback) => {
                            if (
                                value != undefined &&
                                value !== self.user.password
                            ) {
                                callback(
                                    new Error(
                                        self.L(
                                            'PasswordDoesNotMatch',
                                            self.L('PasswordRepeat'),
                                            self.L('Password')
                                        )
                                    )
                                );
                            } else {
                                callback();
                            }
                        },
                        trigger: 'blur,change'
                    }
                ]
            },
            featureTree: void 0
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
        },
        'user.id'(val) {
            this.rules.password.forEach(x => {
                if (x.required) {
                    x.required = x.required && !val;
                }
            });
            this.rules.passwordRepeat.forEach(x => {
                if (x.required) {
                    x.required = x.required && !val;
                }
            });
        },
        'user.password'(val) {}
    },
    async created() {
        this.initiation.isTwoFactorEnabled = abp.setting.getBoolean(
            'Abp.Zero.UserManagement.TwoFactorLogin.IsEnabled'
        );
        this.initiation.isLockoutEnabled = abp.setting.getBoolean(
            'Abp.Zero.UserManagement.UserLockOut.IsEnabled'
        );

        var rs = await ProfileService.getPasswordComplexitySetting();
        var settings = rs.setting;
        this.passwordComplexitySetting = settings;
        if (settings.requireDigit) {
            var dignitRule = {
                pattern: /^[0-9]*$/,
                message: this.L('PasswordComplexity_RequireDigit_Hint'),
                trigger: 'blur,change'
            };
            this.rules.password.push(dignitRule);
            this.rules.passwordRepeat.push(dignitRule);
        }
        if (settings.requireLowercase) {
            var lowercaseRule = {
                pattern: /[a-z]/,
                message: this.L('PasswordComplexity_RequireLowercase_Hint'),
                trigger: 'blur,change'
            };
            this.rules.password.push(lowercaseRule);
            this.rules.passwordRepeat.push(lowercaseRule);
        }
        if (settings.requireUppercase) {
            var uppercase = {
                pattern: /[A-Z]/,
                message: this.L('PasswordComplexity_RequireUppercase_Hint'),
                trigger: 'blur,change'
            };
            this.rules.password.push(uppercase);
            this.rules.passwordRepeat.push(uppercase);
        }
        if (settings.requireNonAlphanumeric) {
            var nonalphanumericRule = {
                pattern: /[0-9a-zA-Z]+$/,
                message: this.L(
                    'PasswordComplexity_RequireNonAlphanumeric_Hint'
                ),
                trigger: 'blur,change'
            };
            this.rules.password.push(nonalphanumericRule);
            this.rules.passwordRepeat.push(nonalphanumericRule);
        }
        if (settings.requiredLength) {
            var lengthRule = {
                min: settings.requiredLength,
                message: this.L(
                    'PasswordComplexity_RequiredLength_Hint',
                    settings.requiredLength
                ),
                trigger: 'blur,change'
            };
            this.rules.password.push(lengthRule);
            this.rules.passwordRepeat.push(lengthRule);
        }
    },
    computed: {
        assignedRoleCount() {
            return _.filter(this.roles, { isAssigned: true }).length;
        }
    },
    methods: {
        getProfilePicture(profilePictureId) {
            if (!profilePictureId) {
                this.profilePicture =
                    '/assets/common/images/default-profile-picture.png';
            } else {
                ProfileService.getProfilePictureById({
                    profilePictureId: profilePictureId
                }).then(
                    result => {
                        if (result && result.profilePicture) {
                            this.profilePicture =
                                'data:image/jpeg;base64,' +
                                result.profilePicture;
                        } else {
                            this.profilePicture =
                                '/assets/common/images/default-profile-picture.png';
                        }
                    },
                    () => {}
                );
            }
        },
        handleOpen() {
            this.loading = true;
            var self = this;
            if (!this.id) {
                this.initiation.setRandomPassword = true;
                this.initiation.sendActivationEmail = true;
            }
            UserService.getUserForEdit({ id: this.id })
                .then(rs => {
                    this.user = rs.user;
                    this.roles = rs.roles;
                    this.organizationUnit = {
                        allOrganizationUnits: rs.allOrganizationUnits,
                        selectedOrganizationUnits: rs.memberedOrganizationUnits
                    };

                    this.initiation.canChangeUserName =
                        this.user.userName !== config.defaultAdminUserName;

                    if (this.id) {
                        this.initiation.setRandomPassword = false;
                        this.initiation.sendActivationEmail = false;
                    }
                    return rs;
                })
                .then(rs => {
                    self
                        .getProfilePicture(rs.profilePictureId)
                        .then(() => {
                            this.loading = false;
                        })
                        .catch(() => {
                            this.loading = false;
                        });
                })
                .catch(() => {
                    this.loading = false;
                });
        },
        handleTabClick(item) {},
        handleClose() {
            this.activeName = 'first';
            this.$refs.userForm.resetFields();
        },
        save() {
            this.$refs.userForm.validate(valid => {
                if (valid) {
                    this.loading = true;
                    let input = {};
                    input.user = this.user;
                    input.setRandomPassword = this.initiation.setRandomPassword;
                    input.sendActivationEmail = this.initiation.sendActivationEmail;
                    input.assignedRoleNames = _.map(
                        _.filter(this.roles, { isAssigned: true }),
                        role => role.roleName
                    );

                    input.organizationUnits = this.organizationTree.getSelectedOrganizations();

                    UserService.createOrUpdateUser(input)
                        .then(() => {
                            abp.notify.success(this.L('SavedSuccessfully'));

                            this.loading = false;
                            this.selfVisible = false;
                            this.onSave && this.onSave();
                        })
                        .catch(() => {
                            this.loading = false;
                        });
                } else {
                    return false;
                }
            });
        }
    },
    components: {
        OrganizationTree
    }
};
</script>