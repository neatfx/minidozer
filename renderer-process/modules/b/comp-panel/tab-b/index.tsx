import React, { ReactElement } from 'react'

import { useModuleContext } from '../../../../minidozer/Module'
import { Inspector } from '../../../../components/OpsPanel'

export function TabB(): ReactElement {
    const {state} = useModuleContext('ModuleB')

    return(
        <Inspector
            activeTab={state.opsPanel.activeTab}
            left={state.opsPanel.left}
            top={state.opsPanel.top}
        />
    )
}