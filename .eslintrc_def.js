module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['airbnb-base', 'plugin:import/errors', 'plugin:import/warnings', 'prettier'],
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['@babel', 'import'],
  rules: {
    // "@babel/new-cap": "error",
    // "@babel/no-invalid-this": "error",
    // "@babel/no-unused-expressions": "error",
    // "@babel/object-curly-spacing": "error",
    // "@babel/semi": "error"
    'no-unused-expressions': ['error', { allowShortCircuit: true, allowTernary: true }],
  },
  settings: {
    // 'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
  },
};
