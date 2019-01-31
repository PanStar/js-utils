const path = require('path');
const webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  entry: './src/index.js', // 入口文件，就是上步骤的src目录下的index.js文件，
  output: {
    path: path.resolve(__dirname, './dist'), // 输出路径，就是上步骤中新建的dist目录，
    publicPath: '/dist/',
    filename: 'js-utils.js',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  ]
};
