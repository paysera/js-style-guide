# @paysera/eslint-config

[![npm version](https://badge.fury.io/js/%40paysera%2Feslint-config.svg)](http://badge.fury.io/js/%40paysera%2Feslint-config)

This package provides Paysera's .eslintrc as an extensible shared config.

## Usage

We export two ESLint configurations for your usage.

### @paysera/eslint-config

Our default export contains all of our ESLint rules, including ECMAScript 6+ and React, except the opt-in Hooks rules in `@paysera/eslint-config/hooks`. It requires `eslint`, `eslint-plugin-import`, `eslint-plugin-react`, and `eslint-plugin-jsx-a11y`. If you don't need React, see [@paysera/eslint-config-base](https://www.npmjs.com/package/@paysera/eslint-config-base).

If you use yarn, run `npm info "@paysera/eslint-config@latest" peerDependencies` to list the peer dependencies and versions, then run `yarn add --dev <dependency>@<version>` for each listed peer dependency. See below for npm instructions.

1. Install the correct versions of each package, which are listed by the command:

  ```sh
  npm info "@paysera/eslint-config@latest" peerDependencies
  ```

  If using **npm 5+**, use this shortcut

  ```sh
  npx install-peerdeps --dev @paysera/eslint-config
  ```

  If using **yarn**, you can also use the shortcut described above if you have npm 5+ installed on your machine, as the command will detect that you are using yarn and will act accordingly.
  Otherwise, run `npm info "@paysera/eslint-config@latest" peerDependencies` to list the peer dependencies and versions, then run `yarn add --dev <dependency>@<version>` for each listed peer dependency.

  If using **npm < 5**, Linux/OSX users can run

  ```sh
  (
    export PKG=@paysera/eslint-config;
    npm info "$PKG@latest" peerDependencies --json | command sed 's/[\{\},]//g ; s/: /@/g' | xargs npm install --save-dev "$PKG@latest"
  )
  ```

  Which produces and runs a command like:

  ```sh
  npm install --save-dev @paysera/eslint-config eslint@^#.#.# eslint-plugin-jsx-a11y@^#.#.# eslint-plugin-import@^#.#.# eslint-plugin-react@^#.#.#
  ```

  If using **npm < 5**, Windows users can either install all the peer dependencies manually, or use the [install-peerdeps](https://github.com/nathanhleung/install-peerdeps) cli tool.

  ```sh
  npm install -g install-peerdeps
  install-peerdeps --dev @paysera/eslint-config
  ```
  The cli will produce and run a command like:

  ```sh
  npm install --save-dev @paysera/eslint-config eslint@^#.#.# eslint-plugin-jsx-a11y@^#.#.# eslint-plugin-import@^#.#.# eslint-plugin-react@^#.#.#
  ```

2. Add `"extends": "@paysera"` to your .eslintrc

See [Paysera's Javascript styleguide](https://github.com/paysera/js-style-guide) and
the [ESlint config docs](https://eslint.org/docs/user-guide/configuring#extending-configuration-files)
for more information.

### @paysera/eslint-config/hooks

An opt-in addition to the default export that lints the Rules of Hooks and Hook dependency arrays. It requires `eslint-plugin-react-hooks`; see [Hooks rules](#hooks-rules).

## React versions

Since v2, `react/require-default-props` requires default parameters instead of `defaultProps` in plain function components, and keeps `defaultProps` for class components. React 18.3 deprecates `defaultProps` on function components and React 19 drops them (the automatic JSX runtime ignores them), while default parameters work in every React version. The rule still checks components wrapped inline in `memo` or `forwardRef` like classes, until a release of eslint-plugin-react ships [jsx-eslint/eslint-plugin-react#4046](https://github.com/jsx-eslint/eslint-plugin-react/pull/4046); see [Default Props](https://github.com/paysera/js-style-guide/tree/master/react#default-props) in the React style guide for how to declare them.

Projects on React < 18.3 that still declare `defaultProps` on function components can restore the previous behaviour only for the files they have not migrated yet, so new files keep requiring default parameters:

```json
{
    "extends": "@paysera",
    "overrides": [{
        "files": ["src/components/Avatar.jsx", "src/components/UserCard.jsx"],
        "rules": {
            "react/require-default-props": ["error", {
                "forbidDefaultForRequired": true,
                "functions": "defaultProps"
            }]
        }
    }]
}
```

List the unmigrated files in `files`. Migrate a listed file, and remove it from `files`, before adding components or optional props to it, because inside the override the rule asks for `defaultProps` again. Remove the override before upgrading to React 18.3 or later.

## Hooks rules

The default `@paysera` config does not lint the [Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks) or the dependency arrays of `useEffect`, `useMemo` and `useCallback`. To check them, install `eslint-plugin-react-hooks@^4`, the newest major version that `eslint-config-airbnb` 18 accepts, and add the opt-in `@paysera/eslint-config/hooks` config. It extends `eslint-config-airbnb/hooks`, which reports both as errors:

```json
{
    "extends": ["@paysera", "@paysera/eslint-config/hooks"]
}
```

## Improving this config

Consider adding test cases if you're making complicated rules changes, like anything involving regexes. Perhaps in a distant future, we could use literate programming to structure our README as test cases for our .eslintrc?

You can run tests with `npm test`.

You can make sure this module lints with itself using `npm run lint`.
