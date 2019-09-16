import { Reducer } from './Module'
import { Action } from './Dispatcher'
import { log } from './Utils'

interface MiddlewareParams<S> {
    moduleName: string;
    state: S;
    action: {
        prev: Action | Promise<Action>;
        next: Action;
    };
    reducer: Reducer<S>;
}
export interface Middleware {
    <S>(params: MiddlewareParams<S>): Promise<void>;
}
interface Middlewares {
    readonly internal: Middleware[];
    external: Middleware[];
}

const asyncActionMiddleware: Middleware = async params => {
    const { action } = params

    action.next = await Promise.resolve(action.prev)
}

const logMiddleware: Middleware = async params => {
    const { moduleName, state, action, reducer } = params

    log('Minidozer.Dispatcher')('Action', {
        'From': moduleName,
        'Prev State': state,
        'Action': action.next,
        'Next State': reducer(state, action.next)
    })
}

export const middlewares: Middlewares = {
    internal: [asyncActionMiddleware, logMiddleware],
    external: []
}