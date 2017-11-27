<template>
    <el-dialog :title="language.id ? L('EditLanguage') + ' : ' + language.name : L('CreateNewLanguage')" :visible.sync="selfVisible" @open="handleOpen" @close="handleClose" :modal-append-to-body="false" top="5vh" width="600px" v-loading="loading">

        <el-form class="el-form-small f16" size="small" :rules="rules" :model="language" ref="langForm">
            <el-form-item :label="L('Languages')" prop="name">

                <el-select v-model="language.name" :placeholder="L('Select')" style="width:100%;" filterable>
                    <el-option v-for="item in languageNames" :label="item.displayText" :key="item.value" :value="item.value">
                    </el-option>
                </el-select>

            </el-form-item>

            <el-form-item :label="L('Flag')" prop="icon">
                <h5 class="input-flag" :class="language.icon|flag"></h5>
                <el-select class="el-select-flag" popper-class="f16" v-model="language.icon" :placeholder="L('Select')" style="width:100%;" filterable>
                    <el-option v-for="item in flags" :label="item.displayText" :key="item.displayText" :value="item.value">
                        <i :class="item.value|flag"></i> {{item.displayText}}
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item>
                <el-checkbox size="medium" style="width:100%;" border :label="L('IsEnabled')" v-model="language.isEnabled"></el-checkbox>
            </el-form-item>

        </el-form>

        <span slot="footer" class="dialog-footer">
            <el-button class="waves-effect" @click="selfVisible = false">{{L('Cancel')}}</el-button>
            <el-button class="waves-effect" type="primary" @click="save">{{L('Save')}}</el-button>
        </span>
    </el-dialog>
</template>

<style lang="scss" rel="stylesheet">
.input-flag {
    position: absolute;
    left: 20px;
    top: 27px;
    z-index: 20;
}
.el-select-flag .el-input__inner {
    padding-left: 42px;
}
</style>
<script type="text/ecmascript-6">
import LanguageService from '../../../services/admin/LanguageService';

export default {
    props: {
        display: Boolean,
        id: Number,
        onSave: Function
    },
    data() {
        return {
            loading: false,
            selfVisible: this.display,
            language: {},
            languageNames: [],
            flags: [],
            rules: {
                name: [
                    {
                        required: true,
                        message: this.L(
                            'TheFieldIsRequired',
                            this.L('Languages')
                        ),
                        trigger: 'change,blur'
                    }
                ],
                icon: [
                    {
                        required: true,
                        message: this.L('TheFieldIsRequired', this.L('Flag')),
                        trigger: 'change,blur'
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
    methods: {
        handleChange() {
            console.log(this.testLang);
        },
        handleOpen() {
            this.loading = true;
            LanguageService.getLanguageForEdit({ id: this.id })
                .then(rs => {
                    this.language = rs.language;
                    this.languageNames = rs.languageNames;
                    this.flags = rs.flags;

                    this.loading = false;
                })
                .catch(() => {
                    this.loading = false;
                });
        },
        handleClose() {},
        save() {
            var self = this;
            this.$refs.langForm.validate(valid => {
                if (valid) {
                    this.loading = true;
                    var input = {};
                    input.language = this.language;
                    LanguageService.createOrUpdateLanguage(input)
                        .then(() => {
                            abp.notify.success(self.L('SavedSuccessfully'));
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
    }
};
</script>
