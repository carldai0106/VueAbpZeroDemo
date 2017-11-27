import config from '../../common/config';
import AjaxHelper from '../../common/js/AjaxHelper';
class CacheService {
    async getAllCaches() {
        let url = `${config.remoteUrl}/api/services/app/Caching/GetAllCaches`;
        var rs = await AjaxHelper.get(url);
        return rs.result;
    }

    async clearCache(input) {
        let url = `${config.remoteUrl}/api/services/app/Caching/ClearCache`;
        var rs = await AjaxHelper.post(url, input);
        return rs;
    }

    async clearAllCaches() {
        let url = `${config.remoteUrl}/api/services/app/Caching/ClearAllCaches`;
        var rs = await AjaxHelper.post(url);
        return rs;
    }
}

export default new CacheService();
