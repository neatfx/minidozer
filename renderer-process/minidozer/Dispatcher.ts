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

function useSuspense(): [Action[], (action: Action, destroy?: boolean) => void, (action: Action) => void] {
    const [suspense, setSuspense] = useState<Action[]>([])
    const suspenseRef = useRef<Action[]>([])
    const suspend = (action: Action, destroy = false): void => {
        suspenseRef.current = suspenseRef.current.filter((item): boolean => item.createdAt !== action.createdAt)
        if (!destroy) {
            suspenseRef.current.push(action)
        }
        setSuspense(suspenseRef.current)
    }
    const suspendNext = (action: Action): void => {
        if (action.status === ActionStatus.PENDING) {
            action.status = ActionStatus.SUCCESS
        }

        if (action.status === ActionStatus.FAILED || action.response) {
            suspend(action)
        }

        setTimeout((): void => {
            suspend(action, true)
        }, 500)
    }

    return [suspense, suspend, suspendNext]
}

export function useDispatcher<S, T>(moduleName: string, actions: Actions, reducer: Reducer<S>, defaultState: S): [S, Dispatch<T>, Action[]] {
    const [state, dispatch] = useReducer(reducer, defaultState)
    const [suspense, suspendPrev, suspendNext] = useSuspense()

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
            reducer
        }

        suspendPrev(prevAction)

        for (const middleware of middlewares.internal.concat(middlewares.external)) {
            await middleware(params)
        }

        dispatch(params.action.next)
        suspendNext(params.action.next)

        return prevAction
    }

    return [state, wrappedDispatch, suspense]
}