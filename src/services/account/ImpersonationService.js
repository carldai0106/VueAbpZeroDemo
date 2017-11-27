import config from '../../common/config';
import AccountService from './AccountService';
import AppAuthService from '../common/AppAuthService';
import AppUrlService from '../common/AppUrlService';

class ImpersonationService {
    async impersonate(input) {
        var result = await AccountService.impersonate(input);
        AppAuthService.logout(false);
        let targetUrl =
            AppUrlService.getAppRootUrlOfTenant(result.tenancyName) +
            config.signInAsSomeoneUrlSegment +
            '?impersonationToken=' +
            result.impersonationToken;
        if (input.tenantId) {
            targetUrl = targetUrl + '&tenantId=' + input.tenantId;
        }

        location.href = targetUrl;
    }

    async backToImpersonator() {
        var result = await AccountService.backToImpersonator();
        AppAuthService.logout(false);

        let targetUrl =
            AppUrlService.getAppRootUrlOfTenant(result.tenancyName) +
            config.signInAsSomeoneUrlSegment +
            '?impersonationToken=' +
            result.impersonationToken;
        if (abp.session.impersonatorTenantId) {
            targetUrl =
                targetUrl + '&tenantId=' + abp.session.impersonatorTenantId;
        }

        location.href = targetUrl;
    }
}

export default new ImpersonationService();
