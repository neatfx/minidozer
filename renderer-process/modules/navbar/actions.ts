import { Action } from '../../minidozer/Dispatcher'

const internal = {
    'SET_ACTIVE_NAV': (preAction: Action): Action => {
        return preAction
    }
}

export const actions = {
    ...internal
}
export type ActionType = keyof typeof actions