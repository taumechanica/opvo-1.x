const fs = require('fs');
const glob = require('glob');
const webpack = require('webpack');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const nodeModules = { };

fs.readdirSync('./node_modules')
    .filter(directory => {
        return ['.bin'].indexOf(directory) === -1;
    })
    .forEach(name => {
        nodeModules[name] = `commonjs ${name}`;
    });

const clientConfig = {
    entry: {
        'application': './src/client/application.ts',
        'application.spec': glob.sync('./src/client/**/*.spec.ts'),
        'vendor': './src/client/vendor.ts'
    },
    output: {
        path: `${__dirname}/dist/client`,
        filename: '[name].js'
    },

    resolve: {
        extensions: ['.ts', '.js']
    },

    module: {
        loaders: [
            { test: /\.ts$/, loaders: [
                'ng-annotate-loader',
                'awesome-typescript-loader?configFileName=./src/client/tsconfig.json'
            ] },
            { test: /\.svg$/, loader: 'file-loader?name=images/[name].svg' },
            { test: /src\/client\/application\.pug$/, loaders: [
                'file-loader?name=[name].html',
                'pug-html-loader?exports=false'
            ] },
            { test: /src\/client\/(.+\/)[^\/]+\.pug$/, loaders: [
                'file-loader?regExp=src\/client\/modules\/(.+\/)&name=modules/[1][name].html',
                'pug-html-loader?exports=false'
            ] },
            { test: /\.less$/, loader: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: 'css-loader!postcss-loader!less-loader'
            }) },
            { test: /\.css$/, loader: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: 'css-loader'
            }) }
        ]
    },

    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: ['application', 'vendor']
        }),
        new CopyWebpackPlugin([{
            from: './src/client/assets/i18n',
            to: 'i18n'
        }]),
        new ExtractTextPlugin({
            filename: '[name].css',
            allChunks: false
        })
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
        extensions: ['.ts', '.js']
    },

    module: {
        loaders: [
            { test: /\.ts$/, loader: 'awesome-typescript-loader?configFileName=./src/server/tsconfig.json' }
        ]
    },

    externals: nodeModules
};

module.exports = [clientConfig, serverConfig];
