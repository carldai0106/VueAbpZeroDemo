import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import createLogger from 'vuex/dist/logger';
import config from '../common/config';
import session from './modules/session';
import sidebar from './modules/sidebar';
import organization from './modules/organization';
import chat from './modules/chat';

Vue.use(Vuex);

var plugins = config.isDebug ? [createLogger()] : [];

plugins.push(createPersistedState());

/*
    写于对vuex的理解 by carl

    vuex 调用顺序
    一般来说 外部调用 action，然后action 调用mutation，最后mutation 设置状态。
    外部不可以修改vuex的状态，只有通过 mutation来维护状态。
    action调用mutation适合于我们需要在action写异步获取数据，例如ajax调用。
    当然也可以直接调用mutation。

    什么时候适合使用vuex，当多个组件需要获取同一个变量信息的时候。
    使用事件总线，或者事件回调，虽然也可以实现，但是，这个实现比用vuex来说更复杂。
*/

const store = new Vuex.Store({
    modules: {
        session,
        sidebar,
        organization,
        chat
    },
    // state: {
    //     activedMenu: null
    // },
    // mutations: {
    //     IndexSetActiveMenu(state, { menu }) {
    //         state.activedMenu = menu;
    //     }
    // },
    // state: {
    //     isReload: false
    // },
    // mutations: {
    //     IndexReloadContent(state, { isReload }) {
    //         state.isReload = isReload;
    //     }
    // },
    // strict: config.isDebug,
    strict: false,
    plugins: plugins
});

export default store;
