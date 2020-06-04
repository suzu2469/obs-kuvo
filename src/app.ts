import crawlWith from './crawler'
import setTrackInfo from './obs'

export function bootstrap() {
    console.log('Server is started...')
    crawlWith(5000, '178960', setTrackInfo)
}
