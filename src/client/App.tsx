import * as React from 'react'
import { Client as Styletron } from 'styletron-engine-atomic'
import { Provider as StyletronProvider } from 'styletron-react'
import { LightTheme, BaseProvider } from 'baseui'
import MainCSS from './css/Main'
import ResetCSS from './css/Reset'

import Home from './page/Home'

const engine = new Styletron()

type Props = {}
const App = (_: Props): React.ReactElement => {
    return (
        <>
            <MainCSS />
            <ResetCSS />
            <StyletronProvider value={engine}>
                <BaseProvider theme={LightTheme}>
                    <Home />
                </BaseProvider>
            </StyletronProvider>
        </>
    )
}

export default App
