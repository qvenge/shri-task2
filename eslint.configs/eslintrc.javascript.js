module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    'jest/globals': true,
  },
  extends: [
    'airbnb-base',
    // 'plugin:import/errors',
    // 'plugin:import/warnings',
    'plugin:jest/recommended',
    'plugin:jest/style',
    'prettier',
  ],
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    '@babel',
    'import',
    'jest',
    // 'prettier'
  ],
  rules: {
    // "@babel/new-cap": "error",
    // "@babel/no-invalid-this": "error",
    // "@babel/no-unused-expressions": "error",
    // "@babel/object-curly-spacing": "error",
    // "@babel/semi": "error"
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'no-unused-expressions': ['error', { allowShortCircuit: true, allowTernary: true }],
  },
  settings: {
    // 'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
  },
};
