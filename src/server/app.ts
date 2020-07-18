import crawlWith from './crawler'
import setTrackInfo from './obs'

export function bootstrap() {
    console.log('Server is started...')

    const playlistId = process.argv[2]
    if (!playlistId) throw new Error('Playlist ID must be set')

    crawlWith(5000, playlistId, setTrackInfo)
}
