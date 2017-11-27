import * as moment from 'moment';
import store from '../store/index';
import localize from '../common/js/localize';
import config from '../common/config';
import SessionService from './common/SessionService';
import AbpScriptHelper from '../common/js/AbpScriptHelper';

function getCurrentClockProvider(currentProviderName) {
    if (currentProviderName === 'unspecifiedClockProvider') {
        return abp.timing.unspecifiedClockProvider;
    }

    if (currentProviderName === 'utcClockProvider') {
        return abp.timing.utcClockProvider;
    }

    return abp.timing.localClockProvider;
}

function init(userCfg, session) {
    $.extend(true, abp, userCfg.result);
    var name = abp.localization.currentLanguage.name;

    abp.clock.provider = getCurrentClockProvider(userCfg.result.clock.provider);
    moment.locale(name);
    console.log(moment);
    if (window.moment) {
        window.moment.locale(name);
    }

    if (abp.clock.provider.supportsMultipleTimezone) {
        moment.tz.setDefault(abp.timing.timeZoneInfo.iana.timeZoneId);
        if (window.moment) {
            window.moment.tz.setDefault(
                abp.timing.timeZoneInfo.iana.timeZoneId
            );
        }
    }

    var source = localize[name];
    var sourceName = config.defaultLocalizationSourceName;
    $.extend(true, abp.localization.values[sourceName], source);

    // 设置session
    store.dispatch('getSession');

    // 该事件一定要在语言初始化后调用
    abp.event.trigger('abp.dynamicScriptsInitialized');

    if (session.tenant && session.tenant.customCssId) {
        $('#TenantCustomCss').remove();
        $('head').append(
            '<link id="TenantCustomCss" href="' +
                config.remoteUrl +
                '/TenantCustomization/GetCustomCss?id=' +
                session.tenant.customCssId +
                '" rel="stylesheet"/>'
        );
    }

    let langElement = require(`element-ui/lib/locale/lang/${name}`).default;
    let localeElement = require('element-ui/lib/locale').default;
    localeElement.use(langElement);
}

class RefreshService {
    /**
     * 预加载配置，整个Vue开始之前调用,
     * 全局刷新页面也会调用该方法，因为刷新的整个生命周期是从main.js中开始的。
     * 而且Token已经保存在内存中，会自动附在header中发送。
     *
     * @param {any} 用户配置
     * @param {any} session
     * @memberof RefreshService
     */
    preloadInit(userCfg, session) {
        init(userCfg, session);
    }

    /**
     * 登录后再初始化一次配置，因为用户权限会发生改变
     *
     * @memberof RefreshService
     */
    async loginedInit() {
        var userCfg = await AbpScriptHelper.getAbpUserCfg();
        var session = await SessionService.init();
        init(userCfg, session);
    }
}

export default new RefreshService();
