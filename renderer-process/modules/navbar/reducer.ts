import { Action } from '@minidozer/Dispatcher'

export interface State {
    activeNav: string;
}

const defaultState: State = {
    activeNav: 'ModuleA',
}

export function reducer(state: State = defaultState, action: Action): State {
    switch (action.type) {
        case 'SET_ACTIVE_NAV':
            return Object.assign({}, state, {...action.payload})
        default:
            return state
    }
}