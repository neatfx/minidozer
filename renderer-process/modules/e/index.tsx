import React, { ReactElement } from 'react'
import styled from 'styled-components'

import { compose, ModuleContext } from '@minidozer/Module'

import { actions, ActionType } from './actions'
import { reducer, State, defaultState } from './reducer'

const Wrapper = styled.div`
    position: relative;
    height: 100%;
    border: 1px dashed #cccccc;
`
const CompA = styled.div`
    margin: 5px;
    padding: 5px;
`

export type Context = ModuleContext<State, ActionType>

export default compose('ModuleE', actions, reducer, defaultState, (): ReactElement => {
    return(
        <Wrapper>
            <CompA>ModuleE</CompA>
        </Wrapper>
    )
})