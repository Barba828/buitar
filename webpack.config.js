const { resolve, join } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const WebpackPwaManifest = require('webpack-pwa-manifest')

const isProduction = process.env.NODE_ENV === 'production'
// const isDocs = process.env.NODE_OUT === 'docs'

module.exports = {
	mode: isProduction ? 'production' : 'development',
	entry: {
		main: resolve(__dirname, 'src/index.ts'),
	},
	module: {
		rules: [
			{
				test: /\.(tsx|ts)?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader', 'postcss-loader'],
			},
			{
				test: /\.(sass|scss)$/,
				use: [
					'style-loader',
					{
						loader: 'css-loader',
						options: {
							modules: {
								// localIdentName: '[path][local]--[hash:base64:6]',
								localIdentName: '[local]--[hash:base64:6]', // classname添加 hash 后缀
							},
						},
					},
					{
						loader: 'postcss-loader',
					},
					{
						loader: 'sass-loader',
						options: {
							// sourceMap: true,
						},
					},
					{
						loader: 'sass-resources-loader',
						options: { resources: resolve(__dirname, 'src/style/app.scss') },
					},
				],
			},
			{
				test: /\.(mp3|wav|ogg)$/,
				use: {
					loader: 'file-loader',
					options: {
						name: '[path][name].[ext]',
						outputPath: '',
					},
				},
			},
			{
				test: /\.(png|jpg)$/,
				use: {
					loader: 'url-loader', // 限制大小，小于指定大小的图片会转成base64，减少请求，（大图则继续请求路径获取，提高首次渲染速度）
					options: {
						esModule: false,
						limit: 5 * 1024, // 5kb 小于该值的图片转成base64
						publicPath: './images/',
						outputPath: 'images/', // 图片输出路径 大于5k打包到该路径下
						filename: '[name].[chunkhash:6].[ext]',
					},
				},
			},
		],
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js', 'json', 'sass'],
		alias: {
			'@': resolve(__dirname, 'src/'),
			'~': resolve(__dirname, 'static/'),
		},
	},
	output: {
		path: resolve(__dirname, 'dist'),
		filename: 'static/js/[name].[chunkhash:6].js',
		chunkFilename: 'static/js/[name].[contenthash:6].js',
	},
	plugins: [
		new CopyWebpackPlugin({
			patterns: [
				{
					from: resolve(__dirname, 'public'),
					to: process.env.NODE_OUT,
					globOptions: {
						ignore: ['**/.DS_Store', resolve(__dirname, 'public/index.html')],
					},
				},
			],
		}),
		new WebpackPwaManifest({
			name: "Buitar",
			short_name: 'Buitar',
			description: '吉他和弦乐理应用',
			background_color: '#3f4345',
			theme_color: '#3f4345',
			filename: 'manifest.[hash:8].json',
			publicPath: '/',
			icons: [
				{
					src: resolve(__dirname, 'static/logo.png'),
					sizes: [96, 128, 192, 256, 384, 512], // multiple sizes
				},
			],
			ios: {
				'apple-mobile-web-app-title': 'Buitar',
				'apple-mobile-web-app-status-bar-style': '#3f4345',
				'apple-mobile-web-app-capable': 'yes',
			},
		}),
		new HtmlWebpackPlugin({
			template: resolve(__dirname, 'public/index.html'),
		}),
	],
	externals: isProduction
		? {
				react: 'React',
				'react-dom': 'ReactDOM',
		  }
		: {},
	devServer: {
		port: 8282, // 服务器端口号
		proxy: {}, //
		headers: {
			'Access-Control-Allow-Origin': '*',
		},
		historyApiFallback: true,
	},
	devtool: isProduction ? 'cheap-module-source-map' : 'source-map',
}
