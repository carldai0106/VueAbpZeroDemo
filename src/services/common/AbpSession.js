class AbpSession {
    get UserId() {
        return abp.session.userId;
    }

    get TentantId() {
        return abp.session.tenantId;
    }

    get ImpersonatorUserId() {
        return abp.session.impersonatorUserId;
    }

    get ImpersonatorTenantId() {
        return abp.session.impersonatorTenantId;
    }

    get MultiTenancySide() {
        return abp.session.multiTenancySide;
    }
}
export default new AbpSession();
