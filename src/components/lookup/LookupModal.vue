<template>
    <el-dialog ref="LookupModal" class="dialog-lookup" :title="dialogOptions.title" :modal-append-to-body="false" :width="dialogOptions.width" :fullscreen="dialogOptions.fullscreen" :modal="dialogOptions.modal" :visible.sync="selfVisible" :top="dialogOptions.top" @open="handleOpen" @close="handleClose">

        <el-input class="mar-btm-10" v-model="fetchOptions.filterText" size="small" :placeholder="L('SearchWithThreeDot')">
            <el-button class="waves-effect" slot="append" icon="el-icon-search" @click="fetchData"></el-button>
        </el-input>

        <el-table class="data-table" v-loading="loading" :data="result" style="width:100%;" :fit="true" border stripe>
            <el-table-column v-for="(item, index) in columns" :key="index" :prop="item.prop" :label="item.label" :sortable="item.sortable" :resizable="item.resizable" :align="item.align" :formatter="item.formatter" :width="item.width" :min-width="item.minWidth">
            </el-table-column>
            <el-table-column width="120" :label="L('Select')" align="center">
                <template slot-scope="scope">
                    <el-button size="small" class="waves-effect" @click="selectItem(scope.row)">{{L('Select')}}</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination class="pagin" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="fetchOptions.pageIndex" :page-size="fetchOptions.maxResultCount" :page-sizes="[10, 30, 60, 100]" layout="sizes,total, prev, pager, next" :total="fetchOptions.totalCount">
        </el-pagination>

    </el-dialog>
</template>

<script type="text/ecmascript-6">
import config from '../../common/config';
export default {
    props: {
        display: Boolean,
        modalProps: Object,
        settings: Object,
        /* column 结构
        {
            label: '',
            prop: '',
            width: '',
            min-width: '',
            sortable: false,
            resizable: false,
            formatter: null,
            align: 'center'
        }
         */
        columns: Array,
        fetchProps: Object,
        selectedItem: Function
    },
    data() {
        var self = this;
        return {
            loading: false,
            selfVisible: this.display,
            result: null,
            // 默认modal设置
            modalOptions: {
                title: self.L('SelectAnItem'),
                width: '',
                fullscreen: false,
                top: '5vh',
                modal: true
            },
            // 默认分页设置
            pageOptions: {
                sorting: '',
                maxResultCount: config.defaultPageSize,
                skipCount: 0,
                pageIndex: 1,
                totalCount: 0
            },
            // 默认取值设置
            defaultOptions: {
                dataSource: async options => {},
                canSelect: () => true
            },
            defaultColumns: [
                {
                    label: self.L('ID'),
                    prop: 'id',
                    width: '80',
                    align: 'center'
                },
                {
                    label: self.L('FirstName'),
                    prop: 'firstName',
                    width: '120',
                    align: 'center'
                },
                {
                    label: self.L('LastName'),
                    prop: 'lastName',
                    width: '120',
                    align: 'center'
                }
            ]
        };
    },
    computed: {
        dialogOptions() {
            return Object.assign({}, this.modalOptions, this.modalProps);
        },
        options() {
            return Object.assign({}, this.defaultOptions, this.settings);
        },
        fetchOptions() {
            return Object.assign({}, this.pageOptions, this.fetchProps);
        }
    },
    watch: {
        // 监控父组件传递过来的值来指示是否显示dialog
        display(val) {
            if (val != this.selfVisible) {
                this.selfVisible = val;
            }
        },
        // 监控本组件的显示状态
        selfVisible(val) {
            // 更新状态到父组件是否显示本对话框
            this.$emit('update:display', val);
        }
    },
    methods: {
        handleOpen() {
            this.fetchData();
        },
        handleClose() {
            /* hack a problem, when opened chat side bar to add a new friend, but the user is in your friend list, when the modal is closed, body will have a padding right = 15px; so we should reset it.
          */
            $('body').prop('style').paddingRight = '0px';
        },
        handleCurrentChange(val) {
            this.fetchOptions.skipCount =
                Math.abs(val - 1) * this.fetchOptions.maxResultCount;
            this.fetchData();
        },
        handleSizeChange(val) {
            this.fetchOptions.maxResultCount = val;
            this.fetchData();
        },
        fetchData() {
            this.loading = true;
            let options = this.options;
            var ds = options.dataSource(this.fetchOptions);
            ds.then(
                rs => {
                    this.result = rs.items;
                    this.fetchOptions.skipCount =
                        (this.fetchOptions.pageIndex - 1) *
                        this.fetchOptions.maxResultCount;
                    this.fetchOptions.totalCount = rs.totalCount;
                    this.loading = false;
                },
                () => {
                    this.loading = false;
                }
            );
        },
        selectItem(item) {
            var options = this.options;
            // 对选中的数据进行检测，是否可以选择
            const boolOrPromise = options.canSelect(item);
            // 如果不可以选择
            if (!boolOrPromise) {
                return;
            }

            // 如果可以选择
            if (boolOrPromise === true) {
                this.selectedItem && this.selectedItem(item);
                this.selfVisible = false;
                return;
            }
            // 如果返回的对象是一个Promise
            boolOrPromise.then(
                rs => {
                    if (rs) {
                        this.selectedItem && this.selectedItem(item);
                        this.selfVisible = false;
                    }
                },
                () => {
                    this.selfVisible = false;
                }
            );
        }
    }
};
</script>
