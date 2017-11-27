<template>
    <div class="f16">
        <h5 class="input-flag" :class="icon|flag"></h5>
        <el-select class="el-select-flag" popper-class="f16" v-model="name" :placeholder="L('Select')" style="width:100%;" @change="selectedData" filterable>
            <el-option v-for="item in languages" :label="item.displayName" :key="item.name" :value="item.name">
                <i :class="item.icon|flag"></i> {{item.displayName}}
            </el-option>
        </el-select>
    </div>
</template>
<style lang="scss" rel="stylesheet">
.input-flag {
    position: absolute;
    left: 20px;
    top: 26px;
    z-index: 20;
}
.el-select-flag .el-input__inner {
    padding-left: 42px;
}
</style>
<script type="text/ecmascript-6">
export default {
    props: {
        value: String,
        languages: Array,
        onChange: Function
    },
    data() {
        return {
            icon: '',
            name: this.value
        };
    },
    mounted() {
        this.setIcon();
    },
    watch: {
        value(val) {
            if (val != this.name) {
                this.name = val;
            }
        },
        name(val) {
            // console.log('watch name ' + val);
            // 这里不可以反射值到父组件，如果反射了，那么父组件会取到之前一个值，
            // 具体原因不明
            // this.$emit('input', val);
            this.setIcon();
        }
    },
    methods: {
        setIcon() {
            if (this.languages) {
                this.languages.forEach(item => {
                    if (item.name === this.value) {
                        this.icon = item.icon;
                    }
                });
            }
        },
        selectedData(val) {
            // 该语句只能写在onChange之前，如果是之后，就只会反射之前的值到父组件
            this.$emit('input', val);
            this.onChange && this.onChange();
        }
    }
};
</script>
