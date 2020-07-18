import { createGlobalStyle } from 'styled-components'

const MainCSS  = createGlobalStyle`
    body {
        background-color: #fff;
        font-size: 14px;
        color: #333;
        font-family: 'Noto Sans JP', sans-serif;
    }
    
    *, *::after, *::before {
        box-sizing: border-box;
    }
    
    a {
        color: inherit;
        text-decoration: none;
    }
`

export default MainCSS
