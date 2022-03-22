const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const isProduction = process.env.NODE_ENV === 'production'
const isDocs = process.env.NODE_OUT === 'docs'

module.exports = {
	mode: isProduction ? 'production' : 'development',
	entry: {
		main: './index.ts',
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
								localIdentName: '[local]--[hash:base64:6]',
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
						options: { resources: path.resolve(__dirname, 'style/app.scss') },
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
			'@': path.resolve(__dirname, 'src/'),
			'~': path.resolve(__dirname, 'static/'),
		},
	},
	output: {
		filename: '[name].[chunkhash:6].js',
		path: path.resolve(__dirname, isDocs ? 'docs' : 'dist'),
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './index.html',
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
	devtool: 'source-map',
}
// file:///Users/liningzhu/Desktop/BarbaGit/Buitar/dist/main.3de68b.js
// file:///static/samples/guitar-acoustic/Fs3.ogg
