<template>
    <el-dialog :title="L('ChangePassword')" :visible.sync="selfVisible" :modal-append-to-body="false" @open="handleOpen" @close="handleClose" width="500px">
        <el-form class="el-form-small" size="small" :model="model" :rules="rules" ref="changePasswordForm">
            <el-form-item :label="L('CurrentPassword')" prop="currentPassword">
                <el-input type="password" v-model="model.currentPassword" :placeholder="L('CurrentPassword')" autofocus></el-input>
            </el-form-item>
            <el-form-item :label="L('NewPassword')" prop="password">
                <el-input type="password" v-model="model.password" :placeholder="L('NewPassword')"></el-input>
            </el-form-item>
            <el-form-item :label="L('NewPasswordRepeat')" prop="passwordConfirm">
                <el-input type="password" v-model="model.passwordConfirm" :placeholder="L('NewPasswordRepeat')"></el-input>
            </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
            <el-button class="waves-effect" @click="selfVisible = false">{{L('Cancel')}}</el-button>
            <el-button class="waves-effect" type="primary" @click="save">{{L('Save')}}</el-button>
        </span>
    </el-dialog>
</template>

<script type="text/ecmascript-6">
import ProfileService from '../../../services/admin/ProfileService';
export default {
    props: {
        display: Boolean
    },
    data() {
        var self = this;
        return {
            selfVisible: this.display,
            loading: false,
            model: {
                currentPassword: null,
                password: null,
                passwordConfirm: null
            },
            rules: {
                currentPassword: [
                    {
                        required: true,
                        message: this.L(
                            'TheFieldIsRequired',
                            this.L('CurrentPassword')
                        ),
                        trigger: 'blur,change'
                    }
                ],
                password: [
                    {
                        required: true,
                        message: this.L(
                            'TheFieldIsRequired',
                            this.L('Password')
                        ),
                        trigger: 'blur,change'
                    }
                ],
                passwordConfirm: [
                    {
                        required: true,
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
                                value !== self.model.password
                            ) {
                                callback(
                                    new Error(
                                        self.L(
                                            'PasswordDoesNotMatch',
                                            self.L('NewPasswordRepeat'),
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
    async created() {
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
            this.rules.passwordConfirm.push(dignitRule);
        }
        if (settings.requireLowercase) {
            var lowercaseRule = {
                pattern: /[a-z]/,
                message: this.L('PasswordComplexity_RequireLowercase_Hint'),
                trigger: 'blur,change'
            };
            this.rules.password.push(lowercaseRule);
            this.rules.passwordConfirm.push(lowercaseRule);
        }
        if (settings.requireUppercase) {
            var uppercase = {
                pattern: /[A-Z]/,
                message: this.L('PasswordComplexity_RequireUppercase_Hint'),
                trigger: 'blur,change'
            };
            this.rules.password.push(uppercase);
            this.rules.passwordConfirm.push(uppercase);
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
            this.rules.passwordConfirm.push(nonalphanumericRule);
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
            this.rules.passwordConfirm.push(lengthRule);
        }
    },
    methods: {
        handleOpen() {},
        handleClose() {},
        save() {
            this.$refs.changePasswordForm.validate(valid => {
                if (valid) {
                    this.loading = true;
                    let input = {};
                    input.currentPassword = this.model.currentPassword;
                    input.newPassword = this.model.password;

                    ProfileService.changePassword(input)
                        .then(() => {
                            abp.notify.success(
                                this.L('YourPasswordHasChangedSuccessfully')
                            );

                            this.loading = false;
                            this.selfVisible = false;
                        })
                        .catch(() => {
                            this.loading = false;
                        });
                } else {
                    return false;
                }
            });
        }
    }
};
</script>