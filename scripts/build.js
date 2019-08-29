'use strict'

process.env.NODE_ENV = 'production'

const del = require('del')
const webpack = require('webpack')
const yaml = require('js-yaml')
const builder = require('electron-builder')

let mainConfig
let rendererConfig
let dllConfig

function pack(config) {
    return new Promise((resolve, reject) => {
        config.mode = 'production'
        webpack(config, (err, stats) => {
            if (err) reject(err.stack || err)
            else if (stats.hasErrors()) {
                let err = ''

                stats
                    .toString({
                        chunks: false,
                        colors: true
                    })
                    .split(/\r?\n/)
                    .forEach(line => {
                        err += `    ${line}\n`
                    })

                reject(err)
            } else {
                resolve(
                    stats.toString({
                        chunks: false,
                        colors: true
                    })
                )
            }
        })
    })
}

function packDll() {
    del.sync(['dist/dll/**/*'])
    dllConfig = require('../config/webpack.conf.dll.js')
    dllConfig.mode = 'production'
    webpack(dllConfig, (err, stats) => {
        if (err || stats.hasErrors()) console.log(err)

        console.log(
            stats.toString({
                chunks: false,
                colors: true
            })
        )

        process.exit()
    })
}

function packRenderer() {
    del.sync(['dist/electron/**/*', '!dist/electron/icons', '!dist/electron/icons/**/*', '!dist/electron/main.js',])
    rendererConfig.mode = 'production'
    webpack(rendererConfig, (err, stats) => {
        if (err || stats.hasErrors()) console.log(err)

        console.log(
            stats.toString({
                chunks: false,
                colors: true
            })
        )

        process.exit()
    })
}

function build() {
    del.sync(['build/*'])

    let results = ''
    const packMain = pack(mainConfig)
        .then(result => {
            results += result + '\n\n'
            console.log('build-main-process')
        })
        .catch(error => {
            console.error('failed to build main process')
            console.log(error)
            process.exit(1)
        })
    const packRenderer = pack(rendererConfig)
        .then(result => {
            results += result + '\n\n'
            console.log('build-renderer-process')
        })
        .catch(error => {
            console.error('failed to build renderer process')
            console.log(error)
            process.exit(1)
        })
    const buildInfo = yaml.load('config/electron-builder.yml', {
        encoding: 'utf-8'
    })
    const loadBuilderConf = Promise.resolve(buildInfo)
        .then(result => {
            results += result + '\n\n'
            console.log('load-electron-builder-conf...')
            return result
        })
        .catch(error => {
            console.error('failed to load electron-builder config file')
            console.log(error)
            process.exit(1)
        })
    const buildStart = Date.now()

    Promise.all([packMain, packRenderer, loadBuilderConf])
        .then(result => {
            console.log(results)
            builder
                .build({
                    targets: builder.Platform.MAC.createTarget(),
                    config: result[2]
                })
                .then(res => {
                    console.log(res)
                    console.log(
                        'BUILD TIME: ',
                        Math.floor((Date.now() - buildStart) / 1000) + ' s'
                    )
                })
                .catch(e => {
                    console.error(e)
                })
        })
        .catch(e => console.log(e))
}

function clean() {
    del.sync([
        'build/*',
        'dist/dll/*',
        'dist/electron/*'
    ])
    process.exit()
}

switch (process.env.BUILD_TASK) {
    case 'clean':
        clean()
        break
    case 'dll':
        packDll()
        break
    case 'renderer':
        rendererConfig = require('../config/webpack.conf.renderer.js')
        packRenderer()
        break
    default:
        mainConfig = require('../config/webpack.conf.main.js')
        rendererConfig = require('../config/webpack.conf.renderer.js')
        build()
}

