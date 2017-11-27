<template>
    <div class="page-wrapper" v-loading="loading">
        <div class="breadcrumbs" id="breadcrumbs">
            <div class="breadcrumb">
                <a href="#">{{L('Administration')}}</a>
                <a href="#" class="active">{{L('Users')}}</a>
            </div>
        </div>

        <!-- Content Header (Page header) -->
        <section class="content-header">
            <h1>
                {{L('Users')}}
                <small>{{L('UsersHeaderInfo')}}</small>
            </h1>
        </section>

        <!-- Main content -->
        <section class="content container-fluid">

            <div class="box box-info">
                <div class="box-body">
                    <el-form size="small">
                        <el-form-item label="" style="margin:0;">
                            <el-input class="mar-btm-10" :placeholder="L('SearchWithThreeDot')">
                                <el-button class="waves-effect" slot="append" icon="el-icon-search" @click="fetchData"></el-button>
                            </el-input>
                        </el-form-item>
                        <div class="row">
                            <div :class="{'col-md-6': isGranted('Pages.Administration.Roles'), 'col-md-12':!isGranted('Pages.Administration.Roles')}">
                                <el-form-item :label="L('Permissions')">
                                    <DropDownPermissionTree size="small" v-model="fetchParams.permission" :onChange="fetchData"></DropDownPermissionTree>
                                </el-form-item>
                            </div>
                            <div class="col-md-6" v-if="isGranted('Pages.Administration.Roles')">
                                <el-form-item :label="L('FilterByRole')">
                                    <el-select style="width:100%;" clearable v-model="fetchParams.roleId" :placeholder="L('Select')">
                                        <el-option v-for="(item, index) in roles" :key="index" :label="item.displayName" :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                        </div>
                    </el-form>
                </div>
            </div>

            <div class="box box-primary">
                <div class="box-body">
                    <div class="toolbar">
                        <div class="btn-group">
                            <button class="waves-effect btn btn-default" v-if="isGranted('Pages.Administration.Users.Create')" @click="createOrEditUser(null)">
                                <i class="fa fa-plus"></i> {{L('Create')}}</button>
                            <button class="waves-effect btn btn-default" @click="fetchData">
                                <i class="fa fa-refresh"></i> {{L('Refresh')}}</button>
                        </div>
                    </div>

                    <el-table :data="data" :fit="true" @sort-change="sortChanged" border stripe>
                        <el-table-column sortable='custom' min-width="120" prop="userName" :label="L('UserName')">
                        </el-table-column>
                        <el-table-column sortable='custom' min-width="120" prop="name" :label="L('Name')">
                        </el-table-column>
                        <el-table-column sortable='custom' width="120" prop="surname" :label="L('Surname')">
                        </el-table-column>
                        <el-table-column width="180" :label="L('Roles')">
                            <template slot-scope="scope">
                                <i v-for="(item, index) in scope.row.roles" :key="index">{{item.roleName}}
                                    <i v-if="index+1 < scope.row.roles.length">, </i>
                                </i>
                            </template>
                        </el-table-column>
                        <el-table-column sortable='custom' width="190" prop="emailAddress" :label="L('EmailAddress')">
                        </el-table-column>
                        <el-table-column width="100" :label="L('EmailConfirm')" :render-header="renderHeader">
                            <template slot-scope="scope">
                                <el-tag type="success" v-if="scope.row.isEmailConfirmed">{{L('Yes')}}</el-tag>
                                <el-tag type="gray" v-else>{{L('No')}}</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column width="80" :label="L('Active')">
                            <template slot-scope="scope">
                                <el-tag type="success" v-if="scope.row.isActive">{{L('Yes')}}</el-tag>
                                <el-tag type="gray" v-else>{{L('No')}}</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column sortable='custom' width="200" prop="lastLoginTime" :label="L('LastLoginTime')">
                            <template slot-scope="scope">
                                {{scope.row.lastLoginTime | DateTimeFormat('LLL')}}
                            </template>
                        </el-table-column>
                        <el-table-column sortable='custom' prop="creationTime" width="190" :label="L('CreationTime')">
                            <template slot-scope="scope">
                                {{scope.row.creationTime | DateTimeFormat('L')}}
                            </template>
                        </el-table-column>
                        <el-table-column fixed="right" width="110" :label="L('Actions')">
                            <template slot-scope="scope">
                                <el-dropdown trigger="click">
                                    <el-button type="primary" size="small" class="waves-effect">
                                        {{L('Actions')}}
                                        <i class="el-icon-caret-bottom el-icon--right"></i>
                                    </el-button>
                                    <el-dropdown-menu slot="dropdown">
                                        <!--权限-->
                                        <el-dropdown-item v-if="isGranted('Pages.Administration.Users.Impersonation') && scope.row.id !== currentUserId">
                                            <div @click="impersonate(scope.row)">
                                                {{L('LoginAsThisUser')}} - {{scope.row.id}} - {{currentUserId}}
                                            </div>
                                        </el-dropdown-item>
                                        <el-dropdown-item v-if="isGranted('Pages.Administration.Users.ChangePermissions')">
                                            <div @click="changePermissions(scope.row)">
                                                {{L('Permissions')}}
                                            </div>
                                        </el-dropdown-item>
                                        <!--编辑-->
                                        <el-dropdown-item divided v-if="isGranted('Pages.Administration.Users.Edit')">
                                            <div @click="createOrEditUser(scope.row)">
                                                {{L('Edit')}}
                                            </div>
                                        </el-dropdown-item>
                                        <!--删除-->
                                        <el-dropdown-item v-if="isGranted('Pages.Administration.Users.Delete')">
                                            <div @click="deleteUser(scope.row)">{{L('Delete')}}</div>
                                        </el-dropdown-item>
                                        <el-dropdown-item divided v-if="isGranted('Pages.Administration.Users.ChangePermissions')">
                                            <div @click="unlock(scope.row)">{{L('Unlock')}}</div>
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </template>
                        </el-table-column>

                    </el-table>

                    <el-pagination class="pagin" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.pageIndex" :page-size="fetchParams.maxResultCount" :page-sizes="[15, 30, 60, 100]" layout="sizes,total, prev, pager, next" :total="pagination.totalCount">
                    </el-pagination>
                </div>
            </div>

        </section>
        <!-- /.content -->

        <CreateOrEditUserModal :display.sync="modal.display" :id="modal.id" :onSave="() => { fetchData() }"></CreateOrEditUserModal>

        <EditUserPermission :display.sync="permissionModal.display" :userId="permissionModal.userId" :userName="permissionModal.userName"></EditUserPermission>

    </div>
