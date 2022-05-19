const webpack = require('webpack');
const { merge } = require('webpack-merge');
const BasicWebpackConfig = require('./webpack.config.basic.js');
const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const exampleDirs = fs.readdirSync(path.resolve(__dirname, '../example'));

const entry = {};
const htmlPlugin = [];
if (exampleDirs && exampleDirs.length) {
	exampleDirs.forEach((dirName) => {
		entry[dirName] = path.resolve(__dirname, `../example/${dirName}/index.ts`);
		htmlPlugin.push(
			new HtmlWebpackPlugin({
				template: path.resolve(__dirname, `../example/${dirName}/index.html`),
				filename: `${dirName}.html`,
				chunks: [dirName],
				inject: true,
				cache: true,
			})
		);
	});
}

module.exports = merge(BasicWebpackConfig, {
	entry,
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].js',
		clean: true,
		publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
	},
	mode: 'development',
	devtool: 'source-map',
	devServer: {
		hot: true,
		port: 9999,
		open: '/webpack-dev-server',
	},
	plugins: [new webpack.HotModuleReplacementPlugin(), ...htmlPlugin],
});
