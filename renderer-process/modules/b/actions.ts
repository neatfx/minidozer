import axios from 'axios'

import { Action } from '@minidozer/Dispatcher'
import { Tracer } from '@minidozer/Utils'

const tracer = new Tracer('Action')
const exclusive = {
    'SAVE_OPS_PANEL_STATE': (preAction: Action): Action => {
        return preAction
    },
    'TOGGLE_PANEL': (preAction: Action): Action => {
        return preAction
    },
    'TOGGLE_BG_COLOR': (preAction: Action): Action => {
        return preAction
    },
    'ASYNC_TOGGLE_BG_COLOR': (preAction: Action): Promise<Action> => {
        return new Promise((resolve): void => {
            tracer.log('ASYNC_TOGGLE_BG_COLOR', '模拟异步操作开始...')
            setTimeout((): void => {
                tracer.log('ASYNC_TOGGLE_BG_COLOR', '模拟异步操作结束')
                resolve(preAction)
            }, 2000)
        })
    },
    'TOGGLE_BG_COLOR_OF_FOO': (preAction: Action): Action => {
        return preAction
    },
    'ASYNC_TOGGLE_BG_COLOR_OF_FOO': (preAction: Action): Promise<Action> => {
        return new Promise((resolve): void => {
            tracer.log('ASYNC_TOGGLE_BG_COLOR_OF_FOO', '模拟异步操作开始...')
            setTimeout((): void => {
                tracer.log('ASYNC_TOGGLE_BG_COLOR_OF_FOO', '模拟异步操作结束')
                resolve(preAction)
            }, 2000)
        })
    },
    'ASYNC_HTTP_GET': async (preAction: Action): Promise<Action> => {
        tracer.log('ASYNC_HTTP_GET', 'HTTP请求开始...')
        const result = await axios.get('https://www.mocky.io/v2/5185415ba171ea3a00704eed')
        tracer.log('ASYNC_HTTP_GET', 'HTTP请求成功返回数据', result.data)
        preAction.response = 'HTTP 200'
        preAction.payload = result.data
        return preAction
    },
    'TOGGLE_COMP_SOME': (preAction: Action): Action => {
        return preAction
    },
    'ERROR': (preAction: Action): Action => {
        try {
            throw new Error('同步操作错误信息')
        } catch(e) {
            preAction.status = 'FAILED'
            preAction.failure = {
                type: 'error',
                error: e.message
            }
            return preAction
        }
    },
    'ASYNC_ERROR': (preAction: Action): Promise<Action> => {
        return new Promise((resolve): void => {
            tracer.log('ASYNC_ERROR', '异步操作开始...')
            setTimeout((): void => {
                tracer.log('ASYNC_ERROR', '异步操作遇到错误')
                preAction.status = 'FAILED'
                preAction.failure = {
                    type: 'error',
                    error: new Error('异步操作错误信息').message
                }
                resolve(preAction)
            }, 2000)
        })
    }
}
const shared = {
    'TOGGLE_PANEL': (preAction: Action): Action => {
        return preAction
    }
}
const external = {
    'ASYNC_TOGGLE_PANEL': (preAction: Action): Promise<Action> => {
        return new Promise((resolve): void => {
            tracer.log('ASYNC_SHOW_PANEL', '模拟异步操作开始...')
            setTimeout((): void => {
                tracer.log('ASYNC_SHOW_PANEL', '模拟异步操作结束')
                resolve(preAction)
            }, 2000)
        })
    }
}

export const actions = {
    ...exclusive,
    ...shared,
    ...external
}
export type ActionType = keyof typeof actions