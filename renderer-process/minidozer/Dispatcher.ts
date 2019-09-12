import { useState, useReducer } from 'react'

import { Actions, Reducer } from './Module'
import { middlewares } from './Middleware'

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

export interface Dispatch<T> {
    (actionType: T, payload?: object): Promise<Action>;
}

export enum ActionStatus {
    PENDING = 'PENDING',
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED'
}

export function useDispatcher<S, T>(moduleName: string, actions: Actions, reducer: Reducer<S>, defaultState: S): [S, Dispatch<T>, Action[]] {
    const [suspense, setSuspense] = useState<Action[]>([])
    const [state, dispatch] = useReducer(reducer, defaultState)

    const wrappedDispatch = async (actionType: T, payload?: object): Promise<Action> => {
        const prevAction = {
            type: actionType as unknown as string,
            status: ActionStatus.PENDING,
            response: '',
            payload: payload,
            createdAt: Date.now()
        }
        const params = {
            moduleName,
            state,
            prevAction,
            actionCreator: actions[prevAction.type],
            reducer,
            dispatch,
            setSuspense,
        }

        for (const middleware of middlewares.internal.concat(middlewares.external)) {
            await middleware(params)
        }

        return prevAction
    }

    return [state, wrappedDispatch, suspense]
}