import { useState, useReducer } from 'react'

import { Actions, Reducer } from './Module'
import { middlewares } from './Middleware'
import { useSuspense } from './Suspense'

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

export function useDispatcher<S, T>(moduleName: string, actions: Actions, reducer: Reducer<S>, defaultState: S): [S, Dispatch<T>, Action[]] {
    const [suspense, setSuspense] = useState<Action[]>([])
    const [suspend] = useSuspense()

    const [state, dispatch] = useReducer(reducer, defaultState)

    const wrappedDispatch = async (actionType: T, payload?: object): Promise<Action> => {
        const preAction = {
            type: actionType as unknown as string,
            status: ActionStatus.PENDING,
            response: '',
            payload: payload,
            createdAt: Date.now()
        }

        if (middlewares.internal.length) setSuspense(suspend(preAction))

        const params = {
            from: moduleName,
            prevState: state,
            action: await Promise.resolve(actions[preAction.type](preAction)),
            reducer,
            suspend,
            setSuspense,
        }

        for (const middleware of middlewares.internal) {
            middleware(params)
        }
        for (const middleware of middlewares.external) {
            middleware(params)
        }

        dispatch(params.action)

        return params.action
    }

    return [state, wrappedDispatch, suspense]
}