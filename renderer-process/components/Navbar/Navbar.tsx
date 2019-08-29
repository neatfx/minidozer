import React, { ReactElement } from 'react'
import styled from 'styled-components'

interface StyleProps {
    active: boolean;
}
interface Props {
    navItems:  {
        title: string;
        icon: JSX.Element;
    }[];
    activeItem: string;
    handleClick: CallableFunction;
}

const Wrapper = styled.div`
  display: grid;
  grid-template-rows: repeat(4, 60px) auto 55px;
  background-color: #e8e9e8;
  border-right: 1px solid #bcc2c6;
`
const NavItem = styled.a`
    text-align: center;
    padding: 20px 1em;
    color: ${(props: StyleProps): string => props.active ? '#49585f' : '#7a8c96'};
    :hover {
        color: #49585f;
    };
    pointer-events: ${(props: StyleProps): string => props.active ? 'none' : 'auto'};
`
  
export function Navbar(props: Props): ReactElement {
    const { navItems, activeItem, handleClick } = props
    const UpperNavItems = navItems.slice(0, navItems.length - 1).map((item): JSX.Element =>
        <NavItem key={item.title} active={activeItem === item.title} onClick={(): void => handleClick(item.title)}>
            {item.icon}
        </NavItem>
    )
    const LowerNavItems = navItems.slice(navItems.length - 1).map((item): JSX.Element =>
        <NavItem key={item.title} active={activeItem === item.title} onClick={(): void => handleClick(item.title)}>
            {item.icon}
        </NavItem>
    )

    return (
        <Wrapper>
            {UpperNavItems}
            <div />
            {LowerNavItems}
        </Wrapper>
    )
}
