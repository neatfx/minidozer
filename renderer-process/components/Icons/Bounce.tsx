import React, { ReactElement } from 'react'
import styled, { keyframes } from 'styled-components'

interface Props {
    color?: string;
    size?: number;
}

const SpinIcon = styled.div`
    display: inline-grid;
`
const scale = keyframes`
    0%, 100% { transform: scale(0.0) }
    50% { transform: scale(1.0) }
`
const Bounce1 = styled.span`
    grid-row: 1 / 2;
    grid-column: 1 / 2;
    width: ${(props: Props): string => props.size + 'px'};
    height: ${(props: Props): string => props.size + 'px'};
    border-radius: 50%;
    background-color: green;
    opacity: 0.6;
    animation: ${scale} 2.0s infinite ease-in-out;
`
const Bounce2 = styled(Bounce1)`
    animation-delay: -1.5s;
`

export function Bounce(props: Props): ReactElement{
    return(
        <SpinIcon>
            <Bounce1 color={props.color} size={props.size}/>
            <Bounce2 color={props.color} size={props.size}/>
        </SpinIcon>
    )
}