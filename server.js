var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require("./webpack/webpack.config.dev");
const IP_ENVIRONMENT = 'localhost';
new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    hot: true,
    historyApiFallback: true
})
    .listen(3000, IP_ENVIRONMENT, function (err, result) {
        if (err) {
            console.log(err);
        }
        console.log('Listening at '+IP_ENVIRONMENT+':3000');
    });