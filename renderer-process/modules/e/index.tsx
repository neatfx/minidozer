import React, { ReactElement } from 'react'
import styled from 'styled-components'

import { compose } from '../../minidozer/Module'
import { actions } from './actions'
import { reducer } from './reducer'

const Wrapper = styled.div`
    position: relative;
    height: 100%;
    border: 1px dashed #cccccc;
`
const CompA = styled.div`
    margin: 5px;
    padding: 5px;
`

export default compose('ModuleE', actions, reducer, (): ReactElement => {
    return(
        <Wrapper>
            <CompA>ModuleE</CompA>
        </Wrapper>
    )
})