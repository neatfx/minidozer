import React, { ReactElement, Fragment, useRef } from 'react'
import styled from 'styled-components'

interface Props {
    tabs:  {
        icon:  JSX.Element;
        content: React.FC;
    }[];
    activeTab: number;
    hidden: boolean;
    left: number;
    top: number;
    dragging: boolean;
    minibarX: number;
    minibarY: number;
    handleMouseDown: CallableFunction;
    handleTabClick: CallableFunction;
    handleMinimizeBtnClick: CallableFunction;
    handleExpandBtnClick: CallableFunction;
    handleResetBtnClick: CallableFunction;
}
interface PanelProps {
    hidden: boolean;
}
interface TabItemProps {
    active: boolean;
    dragging: boolean;
}
interface TabBackgroundSliderProps {
    left: number;
}
interface TabContentProps {
    show: boolean;
}
interface MinibarProps {
    left: number;
    top: number;
}
interface ExpandBtnProps {
    isExpanded: boolean;
}

const ShortcutsBar = styled.div`
    position: absolute;
    left: ${(props: MinibarProps): string => props.left + 'px'};
    top: ${(props: MinibarProps): string => props.top + 'px'};
    border: 1px solid #bcc2c6;
    box-shadow: 2px 2px 15px rgba(0, 0, 0, 0.05);
`
const ToggleVisibleBtn = styled.div`
    margin: 2px;
    width: 10px;
    height: 10px;
    background-color: ${(props: ExpandBtnProps): string => props.isExpanded? '#FEB925' : '#29C232'};
`
const ResetPosAndVisibleBtn = styled.div`
    margin: 2px;
    width: 10px;
    height: 10px;
    background-color: #bcc2c6;
`
const Panel = styled.div`
    position: absolute;
    display: ${(props: PanelProps): string => props.hidden ? 'none' : 'block'};
    border: 1px solid #bcc2c6;
    box-shadow: 2px 2px 15px rgba(0, 0, 0, 0.05);
`
const DragHandle = styled.div`
    height: 40px;
    background-color: #d7d7d7;
    cursor: move;
`
const HideBtn = styled.div`
    position: absolute;
    top: 5px;
    right: 5px;
    height: 10px;
    width: 10px;
    background-color: #FEB925;
    border-radius: 1em;
    border: 0.2px solid #EAA422;
    cursor: default;
    pointer-events: auto;
`
const Tabs = styled.div`
    position: absolute;
    top: 10px;
    left: 10px;
    /* border: 1px solid red; */
`
const TabItemActiveIndicator = styled.div`
    position: absolute;
    left: ${(props: TabBackgroundSliderProps): string => props.left * 56 + 'px'};
    width: 56px;
    height: 30px;
    background-color: #efefef;
    transition: left 0.3s;
`
const TabGroup = styled.div`
    position: absolute;
    display: grid;
    grid-auto-flow: column dense;
    /* border: 1px solid blue; */
`
const TabItem = styled.span`
  display: inline-grid;
  padding: 5px 20px 7px;
  color: ${(props: TabItemProps): string => props.active ? '#49585f' : '#7a8c96'};
  box-shadow: ${(props: TabItemProps): string | null => props.active ? '0 -6px 15px rgba(0, 0, 0, 0.02)' : null};
  :hover {
      background-color: ${(props: TabItemProps): string => props.active ? '' : '#e6e6e6'};
  };
  pointer-events: ${(props: TabItemProps): string => (props.dragging || props.active) ? 'none' : 'auto'};
  cursor: default;
`
const TabContent = styled.div`
  display: ${(props: TabContentProps): string => props.show ? 'block' : 'none'};
  max-height: 500px;
  min-width: 330px;
  padding: 10px;
  overflow-y: auto;
  color: #7a8c96;
  background-color: #efefef;
  /* border: 1px solid green; */
  cursor: default;
`

export const OpsPanel: React.FunctionComponent<Props> = (props: Props): ReactElement => {
    const { 
        tabs,
        activeTab,
        hidden,
        left,
        top,
        dragging,
        minibarX,
        minibarY,
        handleMouseDown,
        handleTabClick,
        handleMinimizeBtnClick,
        handleExpandBtnClick,
        handleResetBtnClick,
    } = props

    const tabsItems = tabs.map((tab, index): JSX.Element => {
        return (
            <TabItem key={index} active={activeTab === index} onClick={(): void => {handleTabClick(index)}} dragging={dragging}>
                {tab.icon}
            </TabItem>
        )
    })
    

    const tabContentGroup = tabs.map((tab, index): JSX.Element => {
        return (
            <TabContent key={index} show={activeTab === index}>
                <tab.content />
            </TabContent>
        )
    })

    const panelEl = useRef(null)

    return (
        <Fragment>
            <ShortcutsBar left={minibarX} top={minibarY}>
                <ToggleVisibleBtn isExpanded={!hidden} onClick={(): void => {handleExpandBtnClick()}}/>
                <ResetPosAndVisibleBtn onClick={(): void => handleResetBtnClick()} />
            </ShortcutsBar>
            <Panel hidden={hidden} style={{left: left, top: top}} ref={panelEl}>
                <DragHandle onMouseDown={(e): void => {handleMouseDown(e.nativeEvent, panelEl.current)}} />
                <Tabs>
                    <TabItemActiveIndicator left={activeTab} />
                    <TabGroup>{tabsItems}</TabGroup>
                </Tabs>
                {tabContentGroup}
                <HideBtn onClick={(): void => handleMinimizeBtnClick()} />
            </Panel>
        </Fragment>
    )
}