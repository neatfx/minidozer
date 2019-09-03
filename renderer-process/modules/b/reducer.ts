import { Action } from '@minidozer/Dispatcher'

export interface State { 
    hasBgColor: boolean;
    compFoo: {
        hasBgColor: boolean;
    };
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
    hasBgColor: false,
    compFoo: {
        hasBgColor: false,
    },
    opsPanel: {
        hidden: false,
        activeTab: 0,
        left: 145,
        top: 5,
        minibarX: 5,
        minibarY: 5,
    }
}

export function reducer(state: State = defaultState, action: Action): State {
    switch (action.type) {
        case 'SAVE_OPS_PANEL_STATE':
            return Object.assign({}, state, {
                opsPanel: {...state.opsPanel, ...action.payload}
            })
        case 'TOGGLE_PANEL':
            return Object.assign({}, state, {
                opsPanel: {...state.opsPanel, ...action.payload}
            })
        case 'ASYNC_TOGGLE_PANEL':
            return Object.assign({}, state, {
                opsPanel: {...state.opsPanel, ...action.payload}
            })
        case 'TOGGLE_BG_COLOR':
            return Object.assign({}, state, {
                ...state, ...action.payload
            })
        case 'ASYNC_TOGGLE_BG_COLOR':
            return Object.assign({}, state, {
                ...state, ...action.payload
            })
        case 'TOGGLE_BG_COLOR_OF_FOO':
            return Object.assign({}, state, {
                compFoo: {...action.payload}
            })
        case 'ASYNC_TOGGLE_BG_COLOR_OF_FOO':
            return Object.assign({}, state, {
                compFoo: {...action.payload}
            })
        default:
            return state
    }
}