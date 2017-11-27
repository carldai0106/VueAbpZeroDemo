import config from '../../common/config';
import TokenHelper from '../../common/js/TokenHelper';
import store from '../../store/index';
import * as types from '../../store/mutation-types';
class AppAuthService {
    logout(reload, returnUrl) {
        var menu = null;
        store.commit(types.IndexSetActiveMenu, { menu });
        abp.auth.clearToken();
        TokenHelper.removeAccessToken();
        TokenHelper.removeEncryptedAccessToken();
        if (reload !== false) {
            if (returnUrl) {
                location.href = returnUrl;
            } else {
                location.href = config.baseUrl;
            }
        }
    }
}

export default new AppAuthService();
