module.exports = {
	entry: './src/index.ts',
	output: {
		filename: 'application.js',
		path: __dirname + '/dist'
	},

	devtool: 'source-map',

	resolve: {
		extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
	},

	module: {
		loaders: [
			{ test: /\.ts$/, loader: 'awesome-typescript-loader' }
		],
		preLoaders: [
			{ test: /\.js$/, loader: 'source-map-loader' }
		]
	},

	externals: {
		'angular': 'angular'
	}
};
