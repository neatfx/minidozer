import React, { ReactElement } from 'react'
import styled from 'styled-components'

import { useModuleContext } from '../../../../minidozer/Module'
import { Inspector } from '../../../../components/OpsPanel'

import { ActionTest } from './ActionTest'

const Wrapper = styled.div`
    display: grid;
    grid-gap: 10px;
`

export function TabA(): ReactElement {
    const { state } = useModuleContext('ModuleB')

    return(
        <Wrapper>
            <Inspector 
                activeTab={state.opsPanel.activeTab}
                left={state.opsPanel.left}
                top={state.opsPanel.top}
            />
            <ActionTest />
        </Wrapper>
    )
}