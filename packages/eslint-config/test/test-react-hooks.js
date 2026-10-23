import test from 'tape';
import { errorMessages, reportedMessages } from './lintMessages';

const hooksSetup = {
    extends: require.resolve('../hooks'),
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

const topLevelHook = `
export default function Greeting({ name = '' }) {
    const [greeting] = React.useState(\`Hello, \${name}\`);

    return <p>{greeting}</p>;
}
Greeting.propTypes = {
    name: PropTypes.string,
};
`;

function titleWithEffectDependencies(dependencies) {
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
        st.plan(2);
        st.deepEqual(reportedMessages('react-hooks/rules-of-hooks', conditionalHook), []);
        st.deepEqual(reportedMessages('react-hooks/exhaustive-deps', titleWithEffectDependencies('')), []);
    });

    t.test('README setup: rejects a Hook called conditionally', (st) => {
        st.plan(1);
        st.equal(errorMessages('react-hooks/rules-of-hooks', conditionalHook, { projectConfig: hooksSetup }).length, 1);
    });

    t.test('README setup: accepts a Hook called at the top level', (st) => {
        st.plan(1);
        st.deepEqual(errorMessages('react-hooks/rules-of-hooks', topLevelHook, { projectConfig: hooksSetup }), []);
    });

    t.test('README setup: rejects a missing effect dependency', (st) => {
        st.plan(1);
        st.equal(errorMessages('react-hooks/exhaustive-deps', titleWithEffectDependencies(''), { projectConfig: hooksSetup }).length, 1);
    });

    t.test('README setup: accepts a complete dependency array', (st) => {
        st.plan(1);
        st.deepEqual(errorMessages('react-hooks/exhaustive-deps', titleWithEffectDependencies('text'), { projectConfig: hooksSetup }), []);
    });
});
