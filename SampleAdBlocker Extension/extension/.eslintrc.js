module.exports = {
    extends: ['airbnb-typescript/base'],
    parserOptions: {
        project: 'tsconfig.json',
    },
    rules: {
        'indent': ['error', 4, {SwitchCase: 1}],
        '@typescript-eslint/indent': ['error', 4],
        'import/prefer-default-export': 0,
        'import/no-extraneous-dependencies': 0,
        'arrow-body-style': 0,
    }
};