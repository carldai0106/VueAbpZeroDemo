class UrlHelper {
  static initialUrl = location.href;

  static getQueryParameters() {
    return UrlHelper.getQueryParametersUsingParameters(document.location.search);
  }

  static getQueryParametersUsingParameters(search) {
    return search.replace(/(^\?)/, '').split('&').map(function(n) {
        var s = n.split('=');
        this[s[0]] = s[1];
        return this;
    }.bind({}))[0];
  }

  static getInitialUrlParameters() {
    var questionMarkIndex = UrlHelper.initialUrl.indexOf('?');
    if (questionMarkIndex >= 0) {
      return UrlHelper.initialUrl.substr(questionMarkIndex, UrlHelper.initialUrl.length - questionMarkIndex);
    }

    return '';
  }

  static getReturnUrl() {
    const queryStringObj = UrlHelper.getQueryParametersUsingParameters(UrlHelper.getInitialUrlParameters());
    if (queryStringObj.returnUrl) {
      return decodeURIComponent(queryStringObj.returnUrl);
    }

    return null;
  }

  static getSingleSignIn() {
    const queryStringObj = UrlHelper.getQueryParametersUsingParameters(UrlHelper.getInitialUrlParameters());
    if (queryStringObj.ss) {
      return queryStringObj.ss;
    }

    return false;
  }
}

export default UrlHelper;
