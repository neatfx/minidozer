import React, { ReactElement, Fragment } from 'react'

import { Tracer } from '../../minidozer/Utils'

import { CPU } from '../../components/Icons/Icons'
import Button from '../../components/Button'

const tracer = new Tracer('moduleA/CompsTest')

export function ButtonTest(): ReactElement {
    const handleClick = async(): Promise<void> => {
        tracer.log('foo')
    }

    return(
        <Fragment>
            <Button handleClick={handleClick} />
            <Button value="文字" handleClick={handleClick} />
            <Button handleClick={handleClick} loading value="状态图标"/>
            <Button handleClick={handleClick} loading value="状态图标">
                <CPU size={16} />
            </Button>
            <br/>
            <Button handleClick={handleClick} primary value="primary" />
            <Button handleClick={handleClick} secondary value="secondary"/>
            <Button handleClick={handleClick} success value="success"/>
            <Button handleClick={handleClick} danger value="danger"/>
            <Button handleClick={handleClick} warning value="warning"/>
            <Button handleClick={handleClick} info value="info"/>
            <br/>
            <Button handleClick={handleClick} disabled />
            <Button handleClick={handleClick} value="文字" disabled />
            <Button handleClick={handleClick} disabled>
                <CPU />
            </Button>
            <Button value="图标按钮" handleClick={handleClick} disabled>
                <CPU />
            </Button>
            <Button handleClick={handleClick} loading value="状态图标" disabled />
            <br/>
            <Button handleClick={handleClick} primary disabled value="primary" />
            <Button handleClick={handleClick} secondary disabled value="secondary"/>
            <Button handleClick={handleClick} success disabled value="success"/>
            <Button handleClick={handleClick} danger disabled value="danger"/>
            <Button handleClick={handleClick} warning disabled value="warning"/>
            <Button handleClick={handleClick} info disabled value="info"/>
            <br></br>
            <Button handleClick={handleClick} block value="Block Mode"/>
        </Fragment>
    )
}