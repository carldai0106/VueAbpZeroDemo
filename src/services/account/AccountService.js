import config from '../../common/config';
import AjaxHelper from '../../common/js/AjaxHelper';
import TokenHelper from '../../common/js/TokenHelper';
import PreloadService from '../../services/PreloadService';
import TokenAuthService from '../common/TokenAuthService';
import UrlHelper from '../../common/js/UrlHelper';

class AccountService {
    static twoFactorRememberClientTokenName = 'TwoFactorRememberClientToken';

    async authenticate(authenticateModel, $router, redirectUrl) {
        authenticateModel.twoFactorRememberClientToken = abp.utils.getCookieValue(
            config.TwoFactorRememberClientTokenKey
        );
        authenticateModel.singleSignIn = UrlHelper.getSingleSignIn();
        authenticateModel.returnUrl = UrlHelper.getReturnUrl();

        var rs = await TokenAuthService.authenticate(authenticateModel);
        var model = rs;

        await this.processAuthenticateResult(
            $router,
            model,
            authenticateModel,
            redirectUrl
        );
    }

    clear(authenticateModel, authenticateResult) {
        authenticateModel = {};
        authenticateModel.rememberClient = false;
        authenticateResult = null;
    }

    async processAuthenticateResult(
        $router,
        authenticateResult,
        authenticateModel,
        redirectUrl
    ) {
        var model = authenticateResult;
        if (model.shouldResetPassword) {
            $router.push(
                {
                    name: 'account.resetpassword',
                    params: {
                        userId: model.userId,
                        tenantId: abp.session.tenantId,
                        resetCode: model.passwordResetCode
                    }
                },
                () => {
                    this.clear(authenticateModel, authenticateResult);
                }
            );
        } else if (model.requiresTwoFactorVerification) {
            // Two factor authentication
            var parameters = {
                authenticateModel: authenticateModel,
                authenticateResult: authenticateResult
            };

            $router.push({
                name: 'account.sendtwofactorcode',
                params: parameters
            });
        } else if (model.accessToken) {
            // Successfully logged in
            if (model.returnUrl && !redirectUrl) {
                redirectUrl = model.returnUrl;
            }
            await this.login(
                model.accessToken,
                model.encryptedAccessToken,
                model.expireInSeconds,
                authenticateModel.rememberClient,
                model.twoFactorRememberClientToken,
                $router,
                redirectUrl
            );
        } else {
            $router.push({ name: 'account.login' });
        }
    }

    async login(
        accessToken,
        encryptedAccessToken,
        expireInSeconds,
        rememberMe,
        twoFactorRememberClientToken,
        $router,
        redirectUrl
    ) {
        let tokenExpireDate = rememberMe
            ? new Date(new Date().getTime() + 1000 * expireInSeconds)
            : undefined;

        TokenHelper.setAccessToken(accessToken, tokenExpireDate);
        TokenHelper.setEncryptedAccessToken(
            encryptedAccessToken,
            tokenExpireDate
        );

        if (twoFactorRememberClientToken) {
            TokenHelper.setToken(
                config.TwoFactorRememberClientTokenKey,
                twoFactorRememberClientToken,
                new Date(new Date().getTime() + 365 * 86400000)
            );
        }

        // 登录成功后，我们需要重新配置全局权限等等一些用户的特有配置。
        await PreloadService.loginedInit();

        if (redirectUrl) {
            location.href = redirectUrl;
        } else {
            var tenantId = abp.multiTenancy.getTenantIdCookie();
            console.log('tenantId : ' + tenantId);
            if (tenantId == null) {
                console.log('router admin.hostdashboard');
                $router.push({ name: 'admin.hostdashboard' });
            } else {
                console.log('router admin.tenantdashboard');
                $router.push({ name: 'admin.tenantdashboard' });
            }
        }
    }

    async getPasswordComplexitySetting() {
        var url = `${
            config.remoteUrl
        }/api/services/app/Profile/GetPasswordComplexitySetting`;
        var rs = await AjaxHelper.get(url);
        return rs;
    }

    async resetPassword(input) {
        var url = `${config.remoteUrl}/api/services/app/Account/ResetPassword`;
        var rs = await AjaxHelper.post(url, input, {
            dataType: 'json',
            contentType: 'application/json'
        });
        return rs.result;
    }

    async isTenantAvailable(input) {
        var url = `${
            config.remoteUrl
        }/api/services/app/Account/IsTenantAvailable`;
        var rs = await AjaxHelper.post(url, input);
        return rs.result;
    }

    async register(input) {
        var url = `${config.remoteUrl}/api/services/app/Account/Register`;
        var rs = await AjaxHelper.post(url, input);
        return rs.result;
    }

    async sendPasswordResetCode(input) {
        var url = `${
            config.remoteUrl
        }/api/services/app/Account/SendPasswordResetCode`;
        var rs = await AjaxHelper.post(url, input);
        return rs;
    }

    async impersonate(input) {
        var url = `${config.remoteUrl}/api/services/app/Account/Impersonate`;
        var rs = await AjaxHelper.post(url, input);
        return rs.result;
    }

    async backToImpersonator() {
        var url = `${
            config.remoteUrl
        }/api/services/app/Account/BackToImpersonator`;
        var rs = await AjaxHelper.post(url);
        return rs.result;
    }

    async sendEmailActivationLink(input) {
        var url = `${
            config.remoteUrl
        }/api/services/app/Account/SendEmailActivationLink`;
        var rs = await AjaxHelper.post(url, input);
        return rs;
    }

    async activateEmail(input) {
        var url = `${config.remoteUrl}/api/services/app/Account/ActivateEmail`;
        var rs = await AjaxHelper.post(url, input);
        return rs;
    }

    async switchToLinkedAccount(input) {
        var url = `${
            config.remoteUrl
        }/api/services/app/Account/SwitchToLinkedAccount`;
        var rs = await AjaxHelper.post(url, input);
        return rs.result;
    }
}

export default new AccountService();
