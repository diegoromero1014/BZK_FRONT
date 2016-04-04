var path = require('path'),
    autoprefixer = require('autoprefixer'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    webpack = require('webpack'),
    config = {
        entry: [
            './src/index.js',
            'webpack-dev-server/client?http://0.0.0.0:3000', // WebpackDevServer host and port
            'webpack/hot/only-dev-server' // "only" prevents reload on syntax errors
        ],
        devtool: 'eval',
        output: {
            path: path.join(__dirname, 'dist'),
            filename: 'bundle.js',
            publicPath: '/static/'
        },
        resolve: {
            extensions: ['', '.jsx', '.scss', '.js', '.json'],  // along the way, subsequent file(s) to be consumed by webpack
            modulesDirectories: [
                'node_modules',
                path.resolve(__dirname, '../node_modules')
            ]
        },
        module: {
            loaders: [
                {
                    test: /\.jsx?$/,
                    loaders: ['react-hot', 'babel'],
                    include: path.join(__dirname, '../src')
                },
                {
                    test: /\.(scss|css)$/,
                    loaders: ["style", "css", "sass"]
                },
                {
                    test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                    loader: "url-loader?limit=10000&minetype=application/font-woff"
                },
                {
                    test: /\.(ttf|eot|svg|gif)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                    loader: "file-loader"
                },
                {
                    test: /\.(png|jpg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                    loader: "file-loader"
                }
            ]
        },
        plugins: [
            new ExtractTextPlugin('styles.css', {allChunks: true}),  // compiled css (single file only)
            new webpack.HotModuleReplacementPlugin(),
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': '"development"'
            })
        ]
    };

module.exports = config;