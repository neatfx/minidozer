import { hot } from 'react-hot-loader/root'
import React from 'react'
import ReactDOM from 'react-dom'
import { createGlobalStyle } from 'styled-components'

import { Layout } from './layout'

const GlobalStyle = createGlobalStyle`
  body {
    font-family: "Helvetica Neue";
    margin: 0;
    overflow: hidden;
    -webkit-user-select: none;
    font: caption;
    cursor: default;
  }
  ::-webkit-scrollbar {
    width: 5px;
  }
  ::-webkit-scrollbar-thumb {
    background-color: #d3d3d3;
  }
`

hot(Layout)

ReactDOM.render(
    <React.StrictMode>
        <GlobalStyle />
        <Layout />
    </React.StrictMode>,
    document.getElementById('react-root')
)