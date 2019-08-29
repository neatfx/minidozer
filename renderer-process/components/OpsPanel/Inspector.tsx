import React, { ReactElement } from 'react'
import styled from 'styled-components'

interface Props {
    activeTab: number;
    left: number;
    top: number;
}

const Wrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 1px;
    border: 1px solid #e5e5e5;
    justify-items: center;
    span {
        display: inline-grid;
        padding: 5px 5px;
    }
`

export default function Inspector(props: Props): ReactElement {
    return(
        <Wrapper>
            <div>
                <span>TAB</span>
                <span>{props.activeTab}</span>
            </div>
            <div>
                <span>LEFT</span>
                <span>{props.left}</span>
            </div>
            <div>
                <span>TOP</span>
                <span>{props.top}</span>
            </div>
        </Wrapper>
    )
}