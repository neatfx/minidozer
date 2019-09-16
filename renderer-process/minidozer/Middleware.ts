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
interface Middlewares {
    readonly internal: (<S>(params: MiddlewareParams<S>) => Promise<void>)[];
    external: (<S>(params: MiddlewareParams<S>) => Promise<void>)[];
}

async function asyncActionMiddleware<S>(params: MiddlewareParams<S>): Promise<void> {
    const { action } = params

    action.next = await Promise.resolve(action.prev)
}

async function suspenseMiddleware<S>(params: MiddlewareParams<S>): Promise<void> {
    const { suspend, action } = params

    const act = action.next

    if (act) {
        if (act.status === ActionStatus.PENDING) {
            act.status = ActionStatus.SUCCESS
        }

        if (act.status === ActionStatus.FAILED || act.response) {
            suspend(act)
        }

        setTimeout((): void => {
            suspend(act, true)
        }, 500)
    }
}

async function logMiddleware<S>(params: MiddlewareParams<S>): Promise<void> {
    const { moduleName, state, reducer, action } = params
    const tracer = new Tracer('Minidozer.Dispatcher')

    if (action) {
        tracer.log('Action', {
            'From': moduleName,
            'Prev State': state,
            'Action': action,
            'Next State': reducer(state, action.next)
        })
    }
}

export const middlewares: Middlewares = {
    internal: [asyncActionMiddleware, suspenseMiddleware, logMiddleware],
    external: []
}