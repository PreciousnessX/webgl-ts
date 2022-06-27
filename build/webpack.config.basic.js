const Path = require('path');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
	// context: Path.join(__dirname, '../src'),
	// entry: {
	// 	index: Path.resolve(__dirname, '../src/index.ts'),
	// },
	// output: {
	// 	path: Path.join(__dirname, '../dist'),
	// 	filename: '[name].js',
	// 	publicPath: './',
	// },
	module: {
		rules: [
			{
				test: /\.m?js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env'],
						plugins: ['@babel/plugin-transform-runtime'],
					},
				},
			},
			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				loader: 'ts-loader',
			},
			{
				test: /\.glsl$/,
				use: ['glslify-import-loader', 'raw-loader', 'glslify-loader'], // https://zhuanlan.zhihu.com/p/51332085  (glslify-loader  模块化glsl 解析插件)
			},
			{
				test: /\.(png|jpg|jpeg|gif)$/,
				use: {
					loader: 'url-loader',
					options: {
						limit: 5 * 1024,
						outputPath: '/img1/',

						// 设置图片的 cdn 地址（也可以统一在外面的 output 中设置，那将作用于所有静态资源）
						// publicPath: 'http://cdn.abc.com'
					},
				},
			},
			{
				test: /\.(scss|css)$/,
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
		new CopyPlugin({
			patterns: [
				{
					from: 'assets',
					to: 'assets',
				},
			],
		}),
		// new HtmlWebpackPlugin({
		// 	template: Path.resolve(__dirname, '../src/index.html'),
		// 	filename: 'index.html',
		// }),
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
