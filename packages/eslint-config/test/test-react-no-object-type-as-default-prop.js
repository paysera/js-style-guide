import test from 'tape';
import errorMessageIds from './lint';

function objectDefaultMessageIds(component) {
    return errorMessageIds('react/no-object-type-as-default-prop', component);
}

test('react/no-object-type-as-default-prop', (t) => {
    t.test('rejects object, array and function literals as default parameters', (st) => {
        st.plan(1);
        st.deepEqual(objectDefaultMessageIds(`
export default function TodoList({ items = [], style = {}, onSelect = () => {} }) {
    return <List items={items} style={style} onSelect={onSelect} />;
}
`), ['forbiddenTypeDefaultParam', 'forbiddenTypeDefaultParam', 'forbiddenTypeDefaultParam']);
    });

    t.test('accepts defaults hoisted to module-level constants', (st) => {
        st.plan(1);
        st.deepEqual(objectDefaultMessageIds(`
const NO_ITEMS = [];
const NO_STYLE = {};
const noop = () => {};

export default function TodoList({ items = NO_ITEMS, style = NO_STYLE, onSelect = noop }) {
    return <List items={items} style={style} onSelect={onSelect} />;
}
`), []);
    });

    t.test('accepts primitive default parameters', (st) => {
        st.plan(1);
        st.deepEqual(objectDefaultMessageIds(`
export default function Avatar({ src = '/avatar.png', size = 48 }) {
    return <img src={src} width={size} height={size} alt="" />;
}
`), []);
    });
});
