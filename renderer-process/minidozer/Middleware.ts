import { Reducer } from './Module'
import { Action } from './Dispatcher'
import { Tracer } from './Utils'

const tracer = new Tracer('Core.Dispatcher')

export function logMiddleware<S>(from: string, prevState: S, action: Action, reducer: Reducer<S>): S {
    const nextState = reducer(prevState, action)

    tracer.log('[ Core.Dispatcher > Action ]', {
        'From': from,
        'Prev State': prevState,
        'Action': action,
        'Next State': nextState
    })

    return nextState
}