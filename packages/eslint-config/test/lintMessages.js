import { CLIEngine } from 'eslint';

const payseraConfig = require.resolve('..');

function createCli({ extends: projectExtends = [], ...projectConfig }) {
    return new CLIEngine({
        useEslintrc: false,
        baseConfig: { ...projectConfig, extends: [payseraConfig].concat(projectExtends) },
    });
}

const payseraCli = createCli({});

export function reportedMessages(ruleId, component, { projectConfig, filename } = {}) {
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

    return result.messages.filter(message => message.ruleId === ruleId);
}

export function errorMessages(ruleId, component, options) {
    return reportedMessages(ruleId, component, options).filter(({ severity }) => severity === 2);
}

export function errorMessageIds(ruleId, component, options) {
    return errorMessages(ruleId, component, options).map(({ messageId }) => messageId);
}
