import wait from './wait'
import videoItems from '../data/videoItems'

export async function fetchVideoItems () {
    await wait(500)
    return videoItems
}
