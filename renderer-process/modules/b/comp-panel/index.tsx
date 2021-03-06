import React, { ReactElement } from 'react'

import { useModuleContext } from '@minidozer/Module'

import { Icon } from 'react-icons-kit'
import { gitPullRequest } from 'react-icons-kit/feather/gitPullRequest'
import { layers } from 'react-icons-kit/feather/layers'
import { cpu } from 'react-icons-kit/feather/cpu'
import { command } from 'react-icons-kit/feather/command'

import { TabA } from './tab-a'
import { TabB } from './tab-b'
import Panel, { StateForSave } from '@components/OpsPanel'

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
    }
]

export function OpsPanel(): ReactElement {
    const {state, dispatch} = useModuleContext('ModuleB')
    const saveState = (state: StateForSave): void => {
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