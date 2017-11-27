import Vue from 'vue';
import moment from 'moment';

Vue.filter('DateTimeFormat', function(value, formatter) {
    if (!formatter) formatter = 'LLL';
    if (!value) return '';
    return moment(value).format(formatter);
});

Vue.filter('flag', function(value) {
    // famfamfam-flags
    if (!value) return;
    var rs = value;
    if (value.indexOf('famfamfam-') >= 0) {
        rs = value.replace('famfamfam-', '');
    }
    if (rs.indexOf('flags') >= 0) {
        rs = rs.replace('flags', 'flag');
    }

    return rs;
});

Vue.filter('currency', function(value, decimal) {
    if (!value) return value;
    var rs = value.toFixed(decimal);
    return rs;
});
