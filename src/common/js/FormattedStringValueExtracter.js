export class FormatStringTokenType {
    constructor() {
        this.ConstantText = 0;
        this.DynamicValue = 1;
    }
}

export class FormatStringTokenizer {
    Tokenize(format, includeBracketsForDynamicValues) {
        const tokens = [];

        let currentText = '';
        let inDynamicValue = false;

        for (let i = 0; i < format.length; i++) {
            const c = format[i];
            switch (c) {
                case '{':
                    if (inDynamicValue) {
                        throw new Error(
                            'Incorrect syntax at char ' +
                                i +
                                '! format string can not contain nested dynamic value expression!'
                        );
                    }

                    inDynamicValue = true;

                    if (currentText.length > 0) {
                        tokens.push({
                            Text: currentText,
                            Type: FormatStringTokenType.ConstantText
                        });
                        currentText = '';
                    }

                    break;
                case '}':
                    if (!inDynamicValue) {
                        throw new Error(
                            'Incorrect syntax at char ' +
                                i +
                                '! These is no opening brackets for the closing bracket }.'
                        );
                    }

                    inDynamicValue = false;

                    if (currentText.length <= 0) {
                        throw new Error(
                            'Incorrect syntax at char ' +
                                i +
                                '! Brackets does not containt any chars.'
                        );
                    }

                    let dynamicValue = currentText;
                    if (includeBracketsForDynamicValues) {
                        dynamicValue = '{' + dynamicValue + '}';
                    }
                    tokens.push({
                        Text: dynamicValue,
                        Type: FormatStringTokenType.DynamicValue
                    });

                    currentText = '';

                    break;
                default:
                    currentText += c;
                    break;
            }
        }

        if (inDynamicValue) {
            throw new Error('There is no closing } char for an opened { char.');
        }

        if (currentText.length > 0) {
            tokens.push({
                Text: currentText,
                Type: FormatStringTokenType.ConstantText
            });
        }

        return tokens;
    }
}

class FormattedStringValueExtracter {
    Extract(str, format) {
        if (str === format) {
            return {
                IsMatch: true,
                Matches: []
            };
        }

        const formatTokens = new FormatStringTokenizer().Tokenize(format);
        if (!formatTokens) {
            return {
                IsMatch: str === '',
                Matches: []
            };
        }

        const result = {
            IsMatch: true,
            Matches: []
        };

        for (let i = 0; i < formatTokens.length; i++) {
            const currentToken = formatTokens[i];
            const previousToken = i > 0 ? formatTokens[i - 1] : null;

            if (currentToken.Type === FormatStringTokenType.ConstantText) {
                if (i === 0) {
                    if (str.indexOf(currentToken.Text) !== 0) {
                        result.IsMatch = false;
                        return result;
                    }

                    str = str.substr(
                        currentToken.Text.length,
                        str.length - currentToken.Text.length
                    );
                } else {
                    const matchIndex = str.indexOf(currentToken.Text);
                    if (matchIndex < 0) {
                        result.IsMatch = false;
                        return result;
                    }

                    result.Matches.push({
                        name: previousToken.Text,
                        value: str.substr(0, matchIndex)
                    });
                    str = str.substring(
                        0,
                        matchIndex + currentToken.Text.length
                    );
                }
            }
        }

        const lastToken = formatTokens[formatTokens.length - 1];
        if (lastToken.Type === FormatStringTokenType.DynamicValue) {
            result.Matches.push({ name: lastToken.Text, value: str });
        }

        return result;
    }

    IsMatch(str, format) {
        const result = new FormattedStringValueExtracter().Extract(str, format);
        if (!result.IsMatch) {
            return [];
        }

        const values = [];
        for (let i = 0; i < result.Matches.length; i++) {
            values.push(result.Matches[i].value);
        }

        return values;
    }
}

export default new FormattedStringValueExtracter();
