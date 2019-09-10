import { useState, useReducer } from 'react'

import { Actions, Reducer } from './Module'
import { logMiddleware, asyncActionMiddleware } from './Middleware'
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

        setSuspense(suspend(preAction))

        const action = await asyncActionMiddleware(preAction, actions[actionType as unknown as string])
        logMiddleware(moduleName, state, action, reducer)

        dispatch(action)

        if (action.status === ActionStatus.PENDING) {
            action.status = ActionStatus.SUCCESS
        }

        if (action.status === ActionStatus.FAILED || action.response) {
            setSuspense(suspend(action))
        }

        setTimeout((): void => {
            setSuspense(suspend(action, true))
        }, 500)

        return action
    }

    return [state, wrappedDispatch, suspense]
}