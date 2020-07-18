import puppeteer from 'puppeteer'
import { TrackInfo } from './trackInfo'

function createKuvoPlaylistURL(playlistId: string): string {
    return `https://kuvo.com/playlist/${playlistId}`
}

async function elementToTrackInfo(
    el: puppeteer.ElementHandle
): Promise<TrackInfo> {
    const artistEl = await el.$('.artist')
    const titleEl = await el.$('.title')

    return {
        artist: (await (
            await titleEl.getProperty('textContent')
        ).jsonValue()) as string,
        name: (await (
            await titleEl.getProperty('textContent')
        ).jsonValue()) as string
    }
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
    let id: number
    try {
        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.goto(createKuvoPlaylistURL(playlistId))

        id = setInterval(async () => {
            await page.reload()
            const trackListEl = await page.$(
                '#body > div.frame > div.r > div > div > section > article > div.tracklist-area'
            )
            const currentTrackEls = await trackListEl.$$('.row.on')

            if (currentTrackEls.length <= 0) {
                callback({ artist: '', name: '' })
                console.log(`Currently track is ... Not Found`)
                return
            }

            const trackInfo = await elementToTrackInfo(currentTrackEls[0])
            callback(await elementToTrackInfo(currentTrackEls[0]))

            console.log(
                `Currently track is ... ${trackInfo.artist} - ${trackInfo.name}`
            )
        }, msec)
    } catch (e) {
        throw new Error('Crawling error')
    }

    return () => clearInterval(id)
}

export default crawlWith
