const path = require('path');

const isProductionBuild = process.env.NODE_ENV === 'production';

module.exports = {
  // target: 'node',
  mode: isProductionBuild ? 'production' : 'development',
  context: path.resolve(__dirname, 'src'),
  entry: './prepareData.ts',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'build'),
    clean: true,
    library: {
      type: 'commonjs2',
    },
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.(ts|js)$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
        },
      },
    ],
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.tsx', '.ts', '.js', '.jsx', '.css'],
  },
};
