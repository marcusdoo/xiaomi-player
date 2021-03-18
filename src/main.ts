import popup from './components/popup/popup'
import './main.css'

/** we run `displayVideoFloor` and console.log(document.documentElement.innerHTML)
 * press F12, copy the innerHTML and paste it in index.html
 * Finally remove unnecessary stuff like css from index.html
 * Here we are, completed a manual SSR!!!
 */
// import displayVideoFloor from './utils/displayVideoItems'
// displayVideoFloor('#video-floor')


const listItems = document.querySelectorAll('#video-floor li')
listItems.forEach((item) => {
    item.addEventListener('click', function () {
        const url = this.dataset.videoUrl
        const title = this.dataset.title

        popup({
            title,
            content: (el) => {
                console.log(el)
            },
            width: '55rem',
            height: '35rem',
            pos: 'center',
            mask: true
        })
    })
})
