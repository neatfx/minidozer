'use strict'

const { join } = require('path')

const webpack = require('webpack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
    .BundleAnalyzerPlugin

const react = [
    'react',
    'react-dom',
]

function resolve(dir) {
    return join(__dirname, '..', dir)
}

const config = {
    target: 'electron-renderer',
    entry: {
        react: react
    },
    output: {
        path: resolve('dist/dll'),
        filename: '[name].dll.js',
        library: '[name]'
    },
    resolve: {
        alias: {
            'react-dom': '@hot-loader/react-dom'
        }
    },
    plugins: [
        new webpack.DllPlugin({
            context: __dirname,
            path: resolve('dist/dll/[name].manifest.json'),
            name: '[name]'
        })
    ]
}

if (process.env.npm_config_analyze) {
    config.plugins.push(
        new BundleAnalyzerPlugin({
            analyzerMode: 'static'
        })
    )
}

module.exports = config
