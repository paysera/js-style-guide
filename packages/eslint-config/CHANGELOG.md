2.0.0 / 2026-10-16
==================
  - [breaking] `react/require-default-props`: function components must declare defaults as default parameters (`functions: 'defaultArguments'`); `defaultProps` on function components is reported, because React 18.3 deprecates and React 19 ignores it. Class components keep `defaultProps`. Projects on React < 18.3 can stay on v1 or override the rule, see [React versions](README.md#react-versions)
  - [breaking] raise the `eslint-plugin-react` peer dependency to `^7.30.0`, the first version with the `functions` option

1.0.0 / 2018-08-16
==================
  - [breaking] update `@paysera/eslint-config-base` to v1 (https://github.com/paysera/js-style-guide/blob/master/packages/eslint-config-base/CHANGELOG.md)
  - [breaking] update `eslint-config-airbnb` to v17 (https://github.com/airbnb/javascript/blob/master/packages/eslint-config-airbnb/CHANGELOG.md)
  - [breaking] `react/jsx-indent-props`: 4 spaces
  - [breaking] `react/jsx-indent`: 4 spaces
