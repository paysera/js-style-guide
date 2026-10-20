import test from 'tape';
import { errorMessages } from './errorMessageIds';

const hooksSetup = {
    plugins: ['react-hooks'],
    rules: {
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'error',
    },
};

const conditionalHook = `
export default function Greeting({ name = '' }) {
    if (name) {
        const [greeting] = React.useState(\`Hello, \${name}\`);

        return <p>{greeting}</p>;
    }

    return null;
}
Greeting.propTypes = {
    name: PropTypes.string,
};
`;

function effectReading(dependencies) {
    return `
export default function Title({ text }) {
    React.useEffect(() => {
        document.title = text;
    }, [${dependencies}]);

    return <h1>{text}</h1>;
}
Title.propTypes = {
    text: PropTypes.string.isRequired,
};
`;
}

test('react-hooks', (t) => {
    t.test('not linted by @paysera alone', (st) => {
        st.plan(1);
        st.deepEqual(errorMessages('react-hooks/rules-of-hooks', conditionalHook), []);
    });

    t.test('README setup: rejects a Hook called conditionally', (st) => {
        st.plan(1);
        st.equal(errorMessages('react-hooks/rules-of-hooks', conditionalHook, { projectConfig: hooksSetup }).length, 1);
    });

    t.test('README setup: rejects a missing effect dependency', (st) => {
        st.plan(1);
        st.equal(errorMessages('react-hooks/exhaustive-deps', effectReading(''), { projectConfig: hooksSetup }).length, 1);
    });

    t.test('README setup: accepts a complete dependency array', (st) => {
        st.plan(1);
        st.deepEqual(errorMessages('react-hooks/exhaustive-deps', effectReading('text'), { projectConfig: hooksSetup }), []);
    });
});
