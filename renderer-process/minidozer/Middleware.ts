import { Reducer } from './Module'
import { Action } from './Dispatcher'
import { Tracer } from './Utils'

export function logMiddleware<S>(from: string, prevState: S, action: Action, reducer: Reducer<S>): S {
    const tracer = new Tracer('Minidozer.Dispatcher')
    const nextState = reducer(prevState, action)

    tracer.log('Action', {
        'From': from,
        'Prev State': prevState,
        'Action': action,
        'Next State': nextState
    })

    return nextState
}

export async function asyncActionMiddleware(preAction: Action, creator: (preAction: Action) => Action | Promise<Action>): Promise<Action> {
    return await Promise.resolve(creator(preAction))
}