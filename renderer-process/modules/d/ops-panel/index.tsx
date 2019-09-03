import React, { ReactElement } from 'react'

import { useModuleContext } from '@minidozer/Module'
import Panel from '@components/OpsPanel'

import { Icon } from 'react-icons-kit'
import { gitPullRequest } from 'react-icons-kit/feather/gitPullRequest'
import { layers } from 'react-icons-kit/feather/layers'
import { cpu } from 'react-icons-kit/feather/cpu'

import { TabA } from './tab-a'

const tabs = [
    {
        icon: <Icon icon={layers} />,
        content: TabA
    },
    {
        icon: <Icon icon={cpu} />,
        content: TabA
    },
    {
        icon: <Icon icon={gitPullRequest} />,
        content: TabA
    }
]

export function OpsPanel(): ReactElement {
    const {state, dispatch} = useModuleContext('ModuleD')
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