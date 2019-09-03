import React, { ReactElement, Fragment } from 'react'

import { useModuleContext } from '@minidozer/Module'

import Button from '@components/Button'

import { Context } from '@modules/b'

export function ActionTest(): ReactElement {
    const { dispatch, state, tracer } = useModuleContext<Context>('ModuleB')

    const toggle = (): void => {
        dispatch('TOGGLE_BG_COLOR', {
            hasBgColor: !state.hasBgColor
        }).then(
            (result): void => tracer.log('Action', 'TOGGLE_BG_COLOR', 'Return', result)
        )
    }
    const asyncToggle = (): void => {
        dispatch('ASYNC_TOGGLE_BG_COLOR', {
            hasBgColor: !state.hasBgColor
        }).then(
            (result): void => tracer.log('Action', 'ASYNC_TOGGLE_BG_COLOR', 'Return', result)
        )
    }
    const toggleFoo = (): void => {
        dispatch('TOGGLE_BG_COLOR_OF_FOO', {
            hasBgColor: !state.compFoo.hasBgColor
        }).then(
            (result): void => tracer.log('Action', 'TOGGLE_BG_COLOR_OF_FOO', 'Return', result)
        )
    }
    const asyncToggleFoo = (): void => {
        dispatch('ASYNC_TOGGLE_BG_COLOR_OF_FOO', {
            hasBgColor: !state.compFoo.hasBgColor
        }).then(
            (result): void => tracer.log('Action', 'ASYNC_TOGGLE_BG_COLOR_OF_FOO', 'Return', result)
        )
    }
    const asyncHttpGet = (): void => {
        dispatch('ASYNC_HTTP_GET').then(
            (result): void => tracer.log('Action', 'ASYNC_HTTP_GET', 'Return', result)
        )
    }
    const handlError = (): void => {
        dispatch('ERROR').then(
            (result): void => tracer.log('Action', 'ERROR', 'Return', result)
        )
    }
    const handleAsyncError = (): void => {
        dispatch('ASYNC_ERROR').then(
            (result): void => tracer.log('Action', 'ASYNC_ERROR', 'Return', result)
        )
    }

    return(
        <Fragment>
            <Button value="切换 ModuleB 背景颜色 - 同步组件通信" handleClick={toggle} />
            <Button value="切换 ModuleB 背景颜色 - 异步组件通信" handleClick={asyncToggle} />
            <Button value="切换 ComponentFoo 背景颜色 - 同步组件通信" handleClick={toggleFoo} />
            <Button value="切换 ComponentFoo 背景颜色 - 异步组件通信" handleClick={asyncToggleFoo} />
            <Button value="HTTP GET" handleClick={asyncHttpGet} />
            <Button value="错误处理 - 同步" handleClick={handlError} />
            <Button value="错误处理 - 异步" handleClick={handleAsyncError} />
        </Fragment>
    )
}