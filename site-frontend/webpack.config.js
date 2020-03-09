const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    devtool: "inline-source-map",

    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },

    output: {
        filename: '[name].[hash].js',
        path: path.resolve(__dirname, 'build'),
        publicPath: 'static'
    },

    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "ts-loader"
                    }
                ]
            },
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            }
        ]
    },

    devServer: {
        port: 8081,
        hot: true,
    },

    plugins: [
        new HtmlWebpackPlugin({
          template: path.resolve(__dirname, 'index.html'),
        }),
        new webpack.EnvironmentPlugin({
            API_URL: 'http://localhost:8080',
            NODE_ENV: 'development',
        }),
        new webpack.HotModuleReplacementPlugin(),
    ],
};
