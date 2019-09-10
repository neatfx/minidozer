import React, { ReactElement } from 'react'
import styled from 'styled-components'

import { compose, ModuleContext } from '@minidozer/Module'
import Indicator from '@components/Indicator'

import { actions, ActionType } from './actions'
import { reducer, State, defaultState } from './reducer'
import { OpsPanel } from './comp-panel'

const Wrapper = styled.div`
    position: relative;
    height: 100%;
    border: 1px dashed #cccccc;
`

export type Context = ModuleContext<State, ActionType>

export default compose('ModuleC', actions, reducer, defaultState, ({suspense}): ReactElement => {
    return(
        <Wrapper>
            <OpsPanel />
            <Indicator queue={suspense}/>
        </Wrapper>
    )
})