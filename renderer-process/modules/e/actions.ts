import { Action } from '@minidozer/Dispatcher'

const internal = {
    'SAVE_OPS_PANEL_STATE': (preAction: Action): Action => {
        return preAction
    }
}

export const actions = {
    ...internal
}
export type ActionType = keyof typeof actions