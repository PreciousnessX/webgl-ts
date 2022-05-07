const Path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const BasicWebpackConfig = require('./webpack.config.basic.js');


module.exports = merge(BasicWebpackConfig, {
    mode: 'development',
    devtool: 'source-map',
    output: {
      publicPath: '/'
    },
    devServer: {
      hot: true,
      port: 9999,
      open:true
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
  });