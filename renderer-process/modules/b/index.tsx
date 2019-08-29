import React, { ReactElement } from 'react'
import styled from 'styled-components'

import { compose } from '../../minidozer/Module'

import { actions, ActionType } from './actions'
import { reducer, State } from './reducer'
import { OpsPanel } from './comp-panel'
import { ComponentFoo } from './comp-foo'

import Indicator from '../../components/Indicator'

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

export default compose<{}, State, ActionType>('ModuleB', actions, reducer, ({state, suspense}): ReactElement => {
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