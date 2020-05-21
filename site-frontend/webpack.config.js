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

    optimization: {
        splitChunks: {
            chunks: 'initial',
            minSize: 30000,
            maxSize: 0,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '~',
            automaticNameMaxLength: 30,
            name: true,
            cacheGroups: {
              vendors: {
                test: /[\\/]node_modules[\\/]/,
                priority: -10
              },
              default: {
                minChunks: 2,
                priority: -20,
                reuseExistingChunk: true
              }
            }
          }
    }
};
