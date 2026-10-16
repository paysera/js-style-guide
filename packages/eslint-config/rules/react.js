module.exports = {
    plugins: [
        'react',
    ],
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
    },
    rules: {
        // Validate props indentation in JSX
        // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-indent-props.md
        'react/jsx-indent-props': ['error', 4],

        // Enforce JSX indentation
        // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-indent.md
        'react/jsx-indent': ['error', 4],

        'react/require-default-props': ['error', {
            forbidDefaultForRequired: true,
            classes: 'defaultProps',
            functions: 'defaultArguments',
        }],

        'react/no-unsafe': ['error', { checkAliases: true }],
    },
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.js', '.jsx', '.json']
            }
        }
    }
};
