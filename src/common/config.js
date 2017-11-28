/**
 *  配置入口类
 *
 * @class Config
 */
class Config {
    constructor() {
        // 从 webpack中配置的调式模式
        this.isDebug = process && process.isDebug;
        this.AccessTokenKey = 'Abp.AuthToken';
        this.EncryptedAccessTokenKey = 'enc_auth_token';
        this.TwoFactorRememberClientTokenKey = 'TwoFactorRememberClientToken';
        // 远程webpai 访问地址
        // this.remoteUrl = 'http://localhost:5000';
        this.remoteUrl = 'http://test-56955.demo.aspnetzero.com';
        // 本地 访问地址
        this.baseUrl = 'http://localhost:8088';
        this.defaultPageSize = 10;
        this.tenancyNamePlaceHolderInUrl = '{TENANCY_NAME}';
        // this.defaultLocalizationSourceName = 'Auth';
        this.defaultLocalizationSourceName = 'AspNetZeroDemo';
        this.defaultAdminUserName = 'admin';
        // 当你模拟某个角色或者用户登录后的中转url片段
        this.signInAsSomeoneUrlSegment = 'views/transfer';
    }
}

export default new Config();
