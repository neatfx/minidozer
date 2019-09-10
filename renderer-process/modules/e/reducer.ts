import { Action } from '@minidozer/Dispatcher'

export interface State { 
    someState: string;
}

export const defaultState: State = {
    someState: ''
}

export function reducer(state: State = defaultState, action: Action): State {
    switch (action.type) {
        case 'SAVE_OPS_PANEL_STATE':
            return Object.assign({}, state)
        default:
            return state
    }
}