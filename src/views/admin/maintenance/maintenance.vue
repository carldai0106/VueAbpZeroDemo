<template>
    <div class="page-wrapper" v-loading="loading">

        <div class="breadcrumbs" id="breadcrumbs">
            <div class="breadcrumb">
                <a href="#">{{L('Administration')}}</a>
                <a href="#" class="active">{{L('Maintenance')}}</a>
            </div>
        </div>

        <!-- Content Header (Page header) -->
        <section class="content-header">
            <h1>
                {{L('Maintenance')}}
            </h1>
        </section>

        <!-- Main content -->
        <section class="content container-fluid">
            <div class="box box-primary">
                <div class="box-body">
                    <el-tabs v-model="activeName" type="border-card">
                        <el-tab-pane :label="L('Caches')" name="first">
                            <div class="row mar-btm-10">
                                <div class="col-xs-6">
                                    <p>{{L("CachesHeaderInfo")}}</p>
                                </div>
                                <div class="col-xs-6 text-right">
                                    <button class="waves-effect btn btn-primary" @click="clearAllCaches">
                                        <i class="fa fa-refresh"></i> {{L("ClearAll")}}</button>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-xs-12">
                                    <div class="panel panel-default">
                                        <table class="table table-striped table-hover table-bordered">
                                            <tbody>
                                                <tr v-for="(cache, index) of caches" :key="index">
                                                    <td>
                                                        <span>{{cache.name}}</span>
                                                        <button class="waves-effect btn btn-xs btn-primary pull-right" @click="clearCache(cache.name)">
                                                            {{L("Clear")}}
                                                        </button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane :label="L('WebSiteLogs')" name="second">
                            <div class="row mar-btm-10">
                                <div class="col-xs-6">
                                    <p>{{L("WebSiteLogsHeaderInfo")}}</p>
                                </div>
                                <div class="col-xs-6 text-right">
                                    <button class="waves-effect btn btn-primary" @click="downloadWebLogs">
                                        <i class="fa fa-download"></i> {{L("DownloadAll")}}</button>
                                    <button class="waves-effect btn btn-default" @click="getWebLogs">
                                        <i class="fa fa-refresh"></i> {{L("Refresh")}}</button>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-xs-12">
                                    <div class="web-log-view full-height">
                                        <span class="log-line" v-for="(log, index) of logs" :key="index">
                                            <span :class="getLogClass(log)">{{getLogType(log)}}</span>
                                            {{getRawLogContent(log)}}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>
        </section>

    </div>
</template>

<script type="text/ecmascript-6">
import * as _ from 'lodash';
import CacheService from '../../../services/admin/CacheService';
import WebLogService from '../../../services/admin/WebLogService';
import FileDownloadService from '../../../services/admin/FileDownloadService';

export default {
    data() {
        return {
            loading: false,
            activeName: 'first',
            caches: null,
            logs: null
        };
    },
    created() {
        self.loading = true;
        this.getCaches();
        this.getWebLogs();
        self.loading = false;
    },
    mounted() {
        $(window).bind('resize', () => {
            this.fixWebLogsPanelHeight();
        });
    },
    methods: {
        clearAllCaches() {
            var self = this;
            CacheService.clearAllCaches().then(() => {
                abp.notify.success(self.L('AllCachesSuccessfullyCleared'));
            });
        },
        clearCache(cacheName) {
            const self = this;
            const input = {};
            input.id = cacheName;

            CacheService.clearCache(input).then(() => {
                self.$notify({
                    title: this.L('Success'),
                    message: this.L('CacheSuccessfullyCleared'),
                    type: 'success',
                    position: 'bottom-right'
                });
            });
        },
        getCaches() {
            const self = this;
            CacheService.getAllCaches()
                .then(result => {
                    self.caches = result.items;
                })
                .catch(() => {
                    self.loading = false;
                });
        },
        getWebLogs() {
            const self = this;
            WebLogService.getLatestWebLogs()
                .then(result => {
                    self.logs = result.latestWebLogLines;
                    self.fixWebLogsPanelHeight();
                })
                .catch(() => {
                    self.loading = false;
                });
        },
        downloadWebLogs() {
            WebLogService.downloadWebLogs().then(result => {
                FileDownloadService.downloadTempFile(result);
            });
        },
        getLogClass(log) {
            if (log.startsWith('DEBUG')) {
                return 'label label-default';
            }

            if (log.startsWith('INFO')) {
                return 'label label-info';
            }

            if (log.startsWith('WARN')) {
                return 'label label-warning';
            }

            if (log.startsWith('ERROR')) {
                return 'label label-danger';
            }

            if (log.startsWith('FATAL')) {
                return 'label label-danger';
            }

            return '';
        },
        getLogType(log) {
            if (log.startsWith('DEBUG')) {
                return 'DEBUG';
            }

            if (log.startsWith('INFO')) {
                return 'INFO';
            }

            if (log.startsWith('WARN')) {
                return 'WARN';
            }

            if (log.startsWith('ERROR')) {
                return 'ERROR';
            }

            if (log.startsWith('FATAL')) {
                return 'FATAL';
            }

            return '';
        },
        getRawLogContent(log) {
            return _.escape(log)
                .replace('DEBUG', '')
                .replace('INFO', '')
                .replace('WARN', '')
                .replace('ERROR', '')
                .replace('FATAL', '');
        },
        fixWebLogsPanelHeight() {
            const windowHeight = $(window).height();
            const panelHeight = $('.full-height').height();
            const difference = windowHeight - panelHeight;
            const fixedHeight = panelHeight + difference;
            $('.full-height').css('height', fixedHeight - 350 + 'px');
        }
    },
    components: {}
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.web-log-view {
    font-family: 'Microsoft YaHei';
    overflow-x: scroll;
    overflow-y: scroll;
    height: 100%;
    white-space: nowrap;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    span.log-line {
        margin-bottom: 5px;
        display: block;
        span.label {
            width: 50px;
            display: inline-block;
            line-height: 18px;
            padding: 0;
            font-size: 12px;
        }
    }
}
</style>