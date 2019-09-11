import { Reducer } from './Module'
import { Action, ActionStatus } from './Dispatcher'
import { Tracer } from './Utils'

interface MiddlewareParams<S> {
    from: string;
    prevState: S;
    action: Action;
    reducer: Reducer<S>;
    suspend: (action: Action<object>, destroy?: boolean) => Action<object>[];
    setSuspense: Function;
}
interface Middlewares {
    readonly internal: (<S>(params: MiddlewareParams<S>) => void)[];
    external: (<S>(params: MiddlewareParams<S>) => void)[];
}

function suspenseMiddleware<S>({action, suspend, setSuspense }: MiddlewareParams<S>): void {
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

function logMiddleware<S>({ from, prevState, action, reducer }: MiddlewareParams<S>): void {
    const tracer = new Tracer('Minidozer.Dispatcher')
    const nextState = reducer(prevState, action)

    tracer.log('Action', {
        'From': from,
        'Prev State': prevState,
        'Action': action,
        'Next State': nextState
    })
}

export const middlewares: Middlewares = {
    internal: [suspenseMiddleware, logMiddleware],
    external: []
}