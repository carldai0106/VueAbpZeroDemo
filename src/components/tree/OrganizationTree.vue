<style rel="styleesheet" lang="scss">
.permissiontree--container {
    overflow: visible;
    position: relative;
    .tree-list {
        position: absolute;
        z-index: 200;
        max-height: 500px;
        overflow-y: scroll;
        width: 100%;
    }
}
</style>
<template>
    <div class="permissiontree--container">
        <el-input v-model="searchText" size="small" :placeholder="L('SearchWithThreeDot')" @keypress.native="inputChanged">
            <i slot="suffix" class="el-input__icon" :class="{ 'el-icon-close': searchText }" @click="() => { searchText = ''; }"></i>
        </el-input>
        <el-card class="mar-top-15">
            <div ref="tree"></div>
        </el-card>
    </div>
</template>

<script type="text/ecmascript-6">
import * as _ from 'lodash';

export default {
    props: {
        context: Object,
        organizationUnit: Object
    },
    data() {
        return {
            $tree: null,
            treeData: [],
            createdTreeBefore: false,
            searchText: ''
        };
    },
    watch: {
        organizationUnit(val) {
            this.treeData = val;
            this.refreshTree();
        }
    },
    created() {
        // 向父组件传递当前组件对象，方便调用当前组件里面的方法，属性。
        this.$emit('update:context', this);
    },
    methods: {
        inputChanged() {
            let to = false;
            let self = this;
            if (to) {
                window.clearTimeout(to);
            }
            to = window.setTimeout(() => {
                self.$tree.jstree(true).search(this.searchText);
            }, 250);
        },
        getSelectedOrganizations() {
            if (!this.$tree || !this.createdTreeBefore) {
                return [];
            }
            let organizationIds = [];
            let selectedOrganizations = this.$tree.jstree('get_selected', true);
            for (let i = 0; i < selectedOrganizations.length; i++) {
                organizationIds.push(selectedOrganizations[i].original.id);
            }
            return organizationIds;
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

            var $tree = $(this.$refs.tree);
            this.$tree = $tree;

            if (this.createdTreeBefore) {
                $tree.jstree('destroy');
            }

            this.createdTreeBefore = false;
            if (!this.treeData || !$tree) {
                return;
            }

            let treeData = _.map(this.treeData.allOrganizationUnits, function(
                item
            ) {
                return {
                    id: item.id,
                    parent: item.parentId ? item.parentId : '#',
                    code: item.code,
                    displayName: item.displayName,
                    memberCount: item.memberCount,
                    text: item.displayName,
                    dto: item,
                    state: {
                        opened: true,
                        selected: _.includes(
                            self.treeData.selectedOrganizationUnits,
                            item.code
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
                search: {
                    show_only_matches: true
                },
                plugins: ['checkbox', 'types', 'search']
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
    },
    components: {}
};
</script>