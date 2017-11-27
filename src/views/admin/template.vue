<template>
    <div>

        <div class="breadcrumbs" id="breadcrumbs">
            <div class="breadcrumb">
                <a href="#">{{L('Administration')}}</a>
                <a href="#" class="active">{{L('Users')}}</a>
            </div>
        </div>

        <!-- Content Header (Page header) -->
        <section class="content-header">
            <h1>
                {{L('Editions')}}
                <small>{{L("EditionsHeaderInfo")}}</small>
            </h1>
        </section>

        <!-- Main content -->
        <section class="content container-fluid">
            <div class="box box-primary">
                <div class="box-body">

                </div>
            </div>
        </section>

    </div>
</template>

<script type="text/ecmascript-6">
export default {
    data() {
        return {
            loading: false,
            data: null
        };
    },
    async mounted() {},
    methods: {
        async fetchData() {
            this.loading = true;
        }
    },
    components: {}
};
</script>

<style lang="scss" rel="stylesheet/scss">

</style>