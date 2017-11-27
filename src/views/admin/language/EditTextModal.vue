<template>
    <el-dialog :title="L('EditText')" :visible.sync="selfVisible" :modal-append-to-body="false" @open="handleOpen" @close="handleClose" top="5vh" width="600px" v-loading="loading">

        <el-form class="el-form-small f16" size="small" ref="textForm">

            <div class="form-group">
                <label class="control-label">{{L('Key')}}</label>
                <p class="form-control-static">{{textData.key}}</p>
            </div>

            <div class="form-group">
                <label>
                    <i :class="baseLanguage.icon|flag"></i> {{baseLanguage.displayName}}
                </label>
                <textarea readonly class="form-control" rows="4" v-model="textData.baseText">
                </textarea>
            </div>

            <div class="form-group">
                <label>
                    <i :class="targetLanguage.icon|flag"></i> {{targetLanguage.displayName}}
                </label>
                <textarea class="form-control" rows="4" autofocus v-model="textData.value" ref="textValue">
                </textarea>
            </div>

        </el-form>

        <span slot="footer" class="dialog-footer">
            <el-button class="waves-effect" @click="selfVisible = false">{{L('Cancel')}}</el-button>
            <el-button class="waves-effect" type="primary" @click="save">{{L('Save')}}</el-button>
        </span>
    </el-dialog>
</template>

<script type="text/ecmascript-6">
import * as _ from 'lodash';
import LanguageService from '../../../services/admin/LanguageService';
export default {
    props: {
        display: Boolean,
        textSource: Object,
        onSave: Function
    },
    data() {
        return {
            loading: false,
            selfVisible: this.display,
            textData: {},
            baseLanguage: {},
            targetLanguage: {}
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
        handleOpen() {
            this.textData = {
                sourceName: this.textSource.sourceName,
                key: this.textSource.key,
                languageName: this.textSource.targetLanguageName,
                value: this.textSource.targetValue,
                baseText: this.textSource.baseValue
            };
            this.baseLanguage = _.find(
                abp.localization.languages,
                l => l.name === this.textSource.baseLanguageName
            );
            this.targetLanguage = _.find(
                abp.localization.languages,
                l => l.name === this.textSource.targetLanguageName
            );
        },
        handleClose() {},
        save() {
            var self = this;
            this.loading = true;
            LanguageService.updateLanguageText(this.textData)
                .then(() => {
                    abp.notify.success(self.L('SavedSuccessfully'));

                    this.loading = false;
                    this.selfVisible = false;
                    this.onSave && this.onSave();
                })
                .catch(() => {
                    this.loading = false;
                });
        }
    }
};
</script>
