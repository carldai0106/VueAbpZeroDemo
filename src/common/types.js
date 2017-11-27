class AppTimezoneScope {
    static Application = 1;
    static Tenant = 2;
    static User = 4;
}

class AppTenantAvailabilityState {
    static Available = 1;
    static InActive = 2;
    static NotFound = 3;
}

class SubscriptionStartType {
    static Free = 1;
    static Trial = 2;
    static Paid = 3;
}

class EditionPaymentType {
    static NewRegistration = 0;
    static BuyNow = 1;
    static Upgrade = 2;
    static Extend = 3;
}

class PaymentPeriodType {
    static Monthly = 30;
    static Annual = 365;
}

class SubscriptionPaymentGatewayType {
    static Paypal = 1;
}

class AppChatMessageReadState {
    static Unread = 1;
    static Read = 2;
}

class AppChatSide {
    static Sender = 1;
    static Receiver = 2;
}

class AppFriendshipState {
    static Accepted = 1;
    static Blocked = 2;
}

export default {
    AppTimezoneScope,
    AppTenantAvailabilityState,
    SubscriptionStartType,
    EditionPaymentType,
    PaymentPeriodType,
    SubscriptionPaymentGatewayType,
    AppChatMessageReadState,
    AppChatSide,
    AppFriendshipState
};
