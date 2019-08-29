import React, { ReactElement } from 'react'
import styled from 'styled-components'

import { useModuleContext } from '../../../minidozer/Module'

interface WrapperProps {
    hasBgColor: boolean;
}

const Wrapper = styled.div`
    padding: 5px 10px;
    border: 1px solid #29C232;
    color: ${(props: WrapperProps): string => props.hasBgColor ? '#eee' : '#7c7c7c'};
    background-color: ${(props: WrapperProps): string => props.hasBgColor ? '#29C232' : 'none'};
`

export function ComponentFoo(): ReactElement {
    const {state} = useModuleContext('ModuleB')

    return(
        <Wrapper hasBgColor={state.compFoo.hasBgColor}>
            ComponentFoo
        </Wrapper>
    )
}