</template>

<script type="text/ecmascript-6">
import { mapState } from 'vuex';
import config from '../../../common/config';
import MessageHelper from '../../../base/MessageHelper';
import DropDownPermissionTree from '../../../components/tree/DropDownPermissionTree';
import RoleService from '../../../services/admin/RoleService';
import UserService from '../../../services/admin/UserService';
import CreateOrEditUserModal from './CreateOrEditUserModal';
import EditUserPermission from './EditUserPermission';
import ImpersonationService from '../../../services/account/ImpersonationService';
export default {
    data() {
        return {
            loading: false,
            roles: [],
            data: [],
            currentUserId: null,
            modal: {
                id: null,
                display: false
            },
            permissionModal: {
                userId: null,
                userName: '',
                display: false
            },
            fetchParams: {
                role: null,
                permission: null,
                filter: null,
                sorting: null,
                maxResultCount: config.defaultPageSize,
                skipCount: 0
            },
            pagination: {
                pageIndex: 1,
                totalCount: 0
            }
        };
    },
    created() {
        this.loading = true;
        RoleService.getRoles(null).then(
            rs => {
                this.roles = rs.items;
                this.loading = false;
            },
            () => {
                this.loading = false;
            }
        );

        this.currentUserId = this.sessionUser.id;
    },
    mounted() {
        this.fetchData();
    },
    computed: {
        ...mapState({
            sessionUser: state => state.session.user,
            sessionTenant: state => state.session.tenant,
            sessionApplication: state => state.session.application
        })
    },
    methods: {
        renderHeader(ce, { column }) {
            return this.spaceToBr(ce, column.label, 1);
        },
        sortChanged({ column, prop, order }) {
            if (prop && order) {
                this.fetchParams.sorting = prop + ' ' + order;
                this.fetchData();
            }
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
        async impersonate(row) {
            var tenantId = this.sessionTenant ? this.sessionTenant.id : null;
            const input = {};
            input.userId = row.id;
            input.tenantId = tenantId;
            await ImpersonationService.impersonate(input);
        },
        changePermissions(row) {
            this.permissionModal.userId = row.id;
            this.permissionModal.userName = row.userName;
            this.permissionModal.display = true;
        },
        createOrEditUser(row) {
            this.modal.display = true;
            this.modal.id = null;
            if (row) {
                this.modal.id = row.id;
            }
        },
        deleteUser(row) {
            if (row.userName === config.defaultAdminUserName) {
                MessageHelper.warning(
                    this.L(
                        '{0}UserCannotBeDeleted',
                        config.defaultAdminUserName
                    )
                );
                return;
            }
            MessageHelper.confirm(
                '',
                this.L('UserDeleteWarningMessage', row.userName),
                () => {
                    UserService.deleteUser({
                        id: row.id
                    }).then(() => {
                        this.fetchData();
                        abp.notify.success(this.L('SuccessfullyDeleted'));
                    });
                }
            );
        },
        unlock(row) {
            UserService.unlockUser({ id: row.id }).then(() => {
                abp.notify.success(this.L('UnlockedTheUser', row.userName));
            });
        },
        fetchData() {
            this.loading = true;

            var fetchParams = Object.assign({}, this.fetchParams, {
                permission: this.fetchParams.permission
                    ? this.fetchParams.permission.id
                    : null
            });
            UserService.getUsers(fetchParams).then(
                rs => {
                    this.data = rs.items;
                    this.pagination.totalCount = rs.totalCount;
                    this.loading = false;
                },
                () => {
                    this.loading = false;
                }
            );
        }
    },
    components: {
        DropDownPermissionTree,
        CreateOrEditUserModal,
        EditUserPermission
    }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>