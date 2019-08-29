import React, { ReactElement } from 'react'
import styled from 'styled-components'

import { useModuleContext } from '../../../../minidozer/Module'
import { Inspector } from '../../../../components/OpsPanel'

const Wrapper = styled.div`
    display: grid;
    grid-gap: 10px;
`

export function TabB(): ReactElement {
    const {state} = useModuleContext('ModuleC')

    return(
        <Wrapper>
            <Inspector 
                activeTab={state.opsPanel.activeTab}
                left={state.opsPanel.left}
                top={state.opsPanel.top}
            />
        </Wrapper>
    )
}