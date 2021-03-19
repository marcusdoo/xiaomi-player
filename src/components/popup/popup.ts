// const styles = require('./popup.module.css').default
import styles from './popup.module.css'

function popup (options: PopupConfig) {
    return new Popup(options)
}

class Popup implements Component {
    container: HTMLDivElement
    mask: HTMLElement
    constructor (private settings: PopupConfig) {
        this.settings = {
            ...{
                width: '100%',
                height: '100%',
                title: '',
                pos: 'center',
                mask: true,
                content: () => {}
            },
            ...this.settings
        }

        this.init()
        this.handle()
        this.getContent()
    }

    init () {
        this.template()

        if (this.settings.mask) {
            this.createMask()
        }
    }
    
    template () {
        const { 
            title, content, 
            width, height, pos, 
            mask
        } = this.settings

        this.container = document.createElement('div')
        this.container.style.width = width
        this.container.style.height = height
        this.container.classList.add(`${styles.popup}`, styles[pos])


        this.container.innerHTML = `
            <div class=${styles['popup-title']}>
                <h3>${title}</h3>
                <i class="iconfont icon-close"></i>
            </div>
            <div class=${styles['popup-content']}></div>
        `
        document.body.appendChild(this.container)
    }

    handle () {
        const closeButton: HTMLElement = document.querySelector(`.${styles['popup-title']} i`)
        closeButton.addEventListener('click', () => {
            document.body.removeChild(this.container)
            if (this.settings.mask) {
                document.body.removeChild(this.mask)
            }
        })
    }

    createMask () {
        this.mask = document.createElement('div')
        this.mask.classList.add(`${styles['popup-mask']}`)
        document.body.appendChild(this.mask)
    }

    getContent () {
        const popupContentEl = this.container.querySelector(`.${styles['popup-content']}`) as HTMLElement
        this.settings.content(popupContentEl)
    }
}

export default popup
