<template>
    <div class="page-wrapper" v-loading="loading">
        <div class="breadcrumbs" id="breadcrumbs">
            <div class="breadcrumb">
                <a href="#">{{L('Administration')}}</a>
                <a href="#" class="active">{{L('Languages')}}</a>
            </div>
        </div>

        <!-- Content Header (Page header) -->
        <section class="content-header">
            <h1>
                {{L("Languages")}}
                <small>{{L("LanguagesHeaderInfo")}}</small>
            </h1>
        </section>

        <!-- Main content -->
        <section class="content container-fluid">

            <div class="box box-primary">
                <div class="box-body">
                    <div class="toolbar">
                        <div class="btn-group">
                            <button class="waves-effect btn btn-default" v-if="isGranted('Pages.Administration.Languages.Create')" @click="createOrEditLanguage(null)">
                                <i class="fa fa-plus"></i> {{L('CreateNewLanguage')}}</button>
                            <button class="waves-effect btn btn-default">
                                <i class="fa fa-refresh"></i> {{L('Refresh')}}</button>
                        </div>
                    </div>

                    <el-table class="data-table f16" :data="data" :fit="true" border stripe>

                        <el-table-column min-width="120" :label="L('Name')">
                            <template slot-scope='scope'>
                                <i :class="scope.row.icon|flag"></i> {{scope.row.displayName}}
                                <el-tag type="primary" v-if="defaultLanguageName == scope.row.name">{{L('Default')}}</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column min-width="120" prop="name" :label="L('Code')">
                        </el-table-column>
                        <el-table-column width="100" :label="L('Default')" v-if="tenantId ? true : false">
                            <template slot-scope="scope">
                                <el-tag type="success" v-if="tenantId != scope.row.tenantId">{{L('Yes')}}</el-tag>
                                <el-tag type="gray" v-else>{{L('No')}}</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column width="100" :label="L('IsEnabled')">
                            <template slot-scope="scope">
                                <el-tag type="success" v-if="!scope.row.isDisabled">{{L('Yes')}}</el-tag>
                                <el-tag type="gray" v-else>{{L('No')}}</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column min-width="100" :label="L('CreationTime')">
                            <template slot-scope="scope">
                                {{scope.row.creationTime | DateTimeFormat('L')}}
                            </template>
                        </el-table-column>
                        <el-table-column width="110" :label="L('Actions')">
                            <template slot-scope="scope">
                                <el-dropdown trigger="click">
                                    <el-button type="primary" size="small" class="waves-effect">
                                        {{L('Actions')}}
                                        <i class="el-icon-caret-bottom el-icon--right"></i>
                                    </el-button>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item v-if="tenantId == scope.row.tenantId && isGranted('Pages.Administration.Languages.Edit')">
                                            <!--修改-->
                                            <div @click="createOrEditLanguage(scope.row)">{{L('Edit')}}</div>
                                        </el-dropdown-item>
                                        <el-dropdown-item v-if="isGranted('Pages.Administration.Languages.ChangeTexts')">
                                            <!--改变文本信息-->
                                            <div @click="changeTexts(scope.row)">
                                                {{L('ChangeTexts')}}
                                            </div>
                                        </el-dropdown-item>
                                        <el-dropdown-item v-if="defaultLanguageName != scope.row.name">
                                            <!--设置当前语言为默认语言-->
                                            <div @click="setAsDefaultLanguage(scope.row)">
                                                {{L('SetAsDefaultLanguage')}}
                                            </div>
                                        </el-dropdown-item>

                                        <el-dropdown-item divided v-if="tenantId == scope.row.tenantId && isGranted('Pages.Administration.Languages.Delete')">
                                            <!--删除-->
                                            <div @click="deleteLanguage( scope.row)">{{L('Delete')}}</div>
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </template>
                        </el-table-column>
                    </el-table>

                    <p class="mar-top-10" v-if="tenantId">
                        <span class="alert alert-success" style="display:block;"> * {{L("CanNotEditOrDeleteDefaultLanguages")}}</span>
                    </p>
                </div>
            </div>

            <CreateOrEditLangModal :display.sync="modal.display" :id="modal.id" :onSave="()=> fetchData()"></CreateOrEditLangModal>
        </section>
        <!-- /.content -->

    </div>
</template>

<script type="text/ecmascript-6">
import { mapState } from 'vuex';
import MessageHelper from '../../../base/MessageHelper';
import LanguageService from '../../../services/admin/LanguageService';
import CreateOrEditLangModal from './CreateOrEditLangModal';
export default {
    data() {
        return {
            loading: false,
            data: null,
            tenantId: null,
            defaultLanguageName: '',
            modal: {
                display: false,
                id: null
            }
        };
    },
    computed: {
        ...mapState({
            tenant: state => state.session.tenant
        })
    },
    created() {
        this.loading = true;
        this.tenantId = this.tenant ? this.tenant.id : null;
    },
    mounted() {
        this.fetchData();
    },
    methods: {
        createOrEditLanguage(row) {
            this.modal.display = true;
            this.modal.id = null;
            if (row) {
                this.modal.id = row.id;
            }
        },
        setAsDefaultLanguage(row) {
            const input = {};
            input.name = row.name;
            this.loading = true;
            LanguageService.setDefaultLanguage(input)
                .then(() => {
                    this.loading = false;
                    this.fetchData();
                })
                .catch(() => {
                    this.loading = false;
                });
        },
        changeTexts(row) {
            this.$router.push({ path: `/admin/languages/${row.name}/texts` });
        },
        deleteLanguage(row) {
            var self = this;
            MessageHelper.confirm(
                '',
                this.L('LanguageDeleteWarningMessage', row.displayName),
                () => {
                    LanguageService.deleteLanguage({
                        id: row.id
                    }).then(() => {
                        this.fetchData();
                        abp.notify.success(self.L('SuccessfullyDeleted'));
                    });
                }
            );
        },
        fetchData() {
            LanguageService.getLanguages()
                .then(rs => {
                    this.defaultLanguageName = rs.defaultLanguageName;
                    this.data = rs.items;
                    this.totalCount = rs.totalCount;
                    this.loading = false;
                })
                .catch(() => {
                    this.loading = false;
                });
        }
    },
    components: { CreateOrEditLangModal }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>