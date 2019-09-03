import { Action } from '@minidozer/Dispatcher'

export interface State { 
    opsPanel: {
        hidden: boolean;
        activeTab: number;
        left: number;
        top: number;
        minibarX: number;
        minibarY: number;
    };
}

const defaultState = {
    opsPanel: {
        hidden: false,
        activeTab: 0,
        left: 25,
        top: 0,
        minibarX: 0,
        minibarY: 0,
    }
}

export function reducer(state: State = defaultState, action: Action): State {
    switch (action.type) {
        case 'SAVE_OPS_PANEL_STATE':
            return Object.assign({}, state, {
                opsPanel: {...state.opsPanel, ...action.payload}
            })
        default:
            return state
    }
}