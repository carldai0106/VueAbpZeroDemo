import axios from 'axios';
import AbpHttpCfg from '../../base/abp/AbpHttpCfg';
import CookieHelper from './CookieHelper';
import TokenHelper from './TokenHelper';

class AjaxHelper {
    addHeader(headers, key, value) {
        return (headers[key] = value);
    }

    hasHeader(headers, key) {
        for (var header in headers) {
            if (header == key) {
                return true;
            }
        }
        return false;
    }

    getAll(headers, key) {
        var list = [];
        for (var header in headers) {
            if (header == key) {
                list.push(headers[header]);
            }
        }
        return list;
    }

    normalizeRequestOptions(options) {
        if (!options.headers) {
            options.headers = {};
        }

        this.addHeader(options.headers, 'Pragma', 'no-cache');
        this.addHeader(options.headers, 'Cache-Control', 'no-cache');
        this.addHeader(
            options.headers,
            'Expires',
            'Sat, 01 Jan 2000 00:00:00 GMT'
        );

        this.addXRequestedWithHeader(options);
        this.addAuthorizationHeaders(options);
        this.addAspNetCoreCultureHeader(options);
        this.addAcceptLanguageHeader(options);
        this.addTenantIdHeader(options);
    }

    addXRequestedWithHeader(options) {
        if (options.headers) {
            this.addHeader(
                options.headers,
                'X-Requested-With',
                'XMLHttpRequest'
            );
        }
    }

    addAspNetCoreCultureHeader(options) {
        let cookieLangValue = CookieHelper.getCookieValue(
            'Abp.Localization.CultureName'
        );
        if (
            cookieLangValue &&
            options.headers &&
            !this.hasHeader(options.headers, '.AspNetCore.Culture')
        ) {
            this.addHeader(
                options.headers,
                '.AspNetCore.Culture',
                cookieLangValue
            );
        }
    }

    addAcceptLanguageHeader(options) {
        let cookieLangValue = CookieHelper.getCookieValue(
            'Abp.Localization.CultureName'
        );
        if (
            cookieLangValue &&
            options.headers &&
            !this.hasHeader(options.headers, 'Accept-Language')
        ) {
            this.addHeader(options.headers, 'Accept-Language', cookieLangValue);
        }
    }

    addTenantIdHeader(options) {
        let cookieTenantIdValue = CookieHelper.getCookieValue('Abp.TenantId');
        if (
            cookieTenantIdValue &&
            options.headers &&
            !this.hasHeader(options.headers, 'Abp.TenantId')
        ) {
            this.addHeader(
                options.headers,
                'Abp.TenantId',
                cookieTenantIdValue
            );
        }
    }

    addAuthorizationHeaders(options) {
        let authorizationHeaders = options.headers
            ? this.getAll(options.headers, 'Authorization')
            : null;
        if (!authorizationHeaders) {
            authorizationHeaders = [];
        }

        var length = authorizationHeaders.length;
        var hasBearer = false;
        for (var i = 0; i < length; i++) {
            var item = authorizationHeaders[i];
            if (item.indexOf('Bearer ') == 0) {
                hasBearer = true;
                break;
            }
        }

        if (!hasBearer) {
            let token = TokenHelper.getAccessToken();
            if (options.headers && token) {
                this.addHeader(
                    options.headers,
                    'Authorization',
                    'Bearer ' + token
                );
            }
        }
    }

    delete(url, params, settings) {
        let config = Object.assign(
            {},
            {
                method: 'delete'
            },
            settings
        );
        return this.request(url, params, config);
    }

    put(url, params, settings) {
        let config = Object.assign(
            {},
            {
                method: 'put'
            },
            settings
        );
        return this.request(url, params, config);
    }

    get(url, params, settings) {
        let config = Object.assign(
            {},
            {
                method: 'get'
            },
            settings
        );
        return this.request(url, params, config);
    }

    post(url, param, settings) {
        let config = Object.assign(
            {},
            {
                method: 'post'
            },
            settings
        );
        return this.request(url, param, config);
    }

    request(url, params, settings) {
        if (!settings) {
            settings = {};
        }
        this.normalizeRequestOptions(settings);

        let config = Object.assign(
            {},
            {
                url: url
            },
            settings
        );
        // `data` is the data to be sent as the request body
        // Only applicable for request methods 'PUT', 'POST', and 'PATCH'
        // When no `transformRequest` is set, must be of one of the following types:
        // - string, plain object, ArrayBuffer, ArrayBufferView, URLSearchParams
        // - Browser only: FormData, File, Blob
        // - Node only: Stream, Buffer
        var canUseDataMethod = ['PUT', 'POST', 'PATCH'];
        var hasUseDataMethod = false;
        canUseDataMethod.forEach(x => {
            if (x == config.method.toUpperCase()) {
                hasUseDataMethod = true;
                return true;
            }
        });

        if (hasUseDataMethod) {
            config.data = params;
        } else {
            config.params = params;
        }

        // console.log(config);
        return axios(config)
            .then(response => {
                var rs = AbpHttpCfg.handleResponse(response);
                return rs;
            })
            .catch(error => {
                AbpHttpCfg.handleError(error.response);
            });
    }
}

export default new AjaxHelper();
