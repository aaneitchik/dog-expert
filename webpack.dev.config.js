const { join } = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.config');

module.exports = merge(common, {
  mode: 'development',
  devServer: {
    compress: false,
    contentBase: join(__dirname, 'dist'),
    historyApiFallback: true,
    hot: true,
    inline: true,
    overlay: true,
    writeToDisk: false,
  },
  devtool: 'cheap-module-eval-source-map',
  watch: true,
  watchOptions: {
    ignored: /node_modules/u,
  },
});
