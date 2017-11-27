import config from '../../common/config';
import AjaxHelper from '../../common/js/AjaxHelper';
class EditionService {
    async getEditions() {
        let url = `${config.remoteUrl}/api/services/app/Edition/GetEditions`;
        var rs = await AjaxHelper.get(url);
        return rs;
    }

    async getEditionComboboxItems(params) {
        let url = `${config.remoteUrl}/api/services/app/Edition/GetEditionComboboxItems`;
        var rs = await AjaxHelper.get(url, params);
        return rs;
    }

    async getEditionForEdit(input) {
        let url = `${config.remoteUrl}/api/services/app/Edition/GetEditionForEdit`;
        var rs = await AjaxHelper.get(url, input);
        return rs.result;
    }

    async createOrUpdateEdition(input) {
        let url = `${config.remoteUrl}/api/services/app/Edition/CreateOrUpdateEdition`;
        var rs = await AjaxHelper.post(url, input);
        return rs;
    }

    async deleteEdition(input) {
        let url = `${config.remoteUrl}/api/services/app/Edition/DeleteEdition`;
        var rs = await AjaxHelper.delete(url, input);
        return rs;
    }
}

export default new EditionService();
