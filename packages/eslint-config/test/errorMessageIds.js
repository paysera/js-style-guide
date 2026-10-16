import { CLIEngine } from 'eslint';
import eslintrc from '..';

const cli = new CLIEngine({
    useEslintrc: false,
    baseConfig: eslintrc,
});

export default function errorMessageIds(ruleId, component) {
    const [result] = cli.executeOnText(`
import React from 'react';
import PropTypes from 'prop-types';

${component}
`).results;
    const parsingError = result.messages.find(({ fatal }) => fatal);

    if (parsingError) {
        throw new Error(parsingError.message);
    }

    return result.messages
        .filter(message => message.ruleId === ruleId && message.severity === 2)
        .map(({ messageId }) => messageId);
}
