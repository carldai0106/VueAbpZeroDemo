class ChatSignalrService {
    constructor() {
        this.chatHub = null;
    }

    sendMessage(messageData, callback) {
        if ($.connection.hub.state !== $.signalR.connectionState.connected) {
            if (callback) {
                callback();
            }
            abp.notify.warn(window.L('ChatIsNotConnectedWarning'));
            return;
        }

        this.chatHub.server
            .sendMessage(messageData)
            .done(result => {
                if (result) {
                    abp.notify.warn(result);
                }
            })
            .always(() => {
                if (callback) {
                    callback();
                }
            });
    }

    init() {
        this.chatHub = $.connection.chatHub;

        if (!this.chatHub) {
            return;
        }

        $.connection.hub.stateChanged(data => {
            if (data.newState === $.connection.connectionState.connected) {
                abp.event.trigger('app.chat.connected');
            }
        });

        this.chatHub.client.getChatMessage = message => {
            console.log('getChatMessage');
            console.log(message);
            abp.event.trigger('app.chat.messageReceived', message);
        };

        this.chatHub.client.getAllFriends = friends => {
            abp.event.trigger('abp.chat.friendListChanged', friends);
        };

        this.chatHub.client.getFriendshipRequest = (
            friendData,
            isOwnRequest
        ) => {
            abp.event.trigger(
                'app.chat.friendshipRequestReceived',
                friendData,
                isOwnRequest
            );
        };

        this.chatHub.client.getUserConnectNotification = (
            friend,
            isConnected
        ) => {
            abp.event.trigger('app.chat.userConnectionStateChanged', {
                friend: friend,
                isConnected: isConnected
            });
        };

        this.chatHub.client.getUserStateChange = (friend, state) => {
            abp.event.trigger('app.chat.userStateChanged', {
                friend: friend,
                state: state
            });
        };

        this.chatHub.client.getallUnreadMessagesOfUserRead = friend => {
            abp.event.trigger('app.chat.allUnreadMessagesOfUserRead', {
                friend: friend
            });
        };

        this.chatHub.client.getReadStateChange = friend => {
            abp.event.trigger('app.chat.readStateChange', {
                friend: friend
            });
        };
    }
}

export default new ChatSignalrService();
