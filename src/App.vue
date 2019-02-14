<style rel="styleesheet" lang="scss">
@import './vendor/flags/flags16.css';
@import './vendor/flags/flags32.css';
@import './vendor/Ionicons/css/ionicons.css';
@import './vendor/AdminLTE/css/AdminLTE.css';
@import './vendor/AdminLTE/css/skins/skin-blue.css';
@import './common/css/layout.scss';
</style>

<template>
    <div id="app">        
        <router-view/>
    </div>
</template>

<script>
import store from './store/index';
import './filters/Filters';
export default {
    name: 'app',
    store,
    beforeCreate() {},
    created() {},
    mounted() {}
};
</script>

