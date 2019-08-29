import { useState, useEffect, ReactElement, PropsWithChildren } from 'react'
import { Unsubscribe, createStore, AnyAction, Store } from 'redux'

import { Status, Action, useDispatcher } from './Dispatcher'
import { Tracer } from './Utils'

export interface Actions {
    [key: string]: (preAction: Action) => Action | Promise<Action>;
}
interface Reducer<S> {
    (prevState: S | undefined, action: Action): S;
}
interface RouterProps {
    router?: Function;
    route?: string;
}
interface ContextProps<S, T> {
    state: S;
    suspense: Status[];
    tracer: Tracer;
    dispatch: (actionType: T, payload?: object) => Promise<Status>;
}
interface Module<P, S, T> {
    (props: PropsWithChildren<RouterProps> & P & ContextProps<S, T>): ReactElement; 
}

const nameMapContext = new Map<string, any>()

export function useRouter(routeKey: string): [Function, string] {
    const [route, setRoute] = useState('_')
    const router = (stateObj: object): void => {
        for (let [key, value] of Object.entries(stateObj)) {
            if(key === routeKey) {
                setRoute(value)
            }
        }
    }

    return [router, route]
}

export function compose<P, S, T>(moduleName: string, actions: Actions, reducer: Reducer<S>, module: Module<P, S, T>): React.FC<RouterProps & P> {
    const store: Store<S, AnyAction> = createStore(reducer)
    const tracer = new Tracer('Core.Module' + ' > ' + moduleName)

    return (props): ReactElement | null => {
        const [state, setState] = useState(store.getState())
        useEffect((): Unsubscribe => store.subscribe((): void => {
            setState(store.getState())
        }))

        const [dispatch, suspense] = useDispatcher<T>(moduleName, actions, store)
        const context = {state, suspense, tracer, dispatch}
        nameMapContext.set(moduleName, context)

        let visible = true
        if(props.router) props.router(state)
        if(props.route) visible = props.route === moduleName
        return visible ? module({...props, ...context}) : null
    }
}

export function useModuleContext<S, T>(moduleName: string): ContextProps<S, T> {
    return nameMapContext.get(moduleName)
}