import { CLIEngine } from 'eslint';

const payseraConfig = require.resolve('..');

function createCli(projectConfig) {
    return new CLIEngine({
        useEslintrc: false,
        baseConfig: { extends: payseraConfig, ...projectConfig },
    });
}

const payseraCli = createCli({});

export function errorMessages(ruleId, component, { projectConfig, filename } = {}) {
    const cli = projectConfig ? createCli(projectConfig) : payseraCli;
    const [result] = cli.executeOnText(`
import React from 'react';
import PropTypes from 'prop-types';

${component}
`, filename).results;
    const parsingError = result.messages.find(({ fatal }) => fatal);

    if (parsingError) {
        throw new Error(parsingError.message);
    }

    return result.messages.filter(message => message.ruleId === ruleId && message.severity === 2);
}

export default function errorMessageIds(ruleId, component, options) {
    return errorMessages(ruleId, component, options).map(({ messageId }) => messageId);
}
