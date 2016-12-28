var fs = require('fs');

var nodeModules = { };

fs.readdirSync('./node_modules')
	.filter(function (directory) {
		return ['.bin'].indexOf(directory) === -1;
	})
	.forEach(function (name) {
		nodeModules[name] = 'commonjs ' + name;
	});

var clientConfig = {
	entry: {
		application: './src/client/application.ts',
		vendor: './src/client/vendor.ts'
	},
	output: {
		path: __dirname + '/dist/client',
		filename: '[name].js'
	},

	resolve: {
		extensions: ['', '.ts', '.js']
	},

	module: {
		loaders: [
			{ test: /\.ts$/, loader: 'awesome-typescript-loader?configFileName=./src/client/tsconfig.json' },
			{ test: /\.html$/, loader: 'file-loader?name=./[name].[ext]' }
		]
	}
};

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
