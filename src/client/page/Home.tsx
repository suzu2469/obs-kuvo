import * as React from 'react'
import produce from 'immer'

import * as PlaylistID from '../module/playlistID'
import { checkClawlerStatus } from '../api/status'
import * as CawlerAPI from '../api/startAndStop'
import { IAPIClient } from '../api/client'

import { styled } from 'baseui'
import { Heading, HeadingLevel } from 'baseui/heading'
import { Input } from 'baseui/input'
import { Button } from 'baseui/button'
import { FormControl } from 'baseui/form-control'
import { Spinner } from 'baseui/spinner'

enum ClawlerStatus {
    ClawlerStopped,
    ClawlerWorking
}
enum Status {
    BeforeInitialized,
    Valid,
    Pending
}

const mockApiClient = {
    get(_url: string) {
        return new Promise<boolean>((resolve) => {
            setTimeout(() => resolve(false), 3000)
        })
    },
    post() {
        return new Promise((resolve) => {
            setTimeout(() => resolve(), 3000)
        })
    }
}

/**
 * State
 */
type State = {
    status: Status
    calwlerStatus: ClawlerStatus
    form: {
        playlistURL: string
    }
    errors: {
        playlistURL?: string
    }
}
const initialState: State = {
    status: Status.BeforeInitialized,
    calwlerStatus: ClawlerStatus.ClawlerStopped,
    form: {
        playlistURL: ''
    },
    errors: {}
}

type Action =
    | ReturnType<typeof changePlaylistURL>
    | ReturnType<typeof invalidPaylistURL>
    | ReturnType<typeof validPlaylistURL>
    | ReturnType<typeof init>
    | ReturnType<typeof requestStart>
    | ReturnType<typeof requestEnd>
    | ReturnType<typeof clawlStarted>
    | ReturnType<typeof clawlStopped>
const changePlaylistURL = (payload: string) => ({
    type: 'changePlaylistURL' as const,
    payload
})
const invalidPaylistURL = () => ({
    type: 'invalidPlaylistURL' as const
})
const validPlaylistURL = () => ({
    type: 'validPlaylistURL' as const
})
const requestStart = () => ({
    type: 'requestStart' as const
})
const requestEnd = () => ({
    type: 'requestEnd' as const
})
const clawlStarted = () => ({
    type: 'clawlStarted' as const
})
const clawlStopped = () => ({
    type: 'clawlStopped' as const
})
const init = (payload: { calwlerIsStarted: boolean }) => ({
    type: 'init' as const,
    payload
})

const reducer: React.Reducer<State, Action> = (state, action) => {
    switch (action.type) {
        case 'init':
            return produce(state, (draftState) => {
                draftState.status = Status.Valid
                draftState.calwlerStatus = action.payload.calwlerIsStarted
                    ? ClawlerStatus.ClawlerWorking
                    : ClawlerStatus.ClawlerStopped
            })
        case 'changePlaylistURL':
            return produce(state, (draftState) => {
                draftState.form.playlistURL = action.payload
            })
        case 'invalidPlaylistURL':
            return produce(state, (draftState) => {
                draftState.errors.playlistURL = 'URLが不正です'
            })
        case 'validPlaylistURL':
            return produce(state, (draftState) => {
                draftState.errors.playlistURL = undefined
            })
        case 'requestStart':
            return produce(state, (draftState) => {
                draftState.status = Status.Pending
            })
        case 'requestEnd':
            return produce(state, (draftState) => {
                draftState.status = Status.Valid
            })
        case 'clawlStarted':
            return produce(state, (draftState) => {
                draftState.calwlerStatus = ClawlerStatus.ClawlerWorking
            })
        case 'clawlStopped':
            return produce(state, (draftState) => {
                draftState.calwlerStatus = ClawlerStatus.ClawlerStopped
            })

        default:
            return state
    }
}

/**
 * Component
 */
type Props = {}
const Home = (props: Props): React.ReactElement => {
    const [state, dispatch] = React.useReducer(reducer, initialState)

    const validatePlaylistURL = React.useCallback(
        () =>
            PlaylistID.validatePlaylistURL(state.form.playlistURL)
                ? dispatch(validPlaylistURL())
                : dispatch(invalidPaylistURL()),
        [state.form.playlistURL]
    )
    const startClawl = React.useCallback(() => {
        if (!PlaylistID.validatePlaylistURL(state.form.playlistURL)) return
        dispatch(requestStart())
        CawlerAPI.start(mockApiClient as any).then(() => {
            dispatch(requestEnd())
            dispatch(clawlStarted())
        })
    }, [state.form.playlistURL])
    const endClawl = React.useCallback(() => {
        dispatch(requestStart())
        CawlerAPI.start(mockApiClient as any).then(() => {
            dispatch(requestEnd())
            dispatch(clawlStopped())
        })
    }, [])

    React.useEffect(() => {
        checkClawlerStatus(mockApiClient as any).then((status) => {
            dispatch(init({ calwlerIsStarted: status }))
        })
    }, [])

    switch (state.status) {
        case Status.BeforeInitialized:
            return (
                <SpinnerWrap>
                    <Spinner />
                </SpinnerWrap>
            )
        default:
            return (
                <Wrap>
                    {renderForm(
                        state,
                        dispatch,
                        validatePlaylistURL,
                        startClawl,
                        endClawl
                    )}
                </Wrap>
            )
    }
}

function renderForm(
    state: State,
    dispatch: React.Dispatch<any>,
    validatePlaylistURL: () => void,
    startClawl: () => void,
    endClawl: () => void
): React.ReactElement {
    return (
        <HeadingLevel>
            <SpacedHeading styleLevel={1}>OBS Kuvo</SpacedHeading>
            <FormControl
                label={() => 'KUVOプレイリストURL'}
                error={state.errors.playlistURL}
            >
                <Input
                    value={state.form.playlistURL}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        dispatch(changePlaylistURL(e.target.value))
                    }
                    onBlur={validatePlaylistURL}
                    error={!!state.errors.playlistURL}
                    placeholder="https://kuvo.com/playlist/*******"
                    disabled={
                        state.calwlerStatus === ClawlerStatus.ClawlerWorking
                    }
                />
            </FormControl>
            <FormControl>
                {state.calwlerStatus === ClawlerStatus.ClawlerStopped ? (
                    <Button
                        onClick={startClawl}
                        isLoading={state.status === Status.Pending}
                    >
                        開始
                    </Button>
                ) : (
                    <Button
                        onClick={endClawl}
                        isLoading={state.status === Status.Pending}
                    >
                        停止
                    </Button>
                )}
            </FormControl>
        </HeadingLevel>
    )
}

/**
 * Styles
 */
const Wrap = styled('div', {
    width: '800px',
    margin: '0 auto',
    padding: '24px'
})

const SpinnerWrap = styled(Wrap, {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh'
})

const SpacedHeading = styled(Heading, {
    marginBottom: '32px'
})

export default Home
