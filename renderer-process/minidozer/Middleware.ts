import { Reducer } from './Module'
import { Action, ActionStatus } from './Dispatcher'
import { Tracer } from './Utils'

interface MiddlewareParams<S> {
    moduleName: string;
    state: S;
    prevAction: Action;
    actionCreator: (preAction: Action<object>) => Action<object> | Promise<Action<object>>;
    reducer: Reducer<S>;
    dispatch: React.Dispatch<Action<object>>;
    actionCache:  Map<number, Promise<Action>>; 
    suspend: (action: Action<object>, destroy?: boolean) => Action<object>[];
}
interface Middlewares {
    readonly internal: (<S>(params: MiddlewareParams<S>) => Promise<void>)[];
    external: (<S>(params: MiddlewareParams<S>) => Promise<void>)[];
}

async function asyncActionMiddleware<S>({ prevAction, actionCreator, actionCache }: MiddlewareParams<S>): Promise<void> {
    actionCache.set(prevAction.createdAt, Promise.resolve(actionCreator(prevAction)))
}

async function suspenseMiddleware<S>({ prevAction, actionCache, suspend }: MiddlewareParams<S>): Promise<void> {
    suspend(prevAction)

    const action = await actionCache.get(prevAction.createdAt)

    if (action) {
        if (action.status === ActionStatus.PENDING) {
            action.status = ActionStatus.SUCCESS
        }

        if (action.status === ActionStatus.FAILED || action.response) {
            suspend(action)
        }

        setTimeout((): void => {
            suspend(action, true)
        }, 500)
    }
}

async function logMiddleware<S>({ moduleName, state, prevAction, reducer, dispatch, actionCache }: MiddlewareParams<S>): Promise<void> {
    const tracer = new Tracer('Minidozer.Dispatcher')
    const action = await actionCache.get(prevAction.createdAt)

    if (action) {
        dispatch(action)
        actionCache.delete(prevAction.createdAt)

        tracer.log('Action', {
            'From': moduleName,
            'Prev State': state,
            'Action': action,
            'Next State': reducer(state, action)
        })
    }
}

export const middlewares: Middlewares = {
    internal: [asyncActionMiddleware, suspenseMiddleware, logMiddleware],
    external: []
}