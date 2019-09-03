import React, { ReactElement } from 'react'
import styled from 'styled-components'

import { useModuleContext } from '@minidozer/Module'
import { Inspector } from '@components/OpsPanel'

const Wrapper = styled.div`
    display: grid;
    grid-gap: 10px;
`
const ExceedingGrid = styled.div`
    display: grid;
    grid-gap: 10px;
    min-height: 500px;
`

export function TabA(): ReactElement {
    const {state} = useModuleContext('ModuleD')

    return(
        <Wrapper>
            <Inspector 
                activeTab={state.opsPanel.activeTab}
                left={state.opsPanel.left}
                top={state.opsPanel.top}
            />
            <ExceedingGrid />
        </Wrapper>
    )
}