<template>
    <div class="page-wrapper" v-loading="loading">
        <div class="breadcrumbs" id="breadcrumbs">
            <div class="breadcrumb">
                <a href="#">{{L('Administration')}}</a>
                <a href="#" class="active">{{L('Roles')}}</a>
            </div>
        </div>

        <!-- Content Header (Page header) -->
        <section class="content-header">
            <h1>
                {{L('Roles')}}
                <small>{{L('RolesHeaderInfo')}}</small>
            </h1>
        </section>

        <!-- Main content -->
        <section class="content container-fluid">

            <div class="box box-info">
                <div class="box-body">
                    <el-form label-width="120px">
                        <el-form-item :label="L('Permissions')">
                            <DropDownPermissionTree :onChange="handleChange"></DropDownPermissionTree>
                        </el-form-item>
                    </el-form>
                </div>
            </div>

            <div class="box box-primary">
                <div class="box-body">

                    <div class="toolbar">
                        <div class="btn-group">
                            <button @click="handleCommand({type:'add', row: null})" v-show="isGranted('Pages.Administration.Roles.Create')" type="button" class="waves-effect btn btn-default waves-effect">
                                <i class="fa fa-plus"></i> {{L('Create')}}</button>
                            <button @click="fetchData()" type="button" class="waves-effect btn btn-default waves-effect">
                                <i class="fa fa-refresh"></i> {{L('Refresh')}}</button>
                        </div>
                    </div>

                    <el-table class="data-table" :data="data" :fit="true" border stripe>
                        <el-table-column min-width="120" :label="L('RoleName')">
                            <template slot-scope="scope">
                                <i>{{scope.row.displayName}}</i>
                                <el-tooltip :content="L('StaticRole_Tooltip')" placement="top" v-if="scope.row.isStatic">
                                    <el-tag type="success">{{L('Static')}}</el-tag>
                                </el-tooltip>

                                <el-tooltip :content="L('DefaultRole_Description')" placement="top" v-if="scope.row.isDefault">
                                    <el-tag type="gray">{{L('Default')}}</el-tag>
                                </el-tooltip>
                            </template>
                        </el-table-column>
                        <el-table-column width="200" prop="lastLoginTime" :label="L('CreationTime')">
                            <template slot-scope="scope">
                                {{scope.row.creationTime | DateTimeFormat('YYYY-MM-DD HH:mm:ss')}}
                            </template>
                        </el-table-column>
                        <el-table-column v-if="isGrantedAny('Pages.Administration.Roles.Edit', 'Pages.Administration.Roles.Delete')" width="110" :label="L('Actions')">
                            <template slot-scope="scope">
                                <el-dropdown trigger="click" @command="handleCommand">
                                    <el-button type="primary" size="small" class="waves-effect">
                                        {{L('Actions')}}
                                        <i class="el-icon-caret-bottom el-icon--right"></i>
                                    </el-button>
                                    <el-dropdown-menu slot="dropdown">
                                        <!--编辑-->
                                        <el-dropdown-item v-if="isGranted('Pages.Administration.Roles.Edit')" :command="{type: 'edit', row: scope.row}">
                                            <i class="fa fa-edit"></i> {{L('Edit')}}
                                        </el-dropdown-item>
                                        <!--删除-->
                                        <el-dropdown-item v-if="isGranted('Pages.Administration.Roles.Delete') && !scope.row.isStatic" :command="{type: 'delete', row: scope.row}">
                                            <i class="fa fa-remove"></i> {{L('Delete')}}
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>

        </section>
        <!-- /.content -->

        <CreateOrEditRoleModal :display.sync="roleModal.display" :roleId.sync="roleModal.roleId" :onSave="type=>{type === 'add' && fetchData()}" :title="roleModal.title">
        </CreateOrEditRoleModal>
    </div>
</template>

<script type="text/ecmascript-6">
import DropDownPermissionTree from '../../../components/tree/DropDownPermissionTree';
import CreateOrEditRoleModal from './CreateOrEditRoleModal';
import RoleService from '../../../services/admin/RoleService';
import MessageHelper from '../../../base/MessageHelper';

export default {
    data() {
        return {
            loading: false,
            data: [],
            fetchParams: {
                permission: null
            },
            roleModal: {
                display: false,
                roleId: null
            }
        };
    },
    mounted() {
        this.fetchData();
    },
    methods: {
        handleChange(selectedData) {
            if (selectedData && selectedData.id) {
                this.fetchParams.permission = selectedData.id;
                this.fetchData();
            }
        },
        handleCommand(command) {
            var self = this;
            if (command.type == 'delete') {
                MessageHelper.confirm(
                    '',
                    this.L('RoleDeleteWarningMessage', command.row.displayName),
                    () => {
                        RoleService.deleteRole({
                            id: command.row.id
                        }).then(() => {
                            this.fetchData();
                            abp.notify.success(self.L('SuccessfullyDeleted'));
                        });
                    }
                );
            } else {
                this.roleModal.roleId =
                    command.type == 'add' ? null : command.row.id;
                this.roleModal.display = true;
            }
        },
        fetchData() {
            this.loading = true;
            RoleService.getRoles(this.fetchParams)
                .then(rs => {
                    this.data = rs.items;
                    this.loading = false;
                })
                .catch(() => {
                    this.loading = false;
                });
        }
    },
    components: {
        DropDownPermissionTree,
        CreateOrEditRoleModal
    }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>