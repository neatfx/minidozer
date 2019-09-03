'use strict'

process.env.BABEL_ENV = 'renderer'

const { join } = require('path')

const webpack = require('webpack')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
    .BundleAnalyzerPlugin

const dlls = require('./webpack.conf.dll.js').entry

function resolve(dir) {
    return join(__dirname, '..', dir)
}

const config = {
    target: 'electron-renderer',
    entry: [
        'webpack-dev-server/client?http://0.0.0.0:3000',
        resolve('renderer-process/index.tsx')
    ],
    output: {
        path: resolve('dist/electron'),
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        alias: {
            'react-dom': '@hot-loader/react-dom',
            '@components': resolve('renderer-process/components'),
            '@modules': resolve('renderer-process/modules'),
            '@minidozer': resolve('renderer-process/minidozer')
        }
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                include: [
                    resolve('renderer-process') 
                ],
                loader: 'ts-loader',
                options: {
                    transpileOnly: true
                }
            }
        ]
    },
    plugins: [
        new ForkTsCheckerWebpackPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: resolve('renderer-process/index.ejs'),
            scripts: Object.keys(dlls).map(key => key + '.dll.js'),
            files: {
                css: []
            },
            minify: {
                collapseWhitespace: true,
                removeAttributeQuotes: true,
                removeComments: true
            }
        })
    ],
    optimization: {
        runtimeChunk: {
            name: entrypoint => `runtime~${entrypoint.name}`
        }
    }
}

Object.keys(dlls).map(dll => {
    config.plugins.push(
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require(resolve('dist/dll/' + dll + '.manifest.json'))
        })
    )
})

if (process.env.NODE_ENV === 'development') {
    // 
}
if (process.env.NODE_ENV === 'production') {
    config.entry = [resolve('renderer-process/index.tsx')]
    config.plugins.push(
        new CopyWebpackPlugin([
            {
                from: resolve('dist/dll'),
                to: resolve('dist/electron'),
                ignore: ['*.json', '.html']
            }
        ])
    )
}

if(process.env.npm_config_analyze){
    config.plugins.push(
        new BundleAnalyzerPlugin({
            analyzerMode: 'static'
        })
    )
}

module.exports = config
