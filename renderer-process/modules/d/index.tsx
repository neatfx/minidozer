import React, { ReactElement } from 'react'
import styled from 'styled-components'

import { compose, ModuleContext } from '@minidozer/Module'

import { actions, ActionType } from './actions'
import { reducer, State, defaultState } from './reducer'
import { OpsPanel } from './ops-panel'

const Wrapper = styled.div`
    position: relative;
    height: 100%;
    border: 1px dashed #cccccc;
`

export type Context = ModuleContext<State, ActionType>

export default compose('ModuleD', actions, reducer, defaultState, (): ReactElement => {
    return(
        <Wrapper>
            <OpsPanel />
        </Wrapper>
    )
})