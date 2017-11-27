import * as types from '../mutation-types';

const state = {
    activedMenu: null
};

const getters = {
    activedMenu: state => state.activedMenu
};

const mutations = {
    [types.IndexSetActiveMenu](state, { menu }) {
        state.activedMenu = menu;
    }
};

const actions = {
    SetActiveMenu(store, { menu }) {
        store.commit(types.IndexSetActiveMenu, { menu });
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};
