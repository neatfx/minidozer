import { useState, useReducer } from 'react'

import { Actions, Reducer } from './Module'
import { logMiddleware } from './Middleware'
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

    const injectedReducer = (prevState: S, action: Action): S => {
        const nextState = logMiddleware(moduleName, prevState, action, reducer)

        return nextState
    }

    const [state, dispatch] = useReducer(injectedReducer, defaultState)

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