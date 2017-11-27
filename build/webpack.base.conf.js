'use strict';
const path = require('path');
const utils = require('./utils');
const config = require('../config');
const vueLoaderConfig = require('./vue-loader.conf');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

function resolve(dir) {
    return path.join(__dirname, '..', dir);
}

var assetsSubDirectory =
    process.env.NODE_ENV === 'production'
        ? config.build.assetsSubDirectory
        : config.dev.assetsSubDirectory;
module.exports = {
    entry: {
        app: './src/main.js'
    },
    output: {
        path: config.build.assetsRoot,
        filename: '[name].js',
        publicPath:
            process.env.NODE_ENV === 'production'
                ? config.build.assetsPublicPath
                : config.dev.assetsPublicPath
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            vue$: 'vue/dist/vue.esm.js',
            '@': resolve('src'),
            common: resolve('src/common'),
            components: resolve('src/components'),
            services: resolve('src/services'),
            // 'api': resolve('src/api'),
            base: resolve('src/base'),
            store: resolve('src/store')
        }
    },
    module: {
        rules: [
            {
                test: /\.(js|vue)$/,
                loader: 'eslint-loader',
                enforce: 'pre',
                include: [resolve('src'), resolve('test')],
                options: {
                    formatter: require('eslint-friendly-formatter')
                }
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: vueLoaderConfig
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [resolve('src'), resolve('test')]
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('img/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('media/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
                }
            },
            {
                /* 为了解决全局加载 signalr.js 出现的jQuery 未定义的问题，
                   需要expose-loader插件。
                   The expose loader adds modules to the global object. 
                   This is useful for debugging or supporting libraries 
                   that depend on libraries in globals.
                */
                test: require.resolve('jquery'),
                use: [
                    {
                        loader: 'expose-loader',
                        options: 'jQuery'
                    },
                    {
                        loader: 'expose-loader',
                        options: '$'
                    }
                ]
            },
            {
                test: require.resolve('toastr'),
                use: [
                    {
                        loader: 'expose-loader',
                        options: 'toastr'
                    }
                ]
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            'window.jQuery': 'jquery',
            'window.$': 'jquery',
            jQuery: 'jquery',
            $: 'jquery',
            'window.toastr': 'toastr',
            toastr: 'toastr'
        }),
        new CopyWebpackPlugin([
            {
                context: path.resolve(
                    __dirname,
                    '../src/vendor/abp/scripts/libs/'
                ),
                to: assetsSubDirectory + '/abp/',
                from: {
                    glob: 'abp.signalr.js',
                    dot: true
                }
            },
            {
                context: path.resolve(
                    __dirname,
                    '../static/images/'
                ),
                to: assetsSubDirectory + '/images/',
                from: {
                    glob: '**.*',
                    dot: true
                }
            }
        ])
    ]
};
