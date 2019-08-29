import { useState } from 'react'
import { Store } from 'redux'

import { Actions } from './Module'
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

export interface Status {
    type: string;
    failure?: {
        type: string;
        error?: string;
    };
    response?: string;
    createdAt: number;
}

interface Dispatch<T> {
    (actionType: T, payload?: object): Promise<Status>;
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

export function useDispatcher<T>(moduleName: string, actions: Actions, store: Store): [Dispatch<T>, Status[]] {
    const [suspense, setSuspense] = useState<Status[]>([])
    const [suspend] = useSuspense()
    const dispatch = async (actionType: T, payload?: object): Promise<Status> => {
        const actionCreator = actions[actionType as unknown as string]

        const preAction = {
            type: actionType as unknown as string,
            status: 'PENDING',
            response: '',
            payload: payload,
            createdAt: Date.now()
        }

        setSuspense(suspend(preAction))
        const result = await Promise.resolve(actionCreator(preAction))

        if (result.status === 'PENDING') {
            result.status = 'SUCCESS'
            const prevState = store.getState()
            store.dispatch(result)
            formatTrace(moduleName, prevState, result, store.getState())
        }

        if (result.status === 'FAILED' || result.response) {
            setSuspense(suspend(result))
        }

        setTimeout((): void => {
            setSuspense(suspend(result, true))
        }, 500)

        return result 
    }

    return [dispatch, suspense]
}