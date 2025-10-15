module.exports = {
  root: true,
  env: { browser: true, node: true },
  extends: ['eslint:recommended'],
  parser: '@typescript-eslint/parser',
  rules: {
    'no-unused-vars': 'warn',
    'prefer-const': 'error',
  },
  ignorePatterns: ['dist/', 'node_modules/'],
};
