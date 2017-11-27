class Config {
    constructor() {
        this.isDebug = process && process.isDebug;
        this.AccessTokenKey = 'Abp.AuthToken';
        this.EncryptedAccessTokenKey = 'enc_auth_token';
        this.TwoFactorRememberClientTokenKey = 'TwoFactorRememberClientToken';
        // this.remoteUrl = 'http://localhost:5000';
        this.remoteUrl = 'http://test-56955.demo.aspnetzero.com';
        this.baseUrl = 'http://localhost:8088';
        this.defaultPageSize = 10;
        this.tenancyNamePlaceHolderInUrl = '{TENANCY_NAME}';
        // this.defaultLocalizationSourceName = 'Auth';
        this.defaultLocalizationSourceName = 'AspNetZeroDemo';
        this.defaultAdminUserName = 'admin';
        this.signInAsSomeoneUrlSegment = 'views/transfer';
    }
}

export default new Config();
