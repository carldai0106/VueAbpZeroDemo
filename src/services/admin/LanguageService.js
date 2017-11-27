import config from '../../common/config';
import AjaxHelper from '../../common/js/AjaxHelper';
class LanguageService {
    async getLanguages() {
        let url = `${config.remoteUrl}/api/services/app/Language/GetLanguages`;
        var rs = await AjaxHelper.get(url);
        return rs.result;
    }

    async getLanguageForEdit(input) {
        let url = `${config.remoteUrl}/api/services/app/Language/GetLanguageForEdit`;
        var rs = await AjaxHelper.get(url, input);
        return rs.result;
    }

    async createOrUpdateLanguage(input) {
        let url = `${config.remoteUrl}/api/services/app/Language/CreateOrUpdateLanguage`;
        var rs = await AjaxHelper.post(url, input);
        return rs.result;
    }

    async deleteLanguage(input) {
        let url = `${config.remoteUrl}/api/services/app/Language/DeleteLanguage`;
        var rs = await AjaxHelper.delete(url, input);
        return rs.result;
    }

    async setDefaultLanguage(input) {
        let url = `${config.remoteUrl}/api/services/app/Language/SetDefaultLanguage`;
        var rs = await AjaxHelper.post(url, input);
        return rs.result;
    }

    async getLanguageTexts(input) {
        let url = `${config.remoteUrl}/api/services/app/Language/GetLanguageTexts`;
        var rs = await AjaxHelper.get(url, input);
        return rs.result;
    }

    async updateLanguageText(input) {
        let url = `${config.remoteUrl}/api/services/app/Language/UpdateLanguageText`;
        var rs = await AjaxHelper.put(url, input);
        return rs.result;
    }
}

export default new LanguageService();
