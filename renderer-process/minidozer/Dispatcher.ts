import { useState, useReducer, useRef } from 'react'

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

function useSuspense(): [Action[], (action: Action<object>, destroy?: boolean) => void] {
    const [suspense, setSuspense] = useState<Action[]>([])
    const suspenseRef = useRef<Action[]>([])
    const suspend = (action: Action, destroy = false): void => {
        suspenseRef.current = suspenseRef.current.filter((item): boolean => item.createdAt !== action.createdAt)
        if (!destroy) {
            suspenseRef.current.push(action)
        }
        setSuspense(suspenseRef.current)
    }

    return [suspense, suspend]
}

export function useDispatcher<S, T>(moduleName: string, actions: Actions, reducer: Reducer<S>, defaultState: S): [S, Dispatch<T>, Action[]] {
    const [state, dispatch] = useReducer(reducer, defaultState)
    const [suspense, suspend] = useSuspense()

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
            action: {
                prev: actions[prevAction.type](prevAction),
                next: prevAction,
            },
            reducer,
            suspend,
        }

        suspend(prevAction)

        for (const middleware of middlewares.internal.concat(middlewares.external)) {
            await middleware(params)
        }

        dispatch(prevAction)

        return prevAction
    }

    return [state, wrappedDispatch, suspense]
}