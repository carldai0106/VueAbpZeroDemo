<template>
    <div class="page-wrapper" v-loading="loading">
        <div class="breadcrumbs" id="breadcrumbs">
            <div class="breadcrumb">
                <a href="#" class="active">{{L('Editions')}}</a>
            </div>
        </div>

        <!-- Content Header (Page header) -->
        <section class="content-header">
            <h1>
                {{L('Editions')}}
                <small>{{L("EditionsHeaderInfo")}}</small>
            </h1>
        </section>

        <!-- Main content -->
        <section class="content container-fluid">
            <div class="box box-primary">
                <div class="box-body">
                    <div class="toolbar">
                        <div class="btn-group">
                            <button @click="createEdition" v-show="isGranted('Pages.Editions.Create')" type="button" class="waves-effect btn btn-default waves-effect">
                                <i class="fa fa-plus"></i> {{L('Create')}}</button>
                            <button @click="fetchData()" type="button" class="waves-effect btn btn-default waves-effect">
                                <i class="fa fa-refresh"></i> {{L('Refresh')}}</button>
                        </div>
                    </div>

                    <el-table :data="data" :fit="true" border stripe>
                        <el-table-column min-width="150" prop="displayName" :label="L('EditionName')">
                        </el-table-column>
                        <el-table-column width="120" prop="creationTime" :label="L('CreationTime')">
                            <template slot-scope="scope">
                                {{scope.row.creationTime|DateTimeFormat('L')}}
                            </template>
                        </el-table-column>
                        <el-table-column v-if="isGrantedAny('Pages.Editions.Edit', 'Pages.Editions.Delete')" width="180" :label="L('Actions')" align="center">
                            <template slot-scope="scope">
                                <div class="btn-group">
                                    <button v-if="isGranted('Pages.Editions.Edit')" class="waves-effect btn btn-primary" @click="editEdition($event, scope.row.id)">
                                        <i class="fa fa-edit"></i> {{L('Edit')}}
                                    </button>
                                    <button v-if="isGranted('Pages.Editions.Delete')" class="waves-effect btn btn-danger" @click="deleteEditon($event, scope.row)">
                                        <i class="fa fa-trash"></i> {{L('Delete')}}
                                    </button>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </section>

        <CreateOrEditEditionModal :display.sync="modal.display" :id="modal.id" :onSave="type => {type === 'add' && fetchData() }"></CreateOrEditEditionModal>

    </div>
</template>

<script type="text/ecmascript-6">
import MessageHelper from '../../../base/MessageHelper';
import EditionService from '../../../services/admin/EditionService';
import CreateOrEditEditionModal from './CreateOrEditEditionModal';

export default {
    data() {
        return {
            loading: false,
            data: null,
            modal: {
                display: false,
                id: null
            }
        };
    },
    mounted() {
        this.fetchData();
    },
    methods: {
        createEdition() {
            this.modal.display = true;
            this.modal.id = null;
        },
        editEdition(e, id) {
            this.modal.display = true;
            this.modal.id = id;
        },
        deleteEditon(e, row) {
            var self = this;
            MessageHelper.confirm(
                '',
                this.L('EditionDeleteWarningMessage', row.displayName),
                () => {
                    EditionService.deleteEdition({
                        id: row.id
                    }).then(() => {
                        this.fetchData();
                        abp.notify.success(self.L('SuccessfullyDeleted'));
                    });
                }
            );
        },
        fetchData() {
            this.loading = true;
            EditionService.getEditions()
                .then(
                    rs => {
                        this.data = rs.result.items;
                        this.loading = false;
                    },
                    () => {
                        this.loading = false;
                    }
                )
                .catch(() => {
                    this.loading = false;
                });
        }
    },
    components: {
        CreateOrEditEditionModal
    }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>