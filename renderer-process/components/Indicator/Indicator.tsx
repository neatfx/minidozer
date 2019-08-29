import React, { ReactElement, ReactNode } from 'react'
import styled from 'styled-components'

export interface Status {
    type: string;
    failure?: {
        type: string;
        error?: string;
    };
    response?: string;
    createdAt: number;
}
interface Props {
    queue: Status[];
}

const Queue = styled.div`
    position: absolute;
    top: 5px;
    right: 5px;
`
const MessageItem = styled.div`
    border: 1px solid #bcc2c6;
    padding: 5px;
    margin-bottom: 5px;
    color: #666666;
    box-shadow: 2px 2px 15px rgba(0, 0, 0, 0.05);
`

export function Indicator(props: Props): ReactElement {
    let messages = props.queue.map((item, index): ReactNode => {
        if (item.failure) return (
            <MessageItem key={index} >
                { item.type + ' - ' + (item.failure.type === 'timeout' ?  '超时' : item.failure.error) + ' - ' + item.createdAt}
            </MessageItem> 
        )
        return(
            <MessageItem key={index} >
                { item.type + ' - ' + (item.response ? (item.response + ' - ' + item.createdAt) : item.createdAt)}
            </MessageItem>
        )
    })

    return(
        <Queue>
            {messages}
        </Queue>
    )
}