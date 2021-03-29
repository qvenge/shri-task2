module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    'jest/globals': true,
  },
  extends: [
    // 'plugin:import/errors',
    // 'plugin:import/warnings',
    // 'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'airbnb-typescript/base',
    'plugin:jest/recommended',
    'plugin:jest/style',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
    'import',
    'jest',
    // 'prettier'
  ],
  rules: {
    // 'prettier/prettier': 'error',
    // 'import/extensions': [
    //   'error',
    //   'ignorePackages',
    //   {
    //     js: 'never',
    //     jsx: 'never',
    //     ts: 'never',
    //     tsx: 'never',
    //   },
    // ],
    // 'no-unused-vars': 'off',
    // '@typescript-eslint/no-unused-vars': ['error'],
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    '@typescript-eslint/lines-between-class-members': 0,
    '@typescript-eslint/no-unsafe-member-access': 0,
    '@typescript-eslint/unbound-method': ['error', { ignoreStatic: true }],
    '@typescript-eslint/no-unused-expressions': ['error', { allowShortCircuit: true, allowTernary: true }],
  },
  settings: {
    // 'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
  },
};
