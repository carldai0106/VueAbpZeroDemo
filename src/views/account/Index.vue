
<style rel="styleesheet" lang="scss">
@import './index.scss';
</style>
<style rel="styleesheet" lang="scss" scoped>
$margin-width: 4px;
$width: 16px;
.logo {
    display: inline-block;
    span {
        height: $width;
        float: left;
        width: $width;
        border-radius: 2px;
    }
    .left-top {
        background: #5cb85c;
        margin-bottom: $margin-width;
        margin-right: $margin-width;
    }
    .right-top {
        background: #5bc0de;
        margin-bottom: $margin-width;
    }
    .left-btm {
        background: #f0ad4e;
        clear: left;
        margin-right: $margin-width;
    }
    .right-btm {
        background: #d9534f;
    }
}
.router-fade-enter-active,
.router-fade-leave-active {
    transition: all 0.3s;
}
.router-fade-enter,
.router-fade-leave-active {
    // transform: translate3d(2rem, 0, 0);
    // transform: scale(0.7);
    // transform: translateX(1rem);
    opacity: 0;
}
.brand {
    cursor: pointer;
    .my-font {
        color: #fff;
        font-weight: 100;
    }
    .admin-font {
        color: #fff;
        font-weight: 600;
    }
}
</style>

<template>
    <div class="main-wrapper">
        <header class="login-header">
            <div @click="goToHome" v-if="!tenant || !tenant.logoId" class="brand">
                <div class="logo">
                    <span class="left-top"></span>
                    <span class="right-top"></span>
                    <span class="left-btm"></span>
                    <span class="right-btm"></span>
                    <div class="clearfix"></div>
                </div>
                <span class="my-font">My</span>
                <span class="admin-font">Admin</span>
            </div>
            <div v-if="tenant && tenant.logoId" class="brand">
                <a @click="goToHome" href="#">
                    <img :src="remoteServiceBaseUrl + '/TenantCustomization/GetLogo?id=' + tenant.logoId" alt="logo" width="168" height="33" />
                </a>
            </div>
        </header>

        <div class="main-content">
            <!-- <div class="login-wrapper" transition="router-fade"> -->
            <div class="tenant-item">
                <div v-if="isMultiTenancyEnabled">
                    {{L("CurrentTenant")}}:
                    <span v-if="tenancyName" :title="name">
                        <strong>{{tenancyName}}</strong>
                    </span>
                    <span v-if="!tenancyName">{{L("NotSelected")}}</span>
                    (
                    <a href="#" @click="showChangeModal">{{L("Change")}}</a>)
                </div>
            </div>
            <div>
                <transition name="router-fade" mode="out-in">
                    <router-view></router-view>
                </transition>
            </div>
        </div>

        <footer class="footer">
            <LanguageSwitch></LanguageSwitch>
            <div class="footer-content">
                © Copyright, DYH Company Inc. {{Year}}, All rights reserved.
            </div>
        </footer>

        <ChangeTenantModal v-if="isMultiTenancyEnabled" :display.sync="modal.display" :tenantName="modal.tenantName"></ChangeTenantModal>
    </div>
</template>

<script type="text/ecmascript-6">
import config from '../../common/config';
import LanguageSwitch from '../../components/select/LanguageSwitch';
import SessionService from '../../services/common/SessionService';
import TokeAuthService from '../../services/common/TokenAuthService';
import AppAuthService from '../../services/common/AppAuthService';
import TokenHelper from '../../common/js/TokenHelper';
import ChangeTenantModal from './ChangeTenantModal';
export default {
    data() {
        return {
            loading: false,
            Year: new Date().getFullYear(),
            remoteServiceBaseUrl: null,
            tenant: null,
            tenancyName: '',
            name: '',
            modal: {
                tenantName: '',
                display: false
            }
        };
    },
    computed: {
        isMultiTenancyEnabled() {
            return abp.multiTenancy.isEnabled;
        }
    },
    created() {
        this.remoteServiceBaseUrl = config.remoteUrl;

        var query = this.$route.query;
        console.log('query');
        console.log(query);
        if (query.redirect && query.redirect === 'TenantRegistration') {
            if (query.forceNewRegistration) {
                AppAuthService.logout();
            }
            location.href = config.baseUrl + '/view/account/SelectEdition';
        } else if (query.impersonationToken) {
            this.impersonatedAuthenticate(query);
        } else {
            this.getTenant();
        }
    },
    mounted() {},
    methods: {
        impersonatedAuthenticate(query) {
            var tenantId = query.tenantId;
            abp.multiTenancy.setTenantIdCookie(tenantId);

            TokeAuthService.impersonatedAuthenticate(
                query.impersonationToken
            ).then(rs => {
                TokenHelper.setAccessToken(rs.accessToken);
                TokenHelper.setEncryptedAccessToken(rs.encryptedAccessToken);

                // 如果模拟登录成功，直接跳转到TenantDashboard
                window.location.href = '/views/dashboard/TenantDashboard';
            });
        },
        getTenant() {
            SessionService.getTenant().then(tenant => {
                if (tenant) {
                    this.tenant = tenant;
                    this.tenancyName = tenant.tenancyName;
                    this.name = tenant.name;
                }
            });
        },
        showChangeModal() {
            this.modal.tenantName = this.tenancyName;
            this.modal.display = true;
        },
        goToHome() {
            window.location.href = '/';
        }
    },
    components: {
        LanguageSwitch,
        ChangeTenantModal
    }
};
</script>