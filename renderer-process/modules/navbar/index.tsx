import React, { ReactElement } from 'react'

import { compose, ModuleContext } from '@minidozer/Module'

import { actions, ActionType } from './actions'
import { reducer, State, defaultState } from './reducer'

import { Icon } from 'react-icons-kit'
import { gitPullRequest } from 'react-icons-kit/feather/gitPullRequest'
import { layers } from 'react-icons-kit/feather/layers'
import { cpu } from 'react-icons-kit/feather/cpu'
import { command } from 'react-icons-kit/feather/command'
import { settings } from 'react-icons-kit/feather/settings'

import Navbar from '@components/Navbar'

const navItems = [
    {
        title: 'ModuleA',
        icon: <Icon icon={layers} />
    },
    {
        title: 'ModuleB',
        icon: <Icon icon={cpu} />
    },
    {
        title: 'ModuleC',
        icon: <Icon icon={gitPullRequest} />
    },
    {
        title: 'ModuleD',
        icon: <Icon icon={command} />
    },
    {
        title: 'ModuleE',
        icon: <Icon icon={settings} />
    }
]

interface Props {
    foo?: number;
    bar: number;
}

export type Context = ModuleContext<State, ActionType>

export default compose<Props, State, ActionType>('ModuleNavbar', actions, reducer, defaultState, (props): ReactElement => {
    const { state, dispatch } = props
    const saveState = (state: { activeNav: string }): void => {
        dispatch('SET_ACTIVE_NAV', state)
    }

    return(
        <Navbar
            navItems={navItems}
            {...state}
            saveState={saveState}
        />
    )
})
