import OBSWebsocket from 'obs-websocket-js'
import { TrackInfo } from './trackInfo'
import os from 'os'

const trackTitleSouceName = 'track-title'
const trackArtistSourceName = 'track-artist'

async function setTrackInfo(trackInfo: TrackInfo) {
    const obs = new OBSWebsocket()

    await obs.connect({
        address: 'localhost:4444'
    })

    let trackTitle: any
    let trackArtist: any

    try {
        trackTitle = await obs.send('GetTextFreetype2Properties', {
            source: 'track-title'
        })
    } catch (e) {
        try {
            trackTitle = await obs.send('GetTextGDIPlusProperties', {
                source: trackTitleSouceName
            })
        } catch (e) {
            throw new Error('Track title text source not found')
        }
    }

    try {
        trackArtist = await obs.send('GetTextFreetype2Properties', {
            source: 'track-artist'
        })
    } catch (e) {
        try {
            trackArtist = await obs.send('GetTextGDIPlusProperties', {
                source: trackArtistSourceName
            })
        } catch (e) {
            throw new Error('Track artist text source not found')
        }
    }

    try {
        await obs.send('SetTextFreetype2Properties', {
            ...trackTitle,
            text: trackInfo.name
        })
        await obs.send('SetTextFreetype2Properties', {
            ...trackArtist,
            text: trackInfo.artist
        })
    } catch (e) {
        try {
            await obs.send('SetTextGDIPlusProperties', {
                ...trackTitle,
                text: trackInfo.name
            })
            await obs.send('SetTextGDIPlusProperties', {
                ...trackArtist,
                text: trackInfo.artist
            })
        } catch (e) {
            throw new Error('Sending text source failed')
        }
    }
}

export default setTrackInfo
