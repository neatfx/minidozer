import React, { ReactElement } from 'react'

import { Button } from './Button'

interface Props {
    handleClick: Function;
    value?: string;
    children?: ReactElement;
    loading?: boolean;
    disabled?: boolean;
    type?: string;
    fontSize?: number;
    block?: boolean;
    primary?: boolean;
    secondary?: boolean;
    success?: boolean;
    danger?: boolean;
    warning?: boolean;
    info?: boolean;
}

const ButtonContainer = (props: Props): ReactElement => {
    let type = 'default'
    if(props.primary) type = 'primary'
    if(props.secondary) type = 'secondary'
    if(props.success) type = 'success'
    if(props.danger) type = 'danger'
    if(props.warning) type = 'warning'
    if(props.info) type = 'info'

    return (
        <Button
            value={props.value || (props.children ? '' : 'BUTTON')}
            type={type}
            block={(props.block === undefined) ? false : true}
            handleClick={props.handleClick}
            loading={(props.loading === undefined) ? false : props.loading}
            disabled={props.disabled || false}
            fontSize={props.fontSize || 13}
        >
            {props.children}
        </Button>
    )
}

export default ButtonContainer