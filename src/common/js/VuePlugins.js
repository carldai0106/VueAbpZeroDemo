import config from '../config';
let appLocalizationSource = abp.localization.getSource(
    config.defaultLocalizationSourceName
);

let translate = function(...args) {
    return appLocalizationSource(...args);
};

window.lang = translate;
window.L = window.lang;

export default {
    install: function(Vue, options) {
        Vue.mixin({
            mounted() {
                Waves.init();
                // if ($.fn.layout) {
                //     $('html, body, .wrapper, .content-wrapper').layout();
                // }
            },
            methods: {
                L(...args) {
                    return translate(...args);
                },
                isGranted(permissionName) {
                    return abp.auth.isGranted(permissionName);
                },
                isGrantedAny(...permissions) {
                    if (!permissions) {
                        return false;
                    }

                    for (const permission of permissions) {
                        if (this.isGranted(permission)) {
                            return true;
                        }
                    }

                    return false;
                },
                spaceToBr(ce, text, indexs) {
                    if (!(indexs instanceof Array)) {
                        indexs = [indexs];
                    }
                    var source = text;
                    var arr = source.split(' ');
                    var newArray = [];
                    for (var i = 0; i < arr.length; i++) {
                        var isBr = false;
                        for (var j = 0; j < indexs.length; j++) {
                            if (i === indexs[j] - 1) {
                                newArray.push(arr[i]);
                                newArray.push(ce('br'));
                                isBr = true;
                            }
                        }
                        if (!isBr) {
                            newArray.push(arr[i]);
                        }
                    }
                    return ce('span', newArray);
                },
                tagIsReady(selector, callback) {
                    var count = 0;
                    var interval = setInterval(function() {
                        var length = 0;
                        if (
                            typeof selector == 'string' &&
                            selector.constructor == String
                        ) {
                            length = document.querySelectorAll(selector).length;
                        } else {
                            length = selector.length;
                        }

                        if (length > 0) {
                            clearInterval(interval);
                            callback();
                        }
                        count++;
                        if (count >= 50) {
                            clearInterval(interval);
                            throw String(
                                'Not found this element by selector : ' +
                                    selector
                            );
                        }
                    }, 100);
                }
            }
        });
    }
};
