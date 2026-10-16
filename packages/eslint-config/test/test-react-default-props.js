import test from 'tape';
import errorMessageIds from './lint';

function defaultPropsMessageIds(component) {
    return errorMessageIds('react/require-default-props', component);
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

    t.test('memo wrapped inline: asks for defaultProps despite a default parameter (until eslint-plugin-react#4046 is released)', (st) => {
        st.plan(1);
        st.deepEqual(defaultPropsMessageIds(`
const Avatar = React.memo(({ src, size = 48 }) => (
    <img src={src} width={size} height={size} alt="" />
));
${avatarPropTypes}
export default Avatar;
`), ['shouldHaveDefault']);
    });

    t.test('forwardRef wrapped inline: asks for defaultProps despite a default parameter (until eslint-plugin-react#4046 is released)', (st) => {
        st.plan(1);
        st.deepEqual(defaultPropsMessageIds(`
const Avatar = React.forwardRef(({ src, size = 48 }, ref) => (
    <img ref={ref} src={src} width={size} height={size} alt="" />
));
${avatarPropTypes}
export default Avatar;
`), ['shouldHaveDefault']);
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
});
