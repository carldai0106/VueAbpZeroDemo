import MessageHelper from '../MessageHelper';

class AbpHttpCfg {
    defaultError = {
        message: 'An error has occurred!',
        details: 'Error details were not sent by server.'
    };

    defaultError401 = {
        message: 'You are not authenticated!',
        details:
            'You should be authenticated (sign in) in order to perform this operation.'
    };

    defaultError403 = {
        message: 'You are not authorized!',
        details: 'You are not allowed to perform this operation.'
    };

    defaultError404 = {
        message: 'Resource not found!',
        details: 'The resource requested could not be found on the server.'
    };

    logError(error) {
        abp.log.error(error);
    }

    showError(error) {
        if (error.details) {
            MessageHelper.error(
                error.message || this.defaultError.message,
                error.details
            );
        } else {
            MessageHelper.error(
                null,
                error.message || this.defaultError.message
            );
        }
    }

    handleTargetUrl(targetUrl) {
        if (!targetUrl) {
            location.href = '/';
        } else {
            location.href = targetUrl;
        }
    }

    handleUnAuthorizedRequest(messagePromise, targetUrl) {
        const self = this;

        if (messagePromise) {
            messagePromise.done(() => {
                this.handleTargetUrl(targetUrl || '/');
            });
        } else {
            self.handleTargetUrl(targetUrl || '/');
        }
    }

    handleNonAbpErrorResponse(response) {
        const self = this;

        switch (response.status) {
            case 401:
                self.handleUnAuthorizedRequest(
                    self.showError(self.defaultError401),
                    '/'
                );
                break;
            case 403:
                self.showError(self.defaultError403);
                break;
            case 404:
                self.showError(self.defaultError404);
                break;
            default:
                self.showError(self.defaultError);
                break;
        }
    }

    handleAbpResponse(response, ajaxResponse) {
        var url = '';
        if (response.config) {
            url = response.config.url;
        } else {
            url = response.request.responseURL;
        }
        var newResponse = {
            url: url,
            body: ajaxResponse,
            headers: response.headers,
            status: response.status,
            statusText: response.statusText
            // type: response.type
        };

        if (ajaxResponse.success) {
            newResponse.body = ajaxResponse.result;

            if (ajaxResponse.targetUrl) {
                this.handleTargetUrl(ajaxResponse.targetUrl);
            }
        } else {
            if (!ajaxResponse.error) {
                ajaxResponse.error = this.defaultError;
            }

            this.logError(ajaxResponse.error);
            this.showError(ajaxResponse.error);

            if (response.status === 401) {
                this.handleUnAuthorizedRequest(null, ajaxResponse.targetUrl);
            }
        }

        return ajaxResponse;
        // return new Response(ajaxResponse, newResponse);
    }

    getAbpAjaxResponseOrNull(response) {
        if (!response || !response.headers) {
            return null;
        }

        var contentType =
            response.headers['Content-Type'] ||
            response.headers['content-type'];
        if (!contentType) {
            abp.log.warn('Content-Type is not sent!');
            return null;
        }

        if (contentType.indexOf('application/json') < 0) {
            abp.log.warn(
                'Content-Type is not application/json: ' + contentType
            );
            return null;
        }

        var responseObj = response.data;
        if (!responseObj.__abp) {
            return null;
        }

        return responseObj;
    }

    handleResponse(response) {
        var ajaxResponse = this.getAbpAjaxResponseOrNull(response);
        if (ajaxResponse == null) {
            return response;
        }

        return this.handleAbpResponse(response, ajaxResponse);
    }

    handleError(error) {
        var ajaxResponse = this.getAbpAjaxResponseOrNull(error);
        if (ajaxResponse != null) {
            this.handleAbpResponse(error, ajaxResponse);
            throw ajaxResponse.error;
        } else {
            this.handleNonAbpErrorResponse(error);
            throw String(
                'HTTP error: ' + error.status + ', ' + error.statusText
            );
        }
    }
}

export default new AbpHttpCfg();
