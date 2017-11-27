import config from '../config';
import FormattedStringValueExtracter from './FormattedStringValueExtracter';

class SubdomainTenancyNameFinder {
    getCurrentTenancyNameOrNull(rootAddress) {
        if (rootAddress.indexOf(config.tenancyNamePlaceHolderInUrl) < 0) {
            // Web site does not support subdomain tenant name
            return null;
        }

        const currentRootAddress = document.location.href;

        const formattedStringValueExtracter = FormattedStringValueExtracter;
        const values = formattedStringValueExtracter.IsMatch(
            currentRootAddress,
            rootAddress
        );
        if (!values.length) {
            return null;
        }

        return values[0];
    }
}

export default new SubdomainTenancyNameFinder();
