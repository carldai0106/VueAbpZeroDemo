import config from '../../common/config';
import AjaxHelper from '../../common/js/AjaxHelper';

class SessionService {
    constructor() {
        this.user = null;
        this.tenant = null;
        this.application = null;
    }

    async getApplication() {
        if (!this.application) {
            await this.init();
        }
        return this.application;
    }

    async getUser() {
        if (!this.user) {
            await this.init();
        }
        return this.user;
    }

    async getUserId() {
        if (!this.user) {
            await this.init();
        }
        return this.user ? this.user.id : null;
    }

    async getTenant() {
        if (!this.tenant) {
            await this.init();
        }
        return this.tenant;
    }

    async getTenantId() {
        if (!this.tenant) {
            await this.init();
        }
        return this.tenant ? this.tenant.id : null;
    }

    async getShownLoginName() {
        if (!this.user || !this.tenant) {
            await this.init();
        }
        const userName = this.user.userName;
        if (!abp.multiTenancy.isEnabled) {
            return userName;
        }

        return (this.tenant ? this.tenant.tenancyName : '.') + '\\' + userName;
    }

    async init() {
        if (!this.user || !this.tenant || !this.application) {
            let url = `${
                config.remoteUrl
            }/api/services/app/Session/GetCurrentLoginInformations`;
            var rs = await AjaxHelper.get(url);
            var result = rs.result;
            this.user = result.user;
            this.tenant = result.tenant;
            this.application = result.application;
        }
        return this;
    }

    async getSession() {
        let url = `${config.remoteUrl}/api/services/app/Session/GetCurrentLoginInformations`;
        var rs = await AjaxHelper.get(url);
        return rs.result;
    }

    async getCurrentLoginInformations() {
        if (!this.user || !this.tenant || !this.application) {
            await this.init();
        }
        return {
            user: this.user,
            tenant: this.tenant,
            application: this.application
        };
    }

    async changeTenantIfNeeded(tenantId) {
        if (!this.user || !this.tenant || !this.application) {
            await this.init();
        }
        if (this.isCurrentTenant(tenantId)) {
            return false;
        }

        abp.multiTenancy.setTenantIdCookie(tenantId);
        location.reload();
        return true;
    }

    async isCurrentTenant(tenantId) {
        if (!this.user || !this.tenant || !this.application) {
            await this.init();
        }
        if (!tenantId && this.tenant) {
            return false;
        } else if (tenantId && (!this.tenant || this.tenant.id !== tenantId)) {
            return false;
        }

        return true;
    }

    async UpdateUserSignInToken() {
        var url = `${
            config.remoteUrl
        }/api/services/app/Session/UpdateUserSignInToken`;
        var rs = await AjaxHelper.put(url);
        return rs;
    }
}

export default new SessionService();
