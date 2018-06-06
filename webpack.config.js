const { resolve, join } = require('path');

const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');

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

const port = 8180

const config = {
	devtool: 'cheap-module-eval-source-map',
	entry: {
		app: [
			'babel-polyfill',
			'react-hot-loader/patch',
			`webpack-dev-server/client?http://localhost:${port}`,
			'webpack/hot/only-dev-server',
			'./main.js'
		],
		vendor: ['react', 'react-dom', 'history', 'react-router-dom', 'axios', 'redux', 'react-redux', 'redux-saga']
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

	devServer: {
		publicPath: '/',
		port: port,
		proxy: { // proxy URLs to backend development server
			'/api': 'http://localhost:3000',
			// '/api': 'http://192.168.100.54:8080',
		},
		contentBase: resolve(__dirname, '/'), // boolean | string | array, static file location
		compress: true, // enable gzip compression
		historyApiFallback: true, // true for index.html upon 404, object for multiple paths
		hot: true, // hot module replacement. Depends on HotModuleReplacementPlugin
		https: false, // true for self-signed, object for cert authority
		noInfo: true, // only errors & warns on hot reload
	},

	module: {
		rules: [
			{
				test: /\.jsx?$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
                query: {
                    presets: ['env', 'react'],
                    plugins: ["react-hot-loader/babel"]
                }
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
								sourceMap: true,
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

	plugins: [
		new webpack.optimize.CommonsChunkPlugin({
			name: "vendor",
			filename: "vendor.js",
			minChunks: Infinity,
		}),
		new webpack.optimize.ModuleConcatenationPlugin(),
		new ExtractTextPlugin({ filename: 'styles/style_[chunkhash:8].css', disable: false, allChunks: true }),
		new HtmlWebpackPlugin({
			template: `${__dirname}/app/index.html`,
			filename: 'index.html',
			inject: 'body',
		}),
		new CopyWebpackPlugin([{ from: './favicon.ico', to: 'favicon.ico' }]),
		new CopyWebpackPlugin([{ from: 'vendors', to: 'vendors' }]),
		new OpenBrowserPlugin({ url: `http://localhost:${port}` }),
		new webpack.HotModuleReplacementPlugin(),
	],
};

module.exports = config;
