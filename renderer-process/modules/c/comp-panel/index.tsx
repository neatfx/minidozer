import React, { ReactElement } from 'react'

import { useModuleContext } from '../../../minidozer/Module'

import { Icon } from 'react-icons-kit'
import { gitPullRequest } from 'react-icons-kit/feather/gitPullRequest'
import { layers } from 'react-icons-kit/feather/layers'
import { cpu } from 'react-icons-kit/feather/cpu'
import { command } from 'react-icons-kit/feather/command'
import { settings } from 'react-icons-kit/feather/settings'

import { TabA } from './tab-a'
import { TabB } from './tab-b'

import Panel from '../../../components/OpsPanel'

const tabs = [
    {
        icon: <Icon icon={layers} />,
        content: TabA
    },
    {
        icon: <Icon icon={cpu} />,
        content: TabB
    },
    {
        icon: <Icon icon={gitPullRequest} />,
        content: TabB
    },
    {
        icon: <Icon icon={command} />,
        content: TabB
    },
    {
        icon: <Icon icon={settings} />,
        content: TabB
    }
]

export function OpsPanel(): ReactElement {
    const {state, dispatch} = useModuleContext('ModuleC')
    const saveState = (state: object): void => {
        dispatch('SAVE_OPS_PANEL_STATE', state)
    }

    return(
        <Panel
            tabs={tabs}
            {...state.opsPanel} 
            saveState={saveState}
        />
    )
}