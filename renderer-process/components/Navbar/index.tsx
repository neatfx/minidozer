import React, { ReactElement, useEffect, useRef, useReducer } from 'react'

import { Navbar } from './Navbar'

interface Props {
    navItems: {
        title: string;
        icon: JSX.Element;
    }[];
    activeNav?: string;
    saveState?: CallableFunction;
}
interface State {
    activeNav: string;
}
interface Action {
    type: string;
    payload: {
        activeNav: string;
    };
}

function useMergeStoreToState(props: Props, state: State): void {
    const ref = useRef(props)
    const prevProps = ref.current
    const storedState = {
        activeNav: prevProps.activeNav !== props.activeNav ? props.activeNav : state.activeNav, 
    }
    state = Object.assign(state, storedState)
    ref.current = props
}

function useDocumentTitle(title: string): void {
    useEffect(
        (): void => {
            document.title = title
        },
        [title]
    )
}

function useHandleEvents(props: Props): [State, object | null, React.Dispatch<Action>] {
    const initState = (props: Props): State => {
        return {
            activeNav: props.activeNav || props.navItems[0].title 
        }
    }
    let stateForUpdate = {}
    let stateForSave: object | null = null
    const reducer = (state: State, action: Action): State => {
        switch (action.type) {
            case 'SELECT_TAB':
                stateForUpdate = stateForSave = {
                    activeNav: action.payload && action.payload.activeNav
                }
                break
            default:
                throw new Error('Action Type Not Found')
        }

        return Object.assign({}, state, stateForUpdate)
    }
    const [state, dispatch] = useReducer(reducer, props, initState)

    return [state, stateForSave, dispatch]
}

export default function NavbarContainer(props: Props): ReactElement {
    const [state, stateForSave, dispatch] = useHandleEvents(props)
    if(props.saveState && stateForSave) props.saveState(state)
    useMergeStoreToState(props, state)
    useDocumentTitle(`Minidozer - ${state.activeNav}`)

    return (
        <Navbar
            navItems={props.navItems}
            activeItem={state.activeNav} 
            handleClick={(navTitle: string): void => {dispatch({type: 'SELECT_TAB', payload: {activeNav: navTitle}})}} 
        />
    )
}