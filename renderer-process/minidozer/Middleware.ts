import { Reducer } from './Module'
import { Action, ActionStatus } from './Dispatcher'
import { Tracer } from './Utils'

interface MiddlewareParams<S> {
    moduleName: string;
    state: S;
    action: {
        prev: Action<object> | Promise<Action<object>>;
        next: Action;
    };
    reducer: Reducer<S>;
    suspend: (action: Action<object>, destroy?: boolean) => void;
}
interface Middleware {
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

const suspenseMiddleware: Middleware = async params => {
    const { suspend, action } = params

    if (action.next.status === ActionStatus.PENDING) {
        action.next.status = ActionStatus.SUCCESS
    }

    if (action.next.status === ActionStatus.FAILED || action.next.response) {
        suspend(action.next)
    }

    setTimeout((): void => {
        suspend(action.next, true)
    }, 500)
}

const logMiddleware: Middleware = async params => {
    const { moduleName, state, reducer, action } = params
    const tracer = new Tracer('Minidozer.Dispatcher')

    tracer.log('Action', {
        'From': moduleName,
        'Prev State': state,
        'Action': action,
        'Next State': reducer(state, action.next)
    })
}

export const middlewares: Middlewares = {
    internal: [asyncActionMiddleware, suspenseMiddleware, logMiddleware],
    external: []
}