import config from '../config';
import CookieHelper from './CookieHelper';

class TokenHelper {
    setToken(tokenKey, tokenValue, expireDate) {
        let tokenJSON = {
            token: tokenValue,
            expireTime: expireDate
        };

        localStorage.setItem(tokenKey, JSON.stringify(tokenJSON));
        // 兼容abp cookie
        CookieHelper.setCookieValue(
            tokenKey,
            tokenValue,
            expireDate,
            abp.appPath
        );
    }

    getToken(tokenKey) {
        let strToken = localStorage.getItem(tokenKey);
        if (!strToken) return null;
        let tokenJSON = JSON.parse(strToken);
        if (tokenJSON.expireTime <= Date.now()) return null;

        return tokenJSON.token;
    }

    removeToken(tokenKey) {
        localStorage.removeItem(tokenKey);
        abp.utils.setCookieValue(tokenKey, null);
        CookieHelper.deleteCookie(tokenKey, abp.appPath);
    }

    setAccessToken(accessToken, expireDate) {
        let tokenJSON = {
            token: accessToken,
            expireTime: expireDate
        };

        // 为了适配旧模式
        // abp.auth.setToken(accessToken, expireDate);
        CookieHelper.setCookieValue(
            config.AccessTokenKey,
            accessToken,
            expireDate,
            abp.appPath
        );
        localStorage.setItem(config.AccessTokenKey, JSON.stringify(tokenJSON));
    }

    getAccessToken() {
        let strToken = localStorage.getItem(config.AccessTokenKey);
        if (!strToken) return null;
        let tokenJSON = JSON.parse(strToken);
        if (tokenJSON.expireTime <= Date.now()) return null;

        return tokenJSON.token;
    }

    removeAccessToken() {
        localStorage.removeItem(config.AccessTokenKey);
        CookieHelper.deleteCookie(config.AccessTokenKey, abp.appPath);
        abp.auth.setToken();
    }

    setEncryptedAccessToken(encryptedAccessToken, expireDate) {
        let tokenJSON = {
            token: encryptedAccessToken,
            expireTime: expireDate
        };
        localStorage.setItem(
            config.EncryptedAccessTokenKey,
            JSON.stringify(tokenJSON)
        );
        // 兼容cookie
        CookieHelper.setCookieValue(
            config.EncryptedAccessTokenKey,
            encryptedAccessToken,
            expireDate,
            abp.appPath
        );
    }

    getEncryptedAccessToken() {
        let strToken = localStorage.getItem(config.EncryptedAccessTokenKey);
        if (!strToken) return null;
        let tokenJSON = JSON.parse(strToken);
        if (tokenJSON.expireTime <= Date.now()) return null;

        return tokenJSON.token;
    }

    removeEncryptedAccessToken() {
        localStorage.removeItem(config.EncryptedAccessTokenKey);
        CookieHelper.deleteCookie(config.EncryptedAccessTokenKey, abp.appPath);
        abp.utils.setCookieValue(config.EncryptedAccessTokenKey, null);
    }
}

export default new TokenHelper();
