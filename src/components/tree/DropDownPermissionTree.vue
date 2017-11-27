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
    <div class="permissiontree--container" ref="container">
        <el-input size="small" :placeholder="L('Permissions')" @focus="showTree = !showTree" ref="input" v-bind:value="selectedData.text" :readonly="true">
            <i slot="suffix" class="el-input__icon" :class="{ 'el-icon-close':selectedData.id }" @click="()=>{selectedData = {}}"></i>
        </el-input>
        <el-card v-show="showTree" class="tree-list">
            <div ref="tree"></div>
        </el-card>
    </div>
</template>

<script type="text/ecmascript-6">
import * as _ from 'lodash';
import PermissionService from '../../services/admin/PermissionService';

export default {
    name: 'PermissionTree',
    props: {
        onChange: Function
    },
    data() {
        return {
            $tree: null,
            showTree: false,
            treeData: [],
            selectedData: {},
            loading: false
        };
    },
    watch: {
        showTree(val) {
            if (val) {
                window.addEventListener('click', this.hideTree);
            } else {
                window.removeEventListener('click', this.hideTree);
            }
        }
    },
    created() {},
    deactivated() {
        window.removeEventListener('click', this.hideTree);
    },
    beforeDestroy() {
        window.removeEventListener('click', this.hideTree);
    },
    async mounted() {
        await this.getTreeData();
        var $tree = $(this.$refs.tree);
        this.$tree = $tree;
        $tree
            .jstree({
                core: {
                    data: this.treeData
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
                plugins: ['types']
            })
            .on('changed.jstree', (e, data) => {
                if (data.selected.length !== 1) {
                    this.selectedData = null;
                } else {
                    this.selectedData = data.instance.get_node(
                        data.selected[0]
                    ).original;
                }
                this.showTree = false;
                this.onChange && this.onChange(this.selectedData);
            });
    },
    methods: {
        async getTreeData() {
            this.loading = true;
            var rs = await PermissionService.getAllPermissions();
            let treeData = _.map(rs.items, function(item) {
                return {
                    id: item.name,
                    parent: item.parentName ? item.parentName : '#',
                    text: item.displayName,
                    state: {
                        opened: true
                    }
                };
            });
            this.loading = false;
            this.treeData = treeData;
        },
        hideTree(e) {
            for (let k in e.path) {
                let item = e.path[k];
                if (item === this.$refs.container) return;
            }
            this.showTree = false;
        }
    },
    components: {}
};
</script>