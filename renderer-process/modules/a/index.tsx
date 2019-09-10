import React, { ReactElement } from 'react'
import styled from 'styled-components'

import { compose, ModuleContext } from '@minidozer/Module'

import { actions, ActionType } from './actions'
import { reducer, State, defaultState } from './reducers'

import { ButtonTest } from './ButtonTest'

interface Props {
    someUserDefinedProp?: string;
}

const Wrapper = styled.div`
    position: relative;
    height: 100%;
    border: 1px dashed #cccccc;
`
const CompA = styled.div`
    margin: 5px;
    padding: 5px;
    width: 486px;
    border: 1px solid #cccccc;
`

export type Context = ModuleContext<State, ActionType>

export default compose<Props, State, ActionType>('ModuleA', actions, reducer, defaultState, (): ReactElement => {
    return(
        <Wrapper>
            <CompA>
                <ButtonTest />
            </CompA>
        </Wrapper>
    )
})