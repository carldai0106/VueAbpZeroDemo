<template>
    <div>
        <p>{{message}}</p>
        <router-link to="/account/login">login</router-link>
    </div>
</template>


<script type="text/ecmascript-6">
export default {
    data() {
        return {
            message: 'Just a test'
        };
    },
    beforeEach(to, from, next) {
        console.log('beforeEach');
        next();
    },
    beforeAfter(to, from, next) {
        console.log('beforeAfter');
        next();
    },
    beforeRouteEnter(to, from, next) {
        console.log('beforeRouteEnter');
        next();
    },
    beforeRouteUpdate(to, from, next) {
        console.log('beforeRouteUpdate');
        next();
    },
    beforeRouteLeave(to, from, next) {
        console.log('beforeRouteLeave');
        next();
    },
    beforeCreate() {
        console.log('beforeCreate');
    },
    created() {
        console.log('created');
    },
    beforeMount() {
        console.log('beforeMount');
    },
    mounted() {
        console.log('mounted');
        this.init();
    },
    beforeUpdate() {
        console.log('beforeUpdate');
    },
    updated() {
        console.log('updated');
    },
    activated() {
        console.log('activated');
    },
    deactivated() {
        console.log('deactivated');
    },
    beforeDestroy() {
        console.log('beforeDestroy');
    },
    destroyed() {
        console.log('destroyed');
    },
    methods: {
        init() {
            console.log('init');
        }
    }
};
</script>
