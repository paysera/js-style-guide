import test from 'tape';
import { errorMessageIds } from './lintMessages';

function defaultPropsMessageIds(component, options) {
    return errorMessageIds('react/require-default-props', component, options);
}

const avatarPropTypes = `
Avatar.propTypes = {
    src: PropTypes.string.isRequired,
    size: PropTypes.number,
};
`;

const unmigratedAvatar = `
export default function Avatar({ src, size }) {
    return <img src={src} width={size} height={size} alt="" />;
}
${avatarPropTypes}
Avatar.defaultProps = {
    size: 48,
};
`;

const unmigratedFilesOverride = {
    overrides: [{
        files: ['src/components/Avatar.jsx', 'src/components/UserCard.jsx'],
        rules: {
            'react/require-default-props': ['error', {
                forbidDefaultForRequired: true,
                functions: 'defaultProps',
            }],
        },
    }],
};

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

    t.test('function component: rejects defaultProps used instead of default parameters', (st) => {
        st.plan(1);
        st.deepEqual(defaultPropsMessageIds(unmigratedAvatar), ['noDefaultPropsWithFunction', 'shouldAssignObjectDefault']);
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

    t.test('function component: accepts a ref prop with a null default parameter', (st) => {
        st.plan(1);
        st.deepEqual(defaultPropsMessageIds(`
export default function TextInput({ ref = null, value, onChange }) {
    return <input ref={ref} value={value} onChange={onChange} />;
}
TextInput.propTypes = {
    ref: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({})]),
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};
`), []);
    });

    t.test('memo wrapped at export: accepts default parameters', (st) => {
        st.plan(1);
        st.deepEqual(defaultPropsMessageIds(`
function Avatar({ src, size = 48 }) {
    return <img src={src} width={size} height={size} alt="" />;
}
${avatarPropTypes}
export default React.memo(Avatar);
`), []);
    });

    t.test('memo wrapped at export: rejects defaultProps', (st) => {
        st.plan(1);
        st.deepEqual(defaultPropsMessageIds(`
function Avatar({ src, size = 48 }) {
    return <img src={src} width={size} height={size} alt="" />;
}
${avatarPropTypes}
Avatar.defaultProps = {
    size: 48,
};

export default React.memo(Avatar);
`), ['noDefaultPropsWithFunction']);
    });

    t.test('memo wrapped inline, known plugin gap (eslint-plugin-react#4046): asks for defaultProps despite a default parameter', (st) => {
        st.plan(1);
        st.deepEqual(defaultPropsMessageIds(`
const Avatar = React.memo(({ src, size = 48 }) => (
    <img src={src} width={size} height={size} alt="" />
));
${avatarPropTypes}
export default Avatar;
`), ['shouldHaveDefault']);
    });

    t.test('memo wrapped inline, known plugin gap (eslint-plugin-react#4046): accepts defaultProps', (st) => {
        st.plan(1);
        st.deepEqual(defaultPropsMessageIds(`
const Avatar = React.memo(({ src, size = 48 }) => (
    <img src={src} width={size} height={size} alt="" />
));
${avatarPropTypes}
Avatar.defaultProps = {
    size: 48,
};

export default Avatar;
`), []);
    });

    t.test('forwardRef wrapped inline, known plugin gap (eslint-plugin-react#4046): asks for defaultProps despite a default parameter', (st) => {
        st.plan(1);
        st.deepEqual(defaultPropsMessageIds(`
const Avatar = React.forwardRef(({ src, size = 48 }, ref) => (
    <img ref={ref} src={src} width={size} height={size} alt="" />
));
${avatarPropTypes}
export default Avatar;
`), ['shouldHaveDefault']);
    });

    t.test('forwardRef wrapped inline, known plugin gap (eslint-plugin-react#4046): accepts defaultProps', (st) => {
        st.plan(1);
        st.deepEqual(defaultPropsMessageIds(`
const Avatar = React.forwardRef(({ src, size = 48 }, ref) => (
    <img ref={ref} src={src} width={size} height={size} alt="" />
));
${avatarPropTypes}
Avatar.defaultProps = {
    size: 48,
};

export default Avatar;
`), []);
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

    t.test('class component: rejects defaultProps on a required prop', (st) => {
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
    src: '/avatar.png',
    size: 48,
};
`), ['noDefaultWithRequired']);
    });

    t.test('React < 18.3 override: accepts defaultProps in a listed file', (st) => {
        st.plan(1);
        st.deepEqual(defaultPropsMessageIds(unmigratedAvatar, {
            projectConfig: unmigratedFilesOverride,
            filename: 'src/components/Avatar.jsx',
        }), []);
    });

    t.test('React < 18.3 override: rejects defaultProps on a required prop in a listed file', (st) => {
        st.plan(1);
        st.deepEqual(defaultPropsMessageIds(`
export default function Avatar({ src, size }) {
    return <img src={src} width={size} height={size} alt="" />;
}
${avatarPropTypes}
Avatar.defaultProps = {
    src: '/avatar.png',
    size: 48,
};
`, {
            projectConfig: unmigratedFilesOverride,
            filename: 'src/components/Avatar.jsx',
        }), ['noDefaultWithRequired']);
    });

    t.test('React < 18.3 override: asks for defaultProps instead of default parameters in a listed file', (st) => {
        st.plan(1);
        st.deepEqual(defaultPropsMessageIds(`
export default function Avatar({ src, size = 48 }) {
    return <img src={src} width={size} height={size} alt="" />;
}
${avatarPropTypes}`, {
            projectConfig: unmigratedFilesOverride,
            filename: 'src/components/Avatar.jsx',
        }), ['shouldHaveDefault']);
    });

    t.test('React < 18.3 override: keeps default parameters required in an unlisted file', (st) => {
        st.plan(1);
        st.deepEqual(defaultPropsMessageIds(unmigratedAvatar, {
            projectConfig: unmigratedFilesOverride,
            filename: 'src/components/Badge.jsx',
        }), ['noDefaultPropsWithFunction', 'shouldAssignObjectDefault']);
    });
});
