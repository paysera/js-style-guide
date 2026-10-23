import test from 'tape';
import { errorMessageIds } from './lintMessages';

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

    t.test('rejects JSX element and new expression defaults', (st) => {
        st.plan(1);
        st.deepEqual(objectDefaultMessageIds(`
export default function Clock({ icon = <span />, startedAt = new Date() }) {
    return <time>{icon}{startedAt.toISOString()}</time>;
}
`), ['forbiddenTypeDefaultParam', 'forbiddenTypeDefaultParam']);
    });

    t.test('rejects class, regular expression and Symbol defaults', (st) => {
        st.plan(1);
        st.deepEqual(objectDefaultMessageIds(`
export default function SearchField({ Parser = class {}, pattern = /\\w+/, id = Symbol('search') }) {
    return <input pattern={pattern.source} data-parser={Parser.name} data-id={String(id)} />;
}
`), ['forbiddenTypeDefaultParam', 'forbiddenTypeDefaultParam', 'forbiddenTypeDefaultParam']);
    });

    t.test('memo wrapped inline: does not check default parameters', (st) => {
        st.plan(1);
        st.deepEqual(objectDefaultMessageIds(`
const TodoList = React.memo(({ items = [] }) => <List items={items} />);
export default TodoList;
`), []);
    });

    t.test('forwardRef wrapped inline: does not check default parameters', (st) => {
        st.plan(1);
        st.deepEqual(objectDefaultMessageIds(`
const TextInput = React.forwardRef(({ style = {}, onChange }, ref) => (
    <input ref={ref} style={style} onChange={onChange} />
));
export default TextInput;
`), []);
    });

    t.test('accepts defaults hoisted to module-level constants', (st) => {
        st.plan(1);
        st.deepEqual(objectDefaultMessageIds(`
const emptyItems = [];
const emptyStyle = {};
const noop = () => {};

export default function TodoList({ items = emptyItems, style = emptyStyle, onSelect = noop }) {
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

    t.test('accepts a null default with a fallback created once in state', (st) => {
        st.plan(1);
        st.deepEqual(objectDefaultMessageIds(`
export default function Clock({ startedAt = null }) {
    const [mountedAt] = React.useState(() => new Date());
    const start = startedAt || mountedAt;

    return <time>{start.toISOString()}</time>;
}
`), []);
    });
});
