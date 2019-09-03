import { useState, useReducer } from 'react'

import { Actions, Reducer } from './Module'
import { useSuspense } from './Suspense'
import { Tracer } from './Utils'

export interface Action<T = object> {
    type: string;
    status: string;
    response?: string;
    failure?: {
        type: string;
        error?: string;
    };
    payload?: T;
    createdAt: number;
}

interface Dispatch<T> {
    (actionType: T, payload?: object): Promise<Action>;
}

export enum ActionStatus {
    PENDING = 'PENDING',
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED' 
}

const tracer = new Tracer('Core.Dispatcher')

function formatTrace<State>(from: string, prevState: State, action: Action, nextState: State): void {
    tracer.log('Action', {
        'From': from,
        'Prev State': prevState,
        'Action': action,
        'Next State': nextState
    })
}

export function useDispatcher<S, T>(moduleName: string, actions: Actions, reducer: Reducer<S>): [S, Dispatch<T>, Action[]] {
    const [suspense, setSuspense] = useState<Action[]>([])
    const [suspend] = useSuspense()

    const injectedReducer = (prevState: S | undefined, action: Action): S => {
        const nextState = reducer(prevState, action)
        if(prevState !== undefined) formatTrace(moduleName, prevState, action, nextState)

        return nextState
    }

    const [state, dispatch] = useReducer(injectedReducer, injectedReducer(undefined, { type: '', status: '', createdAt: Date.now() }))

    const wrappedDispatch = async (actionType: T, payload?: object): Promise<Action> => {
        const actionCreator = actions[actionType as unknown as string]

        const preAction = {
            type: actionType as unknown as string,
            status: ActionStatus.PENDING,
            response: '',
            payload: payload,
            createdAt: Date.now()
        }

        setSuspense(suspend(preAction))

        const result = await Promise.resolve(actionCreator(preAction))

        if (result.status === ActionStatus.PENDING) {
            result.status = ActionStatus.SUCCESS
            dispatch(result)
        }

        if (result.status === ActionStatus.FAILED || result.response) {
            setSuspense(suspend(result))
        }

        setTimeout((): void => {
            setSuspense(suspend(result, true))
        }, 500)

        return result
    }

    return [state, wrappedDispatch, suspense]
}