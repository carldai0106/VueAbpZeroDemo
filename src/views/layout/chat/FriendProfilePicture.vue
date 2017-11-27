<template>
    <img :src="profilePicture" :class="clsName" alt="...">
</template>

<script type="text/ecmascript-6">
import config from '../../../common/config';
import ProfileService from '../../../services/admin/ProfileService';
export default {
    props: {
        profilePictureId: String,
        userId: Number,
        tenantid: Number,
        cssClass: String
    },
    data() {
        return {
            profileImageId: null,
            profilePicture: null,
            clsName: this.cssClass
        };
    },

    mounted() {
        this.profileImageId = this.profilePictureId;
        this.setProfileImage();
    },
    methods: {
        setProfileImage() {
            if (!this.profileImageId) {
                this.profileImageId = undefined;
            }

            if (!this.tenantId) {
                this.tenantId = undefined;
            }

            ProfileService.getFriendProfilePictureById({
                profilePictureId: this.profileImageId,
                userId: this.userId,
                tenantId: this.tenantId
            }).then(result => {
                if (result && result.profilePicture) {
                    this.profilePicture =
                        'data:image/jpeg;base64,' + result.profilePicture;
                } else {
                    this.profilePicture =
                        config.baseUrl + '/static/images/av1.png';
                }
            });
        }
    }
};
</script>
