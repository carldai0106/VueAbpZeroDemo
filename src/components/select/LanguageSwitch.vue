<template>
    <div v-if="languages.length > 1" class="lang-selector f32">
        <a v-for="(language, index) of languages" :key="index" @click="changeLanguage(language)">
            <span class="language-icon" :class="{'language-icon-current': language.name==currentLanguage.name}" :title="language.displayName">
                <i :class="language.icon|flag"></i>
            </span>
        </a>
    </div>
</template>

<script type="text/ecmascript-6">
import * as _ from 'lodash';
import LocalizationService from '../../services/common/LocalizationService';
export default {
    data() {
        return {
            languages: {},
            currentLanguage: null
        };
    },
    created() {
        this.languages = _.filter(
            LocalizationService.languages,
            x => x.isDisabled === false
        );
        this.currentLanguage = LocalizationService.currentLanguage;
    },
    methods: {
        changeLanguage(language) {
            abp.utils.setCookieValue(
                'Abp.Localization.CultureName',
                language.name,
                new Date(new Date().getTime() + 5 * 365 * 86400000), // 5 year
                abp.appPath
            );

            location.reload();
        }
    }
};
</script>

<style lang="scss" rel="stylesheet/scss">

</style>