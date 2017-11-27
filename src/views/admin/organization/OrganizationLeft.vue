<template>
    <div class="box box-primary" v-loading="loading">

        <div class="box-header with-border">
            <h3 class="box-title">{{L('OrganizationTree')}}</h3>

            <!-- tools box -->
            <div class="pull-right box-tools">
                <button v-if="isGranted('Pages.Administration.OrganizationUnits.ManageOrganizationTree')" type="button" class="waves-effect btn btn-primary btn-sm" @click="addUnit(null)">
                    <i class="fa fa-plus"></i> {{L('AddRootUnit')}}
                </button>
            </div>
            <!-- /. tools -->
        </div>

        <div class="box-body">
            <div v-if="treeData" ref="treeview"></div>
            <div v-if="!totalUnitCount" class="text-muted">
                {{L("NoOrganizationUnitDefinedYet")}}
            </div>
        </div>

        <CreateOrEditUnitModal :display.sync="modal.display" :parentId="modal.parentId" :id="modal.id" :displayName="modal.displayName" :onSave="(rs) => { savedCallback(rs); }"></CreateOrEditUnitModal>
    </div>
</template>

<script type="text/ecmascript-6">
import * as _ from 'lodash';
import MessageHelper from '../../../base/MessageHelper';
import OrganizationUnitService from '../../../services/admin/OrganizationUnitService';
import CreateOrEditUnitModal from './CreateOrEditUnitModal';
export default {
    props: {
        ouSelected: Function
    },
    data() {
        return {
            loading: false,
            totalUnitCount: 0,
            $tree: null,
            treeData: [],
            updatingNode: null,
            selectedOu: {},
            modal: {
                display: false,
                parentId: null,
                id: null,
                displayName: ''
            }
        };
    },
    async mounted() {
        var self = this;
        var $tree = $(this.$refs.treeview);
        this.$tree = $tree;
        await this.getTreeData();
        this.totalUnitCount = this.treeData.length;
        const jsTreePlugins = ['types', 'contextmenu', 'wholerow', 'sort'];

        if (
            this.isGranted(
                'Pages.Administration.OrganizationUnits.ManageOrganizationTree'
            )
        ) {
            jsTreePlugins.push('dnd');
        }

        $tree
            .on('changed.jstree', (e, data) => {
                if (data.selected.length !== 1) {
                    this.selectedOu = null;
                } else {
                    this.selectedOu = data.instance.get_node(
                        data.selected[0]
                    ).original;
                }
                this.ouSelected && this.ouSelected(this.selectedOu);
            })
            .on('move_node.jstree', (e, data) => {
                if (
                    !this.isGranted(
                        'Pages.Administration.OrganizationUnits.ManageOrganizationTree'
                    )
                ) {
                    $tree.jstree('refresh'); // rollback
                    return;
                }

                const parentNodeName =
                    !data.parent || data.parent === '#'
                        ? this.L('Root')
                        : $tree.jstree('get_node', data.parent).original
                              .displayName;

                MessageHelper.confirm(
                    '',
                    this.L(
                        'OrganizationUnitMoveConfirmMessage',
                        data.node.original.displayName,
                        parentNodeName
                    ),
                    () => {
                        const input = {};
                        input.id = data.node.id;
                        input.newParentId =
                            !data.parent || data.parent === '#'
                                ? undefined
                                : data.parent;
                        OrganizationUnitService.moveOrganizationUnit(input)
                            .catch(error => {
                                $tree.jstree('refresh'); // rollback
                                throw error;
                            })
                            .then(
                                () => {
                                    abp.notify.success(
                                        self.L('SuccessfullyMoved')
                                    );
                                    this.reload();
                                },
                                () => {}
                            );
                    },
                    () => {
                        $tree.jstree('refresh'); // rollback
                    }
                );
            })
            .jstree({
                core: {
                    data: this.treeData,
                    multiple: false,
                    check_callback: () => true
                },
                types: {
                    default: {
                        icon: 'fa fa-folder tree-item-icon-color icon-lg'
                    },
                    file: {
                        icon: 'fa fa-file tree-item-icon-color icon-lg'
                    }
                },
                contextmenu: {
                    items: function(node) {
                        return self.contextMenu(node);
                    }
                },
                sort: function(node1, node2) {
                    if (
                        this.get_node(node2).original.displayName <
                        this.get_node(node1).original.displayName
                    ) {
                        return 1;
                    }

                    return -1;
                },
                plugins: jsTreePlugins
            });

        $tree.on('click', '.ou-text .fa-caret-down', function(e) {
            e.preventDefault();
            const ouId = $(this)
                .closest('.ou-text')
                .attr('data-ou-id');

            setTimeout(() => {
                $tree.jstree('show_contextmenu', ouId);
            }, 100);
        });
    },
    watch: {
        '$store.state.organization.addedMembers'(val) {
            if (val) {
                this.incrementMemberCount(val.ouId, val.userIds.length);
            }
        },
        '$store.state.organization.removedMember'(val) {
            if (val) {
                this.incrementMemberCount(val.ouId, -1);
            }
        }
    },
    methods: {
        reload() {
            this.getTreeData();
            this.totalUnitCount = this.treeData.length;
            this.$tree.jstree(true).settings.core.data = this.treeData;
            this.$tree.jstree('refresh');
        },
        async getTreeData() {
            var rs = await OrganizationUnitService.getOrganizationUnits();

            const treeData = _.map(rs.items, item => {
                return {
                    id: item.id,
                    parent: item.parentId ? item.parentId : '#',
                    code: item.code,
                    displayName: item.displayName,
                    memberCount: item.memberCount,
                    text: this.generateTextOnTree(item),
                    dto: item,
                    state: {
                        opened: true
                    }
                };
            });
            this.treeData = treeData;
        },
        generateTextOnTree(ou) {
            const itemClass =
                ou.memberCount > 0
                    ? ' ou-text-has-members'
                    : ' ou-text-no-members';
            return (
                '<span title="' +
                ou.code +
                '" class="ou-text' +
                itemClass +
                '" data-ou-id="' +
                ou.id +
                '">' +
                ou.displayName +
                ' (<span class="ou-text-member-count">' +
                ou.memberCount +
                '</span>) <i class="fa fa-caret-down text-muted"></i></span>'
            );
        },
        addUnit(parentId) {
            this.modal.parentId = parseInt(parentId);
            this.modal.display = true;
        },
        contextMenu(node) {
            var self = this;
            const canManageOrganizationTree = self.isGranted(
                'Pages.Administration.OrganizationUnits.ManageOrganizationTree'
            );

            const items = {
                editUnit: {
                    label: self.L('Edit'),
                    _disabled: !canManageOrganizationTree,
                    action: () => {
                        self.updatingNode = node;
                        console.log(node);
                        self.modal.id = parseInt(node.id);
                        self.modal.displayName = node.original.displayName;
                        self.modal.display = true;
                    }
                },

                addSubUnit: {
                    label: self.L('AddSubUnit'),
                    _disabled: !canManageOrganizationTree,
                    action: () => {
                        self.addUnit(node.id);
                    }
                },

                delete: {
                    label: self.L('Delete'),
                    _disabled: !canManageOrganizationTree,
                    action: data => {
                        const instance = $.jstree.reference(data.reference);

                        MessageHelper.confirm(
                            '',
                            this.L(
                                'OrganizationUnitDeleteWarningMessage',
                                node.original.displayName
                            ),
                            () => {
                                OrganizationUnitService.deleteOrganizationUnit({
                                    id: node.id
                                }).then(() => {
                                    this.selectedOu = null;
                                    abp.notify.success(
                                        self.L('SuccessfullyDeleted')
                                    );
                                    instance.delete_node(node);
                                });
                            }
                        );
                    }
                }
            };

            return items;
        },
        savedCallback(rs) {
            if (rs.type === 'create') {
                this.unitCreated(rs.result);
            } else {
                this.unitUpdated(rs.result);
            }
        },
        unitCreated(ou) {
            const instance = $.jstree.reference(this.$tree);
            instance.create_node(
                ou.parentId ? instance.get_node(ou.parentId) : '#',
                {
                    id: ou.id,
                    parent: ou.parentId ? ou.parentId : '#',
                    code: ou.code,
                    displayName: ou.displayName,
                    memberCount: 0,
                    text: this.generateTextOnTree(ou),
                    state: {
                        opened: true
                    }
                }
            );

            this.totalUnitCount += 1;
        },
        unitUpdated(ou) {
            const instance = $.jstree.reference(this.$tree);
            this.updatingNode.original.displayName = ou.displayName;
            instance.rename_node(
                this.updatingNode,
                this.generateTextOnTree(ou)
            );
        },
        incrementMemberCount(ouId, incrementAmount) {
            const treeNode = this.$tree.jstree('get_node', ouId);
            treeNode.original.memberCount =
                treeNode.original.memberCount + incrementAmount;
            this.$tree.jstree(
                'rename_node',
                treeNode,
                this.generateTextOnTree(treeNode.original)
            );
        }
    },
    components: {
        CreateOrEditUnitModal
    }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>