var fs = require('fs');

var clientConfig = {
	entry: './src/client/index.ts',
	output: {
		path: __dirname + '/dist',
		filename: 'client.js'
	},

	devtool: 'source-map',

	resolve: {
		extensions: ['', '.ts', '.js']
	},

	module: {
		loaders: [
			{ test: /\.ts$/, loader: 'awesome-typescript-loader?configFileName=./src/client/tsconfig.json' },
			{ test: /\.html$/, loader: 'file-loader?name=./[name].[ext]' }
		],
		preLoaders: [
			{ test: /\.js$/, loader: 'source-map-loader' }
		]
	},

	externals: {
		'angular': 'angular'
	}
};

var nodeModules = { };

fs.readdirSync('./node_modules')
	.filter(function (directory) {
		return ['.bin'].indexOf(directory) === -1;
	})
	.forEach(function (name) {
		nodeModules[name] = 'commonjs ' + name;
	});

var serverConfig = {
	target: 'node',
	node: {
		__dirname: false
	},

	entry: './src/server/hapi.ts',
	output: {
		path: __dirname + '/dist',
		filename: 'server.js'
	},

	resolve: {
		extensions: ['', '.ts', '.js']
	},

	module: {
		loaders: [
			{ test: /\.ts$/, loader: 'awesome-typescript-loader?configFileName=./src/server/tsconfig.json' }
		]
	},

	externals: nodeModules
};

module.exports = [clientConfig, serverConfig];
