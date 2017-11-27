<style lang="scss" rel="stylesheet/scss" scoped>
ul.tenant-info {
    margin-bottom: 10px;

    li {
        padding: 6px 40px;
        span {
            color: #fff;
            font-size: 14px;
        }
    }
}
.other-info .alert {
    padding: 10px;
}
</style>

<template>
    <div v-if="model" class="login-wrapper" v-loading="loading">
        <div class="header-title">
            <b>{{L("SuccessfullyRegistered")}}</b>
        </div>
        <div class="panel-body">
            <ul class="tenant-info">
                <li>
                    <span class="text-muted">{{L("TenancyName")}} :</span> {{model.tenancyName}}</li>
                <li>
                    <span class="text-muted">{{L("Name")}} :</span> {{model.name}}</li>
                <li>
                    <span class="text-muted">{{L("UserName")}} :</span> {{model.userName}}</li>
                <li>
                    <span class="text-muted">{{L("EmailAddress")}} :</span> {{model.emailAddress}}</li>
            </ul>
            <div class="other-info">
                <div v-if="model.isEmailConfirmationRequired" class="alert alert-warning" role="alert">
                    {{L("ConfirmationMailSentPleaseClickLinkInTheEmail", model.emailAddress)}}
                </div>
                <div v-if="!model.isActive" class="alert alert-warning" role="alert">
                    {{L("YourAccountIsWaitingToBeActivatedByAdmin")}}
                </div>
                <div v-if="tenantUrl" class="alert alert-info" role="alert">
                    {{L("TenantRegistrationLoginInfo")}}<br />
                    <a :href="tenantUrl">{{tenantUrl}}</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
import AppUrlService from '../../../services/common/AppUrlService';
export default {
    data() {
        return {
            loading: false,
            model: {
                tenantId: null,
                tenancyName: null,
                name: null,
                userName: null,
                emailAddress: null,
                isTenantActive: false,
                isActive: false,
                isEmailConfirmationRequired: false
            }
        };
    },
    created() {
        var params = this.$route.params;
        if (!params.registrationResult) {
            this.$route.push({ name: 'account.login' });
        }
        for (var key in this.model) {
            this.model[key] = params.registrationResult[key];
        }

        abp.multiTenancy.setTenantIdCookie(this.model.tenantId);
        this.tenantUrl = AppUrlService.getAppRootUrlOfTenant(
            this.model.tenancyName
        );
    }
};
</script>
