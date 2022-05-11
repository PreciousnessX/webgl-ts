const Path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
	context: Path.join(__dirname, '../src'),
	entry: {
		index: Path.resolve(__dirname, '../src/index.ts'),
	},
	output: {
		path: Path.join(__dirname, '../dist'),
		filename: '[name].js',
		publicPath: './',
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				loader: 'ts-loader',
			},
			{
				test: /\.glsl$/,
				use: ['glslify-import-loader', 'raw-loader', 'glslify-loader'],
			},
			{
				test: /\.scss$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
					},
					'sass-loader',
				],
			},
		],
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: '[name].css',
		}),
		new HtmlWebpackPlugin({
			template: Path.resolve(__dirname, '../src/index.html'),
			filename: 'index.html',
		}),
	],
	resolve: {
		extensions: ['.ts', '.json', '.scss', '.glsl', '.js'],
		plugins: [
			new TsConfigPathsPlugin({
				configFile: Path.resolve(__dirname, '../tsconfig.json'),
			}),
		],
	},
};
