import test from 'tape';
import { errorMessageIds } from './lintMessages';

function unsafeMessageIds(component) {
    return errorMessageIds('react/no-unsafe', component);
}

test('react/no-unsafe', (t) => {
    t.test('rejects the UNSAFE_ lifecycle methods', (st) => {
        st.plan(1);
        st.deepEqual(unsafeMessageIds(`
export default class Clock extends React.Component {
    UNSAFE_componentWillMount() {}

    UNSAFE_componentWillReceiveProps() {}

    UNSAFE_componentWillUpdate() {}

    render() {
        return <div />;
    }
}
`), ['unsafeMethod', 'unsafeMethod', 'unsafeMethod']);
    });

    t.test('rejects the unprefixed lifecycle methods', (st) => {
        st.plan(1);
        st.deepEqual(unsafeMessageIds(`
export default class Clock extends React.Component {
    componentWillMount() {}

    componentWillReceiveProps() {}

    componentWillUpdate() {}

    render() {
        return <div />;
    }
}
`), ['unsafeMethod', 'unsafeMethod', 'unsafeMethod']);
    });

    t.test('accepts the replacement lifecycle methods', (st) => {
        st.plan(1);
        st.deepEqual(unsafeMessageIds(`
export default class Clock extends React.Component {
    componentDidMount() {}

    componentDidUpdate() {}

    render() {
        return <div />;
    }
}
`), []);
    });
});
