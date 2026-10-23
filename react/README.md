# Paysera React/JSX Style Guide

*A mostly reasonable approach to React and JSX*

This style guide is mostly based on the standards that are currently prevalent in JavaScript, although some conventions (i.e async/await or static class fields) may still be included or prohibited on a case-by-case basis. Currently, anything prior to stage 3 is not included nor recommended in this guide.

## Table of Contents

  1. [Basic Rules](#basic-rules)
  1. [Function components vs classes](#function-components-vs-classes)
  1. [Mixins](#mixins)
  1. [Naming](#naming)
  1. [Declaration](#declaration)
  1. [Alignment](#alignment)
  1. [Quotes](#quotes)
  1. [Spacing](#spacing)
  1. [Props](#props)
  1. [Default Props](#default-props)
  1. [Refs](#refs)
  1. [Parentheses](#parentheses)
  1. [Tags](#tags)
  1. [Methods](#methods)
  1. [Ordering](#ordering)
  1. [`isMounted`](#ismounted)

## Basic Rules

  - Only include one React component per file.
    - However, multiple small [function components](https://react.dev/learn/your-first-component) are allowed per file.
  - Always use JSX syntax.
  - Do not use `React.createElement` unless you’re initializing the app from a file that is not JSX.
  - [`react/forbid-prop-types`](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/forbid-prop-types.md) will allow `arrays` and `objects` only if it is explicitly noted what `array` and `object` contains, using `arrayOf`, `objectOf`, or `shape`.
  - React checks `propTypes` only in development builds and only up to React 18; [React 19 silently ignores them](https://react.dev/blog/2024/04/25/react-19-upgrade-guide#removed-proptypes-and-defaultprops). In JavaScript projects keep declaring them anyway: they document the component, and [`react/prop-types`](https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/prop-types.md) and [`react/require-default-props`](https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/require-default-props.md) rely on them. In TypeScript projects, describe props with TypeScript types instead, as the React team recommends.
  - Read context with [`useContext`](https://react.dev/reference/react/useContext) in function components or `contextType` in classes. Do not use the legacy `contextTypes`, `childContextTypes` or `getChildContext` API, which React 19 removed.

## Function components vs classes

  - Write new components as function components, and use [Hooks](https://react.dev/reference/react/hooks) for state, refs and side effects (React 16.8+).

    > Why? Current React APIs and documentation are designed around function components. They are shorter than classes, have no `this` to bind, and let you share logic through custom Hooks instead of higher-order components.

    ```jsx
    // bad
    class Toggle extends React.Component {
      constructor(props) {
        super(props);

        this.state = { isOn: false };
        this.onClick = this.onClick.bind(this);
      }

      onClick() {
        this.setState(({ isOn }) => ({ isOn: !isOn }));
      }

      render() {
        return <button type="button" onClick={this.onClick}>{this.state.isOn ? 'On' : 'Off'}</button>;
      }
    }

    // good
    function Toggle() {
      const [isOn, setIsOn] = useState(false);

      return <button type="button" onClick={() => setIsOn(wasOn => !wasOn)}>{isOn ? 'On' : 'Off'}</button>;
    }
    ```

  - Follow the [Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks): call Hooks only at the top level of function components and custom Hooks, never inside conditions, loops or nested functions.

  - List every [reactive value](https://react.dev/learn/lifecycle-of-reactive-effects#all-variables-declared-in-the-component-body-are-reactive) that a `useEffect`, `useMemo` or `useCallback` callback reads in its dependency array: props, state, and variables and functions declared in the component body.

  - The default `@paysera` config does not lint the Rules of Hooks or dependency arrays. To check them, add the opt-in `@paysera/eslint-config/hooks` config, as described in [Hooks rules](../packages/eslint-config/README.md#hooks-rules).

  - Use a class only when React requires one, for example for an [error boundary](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary). Extend `React.Component`; never use `React.createClass`, which React 16 removed. eslint: [`react/prefer-es6-class`](https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/prefer-es6-class.md)

    ```jsx
    // bad
    const ErrorBoundary = React.createClass({
      // ...
    });

    // good
    class ErrorBoundary extends React.Component {
      // ...
    }
    ```

  - Declare function components as normal functions, not as arrow functions, and do not write a stateless component as a class. A render function passed inline to `forwardRef` or `React.memo` is a callback, so it stays an arrow function (see [Arrow Functions](../README.md#arrows--use-them)). eslint: [`react/prefer-stateless-function`](https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/prefer-stateless-function.md) reports the class form; the arrow-function form is not linted.

    ```jsx
    // bad
    class Listing extends React.Component {
      render() {
        return <div>{this.props.hello}</div>;
      }
    }

    // bad (relying on function name inference is discouraged)
    const Listing = ({ hello }) => (
      <div>{hello}</div>
    );

    // good
    function Listing({ hello }) {
      return <div>{hello}</div>;
    }
    ```

## Mixins

  - [Do not use mixins](https://legacy.reactjs.org/blog/2016/07/13/mixins-considered-harmful.html).

  > Why? Mixins introduce implicit dependencies, cause name clashes, and cause snowballing complexity. Most use cases for mixins can be accomplished in better ways via components, higher-order components, or utility modules.

## Naming

  - **Extensions**: Use `.jsx` extension for React components. eslint: [`react/jsx-filename-extension`](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-filename-extension.md)
  - **Filename**: Use PascalCase for filenames. E.g., `ReservationCard.jsx`.
  - **Reference Naming**: Use PascalCase for React components and camelCase for their instances. eslint: [`react/jsx-pascal-case`](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-pascal-case.md)

    ```jsx
    // bad
    import reservationCard from './ReservationCard';

    // good
    import ReservationCard from './ReservationCard';

    // bad
    const ReservationItem = <ReservationCard />;

    // good
    const reservationItem = <ReservationCard />;
    ```

  - **Component Naming**: Use the filename as the component name. For example, `ReservationCard.jsx` should have a reference name of `ReservationCard`. However, for root components of a directory, use `index.jsx` as the filename and use the directory name as the component name:

    ```jsx
    // bad
    import Footer from './Footer/Footer';

    // bad
    import Footer from './Footer/index';

    // good
    import Footer from './Footer';
    ```

  - **Higher-order Component Naming**: Use a composite of the higher-order component’s name and the passed-in component’s name as the `displayName` on the generated component. For example, the higher-order component `withFoo()`, when passed a component `Bar` should produce a component with a `displayName` of `withFoo(Bar)`.

    > Why? A component’s `displayName` may be used by developer tools or in error messages, and having a value that clearly expresses this relationship helps people understand what is happening.

    ```jsx
    // bad
    export default function withFoo(WrappedComponent) {
      return function WithFoo(props) {
        return <WrappedComponent {...props} foo />;
      }
    }

    // good
    export default function withFoo(WrappedComponent) {
      function WithFoo(props) {
        // eslint-disable-next-line react/jsx-props-no-spreading
        return <WrappedComponent {...props} foo />;
      }

      const wrappedComponentName = WrappedComponent.displayName
        || WrappedComponent.name
        || 'Component';

      WithFoo.displayName = `withFoo(${wrappedComponentName})`;
      return WithFoo;
    }
    ```

  - **Props Naming**: Avoid using DOM component prop names for different purposes.

    > Why? People expect props like `style` and `className` to mean one specific thing. Varying this API for a subset of your app makes the code less readable and less maintainable, and may cause bugs.

    ```jsx
    // bad
    <MyComponent style="fancy" />

    // bad
    <MyComponent className="fancy" />

    // good
    <MyComponent variant="fancy" />
    ```

## Declaration

  - Do not use `displayName` for naming components. Instead, name the component by reference.

    ```jsx
    // bad
    export default React.createClass({
      displayName: 'ReservationCard',
      // stuff goes here
    });

    // good
    export default function ReservationCard() {
      // stuff goes here
    }
    ```

## Alignment

  - Follow these alignment styles for JSX syntax. eslint: [`react/jsx-closing-bracket-location`](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-closing-bracket-location.md) [`react/jsx-closing-tag-location`](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-closing-tag-location.md)

    ```jsx
    // bad
    <Foo superLongParam="bar"
         anotherSuperLongParam="baz" />

    // good
    <Foo
      superLongParam="bar"
      anotherSuperLongParam="baz"
    />

    // if props fit in one line then keep it on the same line
    <Foo bar="bar" />

    // children get indented normally
    <Foo
      superLongParam="bar"
      anotherSuperLongParam="baz"
    >
      <Quux />
    </Foo>

    // bad
    {showButton &&
      <Button />
    }

    // bad
    {
      showButton &&
        <Button />
    }

    // good
    {showButton && (
      <Button />
    )}

    // good
    {showButton && <Button />}

    // good
    {someReallyLongConditional
      && anotherLongConditional
      && (
        <Foo
          superLongParam="bar"
          anotherSuperLongParam="baz"
        />
      )
    }

    // good
    {someConditional ? (
      <Foo />
    ) : (
      <Foo
        superLongParam="bar"
        anotherSuperLongParam="baz"
      />
    )}
    ```

## Quotes

  - Always use double quotes (`"`) for JSX attributes, but single quotes (`'`) for all other JS. eslint: [`jsx-quotes`](https://eslint.org/docs/rules/jsx-quotes)

    > Why? Regular HTML attributes also typically use double quotes instead of single, so JSX attributes mirror this convention.

    ```jsx
    // bad
    <Foo bar='bar' />

    // good
    <Foo bar="bar" />

    // bad
    <Foo style={{ left: "20px" }} />

    // good
    <Foo style={{ left: '20px' }} />
    ```

## Spacing

  - Always include a single space in your self-closing tag. eslint: [`no-multi-spaces`](https://eslint.org/docs/rules/no-multi-spaces), [`react/jsx-tag-spacing`](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-tag-spacing.md)

    ```jsx
    // bad
    <Foo/>

    // very bad
    <Foo                 />

    // bad
    <Foo
     />

    // good
    <Foo />
    ```

  - Do not pad JSX curly braces with spaces. eslint: [`react/jsx-curly-spacing`](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-curly-spacing.md)

    ```jsx
    // bad
    <Foo bar={ baz } />

    // good
    <Foo bar={baz} />
    ```

## Props

  - Always use camelCase for prop names, or PascalCase if the prop value is a React component.

    ```jsx
    // bad
    <Foo
      UserName="hello"
      phone_number={12345678}
    />

    // good
    <Foo
      userName="hello"
      phoneNumber={12345678}
      Component={SomeComponent}
    />
    ```

  - Omit the value of the prop when it is explicitly `true`. eslint: [`react/jsx-boolean-value`](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-boolean-value.md)

    ```jsx
    // bad
    <Foo
      hidden={true}
    />

    // good
    <Foo
      hidden
    />

    // good
    <Foo hidden />
    ```

  - Always include an `alt` prop on `<img>` tags. If the image is presentational, `alt` can be an empty string or the `<img>` must have `role="presentation"`. eslint: [`jsx-a11y/alt-text`](https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/alt-text.md)

    ```jsx
    // bad
    <img src="hello.jpg" />

    // good
    <img src="hello.jpg" alt="Me waving hello" />

    // good
    <img src="hello.jpg" alt="" />

    // good
    <img src="hello.jpg" role="presentation" />
    ```

  - Do not use words like "image", "photo", or "picture" in `<img>` `alt` props. eslint: [`jsx-a11y/img-redundant-alt`](https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/img-redundant-alt.md)

    > Why? Screenreaders already announce `img` elements as images, so there is no need to include this information in the alt text.

    ```jsx
    // bad
    <img src="hello.jpg" alt="Picture of me waving hello" />

    // good
    <img src="hello.jpg" alt="Me waving hello" />
    ```

  - Use only valid, non-abstract [ARIA roles](https://www.w3.org/TR/wai-aria/#usage_intro). eslint: [`jsx-a11y/aria-role`](https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/aria-role.md)

    ```jsx
    // bad - not an ARIA role
    <div role="datepicker" />

    // bad - abstract ARIA role
    <div role="range" />

    // good
    <div role="button" />
    ```

  - Do not use `accessKey` on elements. eslint: [`jsx-a11y/no-access-key`](https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-access-key.md)

  > Why? Inconsistencies between keyboard shortcuts and keyboard commands used by people using screenreaders and keyboards complicate accessibility.

  ```jsx
  // bad
  <div accessKey="h" />

  // good
  <div />
  ```

  - Avoid using an array index as `key` prop, prefer a stable ID. eslint: [`react/no-array-index-key`](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-array-index-key.md)

> Why? Not using a stable ID [is an anti-pattern](https://medium.com/@robinpokorny/index-as-a-key-is-an-anti-pattern-e0349aece318) because it can negatively impact performance and cause issues with component state.

We don’t recommend using indexes for keys if the order of items may change.

  ```jsx
  // bad
  {todos.map((todo, index) =>
    <Todo
      text={todo.text}
      key={index}
    />
  )}

  // good
  {todos.map(todo => (
    <Todo
      text={todo.text}
      key={todo.id}
    />
  ))}
  ```

  - Use spread props sparingly. eslint: [`react/jsx-props-no-spreading`](https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-props-no-spreading.md)
  > Why? Otherwise you’re more likely to pass unnecessary props down to components. And for React v15.6.1 and older, you could [pass invalid HTML attributes to the DOM](https://legacy.reactjs.org/blog/2017/09/08/dom-attributes-in-react-16.html).

  Exceptions. The config reports spreading a variable (an inline object literal such as `{...{ text: '' }}` is allowed), so disable `react/jsx-props-no-spreading` on the line for these:

  - HOCs that proxy down props and hoist propTypes

  ```jsx
  function withFoo(WrappedComponent) {
    function WithFoo(props) {
      // eslint-disable-next-line react/jsx-props-no-spreading
      return <WrappedComponent {...props} />;
    }

    WithFoo.propTypes = WrappedComponent.propTypes;

    return WithFoo;
  }
  ```

  - Spreading objects with known, explicit props. This can be particularly useful when testing React components with Mocha’s beforeEach construct.

  ```jsx
  export default function Foo() {
    const props = {
      text: '',
      isPublished: false,
    };

    // eslint-disable-next-line react/jsx-props-no-spreading
    return <Article {...props} />;
  }
  ```

  Notes for use:
  Filter out unnecessary props when possible. Also, use [prop-types-exact](https://www.npmjs.com/package/prop-types-exact) to help prevent bugs.

  ```jsx
  // bad
  function WithFoo(props) {
    const { irrelevantProp, ...relevantProps } = props;
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <WrappedComponent {...props} />;
  }

  // good
  function WithFoo({ irrelevantProp, ...relevantProps }) {
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <WrappedComponent {...relevantProps} />;
  }
  ```

## Default Props

  - Give every non-required prop a default value, and never give one to a required prop. How the default is declared depends on the component type and the React version. eslint: [`react/require-default-props`](https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/require-default-props.md)

    > Why? Defaults document what a component expects when a prop is omitted, and the component body does not have to check for `undefined`.

    | React version | Function components | Class components |
    | --- | --- | --- |
    | < 18.3 | Default parameters. `defaultProps` still works, so files not migrated yet may keep it until the upgrade under an override scoped to those files (see [`@paysera/eslint-config`](../packages/eslint-config/README.md#react-versions)), but new code must not add it: migrate such a file before adding components or optional props to it | `defaultProps` |
    | 18.3.x | Default parameters only. `defaultProps` logs a deprecation warning | `defaultProps` |
    | 19 and later | Default parameters only. React 19 dropped `defaultProps` for function components: the automatic JSX runtime ignores it, so the default never applies, and only the classic `React.createElement` runtime still reads it | `defaultProps` |

    Default parameters work in every React version, so code written this way needs no changes when the project upgrades.

  - **Function components**: destructure props in the function signature and assign the defaults there. Do not use `defaultProps`.

    ```jsx
    // bad - warns in React 18.3, dropped for function components in React 19
    function Avatar({ src, size }) {
      return <img src={src} width={size} height={size} alt="" />;
    }
    Avatar.propTypes = {
      src: PropTypes.string.isRequired,
      size: PropTypes.number,
    };
    Avatar.defaultProps = {
      size: 48,
    };

    // bad - props are not destructured, so the default has nowhere to go
    function Avatar(props) {
      return <img src={props.src} width={props.size} height={props.size} alt="" />;
    }

    // good
    function Avatar({ src, size = 48 }) {
      return <img src={src} width={size} height={size} alt="" />;
    }
    Avatar.propTypes = {
      src: PropTypes.string.isRequired,
      size: PropTypes.number,
    };
    ```

  - **`React.memo` and `forwardRef`**: keep the defaults in the inner function’s parameters and never add `defaultProps`. `react/require-default-props` recognises default parameters only on a plain function. When `propTypes` sit on a component wrapped inline, it asks for `defaultProps` instead, until a release of eslint-plugin-react ships [jsx-eslint/eslint-plugin-react#4046](https://github.com/jsx-eslint/eslint-plugin-react/pull/4046). Do not follow that advice: the linter then accepts the `defaultProps`, but React 18.3 deprecates them for `memo` components and React 19 drops them for `memo` and `forwardRef` components the same way as for plain function components.
    - `React.memo`: declare the component as a plain function with its `propTypes`, and wrap it at export.
    - `forwardRef` (React < 19): `propTypes` have to sit on the wrapper, so disable `react/require-default-props` around them. On React 19 and later, read `ref` from props instead (see [Refs](#refs)).

    ```jsx
    // bad - the linter asks for defaultProps, which React 18.3 deprecates for memo components
    const Avatar = React.memo(({ src, size = 48 }) => (
      <img src={src} width={size} height={size} alt="" />
    ));
    Avatar.propTypes = {
      src: PropTypes.string.isRequired,
      size: PropTypes.number,
    };

    // good
    function Avatar({ src, size = 48 }) {
      return <img src={src} width={size} height={size} alt="" />;
    }
    Avatar.propTypes = {
      src: PropTypes.string.isRequired,
      size: PropTypes.number,
    };

    export default React.memo(Avatar);

    // good, React < 19
    const TextInput = forwardRef(({ value = '', onChange }, ref) => (
      <input ref={ref} value={value} onChange={onChange} />
    ));
    /* eslint-disable react/require-default-props */
    TextInput.propTypes = {
      value: PropTypes.string,
      onChange: PropTypes.func.isRequired,
    };
    /* eslint-enable react/require-default-props */
    ```

  - Hoist object, array, function and JSX element defaults to module-level constants. A value that must be created per component instance, such as the time it mounted, cannot be hoisted: default the prop to `null` and create the fallback once with a lazy `useState` initializer. eslint: [`react/no-object-type-as-default-prop`](https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-object-type-as-default-prop.md), which also reports class, `new`, regex and `Symbol()` defaults. It does not check components wrapped inline in `memo` or `forwardRef`, so hoist their defaults by hand.

    > Why? A default parameter is evaluated on every render, so `items = []` creates a new array each time the prop is omitted. A new reference on every render defeats `React.memo`, `useMemo`, `useCallback` and `useEffect` dependency checks. `defaultProps` did not have this problem because the same object was reused.

    ```jsx
    // bad
    function TodoList({ items = [] }) {
      const sortedItems = useMemo(() => sortByDate(items), [items]);

      return <List items={sortedItems} />;
    }

    // good
    const emptyItems = [];

    function TodoList({ items = emptyItems }) {
      const sortedItems = useMemo(() => sortByDate(items), [items]);

      return <List items={sortedItems} />;
    }

    // bad - creates a new Date on every render
    function Clock({ startedAt = new Date() }) {
      return <time>{startedAt.toISOString()}</time>;
    }

    // good
    function Clock({ startedAt = null }) {
      const [mountedAt] = useState(() => new Date());
      const start = startedAt || mountedAt;

      return <time>{start.toISOString()}</time>;
    }
    ```

  - **Class components**: keep using `defaultProps`; React 19 still supports it for classes. Assign it after the class body, the same way as `propTypes` (see [Ordering](#ordering)). eslint: [`react/static-property-placement`](https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/static-property-placement.md)

## Refs

  - Do not use string refs; React 19 removed them. Use [`useRef`](https://react.dev/reference/react/useRef) in function components and [`createRef`](https://react.dev/reference/react/createRef) in class components. eslint: [`react/no-string-refs`](https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-string-refs.md)

    ```jsx
    // bad
    <Foo
      ref="myRef"
    />

    // good
    function SearchForm() {
      const inputRef = useRef(null);

      return <input ref={inputRef} />;
    }

    // good
    class SearchForm extends React.Component {
      constructor(props) {
        super(props);

        this.inputRef = React.createRef();
      }

      render() {
        return <input ref={this.inputRef} />;
      }
    }
    ```

  - Use a ref callback only when you need to run code at the moment the node is attached or detached.

  - To pass a ref to your own function component, follow the React version:
    - React 19 and later only: `ref` is a regular prop. Read it from props, declare it in `propTypes` as an optional prop with a `null` default (`PropTypes.shape({})` leaves `current` unspecified, so it accepts a ref object whether `current` holds a DOM node or a handle set with `useImperativeHandle`), and do not wrap new components in [`forwardRef`](https://react.dev/reference/react/forwardRef), which React plans to deprecate.
    - React < 19: function components do not receive `ref` as a prop, so wrap the component in `forwardRef` (see [Default Props](#default-props) for its `propTypes`). A component written the React 19 way never attaches the ref there: React only warns in development, and the linter accepts it.

    ```jsx
    // good, React 19 and later only - in React < 19 this ref never attaches
    function TextInput({ ref = null, value, onChange }) {
      return <input ref={ref} value={value} onChange={onChange} />;
    }
    TextInput.propTypes = {
      ref: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({})]),
      value: PropTypes.string.isRequired,
      onChange: PropTypes.func.isRequired,
    };

    // good, React < 19
    const TextInput = forwardRef(({ value, onChange }, ref) => (
      <input ref={ref} value={value} onChange={onChange} />
    ));
    ```

## Parentheses

  - Wrap JSX tags in parentheses when they span more than one line. eslint: [`react/jsx-wrap-multilines`](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-wrap-multilines.md)

    ```jsx
    // bad
    render() {
      return <MyComponent variant="long body" foo="bar">
               <MyChild />
             </MyComponent>;
    }

    // good
    render() {
      return (
        <MyComponent variant="long body" foo="bar">
          <MyChild />
        </MyComponent>
      );
    }

    // good, when single line
    render() {
      const body = <div>hello</div>;
      return <MyComponent>{body}</MyComponent>;
    }
    ```

## Tags

  - Always self-close tags that have no children. eslint: [`react/self-closing-comp`](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/self-closing-comp.md)

    ```jsx
    // bad
    <Foo variant="stuff"></Foo>

    // good
    <Foo variant="stuff" />
    ```

  - If your component has multiline properties, close its tag on a new line. eslint: [`react/jsx-closing-bracket-location`](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-closing-bracket-location.md)

    ```jsx
    // bad
    <Foo
      bar="bar"
      baz="baz" />

    // good
    <Foo
      bar="bar"
      baz="baz"
    />
    ```

## Methods

  - Use arrow functions to close over local variables. It is handy when you need to pass additional data to an event handler. Although, make sure they [do not massively hurt performance](https://www.bignerdranch.com/blog/choosing-the-best-approach-for-react-event-handlers/), in particular when passed to custom components that might be PureComponents, because they will trigger a possibly needless rerender every time.

    ```jsx
    function ItemList({ items }) {
      return (
        <ul>
          {items.map((item, index) => (
            <Item
              key={item.key}
              onClick={event => doSomethingWith(event, item.name, index)}
            />
          ))}
        </ul>
      );
    }
    ```

  - In class components, bind event handlers for the render method in the constructor. eslint: [`react/jsx-no-bind`](https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-no-bind.md)

    > Why? A bind call in the render path creates a brand new function on every single render. Do not use arrow functions in class fields, because it makes them [challenging to test and debug, and can negatively impact performance](https://medium.com/@charpeni/arrow-functions-in-class-properties-might-not-be-as-great-as-we-think-3b3551c440b1), and because conceptually, class fields are for data, not logic.

    ```jsx
    // bad
    class extends React.Component {
      onClickDiv() {
        // do stuff
      }

      render() {
        return <div onClick={this.onClickDiv.bind(this)} />;
      }
    }

    // very bad
    class extends React.Component {
      onClickDiv = () => {
        // do stuff
      }

      render() {
        return <div onClick={this.onClickDiv} />
      }
    }

    // good
    class extends React.Component {
      constructor(props) {
        super(props);

        this.onClickDiv = this.onClickDiv.bind(this);
      }

      onClickDiv() {
        // do stuff
      }

      render() {
        return <div onClick={this.onClickDiv} />;
      }
    }
    ```

  - Do not use underscore prefix for internal methods of a React component.
    > Why? Underscore prefixes are sometimes used as a convention in other languages to denote privacy. But, unlike those languages, there is no native support for privacy in JavaScript, everything is public. Regardless of your intentions, adding underscore prefixes to your properties does not actually make them private, and any property (underscore-prefixed or not) should be treated as being public. See issues [#1024](https://github.com/airbnb/javascript/issues/1024), and [#490](https://github.com/airbnb/javascript/issues/490) for a more in-depth discussion.

    ```jsx
    // bad
    React.createClass({
      _onClickSubmit() {
        // do stuff
      },

      // other stuff
    });

    // good
    class extends React.Component {
      onClickSubmit() {
        // do stuff
      }

      // other stuff
    }
    ```

  - Be sure to return a value in your `render` methods. eslint: [`react/require-render-return`](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/require-render-return.md)

    ```jsx
    // bad
    render() {
      (<div />);
    }

    // good
    render() {
      return (<div />);
    }
    ```

## Ordering

  - Ordering for `class extends React.Component`: eslint: [`react/sort-comp`](https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/sort-comp.md)

  1. optional `static` methods other than `getDerivedStateFromProps`
  1. `constructor`
  1. `getDerivedStateFromProps`
  1. `componentDidMount`
  1. `shouldComponentUpdate`
  1. `getSnapshotBeforeUpdate`
  1. `componentDidUpdate`
  1. `componentDidCatch`
  1. `componentWillUnmount`
  1. *event handlers starting with 'handle'* like `handleSubmit()` or `handleChangeDescription()`
  1. *event handlers starting with 'on'* like `onClickSubmit()` or `onChangeDescription()`
  1. *getter methods for `render`* like `getSelectReason()` or `getFooterContent()`
  1. *optional render methods* like `renderNavigation()` or `renderProfilePicture()`
  1. `render`

  - Do not use `componentWillMount`, `componentWillReceiveProps` or `componentWillUpdate`, nor their `UNSAFE_` aliases. React 16.3 [marked them unsafe](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html) because they misbehave with async rendering. Use `componentDidMount`, `getDerivedStateFromProps` or `componentDidUpdate` instead. eslint: [`react/no-unsafe`](https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-unsafe.md), [`react/no-deprecated`](https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-deprecated.md)

    Both rules report an unprefixed name such as `componentWillMount`. `react/no-deprecated` suggests renaming it to its `UNSAFE_` alias; ignore that suggestion, because `react/no-unsafe` reports the alias too.

  - How to define `propTypes` and `defaultProps` in a class component:

    ```jsx
    import React from 'react';
    import PropTypes from 'prop-types';

    const propTypes = {
      id: PropTypes.number.isRequired,
      url: PropTypes.string.isRequired,
      text: PropTypes.string,
    };

    const defaultProps = {
      text: 'Hello World',
    };

    class Link extends React.Component {
      static methodsAreOk() {
        return true;
      }

      render() {
        const { id, url, text } = this.props;

        return <a href={url} data-id={id}>{text}</a>;
      }
    }

    Link.propTypes = propTypes;
    Link.defaultProps = defaultProps;

    export default Link;
    ```

## `isMounted`

  - Do not use `isMounted`. eslint: [`react/no-is-mounted`](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-is-mounted.md)

  > Why? [`isMounted` is an anti-pattern][anti-pattern], and it is not available in ES6 classes or function components. Cancel subscriptions and pending requests in the effect cleanup or in `componentWillUnmount` instead.

  [anti-pattern]: https://legacy.reactjs.org/blog/2015/12/16/ismounted-antipattern.html

**[⬆ back to top](#table-of-contents)**
