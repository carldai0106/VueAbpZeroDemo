// eslint-disable import/first */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
window.abp = window.abp || {};

import 'spin.js';
import 'block-ui';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';
import 'spin.js/jquery.spin.js';
import './vendor/abp/scripts/abp.js';
import 'jstree';
import 'jstree/dist/themes/default/style.min.css';
import './vendor/Waves/dist/waves.js';
import './vendor/Waves/dist/waves.css';
import 'animate.css';
import 'signalr';
import 'moment';
import 'moment-timezone';
import 'toastr/build/toastr.css';
import 'jquery-slimscroll';
import './vendor/abp/scripts/libs/abp.toastr.js';
import './vendor/AdminLTE/js/adminlte.js';

import axios from 'axios';
import Vue from 'vue';
import VueQuillEditor from 'vue-quill-editor';
import VeeValidate from 'vee-validate';
import Element from 'element-ui';
import ElementLocale from 'element-ui/lib/locale/lang/zh-CN';
import 'element-ui/lib/theme-chalk/index.css';
import VuePlugins from './common/js/VuePlugins';
import App from './App';
import AbpScriptHelper from './common/js/AbpScriptHelper';
import SessionService from './services/common/SessionService';
import PreloadService from './services/PreloadService';

Vue.use(Element, { ElementLocale });
Vue.use(VueQuillEditor);
Vue.use(VuePlugins);

const veeConfig = {
    fieldsBagName: 'vee-fields' // 默认为 fields
};
Vue.use(VeeValidate, veeConfig);
// 是否为产品模式
Vue.config.productionTip = false;
$.extend($.blockUI.defaults, {
    message: 'Loading',
    css: {
        zIndex: '1011',
        width: '30%',
        top: '54%',
        left: '35.2%',
        textAlign: 'center',
        fontSize: '16px',
        fontWeight: 'bold'
    },
    overlayCSS: {
        backgroundColor: '#AAA',
        opacity: 0.3,
        cursor: 'wait'
    }
});

$.blockUI();
$('body').spin();

axios
    .all([AbpScriptHelper.getAbpUserCfg(), SessionService.init()])
    .then(
        axios.spread((userCfg, session) => {
            console.log('start.......');
            PreloadService.preloadInit(userCfg, session);

            $.unblockUI();
            $('body').spin(false);

            let router = require('./router').default;

            /* eslint-disable no-new */
            new Vue({
                el: '#app',
                router,
                template: '<App/>',
                components: {
                    App
                },
                mounted() {},
                methods: {}
            });
        })
    )
    .catch(() => {
        $.unblockUI();
        $('body').spin(false);
        window.location.href = '/';
    });
