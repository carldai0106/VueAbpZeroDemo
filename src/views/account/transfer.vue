<template></template>

<script type="text/ecmascript-6">
import config from '../../common/config';
import AppAuthService from '../../services/common/AppAuthService';
import TokenHelper from '../../common/js/TokenHelper';
import TokenAuthService from '../../services/common/TokenAuthService';
export default {
    created() {
        $.blockUI();
        $('body').spin();

        var query = this.$route.query;
        console.log('query');
        console.log(query);
        if (query.redirect && query.redirect === 'TenantRegistration') {
            if (query.forceNewRegistration) {
                AppAuthService.logout();
            }
            location.href = config.baseUrl + '/views/account/SelectEdition';
        } else if (query.impersonationToken) {
            this.impersonatedAuthenticate(query);
        } else if (query.switchAccountToken) {
            this.linkedAccountAuthenticate(query);
        } else {
            location.href = config.baseUrl + '/views/account/login';
        }
    },
    mounted() {
        $.unblockUI();
        $('body').spin(false);
    },
    activated() {},
    methods: {
        impersonatedAuthenticate(query) {
            var tenantId = query.tenantId;
            abp.multiTenancy.setTenantIdCookie(tenantId);

            TokenAuthService.impersonatedAuthenticate(
                query.impersonationToken
            ).then(rs => {
                TokenHelper.setAccessToken(rs.accessToken);
                TokenHelper.setEncryptedAccessToken(rs.encryptedAccessToken);

                /* 如果模拟登录成功，直接跳转到TenantDashboard
                    如果当前用户没有租户权限的话，路由守卫会自动的跳转到合适的页面。
                */
                window.location.href = '/views/dashboard/TenantDashboard';
            });
        },
        linkedAccountAuthenticate(query) {
            var tenantId = query.tenantId;
            abp.multiTenancy.setTenantIdCookie(tenantId);
            TokenAuthService.linkedAccountAuthenticate(
                query.switchAccountToken
            ).then(rs => {
                TokenHelper.setAccessToken(rs.accessToken);
                TokenHelper.setEncryptedAccessToken(rs.encryptedAccessToken);
                window.location.href = '/views/dashboard/TenantDashboard';
            });
        }
    }
};
</script>
