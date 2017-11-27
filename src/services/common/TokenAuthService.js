import config from '../../common/config';
import AjaxHelper from '../../common/js/AjaxHelper';

class TokenAuthService {
    async authenticate(input) {
        let url = `${config.remoteUrl}/api/TokenAuth/Authenticate`;
        var rs = await AjaxHelper.post(url, input);
        return rs.result;
    }

    async sendTwoFactorAuthCode(input) {
        let url = `${config.remoteUrl}/api/TokenAuth/SendTwoFactorAuthCode`;
        var rs = await AjaxHelper.post(url, input);
        return rs;
    }

    async impersonatedAuthenticate(impersonationToken) {
        let url = `${config.remoteUrl}/api/TokenAuth/ImpersonatedAuthenticate?impersonationToken=${impersonationToken}`;
        var rs = await AjaxHelper.post(url);
        return rs.result;
    }

    async linkedAccountAuthenticate(switchAccountToken) {
        let url = `${config.remoteUrl}/api/TokenAuth/LinkedAccountAuthenticate?switchAccountToken=${switchAccountToken}`;
        var rs = await AjaxHelper.post(url);
        return rs.result;
    }

    async getExternalAuthenticationProviders() {
        let url = `${config.remoteUrl}/api/TokenAuth/GetExternalAuthenticationProviders`;
        var rs = await AjaxHelper.get(url);
        return rs.result;
    }

    async externalAuthenticate(input) {
        let url = `${config.remoteUrl}/api/TokenAuth/ExternalAuthenticate`;
        var rs = await AjaxHelper.post(url, input);
        return rs.result;
    }

    async testNotification(input) {
        let url = `${config.remoteUrl}/api/TokenAuth/TestNotification`;
        var rs = await AjaxHelper.get(url, input);
        return rs;
    }
}

export default new TokenAuthService();
