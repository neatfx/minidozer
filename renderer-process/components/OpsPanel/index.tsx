import React, { ReactElement, useReducer, useRef } from 'react'

import { OpsPanel } from './OpsPanel'

interface Props {
    tabs: {
        icon: JSX.Element;
        content: React.FC;
    }[];
    activeTab?: number;
    hidden?: boolean;
    left?: number;
    top?: number;
    minibarX?: number;
    minibarY?: number;
    saveState?: CallableFunction;
    container: HTMLElement; 
}
interface State {
    activeTab: number;
    hidden: boolean;
    left: number;
    top: number;
    minibarX: number;
    minibarY: number;
    dragging: boolean;
    startX: number;
    startY: number;
    zoneW: number;
    zoneH: number;
}
export interface StateForSave {
    activeTab?: number;
    hidden?: boolean;
    left?: number;
    top?: number;
}
interface Action {
    type: string;
    payload: {
        tabIndex?: number;
        hidden?: boolean;
        left?: number;
        top?: number;
        clientX?: number;
        clientY?: number;
        containerWidth?: number;
        containerHeight?: number;
    };
}

function useHandleEvents(props: Props): [State, object | null, React.Dispatch<Action>] {
    const initState = (props: Props): State => {
        return {
            activeTab:  props.activeTab || 0,
            hidden: props.hidden || false,
            left: props.left || 25,
            top: props.top || 5,
            minibarX: props.minibarX || 5,
            minibarY: props.minibarY || 5,
            dragging: false,
            startX: 0,
            startY: 0,
            zoneW: 0,
            zoneH: 0,
        }
    }
    const defaultProps = useRef({
        hidden: false,
        left: 25,
        top: 5,
    })
    let stateForUpdate = {}
    let stateForSave: StateForSave | null = null
    const reducer = (state: State, action: Action): State => {
        switch (action.type) {
            case 'SELECT_TAB':
                stateForUpdate = stateForSave = {
                    activeTab: action.payload.tabIndex
                }
                break
            case 'HIDE':
                stateForUpdate = stateForSave = {
                    hidden: true
                }
                break
            case 'TOGGLE_VISIBLE':
                stateForUpdate = stateForSave = {
                    hidden: !state.hidden
                }
                break
            case 'RESET_POS_AND_VISIBLE':
                stateForUpdate = stateForSave = defaultProps.current
                break
            case 'DRAG_START':
            {
                stateForUpdate = {
                    dragging: true,
                    startX: action.payload.clientX,
                    startY: action.payload.clientY,
                    zoneW:  action.payload.containerWidth,
                    zoneH:  action.payload.containerHeight,
                }
                break
            }
            case 'DRAG':
            {
                let mouseX =  action.payload.clientX
                let mouseY =  action.payload.clientY
                let deltaX =  mouseX? mouseX - state.startX : 0
                let deltaY =  mouseY? mouseY - state.startY : 0
                let left = state.left + deltaX
                let top = state.top + deltaY

                if(left < 0) {
                    mouseX = state.startX
                    left = 0
                } else if(left > state.zoneW) {
                    mouseX = state.startX
                    left = state.left
                }

                if(top < 0) {
                    mouseY = state.startY
                    top = 0
                } else if(top > state.zoneH) {
                    mouseY = state.startY
                    top = state.top
                }

                stateForUpdate = {
                    dragging: true,
                    startX: mouseX,
                    startY: mouseY,
                    left: left,
                    top: top
                }
                break
            }
            case 'DRAG_END':
                stateForUpdate = {
                    dragging: false
                }
                stateForSave = {
                    left: state.left,
                    top: state.top
                }
                break
            default:
                throw new Error('Action Type Not Found')
        }

        return Object.assign({}, state, stateForUpdate)
    }
    const [state, dispatch] = useReducer(reducer, props, initState)

    if(state.dragging) {
        if(!document.onmousemove){
            document.onmousemove = (e: MouseEvent): void => dispatch({type: 'DRAG', payload: e})
        }
        if(!document.onmouseup){
            document.onmouseup = (): void => dispatch({type: 'DRAG_END', payload: {}})
        }
    }else{
        document.onmousemove = null
        document.onmouseup = null
    }

    return [state, stateForSave, dispatch]
}

function useMergeStoreToState(props: Props, state: State): void {
    const ref = useRef(props)
    const prevProps = ref.current
    const storedState = {
        hidden: prevProps.hidden !== props.hidden ? props.hidden : state.hidden,
        tabIndex: prevProps.activeTab !== props.activeTab ? props.activeTab : state.activeTab, 
        left: prevProps.left !== props.left ? props.left : state.left, 
        top: prevProps.top !== props.top ? props.top : state.top,
    }
    state = Object.assign(state, storedState)
    ref.current = props
}

export default function OpsPanelContainer(props: Props): ReactElement {
    const [state, stateForSave, dispatch] = useHandleEvents(props)
    if(props.saveState && stateForSave) props.saveState(stateForSave)
    useMergeStoreToState(props, state)

    return (
        <OpsPanel
            tabs={props.tabs}
            // minibarX={props.minibarX || 0}
            // minibarY={props.minibarY || 0}
            handleMouseDown={(event: MouseEvent, node: HTMLElement): void => {
                dispatch({
                    type: 'DRAG_START',
                    payload: {
                        clientX: event.clientX,
                        clientY: event.clientY,
                        containerWidth: (node.parentNode as HTMLElement).clientWidth - node.clientWidth,
                        containerHeight: (node.parentNode as HTMLElement).clientHeight - node.clientHeight, 
                    }
                })
            }}
            handleTabClick={(tabIndex: number): void => dispatch({type: 'SELECT_TAB', payload: {tabIndex: tabIndex}})}
            handleMinimizeBtnClick={(): void => dispatch({type: 'HIDE', payload: {}})}
            handleExpandBtnClick={(): void => dispatch({type: 'TOGGLE_VISIBLE', payload: {}})}
            handleResetBtnClick={(): void => dispatch({type: 'RESET_POS_AND_VISIBLE', payload: {}})}
            {...state}
        />
    )
}

import inspector from './Inspector'

export const Inspector = inspector