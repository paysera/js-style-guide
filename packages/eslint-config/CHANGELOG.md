2.0.0 / 2026-10-20
==================
  - [breaking] `react/require-default-props`: function components must declare defaults as default parameters (`functions: 'defaultArguments'`); `defaultProps` on a plain function component is reported, because React 18.3 deprecates it and React 19 drops it for function components (the automatic JSX runtime ignores it). Class components keep `defaultProps`. Components wrapped inline in `memo` or `forwardRef` are still checked like classes, so the rule asks for `defaultProps` on them and accepts them; do not add them, see [Default Props](https://github.com/paysera/js-style-guide/tree/master/react#default-props). Projects on React < 18.3 can override the rule for files not migrated yet, see [React versions](https://github.com/paysera/js-style-guide/tree/master/packages/eslint-config#react-versions)
  - [breaking] `react/no-object-type-as-default-prop`: report object, array, function, class, JSX element, `new`, regex and `Symbol()` defaults in a function component's destructured props, which create a new value on every render. Components wrapped inline in `memo` or `forwardRef` are not checked
  - [breaking] `react/no-unsafe`: report `UNSAFE_componentWillMount`, `UNSAFE_componentWillReceiveProps` and `UNSAFE_componentWillUpdate`, and their unprefixed names (`checkAliases: true`)
  - [breaking] raise the `eslint-plugin-react` peer dependency to `^7.35.0`, the first version that reports a default parameter on a required prop of a function component. A project that keeps an older plugin, for example through `--legacy-peer-deps`, misses those reports; below 7.32.0 ESLint also reports `Definition for rule 'react/no-object-type-as-default-prop' was not found` on every file, and below 7.30.0 it lints no file and stops with `Configuration for rule "react/require-default-props" is invalid`
  - add the opt-in `@paysera/eslint-config/hooks` config, which extends `eslint-config-airbnb/hooks` (`react-hooks/rules-of-hooks` and `react-hooks/exhaustive-deps`) and needs `eslint-plugin-react-hooks`, see [Hooks rules](https://github.com/paysera/js-style-guide/tree/master/packages/eslint-config#hooks-rules)

1.0.0 / 2018-08-16
==================
  - [breaking] update `@paysera/eslint-config-base` to v1 (https://github.com/paysera/js-style-guide/blob/master/packages/eslint-config-base/CHANGELOG.md)
  - [breaking] update `eslint-config-airbnb` to v17 (https://github.com/airbnb/javascript/blob/master/packages/eslint-config-airbnb/CHANGELOG.md)
  - [breaking] `react/jsx-indent-props`: 4 spaces
  - [breaking] `react/jsx-indent`: 4 spaces
