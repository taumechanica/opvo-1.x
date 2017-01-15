const fs = require('fs');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const nodeModules = { };

fs.readdirSync('./node_modules')
	.filter(function (directory) {
		return ['.bin'].indexOf(directory) === -1;
	})
	.forEach(function (name) {
		nodeModules[name] = `commonjs ${name}`;
	});

const clientConfig = {
	entry: {
		application: './src/client/application.ts',
		vendor: './src/client/vendor.ts'
	},
	output: {
		path: `${__dirname}/dist/client`,
		filename: '[name].js'
	},

	resolve: {
		extensions: ['', '.ts', '.js']
	},

	module: {
		loaders: [
			{ test: /\.ts$/, loader: 'awesome-typescript-loader?configFileName=./src/client/tsconfig.json' },
			{ test: /src\/client\/application\.pug$/, loaders: [
				'file-loader?name=[name].html',
				'pug-html-loader?exports=false'
			] },
			{ test: /src\/client\/(.+?)\/.+?\.pug$/, loaders: [
				'file-loader?regExp=src\/client\/(.+?)\/&name=[1]/[name].html',
				'pug-html-loader?exports=false'
			] },
			{ test: /\.less$/, loader: ExtractTextPlugin.extract(
				'style-loader', 'css-loader!postcss-loader!less-loader'
			) }
		]
	},

	plugins: [
		new webpack.optimize.CommonsChunkPlugin({
			name: ['application', 'vendor']
		}),
		new ExtractTextPlugin('application.css', { allChunks: false })
	]
};

const serverConfig = {
	target: 'node',
	node: {
		__dirname: false
	},

	entry: './src/server/application.ts',
	output: {
		path: `${__dirname}/dist/server`,
		filename: 'application.js'
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
