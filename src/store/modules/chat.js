import * as types from '../mutation-types';
import ChatService from '../../services/admin/ChatService';

const state = {
    friends: null,
    serverTime: null,
    selectedUser: null,
    isOpen: false,
    loadingPreviousUserMessages: false
};

const getters = {
    friends: state => state.friends,
    serverTime: state => state.serverTime,
    selectedUser: state => state.selectedUser,
    isOpen: state => state.isOpen
};

const mutations = {
    [types.CHAT_SET_USER_CHAT_FRIENDS_SETTINGS](state, { data }) {
        state.friends = data.friends;
        state.serverTime = data.serverTime;
    },
    [types.CHAT_SET_FRIENDS](state, { friends }) {
        state.friends = friends;
    },
    [types.CHAT_SELECTED_USER](state, { selectedUser }) {
        state.selectedUser = selectedUser;
    },
    [types.CHAT_SET_OPEN](state, { isOpen }) {
        state.isOpen = isOpen;
    },
    [types.CHAT_LOAD_PREVIOUS_USER_MESSAGES](
        state,
        { loadingPreviousUserMessages }
    ) {
        state.loadingPreviousUserMessages = loadingPreviousUserMessages;
    }
};

const actions = {
    getUserChatFriendsWithSettings(store) {
        ChatService.getUserChatFriendsWithSettings().then(result => {
            let rs = result;
            store.commit(types.CHAT_SET_USER_CHAT_FRIENDS_SETTINGS, {
                data: rs
            });
        });
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};
