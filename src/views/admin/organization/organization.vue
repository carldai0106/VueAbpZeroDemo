<template>
    <div class="page-wrapper">
        <div class="breadcrumbs" id="breadcrumbs">
            <div class="breadcrumb">
                <a href="#">{{L('Administration')}}</a>
                <a href="#" class="active">{{L('OrganizationUnits')}}</a>
            </div>
        </div>

        <!-- Content Header (Page header) -->
        <section class="content-header">
            <h1>
                {{L('OrganizationUnits')}}
                <small>{{L('OrganizationUnitsHeaderInfo')}}</small>
            </h1>
        </section>

        <!-- Main content -->
        <section class="content container-fluid">

            <div class="row">
                <div class="col-md-6">
                    <OrganizationLeft :ouSelected="(rs) => { selectedOrganizationUnit(rs); }"></OrganizationLeft>
                </div>
                <div class="col-md-6">
                    <OrganizationRight :organizationUnit="organizationUnit"></OrganizationRight>
                </div>
            </div>

        </section>
        <!-- /.content -->

    </div>
</template>

<script type="text/ecmascript-6">
import OrganizationLeft from './OrganizationLeft';
import OrganizationRight from './OrganizationRight';
export default {
    data() {
        return {
            organizationUnit: null
        };
    },
    methods: {
        selectedOrganizationUnit(rs) {
            this.organizationUnit = rs;
        }
    },
    components: {
        OrganizationLeft,
        OrganizationRight
    }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>