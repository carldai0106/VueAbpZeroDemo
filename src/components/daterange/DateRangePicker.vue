<template>
    <el-date-picker ref="container" type="daterange" style="width:100%;" align="left" :size="size" :disabled="disabled" @change="onChange" v-model="currentRange" :placeholder="L('DateRange')" :picker-options="pickerOptions">
    </el-date-picker>
</template>

<script>
import * as moment from 'moment';

export default {
    props: {
        start: moment.Moment, // 开始日期
        end: moment.Moment, // 结束日期
        onChange: {
            type: Function,
            default: () => {}
        },
        size: String,
        disabled: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            pickerOptions: {
                shortcuts: [
                    {
                        text: this.L('Today'),
                        onClick(picker) {
                            picker.$emit('pick', [
                                moment().startOf('day'),
                                moment().endOf('day')
                            ]);
                        }
                    },
                    {
                        text: this.L('Yesterday'),
                        onClick(picker) {
                            picker.$emit('pick', [
                                moment()
                                    .subtract(1, 'days')
                                    .startOf('day'),
                                moment()
                                    .subtract(1, 'days')
                                    .endOf('day')
                            ]);
                        }
                    },
                    {
                        text: this.L('Last7Days'),
                        onClick(picker) {
                            picker.$emit('pick', [
                                moment()
                                    .subtract(6, 'days')
                                    .startOf('day'),
                                moment().endOf('day')
                            ]);
                        }
                    },
                    {
                        text: this.L('Last30Days'),
                        onClick(picker) {
                            picker.$emit('pick', [
                                moment()
                                    .subtract(29, 'days')
                                    .startOf('day'),
                                moment().endOf('day')
                            ]);
                        }
                    },
                    {
                        text: this.L('ThisMonth'),
                        onClick(picker) {
                            picker.$emit('pick', [
                                moment().startOf('month'),
                                moment().endOf('month')
                            ]);
                        }
                    },
                    {
                        text: this.L('LastMonth'),
                        onClick(picker) {
                            picker.$emit('pick', [
                                moment()
                                    .subtract(1, 'month')
                                    .startOf('month'),
                                moment()
                                    .subtract(1, 'month')
                                    .endOf('month')
                            ]);
                        }
                    }
                ]
            },
            currentRange: [this.start, this.end]
        };
    },
    watch: {
        currentRange(val) {
            var range = val || new Array(2);
            if (range[0] == null) {
                range[0] = moment().startOf('day');
                range[1] = moment().endOf('day');
            }

            this.$emit('update:start', range[0]);
            this.$emit('update:end', range[1]);
        },
        start(val) {
            var range = this.currentRange || new Array(2);
            if (val !== range[0]) {
                this.currentRange[0] = val;
            }
        },
        end(val) {
            var range = this.currentRange || new Array(2);
            if (val !== range[1]) {
                this.currentRange[1] = val;
            }
        }
    }
};
</script>
