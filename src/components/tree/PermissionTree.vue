<template>
    <div class="permission-tree" ref="permissionTree">
    </div>
</template>

<script>
import * as _ from 'lodash';
export default {
    props: {
        permissions: Object,
        context: Object,
        loading: false
    },
    data() {
        return {
            $tree: null,
            permissionData: null,
            createdTreeBefore: false
        };
    },
    watch: {
        permissions(val) {
            this.permissionData = val;
            this.refreshTree();
            // 只有当PremissionTree加载完毕后，才可以将父组件的loading设置为FALSE
            this.$emit('update:loading', false);
        }
    },
    created() {
        // 向父组件传递当前组件对象，方便调用当前组件里面的方法，属性。
        this.$emit('update:context', this);
    },
    activated() {},
    mounted() {},
    methods: {
        getGrantedPermissionNames() {
            if (!this.$tree || !this.createdTreeBefore) {
                return [];
            }
            let permissionNames = [];
            let selectedPermissions = this.$tree.jstree('get_selected', true);
            for (let i = 0; i < selectedPermissions.length; i++) {
                permissionNames.push(selectedPermissions[i].original.id);
            }
            return permissionNames;
        },
        selectNodeAndAllParents(node) {
            this.$tree.jstree('select_node', node, true);
            let parent = this.$tree.jstree('get_parent', node);
            if (parent) {
                this.selectNodeAndAllParents(parent);
            }
        },
        refreshTree() {
            let self = this;

            var $tree = $(this.$refs.permissionTree);
            this.$tree = $tree;

            if (this.createdTreeBefore) {
                $tree.jstree('destroy');
            }

            this.createdTreeBefore = false;
            if (!this.permissionData || !$tree) {
                return;
            }

            let treeData = _.map(this.permissionData.permissions, function(
                item
            ) {
                return {
                    id: item.name,
                    parent: item.parentName ? item.parentName : '#',
                    text: item.displayName,
                    state: {
                        opened: true,
                        selected: _.includes(
                            self.permissionData.grantedPermissionNames,
                            item.name
                        )
                    }
                };
            });

            $tree.jstree({
                core: {
                    data: treeData
                },
                types: {
                    default: {
                        icon: 'fa fa-folder tree-item-icon-color icon-lg'
                    },
                    file: {
                        icon: 'fa fa-file tree-item-icon-color icon-lg'
                    }
                },
                checkbox: {
                    keep_selected_style: false,
                    three_state: false,
                    cascade: ''
                },
                plugins: ['checkbox', 'types']
            });

            this.createdTreeBefore = true;
            let inTreeChangeEvent = false;

            $tree.on('changed.jstree', function(e, data) {
                if (!data.node) {
                    return;
                }

                let wasInTreeChangeEvent = inTreeChangeEvent;

                if (!wasInTreeChangeEvent) {
                    inTreeChangeEvent = true;
                }

                let childrenNodes;

                if (data.node.state.selected) {
                    self.selectNodeAndAllParents(
                        $tree.jstree('get_parent', data.node)
                    );

                    childrenNodes = $.makeArray(
                        $tree.jstree('get_children_dom', data.node)
                    );

                    $tree.jstree('select_node', childrenNodes);
                } else {
                    childrenNodes = $.makeArray(
                        $tree.jstree('get_children_dom', data.node)
                    );

                    $tree.jstree('deselect_node', childrenNodes);
                }

                if (!wasInTreeChangeEvent) {
                    inTreeChangeEvent = false;
                }
            });
        }
    }
};
</script>
