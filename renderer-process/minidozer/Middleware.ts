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
    setSuspense: Function;
}
interface Middlewares {
    readonly internal: (<S>(params: MiddlewareParams<S>) => Promise<void>)[];
    external: (<S>(params: MiddlewareParams<S>) => Promise<void>)[];
}

const actionCache: Map<string, Promise<Action>> = new Map()

async function asyncActionMiddleware<S>({ prevAction, actionCreator }: MiddlewareParams<S>): Promise<void> {
    actionCache.set(prevAction.type, Promise.resolve(actionCreator(prevAction)))
}

let suspenseQueue: Action[] = []

function suspend(action: Action, destroy = false): Action[] { 
    suspenseQueue = [...suspenseQueue].filter((item): boolean => item.createdAt !== action.createdAt)
    if(!destroy){
        if(action.status === ActionStatus.PENDING) {
            suspenseQueue.push(action)
        }
        if(action.status === ActionStatus.SUCCESS && action.response) {
            suspenseQueue.push(action)
        }
        if(action.status === ActionStatus.FAILED) {
            suspenseQueue.push(action)
        }
    }

    return suspenseQueue
}

async function suspenseMiddleware<S>({prevAction, setSuspense }: MiddlewareParams<S>): Promise<void> {
    setSuspense(suspend(prevAction))

    const action = await actionCache.get(prevAction.type)

    if (action) {
        if (action.status === ActionStatus.PENDING) {
            action.status = ActionStatus.SUCCESS
        }

        if (action.status === ActionStatus.FAILED || action.response) {
            setSuspense(suspend(action))
        }

        setTimeout((): void => {
            setSuspense(suspend(action, true))
        }, 500)
    }
}

async function logMiddleware<S>({ moduleName, prevAction, reducer, dispatch, state }: MiddlewareParams<S>): Promise<void> {
    const tracer = new Tracer('Minidozer.Dispatcher')
    const action = await actionCache.get(prevAction.type)

    if (action) {
        dispatch(action)
        actionCache.delete(prevAction.type)

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