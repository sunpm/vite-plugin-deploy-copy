/* eslint-env node */
module.exports = {
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    root: true,
    ignorePatterns: ['dist', 'node_modules'],
    rules: {
        '@typescript-eslint/no-var-requires': 'off',
        'no-console': 'off'
    }
};
