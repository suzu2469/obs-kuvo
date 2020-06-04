import puppeteer from 'puppeteer'
import { TrackInfo } from './trackInfo'

function createKuvoPlaylistURL(playlistId: string): string {
    return `https://kuvo.com/playlist/${playlistId}`
}

function currentTrack(tracks: TrackInfo[]): TrackInfo {
    return tracks[tracks.length - 1]
}

/**
 *
 * @param msec 何秒ごとにクロールするか mill second
 * @param playlistId 対象のプレイリストID
 * @param callback 取得時に呼ばれるCallback
 *
 * @return stop クロールを停止させる関数
 */
async function crawlWith(
    msec: number,
    playlistId: string,
    callback: (info: TrackInfo) => void
): Promise<() => void> {
    let id: NodeJS.Timeout
    try {
        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.goto(createKuvoPlaylistURL(playlistId))

        id = setInterval(async () => {
            await page.reload()
            const trackListEl = await page.$(
                '#body > div.frame > div.r > div > div > section > article > div.tracklist-area'
            )
            const trackEls = await trackListEl.$$('.row')
            const trackList: TrackInfo[] = await Promise.all(
                trackEls.map<Promise<TrackInfo>>(async (el) => ({
                    name: (await (
                        await (await el.$('.title')).getProperty('textContent')
                    ).jsonValue()) as string,
                    artist: (await (
                        await (await el.$('.artist')).getProperty('textContent')
                    ).jsonValue()) as string
                }))
            )

            const track = currentTrack(trackList)
            // 一番上に表示されたものを返却
            callback(track)

            console.log(
                `Currently track is ... ${track.artist} - ${track.name}`
            )
        }, msec)
    } catch (e) {
        throw new Error('Crawling error')
    }

    return () => clearInterval(id)
}

export default crawlWith
