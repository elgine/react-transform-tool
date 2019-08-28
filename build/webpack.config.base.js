const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const htmlTemplate = require('./htmlTemplate');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const config = require('./config');
const { getWebpackMode, isDev, isElectron } = require('./util');

let env;

const outputDir = isElectron() ? config.electronRendererOutputDir : config.webOutputDir;

const plugins = [
    new webpack.optimize.OccurrenceOrderPlugin()
];

if (isDev()) {
    env = {
        devtool: 'source-map',
        devServer: {
            historyApiFallback: true,
            inline: true,
            hot: true,
            ...config.devServer
        },
        module: {
            rules: [
                {
                    test: /\.(less|css)$/,
                    use: [
                        'style-loader',
                        'css-loader',
                        {
                            loader: 'less-loader',
                            options: {
                                javascriptEnabled: true
                            }
                        }
                    ]
                }
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                templateContent: htmlTemplate(isDev(), isElectron(), 'React transform-tool example')
            }),
            new webpack.HotModuleReplacementPlugin()
        ]
    };
} else {
    env = {
        module: {
            rules: [
                {
                    test: /\.(less|css)$/,
                    use: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: [
                            'css-loader',
                            'postcss-loader',
                            {
                                loader: 'less-loader',
                                options: {
                                    javascriptEnabled: true
                                }
                            }
                        ]
                    })
                }
            ]
        },
        plugins: [
            new CleanWebpackPlugin(),
            new ExtractTextPlugin({
                filename: 'css/index.css'
            }),
            new CompressionWebpackPlugin({
                filename: '[path].gz[query]',
                algorithm: 'gzip',
                test: /\.(js|css)$/,
                threshold: 10240,
                minRatio: 0.8
            })
        ]
    };
}

const base = {
    entry: path.resolve(__dirname, '../src/ui/index.tsx'),
    output: {
        path: outputDir,
        filename: 'index.js',
        publicPath: isElectron() && !isDev() ? './' : '/',
        chunkFilename: isDev() ? '[name].[hash].js' : '[name].js',
        library: 'ReactTransformTool',
        libraryTarget: 'umd',
        umdNamedDefine: true,
        globalObject: "typeof self !== 'undefined' ? self : this"
    },
    target: isElectron() ? 'electron-renderer' : 'web',
    mode: getWebpackMode(),
    resolve: {
        extensions: ['.tsx', '.ts', '.less', '.css', '.mjs', '.js', '.json']
    },
    externals: isDev() ? {} : {
        react: 'react'
    },
    module: {
        rules: [
            {
                test: /\.(j|t)sx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ]
    },
    plugins
};
module.exports = merge(base, env);