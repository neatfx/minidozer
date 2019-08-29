import React, { ReactElement } from 'react'
import styled from 'styled-components'

import { compose } from '../../minidozer/Module'
import Indicator from '../../components/Indicator'

import { actions } from './actions'
import { reducer } from './reducer'
import { OpsPanel } from './comp-panel'

const Wrapper = styled.div`
    position: relative;
    height: 100%;
    border: 1px dashed #cccccc;
`

export default compose('ModuleC', actions, reducer, ({suspense}): ReactElement => {
    return(
        <Wrapper>
            <OpsPanel />
            <Indicator queue={suspense}/>
        </Wrapper>
    )
})