import * as types from '../mutation-types';
import SessionService from '../../services/common/SessionService';
const state = {
    data: null,
    user: null,
    tenant: null,
    application: null
};

const getters = {
    data: state => state.data,
    user: state => state.data.user,
    tenant: state => state.data.tenant,
    application: state => state.data.application
};

const mutations = {
    [types.SESSION_SET_SESSION](state, { session }) {
        state.data = session;
        state.user = session.user;
        state.tenant = session.tenant;
        state.application = session.application;
    }
};

const actions = {
    getSession(store) {
        SessionService.getSession().then(rs => {
            let session = rs;
            store.commit(types.SESSION_SET_SESSION, { session });
        });
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};
