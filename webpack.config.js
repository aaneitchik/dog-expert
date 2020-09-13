const autoPrefixer = require('autoprefixer');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const configuration = {
  cache: true,
  entry: {
    app: './src/index.tsx',
  },
  module: {
    rules: [
      {
        loader: 'html-loader',
        options: {
          attrs: ['img:src', 'link:href'],
        },
        test: /\.html$/u,
      },
      {
        test: /\.worker\.(js|ts)$/i,
        use: [
          {
            loader: 'comlink-loader',
            options: {
              singleton: true,
            },
          },
        ],
      },
      {
        test: /\.tsx?$/u,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: 'tsconfig.json',
              experimentalFileCaching: true,
              experimentalWatchApi: true,
              transpileOnly: true,
            },
          },
        ],
      },
      {
        test: /\.css$/u,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [autoPrefixer()],
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.(svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[hash].[ext]',
              outputPath: 'assets/images',
            },
          },
        ],
      },
    ],
  },
  output: {
    filename: 'chunks/[name].js',
    pathinfo: true,
    publicPath: '/',
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: true,
      dry: false,
      protectWebpackAssets: true,
      verbose: false,
    }),
    new HtmlWebpackPlugin({
      inject: true,
      minify: false,
      template: 'src/index.html',
    }),
  ],
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    mainFields: ['browser', 'module', 'main'],
  },
};

module.exports = configuration;
