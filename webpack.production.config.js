const { resolve } = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

var fs = require('fs')
const pkgPath = resolve(__dirname, './package.json')
const pkg = fs.existsSync(pkgPath) ? require(pkgPath) : {}
let theme = {}
if (pkg.theme && typeof pkg.theme === 'string') {
	let cfgPath = pkg.theme
	// relative path
	if (cfgPath.charAt(0) === '.') {
		cfgPath = resolve(__dirname, cfgPath)
	}
	const getThemeConfig = require(cfgPath)
	theme = getThemeConfig()
} else if (pkg.theme && typeof pkg.theme === 'object') {
	theme = pkg.theme
}

const config = {
	devtool: 'cheap-module-source-map',

	entry: {
		app: [
			'./main.js'
		],
		vendor: ['babel-polyfill', 'react', 'react-dom', 'history', 'react-router-dom', 'axios', 'redux', 'react-redux', 'redux-saga']
	},

	output: {
		filename: 'bundle_[chunkhash:8].js',
		path: resolve(__dirname, 'dist'),
		publicPath: '/',
		chunkFilename: 'chunk_[chunkhash:8].js'
	},

	context: resolve(__dirname, 'app'),

	resolve: {
		extensions: ['.js', '.jsx', '.less'],
		alias: {
			components: `${__dirname}/app/components`,
			utils: `${__dirname}/app/utils`,
			config: `${__dirname}/app/utils/config`,
			services: `${__dirname}/app/services`,
			routers: `${__dirname}/app/routers`,
			reducers: `${__dirname}/app/reducers`,
			sagas: `${__dirname}/app/sagas`,
			store: `${__dirname}/app/store`,
			assets: `${__dirname}/app/assets`,
			themes: `${__dirname}/app/themes`,
		}
	},

	plugins: [
		new webpack.optimize.CommonsChunkPlugin({
			name: "vendor",
			filename: "vendor.js",
			minChunks: Infinity,
		}),
		new webpack.optimize.ModuleConcatenationPlugin(),
		new HtmlWebpackPlugin({
			template: `${__dirname}/app/index.html`,
			filename: 'index.html',
			inject: 'body',
		}),
		new webpack.optimize.OccurrenceOrderPlugin(),
		new webpack.LoaderOptionsPlugin({
			minimize: true,
			debug: false,
		}),
		new webpack.optimize.UglifyJsPlugin({
			beautify: false
		}),
		new webpack.DefinePlugin({ 'process.env': { NODE_ENV: JSON.stringify('production') } }),
		new ExtractTextPlugin({ filename: './styles/style_[chunkhash:8].css', disable: false, allChunks: true }),
		new CopyWebpackPlugin([{ from: './favicon.ico', to: 'favicon.ico' }]),
		new CopyWebpackPlugin([{ from: './vendors', to: 'vendors' }]),
	],

	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
			},
			{
				test: /\.less$/,
				include: resolve(__dirname, 'app'),
				exclude: resolve(__dirname, 'app/assets'),
				use: [
					require.resolve('style-loader'),
					{
						loader: require.resolve('css-loader'),
						options: {
							modules: true,
							importLoaders: 1,
							localIdentName: '[local]___[hash:base64:5]',
						},
					},
					{
						loader: require.resolve('postcss-loader'),
						options: {
							// Necessary for external CSS imports to work
							// https://github.com/facebookincubator/create-react-app/issues/2677
							ident: 'postcss',
							plugins: () => [
								require('postcss-flexbugs-fixes'),
								autoprefixer({
									browsers: [
										'>1%',
										'last 4 versions',
										'Firefox ESR',
										'not ie < 9', // React doesn't support IE8 anyway
									],
									flexbox: 'no-2009',
								}),
							],
						},
					},
					{
						loader: 'less-loader',
						query: {
							sourceMap: false,
						},
					},
				],
			},
			{
				test: /\.less$/,
				include: resolve(__dirname, 'app/assets'),
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: [
						'css-loader',
						{
							loader: require.resolve('postcss-loader'),
							options: {
								// Necessary for external CSS imports to work
								// https://github.com/facebookincubator/create-react-app/issues/2677
								ident: 'postcss',
								plugins: () => [
									require('postcss-flexbugs-fixes'),
									autoprefixer({
										browsers: [
											'>1%',
											'last 4 versions',
											'Firefox ESR',
											'not ie < 9', // React doesn't support IE8 anyway
										],
										flexbox: 'no-2009',
									}),
								],
							},
						},
						{
							loader: 'less-loader',
							query: {
								sourceMap: false,
							},
						},
					],
					publicPath: '../',
				}),
			},
			{
				test: /.less$/,  // antd 中的less
				include: resolve(__dirname, 'node_modules/antd'),  //这个路径要写准确，否则报错
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: [
						{
							loader: 'css-loader',
						},
						{
							loader: require.resolve('postcss-loader'),
							options: {
								// Necessary for external CSS imports to work
								// https://github.com/facebookincubator/create-react-app/issues/2677
								ident: 'postcss',
								plugins: () => [
									require('postcss-flexbugs-fixes'),
									autoprefixer({
										browsers: [
											'>1%',
											'last 4 versions',
											'Firefox ESR',
											'not ie < 9', // React doesn't support IE8 anyway
										],
										flexbox: 'no-2009',
									}),
								],
							},
						},
						{
							loader: 'less-loader',
							options: {
								sourceMap: false,
								modules: false,
								modifyVars: theme,
							},
						},
					],
				}),
			},
			{ test: /\.(png|jpg|gif)$/, use: 'url-loader?limit=10&name=images/[name].[ext]' },
			{ test: /\.eot(\?v=\d+.\d+.\d+)?$/, use: 'file-loader?name=styles/fonts/[name][hash:base64:8].[ext]' },
			{ test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, use: 'url-loader?limit=10&mimetype=application/font-woff&name=styles/fonts/[name][hash:base64:8].[ext]' },
			{ test: /\.[ot]tf(\?v=\d+.\d+.\d+)?$/, use: 'url-loader?limit=10&mimetype=application/octet-stream&name=styles/fonts/[name][hash:base64:8].[ext]' },
			{ test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, use: 'url-loader?limit=10&mimetype=image/svg+xml&name=styles/fonts/[name][hash:base64:8].[ext]' },
		]
	},
};

module.exports = config;
