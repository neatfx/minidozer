'use strict'

process.env.NODE_ENV = 'development'

const webpackDevServer = require('webpack-dev-server')
const webpack = require('webpack')
const electron = require('electron')
const path = require('path')
const chalk = require('chalk')
const { spawn } = require('child_process')

const rendererConfig = require('../config/webpack.conf.renderer.js')
const mainConfig = require('../config/webpack.conf.main.js')
const config = require('../config/development.json')

let electronProcess = null
let manualRestart = false

function logStats(proc, data) {
    let log = ''

    log += '\n'
    log += chalk.hex('#4B8Dd3').bold(`+--- ${proc} Process ${new Array(19 - proc.length + 1).join('-')}`)
    log += '\n'
    log += chalk.hex('#4B8Dd3').bold('|\n')

    if (typeof data === 'object') {
        data
            .toString({
                colors: true,
                chunks: false
            })
            .split(/\r?\n/)
            .forEach(line => {
                log += chalk.hex('#4B8Dd3').bold('  ') + line + '\n'
            })
    } else {
        log += `  ${data}\n`
    }

    log += chalk.hex('#4B8Dd3').bold('|\n')
    log += chalk.hex('#4B8Dd3').bold(`+${new Array(28 + 1).join('-')}` + '\n')

    console.log(log)
}

function startRenderer() {
    return new Promise((resolve, reject) => {
        rendererConfig.mode = 'development'
        const compiler = webpack(rendererConfig)
        compiler.hooks.compilation.tap('compilation', compilation => {
            compilation.hooks.htmlWebpackPluginAfterEmit.tapAsync(
                'html-webpack-plugin-after-emit',
                (data, cb) => {
                    cb()
                }
            )
        })

        compiler.hooks.done.tap('done', stats => {
            logStats('Renderer', stats)
        })

        const server = new webpackDevServer(compiler, {
            contentBase: path.join(__dirname, '../dist/electron'),
            quiet: true,
            hot: true,
            before(app, ctx) {
                ctx.middleware.waitUntilValid(() => {
                    resolve()
                })
            }
        })

        server.listen(config.server.port)
    })
}

function electronLog(data, color) {
    let log = ''
    data = data.toString().split(/\r?\n/)
    data.forEach(line => {
        log += `  ${line}\n`
    })
    if (/[0-9A-z]+/.test(log)) {
        console.log(chalk[color].bold('+--- Electron -------------------'))
        console.log(chalk[color].bold('|'))
        log += chalk[color].bold('|\n')
        log += chalk[color].bold('+-------------------------------')
        console.log(log)
    }
}

function startElectron() {
    var args = [
        '--inspect=5858',
        path.join(__dirname, '../dist/electron/main.js')
    ]

    if (process.env.npm_execpath.endsWith('yarn.js')) {
        args = args.concat(process.argv.slice(3))
    } else if (process.env.npm_execpath.endsWith('npm-cli.js')) {
        args = args.concat(process.argv.slice(2))
    }

    electronProcess = spawn(electron, args)

    electronProcess.stdout.on('data', data => {
        electronLog(data, 'blue')
    })
    electronProcess.stderr.on('data', data => {
        electronLog(data, 'red')
    })

    electronProcess.on('close', () => {
        if (!manualRestart) process.exit()
    })
}

function startMain() {
    return new Promise((resolve, reject) => {
        mainConfig.mode = 'development'
        const compiler = webpack(mainConfig)

        compiler.hooks.watchRun.tapAsync('watch-run', (compilation, done) => {
            logStats('Main', chalk.white.bold('compiling...'))
            done()
        })

        compiler.watch({}, (err, stats) => {
            if (err) {
                console.log(err)
                reject(err)
            }

            logStats('Main', stats)

            if (electronProcess && electronProcess.kill) {
                manualRestart = true
                process.kill(electronProcess.pid)
                electronProcess = null
                startElectron()

                setTimeout(() => {
                    manualRestart = false
                }, 5000)
            }

            resolve()
        })
    })
}

Promise.all([startRenderer(), startMain()])
    .then(() => {
        startElectron()
    })
    .catch(err => {
        console.error(err)
    })
