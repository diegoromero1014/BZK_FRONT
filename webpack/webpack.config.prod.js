require('babel-polyfill');


var webpack = require('webpack'),
    path = require('path'),
    autoprefixer = require('autoprefixer'),
    CleanPlugin = require('clean-webpack-plugin'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    assetsPath = path.join(__dirname, '../dist'),
    strip = require('strip-loader'),
    projectRootPath = path.resolve(__dirname, '../'),
    WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin'),
    webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(require('./webpack-isomorphic-tools')),
    config = {
        devtool: 'source-map',
        context: path.resolve(__dirname, '..'),
        entry: {
            'main': [
                './src/index.js'
            ]
        },
        output: {
            path: assetsPath,
            filename: '[name]-[chunkhash].js',
            chunkFilename: '[name]-[chunkhash].js',
            publicPath: '/',
        },
        progress: true,
        resolve: {
            modulesDirectories: [
                'src',
                'node_modules'
            ],
            extensions: ['', '.json', '.js', '.jsx', '.scss']
        },
        module: {
            loaders: [
                {test: /\.jsx?$/, exclude: /node_modules/, loaders: [strip.loader('debug'), 'babel']},
                {test: /\.json$/, loader: 'json-loader'},
                {
                    test: /\.less$/,
                    loader: ExtractTextPlugin.extract('style', 'css!less'),
                    include: /react\-widgets/
                },
                {
                    test: /(\.scss)$/,
                    loader: ExtractTextPlugin.extract('style', 'css!sass')
                },
                {
                    test: /\.css$/,
                    include: [/flexboxgrid/, /bootstrap/],
                    loader: ExtractTextPlugin.extract('style', 'css')
                },
                {
                    test: /\.woff(2)?(\?v=[0-9].[0-9].[0-9])?$/,
                    loader: "url-loader?mimetype=application/font-woff"
                },
                {
                    test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                    loader: "url?limit=10000&mimetype=application/octet-stream"
                },
                {
                    test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                    loader: "file"
                },
                {
                    test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                    loader: "url?limit=10000&mimetype=image/svg+xml"
                },
                {
                    test: webpackIsomorphicToolsPlugin.regular_expression('images'),
                    loader: 'url-loader?limit=10240'
                }
            ]
        },
        plugins: [
            new CleanPlugin([assetsPath], {root: projectRootPath}),

            // css files from the extract-text-plugin loader
            new ExtractTextPlugin('[name]-[chunkhash].css', {allChunks: true}),
            new webpack.DefinePlugin({
                "process.env": {
                    NODE_ENV: JSON.stringify("production")
                },

                __CLIENT__: true,
                __SERVER__: false,
                __DEVELOPMENT__: false,
                __DEVTOOLS__: false
            }),

            // ignore dev config
            new webpack.IgnorePlugin(/\.\/dev/, /\/config$/),

            // optimizations
            new webpack.optimize.DedupePlugin(),
            new webpack.optimize.OccurenceOrderPlugin(),
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                }
            }),

            webpackIsomorphicToolsPlugin
        ]
    };

module.exports = config;
