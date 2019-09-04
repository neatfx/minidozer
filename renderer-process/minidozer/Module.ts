import { useState, ReactElement, PropsWithChildren } from 'react'

import { Action, useDispatcher } from './Dispatcher'
import { Tracer } from './Utils'

export interface Actions {
    [key: string]: (preAction: Action) => Action | Promise<Action>;
}
export interface Reducer<S> {
    (prevState: S | undefined, action: Action): S;
}
interface RouterProps {
    router?: Function;
    route?: string;
}
interface ContextProps<S, T> {
    state: S;
    suspense: Action[];
    tracer: Tracer;
    dispatch: (actionType: T, payload?: object) => Promise<Action>;
}
export interface ModuleContext<S, T> {
    state: S;
    dispatch: (actionType: T, payload?: object) => Promise<Action>;
    tracer: Tracer;
}
interface Module<P, S, T> {
    (props: PropsWithChildren<RouterProps> & P & ContextProps<S, T>): ReactElement; 
}

const nameMapContext = new Map<string, any>()

export function useRouter(routeKey: string): [Function, string] {
    const [route, setRoute] = useState('_')
    const router = (stateObj: object): void => {
        for (const [key, value] of Object.entries(stateObj)) {
            if(key === routeKey) {
                setRoute(value)
            }
        }
    }

    return [router, route]
}

export function compose<P, S, T>(moduleName: string, actions: Actions, reducer: Reducer<S>, module: Module<P, S, T>): React.FC<RouterProps & P> {
    const tracer = new Tracer('Core.Module' + ' > ' + moduleName)

    return (props): ReactElement | null => {
        const [state, dispatch, suspense] = useDispatcher<S, T>(moduleName, actions, reducer)

        const context = {state, suspense, tracer, dispatch}
        nameMapContext as Map<string, ContextProps<S, T>>
        nameMapContext.set(moduleName, context)

        let visible = true
        if(props.router) props.router(state)
        if(props.route) visible = props.route === moduleName
        return visible ? module({...props, ...context}) : null
    }
}

export function useModuleContext<T>(moduleName: string): T {
    return nameMapContext.get(moduleName)
}