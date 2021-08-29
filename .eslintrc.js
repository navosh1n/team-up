module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    // 'plugin:vue/essential',
    'plugin:vue/recommended',
    '@vue/airbnb',
  ],
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'import/extensions': 'off',
    'no-param-reassign': 'off',
    'import/prefer-default-export': 'off',
    'object-curly-newline': [
      'error', { multiline: true, consistent: true },
    ],
    'arrow-parens': 'off',
    'no-shadow': 'off',
    'class-methods-use-this': 'off',
    'no-unused-expressions': 'off',
    'no-underscore-dangle': 'off',
    'consistent-return': 'off',
    'no-plusplus': 'off',
    'no-nested-ternary': 'off',
    'no-bitwise': 'off',
    'no-return-assign': 'off', // todo
    'no-mixed-operators': 'off',
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)',
      ],
      env: {
        jest: true,
      },
    },
  ],
};
