import React, { ReactElement } from 'react'
import styled from 'styled-components'

import { compose } from '../../minidozer/Module'
import { actions } from './actions'
import { reducer } from './reducer'

import { OpsPanel } from './ops-panel'

const Wrapper = styled.div`
    position: relative;
    height: 100%;
    border: 1px dashed #cccccc;
`

export default compose('ModuleD', actions, reducer, (): ReactElement => {
    return(
        <Wrapper>
            <OpsPanel />
        </Wrapper>
    )
})