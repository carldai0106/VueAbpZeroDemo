import config from '../../common/config';
import AjaxHelper from '../../common/js/AjaxHelper';
class InvoiceService {
    async getInvoiceInfo(input) {
        var url = `${config.remoteUrl}/api/services/app/Invoice/GetInvoiceInfo`;
        var rs = await AjaxHelper.get(url, input);
        return rs.result;
    }

    async createInvoice(input) {
        var url = `${config.remoteUrl}/api/services/app/Invoice/CreateInvoice`;
        var rs = await AjaxHelper.post(url, input);
        return rs;
    }
}
export default new InvoiceService();
