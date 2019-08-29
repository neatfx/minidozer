import { Action } from '../../minidozer/Dispatcher'

export interface State {
    key: string;
}

const defaultState: State = {
    key: 'none'
}

export function reducer(state: State = defaultState, action: Action): State {
    switch (action.type) {
        case 'SAVE_OPS_PANEL_STATE':
            return Object.assign({}, state, {})
        default:
            return state
    }
}