class CookieHelper {
    getCookieValue(key) {
        return abp.utils.getCookieValue(key);
    }

    setCookieValue(key, value, expireDate, path) {
        abp.utils.setCookieValue(key, value, expireDate, path);
    }

    deleteCookie(key, path) {
        abp.utils.deleteCookie(key, path);
    }
}

export default new CookieHelper();
