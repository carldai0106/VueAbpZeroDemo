import config from '../config';
import AjaxHelper from './AjaxHelper';
import TokenHelper from './TokenHelper';

class AbpScriptHelper {
    loadJs(url) {
        let script = document.createElement('script');
        script.src = url;
        document.body.appendChild(script);
        return new Promise((resolve, reject) => {
            script.onload = function() {
                resolve(true);
            };

            script.onerror = function(e) {
                reject(e);
            };
        });
    }

    getAbpScripts() {
        return this.loadJs(
            `${config.remoteUrl}/AbpScripts/GetScripts?v=${Date.now()}`
        );
    }

    getAbpServiceProxies() {
        return this.loadJs(
            `${config.remoteUrl}/AbpServiceProxies/GetAll?type=jquery`
        );
    }

    initSignalR(callback) {
        jQuery.getScript(config.remoteUrl + '/signalr/hubs', () => {
            $.connection.hub.url = config.remoteUrl + '/signalr';
            const encryptedAuthToken = TokenHelper.getEncryptedAccessToken();
            $.connection.hub.qs = `${
                config.EncryptedAccessTokenKey
            }=${encodeURIComponent(encryptedAuthToken)}`;

            jQuery.getScript(config.baseUrl + '/static/abp/abp.signalr.js');
            callback();
        });
    }

    async getAbpUserCfg() {
        const cookieLangValue = abp.utils.getCookieValue(
            'Abp.Localization.CultureName'
        );
        var accessToken = TokenHelper.getAccessToken();
        var tentantId = abp.multiTenancy.getTenantIdCookie();
        var rs = await AjaxHelper.get(
            `${config.remoteUrl}/AbpUserConfiguration/GetAll`,
            null,
            {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + accessToken,
                    '.AspNetCore.Culture':
                        'c=' + cookieLangValue + '|uic=' + cookieLangValue,
                    'Abp.TenantId': tentantId
                }
            }
        );

        return rs;
    }
}

export default new AbpScriptHelper();
