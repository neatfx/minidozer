'use strict'

process.env.BABEL_ENV = 'main'

const { join } = require('path')

const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

function resolve(dir) {
    return join(__dirname, '..', dir)
}

let config = {
    target: 'electron-main',
    entry: {
        main: resolve('main-process/main.ts')
    },
    output: {
        filename: '[name].js',
        path: resolve('dist/electron')
    },
    resolve: {
        extensions: ['.ts']
    },
    node: {
        __dirname: process.env.NODE_ENV !== 'production',
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                include: [
                    resolve('main-process')
                ],
                options: {
                    transpileOnly: true
                }
            }
        ]
    },
    plugins: [
        new ForkTsCheckerWebpackPlugin({
            reportFiles: [
                resolve('main-process/**/*.ts')
            ]
        })
    ]
}

if (process.env.NODE_ENV === 'development') {
}

if (process.env.NODE_ENV === 'production') {
    config.plugins.push(
        new CopyWebpackPlugin([
            {
                from: resolve('main-process/icons'),
                to: resolve('dist/electron/icons')
            }
        ])
    )
}

module.exports = config
