const path = require('path');

const isProductionBuild = process.env.NODE_ENV === 'production';

module.exports = {
  mode: isProductionBuild ? 'production' : 'development',
  context: path.resolve(__dirname, 'src'),
  entry: './prepareData.ts',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'build'),
    clean: true,
  },
  // devtool: !isProductionBuild ? 'inline-source-map' : undefined,
  module: {
    rules: [
      {
        test: /\.(ts|js)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.tsx', '.ts', '.js', '.jsx', '.css'],
  },
};
