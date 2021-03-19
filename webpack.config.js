const path = require('path')
const { CleanPlugin } = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const isProd = process.env.mode === 'prod'

module.exports = {
    mode: isProd ? 'development' : 'production',
    target: ['web', 'es5'],
    entry: './src/main.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js'
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        port: 8888,
        hot: true,
        // open: true, // automatically open the browser
        // compress: true, // disable this for HMR
    },
    module: {
        rules: [
            { 
                test: /\.css$/i, 
                use: [
                    isProd ? MiniCssExtractPlugin.loader : 'style-loader', 
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                auto: (resourcePath) => resourcePath.endsWith('.module.css'),
                                localIdentName: 'mi__[local]--[hash:base64:5]'
                            }
                        }
                    }
                ] 
            },
            { 
                test: /\.(eot|svg|woff|woff2|ttf|png)$/i, 
                use: [{
                    loader: 'file-loader',
                    options: {
                        outputPath: 'iconfont'
                    }
                }] 
            },
            { test: /\.tsx?$/i, use: ['ts-loader'], exclude: ['/node_modules/'] },
            // {
            //     // faster(maybe?) alternatives
            //     // do not need to install typescript as a dependency,
            //     // since we are using babel for transpilation 
            //     // and vscode for type checking 
            //     test: /\.tsx?$/i,
            //     exclude: ['/node_modules/'], 
            //     loader: 'babel-loader', 
            //     options: { 
            //         presets: [
            //             '@babel/preset-env', 
            //             '@babel/preset-typescript'
            //         ] 
            //     } 
            // },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            favicon: 'favicon.png',
            template: './src/index.html'
        }),
        new CleanPlugin(),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css',
        })
    ],
    resolve: {
        extensions: ['.tsx', '.ts', '.js', 'json'],
    },
    optimization: {
        minimize: true,
        minimizer: [
            new CssMinimizerPlugin(),
        ]
    }
}
