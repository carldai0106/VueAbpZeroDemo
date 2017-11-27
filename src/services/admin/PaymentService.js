import config from '../../common/config';
import AjaxHelper from '../../common/js/AjaxHelper';
class PaymentService {
    async getPaymentInfo(input) {
        var url = `${config.remoteUrl}/api/services/app/Payment/GetPaymentInfo`;
        var rs = await AjaxHelper.get(url, input);
        return rs.result;
    }

    async createPayment(input) {
        var url = `${config.remoteUrl}/api/services/app/Payment/CreatePayment`;
        var rs = await AjaxHelper.post(url, input);
        return rs;
    }

    async executePayment(input) {
        var url = `${config.remoteUrl}/api/services/app/Payment/ExecutePayment`;
        var rs = await AjaxHelper.post(url, input);
        return rs;
    }

    async getPaymentHistory(input) {
        var url = `${config.remoteUrl}/api/services/app/Payment/GetPaymentHistory`;
        var rs = await AjaxHelper.get(url, input);
        return rs.result;
    }
}
export default new PaymentService();
