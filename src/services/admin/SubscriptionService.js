import config from '../../common/config';
import AjaxHelper from '../../common/js/AjaxHelper';
class SubscriptionService {
    async upgradeTenantToEquivalentEdition(input) {
        let url = `${config.remoteUrl}/api/services/app/Subscription/UpgradeTenantToEquivalentEdition`;
        var rs = await AjaxHelper.post(url, input);
        return rs.result;
    }
}
export default new SubscriptionService();
