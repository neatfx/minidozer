import React, { ReactElement } from 'react'
import styled from 'styled-components'

import { Bounce as Spin } from '../Icons/Bounce'

interface Props {
    value: string;
    type: string;
    handleClick: CallableFunction;
    loading: boolean;
    disabled: boolean;
    block: boolean;
    children?: object;
    fontSize: number;
}
interface SpriteProps {
    noIcon: boolean;
    noValue: boolean;
    disabled: boolean;
    // fontSize: number;
    noSpin: boolean;
    // iconSize: number;
    block: boolean;
    type: string;
}
interface LoadingProps {
    show: boolean;
}
interface IconProps {
    show: boolean;
}
interface ValueProps {
    show: boolean;
    fontSize: number;
}

const types: {[key: string]: string} = {
    default: '210, 210, 210', // '#e5e5e5'
    primary: '21, 127, 251', // '#1566fa',
    secondary: '108, 117, 125', // '#59616a'
    success: '48, 166, 74', // '#28a745',
    danger: '218, 55, 73', // '#cf2039',
    warning: '253, 192, 47', // '#fbb425',
    info: '36, 162, 183', // '#2292a8',
}
const Sprite = styled.div`
    display: ${(props: SpriteProps): string => props.block ? "grid" : "inline-grid"};
    margin: 1px;
    grid-auto-flow: column dense;
    justify-content: center;
    align-content: center;
    grid-column-gap: 5px;
    padding: 5px 5px;
    color: ${(props: SpriteProps): string => {
        let color = 'rgb(' + types[props.type] + ')'
        if(props.type === 'default') color = '#7c7c7c'
        if(props.disabled) {
            color = 'rgb(' + types[props.type] + ', 0.3)'
            if(props.type === 'default') color = 'rgb(' + types[props.type] + ')'
        }
        return color
    }};
    background-color: ${(props: SpriteProps): string => {
        let color = 'rgb(' + types[props.type] + ', 0.4)'
        if(props.disabled) color = 'rgb(' + types[props.type] + ', 0.1)' 
        return color
    }};
    border: ${(props: SpriteProps): string => {
        let border = '1px solid ' + 'rgb(' + types[props.type] + ')'
        if(props.type !== 'default') border = '1px solid ' + 'rgb(' + types[props.type] + ', 0.3)'
        if(props.disabled) border = '1px solid rgb(' + types[props.type] + ', 0.1)' 
        return border
    }};
    pointer-events: ${(props: SpriteProps): string => props.disabled ? 'none' : 'auto'};
    :hover {
        color: ${(props: SpriteProps): string => {
        let color = 'rgb(255, 255, 255, 0.8)'
        if(props.type === 'default') color = '#7c7c7c' 
        return color
    }};
        background-color: ${(props: SpriteProps): string => {
        let color = 'rgb(' + types[props.type] + ', 0.8)'
        return color
    }};
    };
    transition: color .1s ease-in-out, background-color .1s ease-in-out, border-color .1s ease-in-out, box-shadow .1s ease-in-out;
`
const Indicator = styled.span`
    display:  ${(props: LoadingProps): string => props.show ? 'inline-grid' : 'none'};
    align-content: center;
    /* border: 1px solid royalblue; */
`
const Icon = styled.span`
    display:  ${(props: IconProps): string => props.show ? 'inline-grid' : 'none'};
    align-content: center;
    /* border: 1px solid royalblue; */
`
const Text = styled.span`
    display:  ${(props: ValueProps): string => props.show ? 'inline-grid' : 'none'};
    align-content: center;
    font-size: ${(props: ValueProps): string => {
        let size = props.fontSize
        return size + 'px'
    }};
    /* border: 1px solid royalblue; */
`

export function Button(props: Props): ReactElement {
    return(
        <Sprite
            noSpin={!props.loading || props.disabled}
            noIcon={!props.children}
            noValue={!props.value}
            disabled={props.disabled}
            type={props.type}
            block={props.block}
            onClick={(e): void => {props.handleClick(e)}}
        >
            <Indicator show={props.loading && !props.disabled}>
                <Spin size={props.fontSize - 3} />
            </Indicator>
            <Icon show={props.children != undefined}>
                {props.children}
            </Icon>
            <Text show={props.value != ''} fontSize={props.fontSize} >
                {props.value}
            </Text>
        </Sprite>
    )
}