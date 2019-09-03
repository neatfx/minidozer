import React, { ReactElement, Fragment } from 'react'

import { useModuleContext } from '@minidozer/Module'
import { Tracer } from '@minidozer/Utils'

import Button from '@components/Button'
import { Context } from '@modules/b'

const tracer = new Tracer('moduleC/ActionTest')

export function ActionTest(): ReactElement | null {
    const { state, dispatch } = useModuleContext<Context>('ModuleB')
    const handleClick = (): void => {
        dispatch('TOGGLE_PANEL', {hidden: !state.opsPanel.hidden}).then(
            (result): void => tracer.log('TOGGLE_PANEL', result)
        )
    }
    const handleClickAsync = (): void => {
        dispatch('ASYNC_TOGGLE_PANEL', {hidden: !state.opsPanel.hidden}).then(
            (result): void => tracer.log('ASYNC_TOGGLE_PANEL', result)
        )
    }

    return(
        <Fragment>
            <Button value="切换 OpsPanel @ ModuleB 显示状态 - 同步模块通信" handleClick={handleClick} />
            <Button value="切换 OpsPanel @ ModuleB 显示状态 - 异步模块通信" handleClick={handleClickAsync} />
        </Fragment>
    )
}