import * as types from '../mutation-types';

const state = {
    addedMembers: null,
    removedMember: null
};

const getters = {
    addedMembers: state => state.addedMembers,
    removedMember: state => state.removedMember
};

const actions = {
    SetAddedMembers(store, { members }) {
        store.commit(types.IndexSetAddedMembers, { members });
    },
    SetRemovedMember(store, { member }) {
        store.commit(types.IndexSetRemovedMember, { member });
    }
};

const mutations = {
    [types.IndexSetAddedMembers](state, { members }) {
        state.addedMembers = members;
    },
    [types.IndexSetRemovedMember](state, { member }) {
        state.removedMember = member;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};
