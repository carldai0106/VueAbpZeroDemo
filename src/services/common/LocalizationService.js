class LocalizationService {
    get languages() {
        return abp.localization.languages;
    }

    get currentLanguage() {
        return abp.localization.currentLanguage;
    }

    localize(key, sourceName) {
        return abp.localization.localize(key, sourceName);
    }

    getSource(sourceName) {
        return abp.localization.getSource(sourceName);
    }
}

export default new LocalizationService();
