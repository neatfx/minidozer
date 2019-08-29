import React, { ReactElement } from 'react'

import { Indicator, Status } from './Indicator'

interface Props {
    queue: Status[];
}

export default function IndicatorContainer(props: Props): ReactElement {
    return(
        <Indicator queue={props.queue} />
    )
}