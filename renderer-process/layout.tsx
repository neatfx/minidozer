import React, { ReactElement } from 'react'
import styled from 'styled-components'

import { useRouter } from '@minidozer/Module'
import { middlewares, Middleware } from '@minidozer/Middleware'

import Navbar from '@modules/navbar'
import A from '@modules/a'
import B from '@modules/b'
import C from '@modules/c'
import D from '@modules/d'
import E from '@modules/e'

const RootWrapper = styled.div`
    display: grid;
    grid-template-columns: 45px auto;
    min-height: 100vh;
    background-color: #efefef;
`
const RightWrapper = styled.div`
    display: grid;
    padding: 10px;
`
const userDefinedMiddlewareA: Middleware = async () => {
    console.log('external middleware 01')
}

middlewares.external = [userDefinedMiddlewareA]

export function Layout(): ReactElement {
    const [router, route] = useRouter('activeNav')

    return(
        <RootWrapper>
            <Navbar
                bar={456}
                router={router}
            >
                <div>######</div>
            </Navbar>
            <RightWrapper>
                <A route={route}/>
                <B route={route}/>
                <C route={route}/>
                <D route={route}/>
                <E route={route}/>
            </RightWrapper>
        </RootWrapper>
    )
}