import test from 'tape';
import { CLIEngine } from 'eslint';
import eslintrc from '..';

const cli = new CLIEngine({
    useEslintrc: false,
    baseConfig: eslintrc,
});

function defaultPropsMessageIds(component) {
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
        .filter(({ ruleId }) => ruleId === 'react/require-default-props')
        .map(({ messageId }) => messageId);
}

const avatarPropTypes = `
Avatar.propTypes = {
    src: PropTypes.string.isRequired,
    size: PropTypes.number,
};
`;

test('react/require-default-props', (t) => {
    t.test('function component: accepts default parameters', (st) => {
        st.plan(1);
        st.deepEqual(defaultPropsMessageIds(`
export default function Avatar({ src, size = 48 }) {
    return <img src={src} width={size} height={size} alt="" />;
}
${avatarPropTypes}`), []);
    });

    t.test('function component: rejects defaultProps', (st) => {
        st.plan(1);
        st.deepEqual(defaultPropsMessageIds(`
export default function Avatar({ src, size = 48 }) {
    return <img src={src} width={size} height={size} alt="" />;
}
${avatarPropTypes}
Avatar.defaultProps = {
    size: 48,
};
`), ['noDefaultPropsWithFunction']);
    });

    t.test('function component: rejects an optional prop without a default parameter', (st) => {
        st.plan(1);
        st.deepEqual(defaultPropsMessageIds(`
export default function Avatar({ src, size }) {
    return <img src={src} width={size} height={size} alt="" />;
}
${avatarPropTypes}`), ['shouldAssignObjectDefault']);
    });

    t.test('function component: rejects a default parameter on a required prop', (st) => {
        st.plan(1);
        st.deepEqual(defaultPropsMessageIds(`
export default function Avatar({ src = '/avatar.png', size = 48 }) {
    return <img src={src} width={size} height={size} alt="" />;
}
${avatarPropTypes}`), ['noDefaultWithRequired']);
    });

    t.test('function component: rejects props that are not destructured in the signature', (st) => {
        st.plan(1);
        st.deepEqual(defaultPropsMessageIds(`
export default function Avatar(props) {
    const { src, size } = props;
    return <img src={src} width={size} height={size} alt="" />;
}
${avatarPropTypes}`), ['destructureInSignature']);
    });

    t.test('class component: accepts defaultProps', (st) => {
        st.plan(1);
        st.deepEqual(defaultPropsMessageIds(`
export default class Avatar extends React.Component {
    render() {
        const { src, size } = this.props;
        return <img src={src} width={size} height={size} alt="" />;
    }
}
${avatarPropTypes}
Avatar.defaultProps = {
    size: 48,
};
`), []);
    });

    t.test('class component: rejects an optional prop without defaultProps', (st) => {
        st.plan(1);
        st.deepEqual(defaultPropsMessageIds(`
export default class Avatar extends React.Component {
    render() {
        const { src, size } = this.props;
        return <img src={src} width={size} height={size} alt="" />;
    }
}
${avatarPropTypes}`), ['shouldHaveDefault']);
    });
});
