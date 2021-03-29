const jsConfig = require('./eslint.configs/eslintrc.javascript');
const tsConfig = require('./eslint.configs/eslintrc.typescript');

module.exports = {
  overrides: [
    { files: ['**/*.js'], ...jsConfig },
    { files: ['**/*.ts'], ...tsConfig },
  ],
};
