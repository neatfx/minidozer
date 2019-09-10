import React, { ReactElement } from 'react'
import styled from 'styled-components'

import { compose, ModuleContext } from '@minidozer/Module'

import Indicator from '@components/Indicator'

import { actions, ActionType } from './actions'
import { reducer, State, defaultState } from './reducer'
import { OpsPanel } from './comp-panel'
import { ComponentFoo } from './comp-foo'

interface WrapperProps {
    hasBgColor: boolean;
}

const Wrapper = styled.div`
    position: relative;
    height: 100%;
    border: 1px dashed #cccccc;
    background-color: ${(props: WrapperProps): string => props.hasBgColor ? '#F0EBE6' : 'none'};
`
const FooWrapper = styled.div`
    position: absolute;
    top: 5px;
    left: 25px;
`

export type Context = ModuleContext<State, ActionType>

export default compose<{}, State, ActionType>('ModuleB', actions, reducer, defaultState, ({state, suspense}): ReactElement => {
    return(
        <Wrapper hasBgColor={state.hasBgColor}>
            <FooWrapper>
                <ComponentFoo />
            </FooWrapper>
            <OpsPanel />
            <Indicator queue={suspense}/>
        </Wrapper>
    )
})