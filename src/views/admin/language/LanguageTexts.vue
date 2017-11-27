<template>
    <div class="page-wrapper" v-loading="loading">
        <div class="breadcrumbs" id="breadcrumbs">
            <div class="breadcrumb">
                <a href="#">{{L('Administration')}}</a>
                <router-link to="/admin/languages">{{L('Languages')}}</router-link>
                <a href="#" class="active">{{L('LanguageTexts')}}</a>
            </div>
        </div>

        <!-- Content Header (Page header) -->
        <section class="content-header">
            <h1>
                {{L("LanguageTexts")}}
                <small>{{L("LanguageTextsHeaderInfo")}}</small>
            </h1>
        </section>

        <!-- Main content -->
        <section class="content container-fluid">
            <div class="box box-info">
                <div class="box-body">
                    <el-form class="el-form-small" size="small">
                        <div class="row">
                            <div class="col-md-3">
                                <el-form-item :label="L('BaseLanguage')">
                                    <LanguageFlagSelect :languages="languages" v-model="fetchParams.baseLanguageName"></LanguageFlagSelect>
                                </el-form-item>
                            </div>
                            <div class="col-md-3">
                                <el-form-item :label="L('TargetLanguage')">
                                    <LanguageFlagSelect :languages="languages" v-model="fetchParams.targetLanguageName"></LanguageFlagSelect>
                                </el-form-item>
                            </div>
                            <div class="col-md-3">
                                <el-form-item :label="L('Source')">
                                    <el-select v-model="fetchParams.sourceName" :placeholder="L('Select')" style="width:100%;" filterable>
                                        <el-option v-for="item in sourceNames" :label="item" :key="item" :value="item">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                            <div class="col-md-3">
                                <el-form-item :label="L('TargetValue')">
                                    <el-select v-model="fetchParams.targetValueFilter" :placeholder="L('Select')" style="width:100%;">
                                        <el-option label="ALL" :value="L('All')"></el-option>
                                        <el-option label="EMPTY" :value="L('EmptyOnes')"></el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <el-form-item>
                                    <el-input class="mar-btm-10" v-model="fetchParams.filterText" :placeholder="L('SearchWithThreeDot')">
                                        <el-button class="waves-effect" slot="append" icon="el-icon-search" @click="applyFilters"></el-button>
                                    </el-input>
                                </el-form-item>
                            </div>
                        </div>
                    </el-form>
                </div>
            </div>
            <div class="box box-primary">
                <div class="box-body">

                    <el-table class="data-table" @sort-change="sortChanged" :data="data" :fit="true" border stripe>
                        <el-table-column prop="key" :label="L('Key')" sortable>
                            <template slot-scope="scope">
                                {{truncateString(scope.row.key)}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="baseValue" :label="L('BaseValue')" sortable>
                            <template slot-scope="scope">
                                {{truncateString(scope.row.baseValue)}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="targetValue" :label="L('TargetValue')" sortable>
                            <template slot-scope="scope">
                                {{truncateString(scope.row.targetValue)}}
                            </template>
                        </el-table-column>
                        <el-table-column width="80" :label="L('Edit')">
                            <template slot-scope='scope'>
                                <el-button class="waves-effect" @click="editText(scope.row)" size="mini" icon="fa fa-edit" :title="L('Edit')"></el-button>
                            </template>
                        </el-table-column>
                    </el-table>

                    <el-pagination class="pagin" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.pageIndex" :page-size="fetchParams.maxResultCount" :page-sizes="[15, 30, 60, 100]" layout="sizes,total, prev, pager, next" :total="pagination.totalCount">
                    </el-pagination>
                </div>
            </div>

        </section>
        <!-- /.content -->

        <EditTextModal :display.sync="modal.display" :textSource="modal.textSource" :onSave="()=> fetchData()"></EditTextModal>
    </div>
</template>

<script type="text/ecmascript-6">
import * as _ from 'lodash';
import config from '../../../common/config';
import LanguageService from '../../../services/admin/LanguageService';
import LanguageFlagSelect from '../../../components/select/LanguageFlagSelect';
import EditTextModal from './EditTextModal';

export default {
    data() {
        return {
            loading: false,
            data: null,
            languages: null,
            sourceNames: null,
            modal: {
                textSource: {},
                display: false
            },
            fetchParams: {
                maxResultCount: config.defaultPageSize,
                skipCount: 0,
                sorting: '',
                sourceName: '',
                baseLanguageName: '',
                targetLanguageName: '',
                targetValueFilter: '',
                filterText: ''
            },
            pagination: {
                pageIndex: 1,
                totalCount: 0
            }
        };
    },
    beforeCreate() {
        console.log('beforeCreate');
    },
    created() {
        console.log('created');
        this.sourceNames = _.map(
            _.filter(
                abp.localization.sources,
                source => source.type === 'MultiTenantLocalizationSource'
            ),
            value => value.name
        );

        this.languages = abp.localization.languages;
    },
    beforeMount() {
        console.log('beforeMount');
    },
    mounted() {
        this.init();
        this.fetchData();
    },
    async beforeUpdate() {
        console.log('beforeUpdate');
    },
    updated() {
        console.log('updated');
    },
    activated() {
        console.log('activated');
    },
    deactivated() {
        console.log('deactivated');
    },
    beforeDestroy() {
        console.log('beforeDestroy');
    },
    destroyed() {
        console.log('destroyed');
    },
    methods: {
        truncateString(text) {
            return abp.utils.truncateStringWithPostfix(text, 32, '...');
        },
        init() {
            var params = this.$route.params;
            this.fetchParams.baseLanguageName =
                params['baseLanguageName'] ||
                abp.localization.currentLanguage.name;
            this.fetchParams.targetLanguageName = params['name'];
            this.fetchParams.sourceName = params['sourceName'] || 'Auth';
            this.fetchParams.targetValueFilter =
                params['targetValueFilter'] || 'ALL';
            this.fetchParams.filterText = params['filterText'] || '';
        },
        applyFilters() {
            // 由于vue router 的路由机制，路由刷新，不会重新加载整个页面的生命周期
            //  this.$router.push 这一段基本没用，也有可能是我理解有问题，目前没找到方法，刷新路由，可以重新整个生命周期。
            this.$router.push({
                path: `/admin/languages/${
                    this.fetchParams.targetLanguageName
                }/texts`,
                // name: 'admin.languages.texts',
                params: {
                    // name: this.fetchParams.baseLanguageName,
                    sourceName: this.fetchParams.sourceName,
                    baseLanguageName: this.fetchParams.baseLanguageName,
                    targetValueFilter: this.fetchParams.targetValueFilter,
                    filterText: this.fetchParams.filterText
                }
            });
            if (this.pagination.pageIndex !== 1) {
                this.pagination.pageIndex = 1;
            }
            // console.log('applyFilters');
            this.fetchData();
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
        editText(row) {
            this.modal.textSource = {
                sourceName: this.fetchParams.sourceName,
                baseLanguageName: this.fetchParams.baseLanguageName,
                targetLanguageName: this.fetchParams.targetLanguageName,
                key: row.key,
                baseValue: row.baseValue,
                targetValue: row.targetValue
            };
            this.modal.display = true;
        },
        fetchData() {
            this.loading = true;
            LanguageService.getLanguageTexts(this.fetchParams)
                .then(rs => {
                    this.data = rs.items;
                    this.pagination.totalCount = rs.totalCount;
                    this.loading = false;
                })
                .catch(() => {
                    this.loading = false;
                });
        }
    },
    components: { LanguageFlagSelect, EditTextModal }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>