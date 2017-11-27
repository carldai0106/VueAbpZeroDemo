<template>
    <el-select v-model="selectedTimeZone" :placeholder="L('Select')" style="width: 100%">
        <el-option size="large" v-for="item in data" :key="item.value" :label="item.name" :value="item.value">
        </el-option>
    </el-select>
</template>

<script type="text/ecmascript-6">
import TimingService from '../../services/common/TimingService';
export default {
    props: {
        // value is selectedTimeZone
        value: String,
        defaultTimezoneScope: Number
    },
    data() {
        return {
            selectedTimeZone: this.value,
            data: []
        };
    },
    watch: {
        value(val) {
            if (val != this.selectedTimeZone) {
                this.selectedTimeZone = val;
            }
        },
        selectedTimeZone(val) {
            this.$emit('input', val);
        }
    },
    async created() {
        await this.fetchData();
    },
    methods: {
        async fetchData() {
            var rs = await TimingService.getTimezones({
                defaultTimezoneScope: this.defaultTimezoneScope
            });
            this.data = rs.items;
        }
    }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>