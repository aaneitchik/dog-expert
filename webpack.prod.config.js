const { merge } = require('webpack-merge');
const common = require('./webpack.config');
const TerserJSPlugin = require('terser-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  optimization: {
    minimize: true,
    minimizer: [new TerserJSPlugin({})],
  },
});
