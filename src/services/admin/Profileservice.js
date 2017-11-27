import config from '../../common/config';
import AjaxHelper from '../../common/js/AjaxHelper';
class ProfileService {
    async getPasswordComplexitySetting() {
        var rs = await AjaxHelper.get(
            `${config.remoteUrl}/api/services/app/Profile/GetPasswordComplexitySetting`
        );
        return rs.result;
    }

    async getProfilePictureById(input) {
        var url = `${config.remoteUrl}/api/services/app/Profile/GetProfilePictureById`;
        var rs = await AjaxHelper.get(url, input);
        return rs.result;
    }

    async getCurrentUserProfileForEdit() {
        var url = `${config.remoteUrl}/api/services/app/Profile/GetCurrentUserProfileForEdit`;
        var rs = await AjaxHelper.get(url);
        return rs.result;
    }

    async updateGoogleAuthenticatorKey() {
        var url = `${config.remoteUrl}/api/services/app/Profile/UpdateGoogleAuthenticatorKey`;
        var rs = await AjaxHelper.put(url);
        return rs.result;
    }

    async sendVerificationSms() {
        var url = `${config.remoteUrl}/api/services/app/Profile/SendVerificationSms`;
        var rs = await AjaxHelper.post(url);
        return rs;
    }

    async verifySmsCode(input) {
        var url = `${config.remoteUrl}/api/services/app/Profile/VerifySmsCode`;
        var rs = await AjaxHelper.post(url, input);
        return rs;
    }

    async updateCurrentUserProfile(input) {
        var url = `${config.remoteUrl}/api/services/app/Profile/UpdateCurrentUserProfile`;
        var rs = await AjaxHelper.put(url, input);
        return rs;
    }

    async changePassword(input) {
        var url = `${config.remoteUrl}/api/services/app/Profile/ChangePassword`;
        var rs = await AjaxHelper.post(url, input);
        return rs;
    }

    async updateProfilePicture(input) {
        var url = `${config.remoteUrl}/api/services/app/Profile/UpdateProfilePicture`;
        var rs = await AjaxHelper.put(url, input);
        return rs;
    }

    async getProfilePicture() {
        var url = `${config.remoteUrl}/api/services/app/Profile/GetProfilePicture`;
        var rs = await AjaxHelper.get(url);
        return rs.result;
    }

    async getFriendProfilePictureById(input) {
        var url = `${config.remoteUrl}/api/services/app/Profile/GetFriendProfilePictureById`;
        var rs = await AjaxHelper.get(url, input);
        return rs.result;
    }

    async changeLanguage(input) {
        var url = `${config.remoteUrl}/api/services/app/Profile/ChangeLanguage`;
        var rs = await AjaxHelper.post(url, input);
        return rs;
    }
}

export default new ProfileService();
