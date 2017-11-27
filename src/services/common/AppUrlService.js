import store from '../../store/index';
import config from '../../common/config';
// import SessionService from './SessionService';

class AppUrlService {
    async getAppRootUrl() {
        // use vuex to get session
        // var tenant = await SessionService.getTenant();
        var tenant = store.state.session.tenant;
        if (tenant) {
            return this.getAppRootUrlOfTenant(tenant.tenancyName);
        } else {
            return this.getAppRootUrlOfTenant(null);
        }
    }

    /**
     * Returning url ends with '/'.
     */
    getAppRootUrlOfTenant(tenancyName) {
        let baseUrl = this.ensureEndsWith(config.baseUrl, '/');

        if (baseUrl.indexOf(config.tenancyNamePlaceHolderInUrl) < 0) {
            return baseUrl;
        }

        if (baseUrl.indexOf(config.tenancyNamePlaceHolderInUrl + '.') >= 0) {
            baseUrl = baseUrl.replace(
                config.tenancyNamePlaceHolderInUrl + '.',
                config.tenancyNamePlaceHolderInUrl
            );
            if (tenancyName) {
                tenancyName = tenancyName + '.';
            }
        }

        if (!tenancyName) {
            return baseUrl.replace(config.tenancyNamePlaceHolderInUrl, '');
        }

        return baseUrl.replace(config.tenancyNamePlaceHolderInUrl, tenancyName);
    }

    ensureEndsWith(str, c) {
        if (str.charAt(str.length - 1) !== c) {
            str = str + c;
        }

        return str;
    }

    removeFromEnd(str, c) {
        if (str.charAt(str.length - 1) === c) {
            str = str.substr(0, str.length - 1);
        }

        return str;
    }
}

export default new AppUrlService();
